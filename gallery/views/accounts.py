"""accounts interface."""
import uuid
import hashlib
import os
import pathlib
from flask import abort, redirect, render_template, request, session
import gallery


@gallery.app.route('/accounts/', methods=['POST'])
def accounts():
    """/accounts/?target=URL Immediate redirect. No screenshot."""
    with gallery.app.app_context():

        # check if target is unspecified or blank
        target = gallery.model.get_target()

        # get operation
        operation = request.form.get('operation')

        # create a login cookie
        if operation == "login":

            # get username and password from form
            uname = request.form['username']
            pword = request.form['password']

            # set session cookie
            if not do_login(uname, pword):
                abort(500)      # server didn't abort
            session['logname'] = uname


        # create an account
        elif operation == "create":
            info = {
                "username": request.form.get("username"),
                "email": request.form.get("email"),
                "password": request.form.get("password"),
                "fullname": request.form.get("fullname"),
                "file": request.files.get("file"),
            }
            if not do_create(info):
                abort(500)      # server didn't abort correctly

        # do not allow deleting without being logged in
        elif 'logname' not in session:
            abort(403)

        elif operation == "delete":
            do_delete()

        elif operation == "update_password":
            # user must be logged in
            if 'logname' not in session:
                abort(403)

            info = {
                "username": session['logname'],
                "old": request.form.get('oldpw'),
                "new": request.form.get("newpw"),
                "verify_new": request.form.get("renewpw"),
            }
            do_update_password(info)

        else:
            abort(400)  # invalid request

    return redirect(target)


def do_login(uname, pword):
    """Login user with username and password."""
    logname = gallery.model.check_authorization(uname, pword)
    if not logname:
        abort(403)

    return True


def do_create(info):
    """Create account with info."""
    for i in info:
        if i == "":
            abort(400)

    pw_str = create_hashed_password(info['password'])
    
    req_data = {
        "table": gallery.app.config["DATABASE_FILENAME"],
        "query": "SELECT username FROM users WHERE username = ?",
        "args": [info['username']],
    }
    req_hdrs = {
        'content_type': 'application/json'
    }
        
    user = gallery.get_client().get(req_data, req_hdrs)

    if len(user) != 0:
        abort(409)
        pass
    
    # upload profile picture
    picture = info['file']
    os.chdir(gallery.app.config["SITE_ROOT"])
    tmp_dir = f'tmp-{gallery.app.config["MY_HOST_ID"]}'
    tmp_path = pathlib.Path(gallery.app.config["SITE_ROOT"]) / tmp_dir
    if tmp_dir not in os.listdir():
        os.mkdir(tmp_path)
        pass
    
    file_id = gallery.get_uuid(picture.filename)
    
    req_data = {
        "table": gallery.app.config["DATABASE_FILENAME"],
        "query": "INSERT INTO users (username, fullname, email, filename, password) VALUES (?, ?, ?, ?, ?)",
        "args": [info['username'], info['fullname'], info['email'], file_id, pw_str],
    }
    req_hdrs = {
        'content_type': 'application/json'
    }
        
    gallery.get_client().post(req_data, req_hdrs)
    
    req_data = {
        "table": gallery.app.config["DATABASE_FILENAME"],
        "query": "INSERT INTO pictures(owner, albumid, fileid) VALUES (?, ?, ?)",
        "args": [info['username'], 1, file_id],
        "media_op": "upload",
        "file_id": file_id
    }
    
    picture.save(tmp_path / file_id)

    fileobj = open(tmp_path / file_id, "rb")
    gallery.get_client().file_post(req_data, fileobj)
    os.remove(tmp_path / file_id)

    session['logname'] = info['username']
    return True


