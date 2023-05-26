"""Site model (database) API."""
from datetime import datetime
import hashlib
import uuid
import pathlib
import gallery
import flask


def get_uuid(filename):
    """Get image uuid."""
    stem = uuid.uuid4().hex
    suffix = pathlib.Path(filename).suffix
    uuid_basename = f"{stem}{suffix}"

    return uuid_basename


def get_target():
    """Return request target or /."""
    target = flask.request.args.get('target')
    if target is None or target == "":
        return "/"
    return target


def get_logname():
    """Get the logname either from session or http basic auth."""
    session_logname = check_session()
    basic_logname = check_authorization()
    if session_logname:
        return session_logname
    if basic_logname:
        return basic_logname

    return False


def check_session():
    """Check if logname exists in session."""
    if 'logname' not in flask.session:
        return False
    username = flask.session['logname']
    cur = connection.execute(
        "SELECT username "
        "FROM users "
        "WHERE username == ?",
        (username, )
    )

    # user must exist
    user = cur.fetchall()
    if len(user) == 0:
        flask.session.clear()
        return False

    return username


def check_authorization(username=None, password=None):
    """Check if authorization in request matches credentials for a user."""
    if username is None or password is None:
        # auth must exist if username and password aren't provided
        if flask.request.headers.get("authorization") is None:
            return False

        # auth must have username and password in headers
        username = flask.request.authorization.get("username")
        password = flask.request.authorization.get("password")
        if username is None or password is None:
            return False

    # verify username and password match an existing user
    cur = connection.execute(
        "SELECT password "
        "FROM users "
        "WHERE username == ? ",
        (username,)
    )

    # password must exist
    pw_hash = cur.fetchall()
    if len(pw_hash) == 0:
        return False

    # get db entry salt if present and encrypt password
    pw_hash = pw_hash[0]
    salt = pw_hash['password'].split("$")
    if len(salt) > 1:
        salt = salt[1]
        pw_str = encrypt(salt, password)
    else:
        pw_str = password

    # find an entry with encrypted password
    cur = connection.execute(
        "SELECT username "
        "FROM users "
        "WHERE username == ? AND password == ?",
        (username, pw_str,)
    )

    # user must exist
    user = cur.fetchall()
    if len(user) == 0:
        return False

    return username


def show_username() -> dict:
    """Handle the rendering of the username/sign in link."""
    logname = gallery.get_logname()
    context = {}
    if not logname:
        context["logname"] = "Sign In"
        context["logname_link"] = "/accounts/login/"
    else:
        context["logname"] = logname
        context["logname_link"] = f"/accounts/{logname}/"
    return context


def encrypt(salt, password):
    """One way decryption given the plaintext pw and salt from user db."""
    algorithm = 'sha512'

    hash_obj = hashlib.new(algorithm)
    password_salted = salt + password
    hash_obj.update(password_salted.encode('utf-8'))
    password_hash = hash_obj.hexdigest()
    password_db_string = "$".join([algorithm, salt, password_hash])
    return password_db_string


def print_log(msg: str, code: None) -> str:
    now = datetime.utcnow()
    now = now.strftime("%d/%b/%Y %H:%M:%S")
    print(f'localhost - - [{now}] {msg} {code} -')
