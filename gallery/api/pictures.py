import gallery
import flask
import os
import pathlib


@gallery.app.route("/api/v1/pictures/", methods=["POST"])
def get_picture_info():
    logname = flask.session.get('logname')
    data = {
        "logname": logname,
    }
    if logname is None:
        data["logname"] = "log in"
        data["albums"] = []
        data["pictures"] = []
        data["accounts"] = []
        return flask.jsonify(data)

    req_data = {
        "table": gallery.app.config["DATABASE_FILENAME"],
        "query": "SELECT * FROM sharing WHERE user = ?",
        "args": [logname],
    }
    req_hdrs = {
        'content_type': 'application/json'
    }

    albums = gallery.get_client().get(req_data, req_hdrs)
    album_ids = [album['albumid'] for album in albums]

    req_data = {
        "table": gallery.app.config["DATABASE_FILENAME"],
        "query": f"SELECT * FROM pictures WHERE albumid in ({('?, ' * len(album_ids)).rstrip(', ')})",
        "args": album_ids,
    }
    req_hdrs = {
        'content_type': 'application/json'
    }

    # return logname, pictures & albums
    data["pictures"] = gallery.get_client().get(req_data, req_hdrs)
    # get albums too
    req_data["query"] = f"SELECT * FROM albums WHERE id in ({('?, ' * len(album_ids)).rstrip(', ')})"
    data["albums"] = gallery.get_client().get(req_data, req_hdrs)
    
    req_data = {
        "table": gallery.app.config["DATABASE_FILENAME"],
        "query": "SELECT username FROM users",
        "args": [],
    }
    req_hdrs = {
        'content_type': 'application/json'
    }
    
    usernames = gallery.get_client().get(req_data, req_hdrs)
    data["accounts"] = [x["username"] for x in usernames]
    return flask.jsonify(data)


@gallery.app.route("/api/v1/pictures/upload/", methods=['POST'])
def upload_picture():
    if not flask.request.form:
        flask.abort(400)
        pass

    for k in ['album-choice']:
        if k not in flask.request.form:
            flask.abort(400)
            pass
        pass

    logname = flask.session.get('logname')
    if logname is None or logname != 'dokastho':
        flask.abort(403)
        pass

    files = flask.request.files.getlist('file')
    album_id_str = flask.request.form.get('album-choice')
    album_id = int(album_id_str)

    if album_id == 0:
        # post new album to database
        album_name = flask.request.form.get('new-album-name')

        # albums table
        req_data = {
            "table": gallery.app.config["DATABASE_FILENAME"],
            "query": "INSERT INTO albums(owner, name) VALUES (?, ?)",
            "args": [logname, album_name],
        }
        req_hdrs = {
            'content_type': 'application/json'
        }

        gallery.get_client().post(req_data, req_hdrs)
        
        # get corresponding album id
        req_data = {
            "table": gallery.app.config["DATABASE_FILENAME"],
            "query": f"SELECT id FROM albums WHERE name = ?",
            "args": [album_name],
        }
        req_hdrs = {
            'content_type': 'application/json'
        }

        # return logname, pictures & albums
        album_id = gallery.get_client().get(req_data, req_hdrs)[0]['id']

        # sharing table
        req_data = {
            "table": gallery.app.config["DATABASE_FILENAME"],
            "query": "INSERT INTO sharing(user, albumid) VALUES (?, ?)",
            "args": [logname, album_id],
        }
        req_hdrs = {
            'content_type': 'application/json'
        }

        gallery.get_client().post(req_data, req_hdrs)
        pass
    
    # create temp output folder if it doesn't already exists
    os.chdir(gallery.app.config["SITE_ROOT"])
    tmp_dir = f'tmp-{gallery.app.config["MY_HOST_ID"]}'
    tmp_path = pathlib.Path(gallery.app.config["SITE_ROOT"]) / tmp_dir
    if tmp_dir not in os.listdir():
        os.mkdir(tmp_path)
        pass

    # insert all pictures
    for picture in files:
        file_id = gallery.get_uuid(picture.filename)
        req_data = {
            "table": gallery.app.config["DATABASE_FILENAME"],
            "query": "INSERT INTO pictures(owner, albumid, fileid) VALUES (?, ?, ?)",
            "args": [logname, album_id, file_id],
            "media_op": "upload",
            "file_id": file_id
        }
        
        picture.save(tmp_path / file_id)

        fileobj = open(tmp_path / file_id, "rb")
        gallery.get_client().file_post(req_data, fileobj)
        os.remove(tmp_path / file_id)
        pass
    return flask.redirect("/")


@gallery.app.route("/api/v1/picture/<pic_id>/")
def get_picture(pic_id):
    req_data = {
        "table": gallery.app.config["DATABASE_FILENAME"],
        "query": "",
        "args": [],
        "media_op": "get",
        "file_id": pic_id
    }
    req_hdrs = {
        'content_type': 'application/json'
    }
    data = gallery.get_client().file_get(req_data, req_hdrs)
    return flask.Response(data)


@gallery.app.route("/api/v1/picture/delete/<pic_id>/", methods=["POST"])
def delete_picture(pic_id):
    req_data = {
        "table": gallery.app.config["DATABASE_FILENAME"],
        "query": "DELETE FROM pictures WHERE fileid = ?",
        "args": [pic_id],
        "media_op": "delete",
        "file_id": pic_id
    }
    req_hdrs = {
        'content_type': 'application/json'
    }
    gallery.get_client().post(req_data, req_hdrs)
    return flask.Response(status=200)