def do_delete():
    """Delete account of logname."""
    # user must be logged in
    if 'logname' not in session:
        abort(403)

    uname = session['logname']
    
    # get profile picture ID
    req_data = {
        "table": gallery.app.config["DATABASE_FILENAME"],
        "query": "SELECT filename FROM users WHERE username = ?",
        "args": [uname],
    }
    req_hdrs = {
        'content_type': 'application/json'
    }
        
    file_id = gallery.get_client().get(req_data, req_hdrs)[0]['filename']

    # delete users entry and all related ones
    req_data = {
        "table": gallery.app.config["DATABASE_FILENAME"],
        "query": "DELETE FROM users WHERE username = ?",
        "args": [uname],
    }
    req_hdrs = {
        'content_type': 'application/json'
    }
        
    gallery.get_client().post(req_data, req_hdrs)

    # clear the session
    session.clear()
    
    # delete profile picture
    req_data = {
        "table": gallery.app.config["DATABASE_FILENAME"],
        "query": "DELETE FROM pictures WHERE fileid = ?",
        "args": [file_id],
        "media_op": "delete",
        "file_id": file_id
    }
    req_hdrs = {
        'content_type': 'application/json'
    }
    gallery.get_client().post(req_data, req_hdrs)


def do_update_password(info):
    """Update password with info."""
    if (info['old'] is None or info['new'] is None or
            info['verify_new'] is None):
        abort(400)
        
    req_data = {
        "table": gallery.app.config["DATABASE_FILENAME"],
        "query": "SELECT password FROM users WHERE username = ?",
        "args": [info['username']],
    }
    req_hdrs = {
        'content_type': 'application/json'
    }
        
    old_pw_hash = gallery.get_client().get(req_data, req_hdrs)
    old_pw_hash = old_pw_hash[0]

    # check if salt is present (default data isn't encrypted)
    salt = old_pw_hash['password'].split("$")
    if len(salt) > 1:
        salt = salt[1]
        pw_str = gallery.model.encrypt(salt, info['old'])
    else:
        pw_str = info['old']
        pass
    
    req_data = {
        "table": gallery.app.config["DATABASE_FILENAME"],
        "query": "SELECT username FROM users WHERE username = ? AND password == ?",
        "args": [info['username'], pw_str],
    }
    req_hdrs = {
        'content_type': 'application/json'
    }
        
    user = gallery.get_client().get(req_data, req_hdrs)
    if len(user) == 0:
        abort(403)

    if info['new'] != info['verify_new']:
        abort(401)

    new_pw_hash = create_hashed_password(info['new'])
    req_data = {
        "table": gallery.app.config["DATABASE_FILENAME"],
        "query": "UPDATE users SET password = ? WHERE username == ?",
        "args": [new_pw_hash, info['username']],
    }
    req_hdrs = {
        'content_type': 'application/json'
    }
        
    gallery.get_client().post(req_data, req_hdrs)


@gallery.app.route('/accounts/login/')
def login():
    """Render login page."""
    with gallery.app.app_context():

        # redirect if a session cookie exists
        if 'logname' not in session:
            return render_template("login.html")

        # if there doesn't exist a session cookie,
        # redirect to /accounts/?target=/login/ to create one
        return redirect('/')


@gallery.app.route('/accounts/logout/', methods=['POST'])
def logout():
    """Log out user and redirects to login."""
    session.clear()
    return redirect('/')


@gallery.app.route('/accounts/create/', methods=['GET'])
def create():
    """Render create page if not logged in."""

    return render_template('create.html')


@gallery.app.route('/accounts/delete/')
def delete():
    """Render delete page if logged in."""
    if 'logname' not in session:
        abort(403)

    context = {
        "logname": session['logname']
    }
    return render_template('delete.html', **context)


@gallery.app.route('/accounts/password/')
def password():
    """Render page to update password if logged in."""
    if 'logname' not in session:
        abort(403)
    context = {
        "logname": session['logname']
    }
    return render_template('password.html', **context)


def create_hashed_password(pword):
    """Create a hashed password for a new user."""
    algorithm = 'sha512'
    salt = uuid.uuid4().hex
    hash_obj = hashlib.new(algorithm)
    password_salted = salt + pword
    hash_obj.update(password_salted.encode('utf-8'))
    password_hash = hash_obj.hexdigest()
    password_db_string = "$".join([algorithm, salt, password_hash])
    return password_db_string


def encrypt(salt, pword):
    """One way decryption given the plaintext pw and salt from user db."""
    algorithm = 'sha512'

    hash_obj = hashlib.new(algorithm)
    password_salted = salt + pword
    hash_obj.update(password_salted.encode('utf-8'))
    password_hash = hash_obj.hexdigest()
    password_db_string = "$".join([algorithm, salt, password_hash])
    return password_db_string
