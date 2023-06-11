import gallery
import flask


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
    album_ids = [album['id'] for album in albums]

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
    return flask.jsonify(data)


@gallery.app.route("/api/v1/pictures/upload/", methods=['POST'])
def upload_picture():
    if not flask.request.form:
        flask.abort(400)
        pass

    for k in ['file', 'album-choice']:
        if k not in flask.request.form:
            flask.abort(400)
            pass
        pass

    logname = flask.session.get('logname')
    if logname is None or logname != 'dokastho':
        flask.abort(403)
        pass

    files = flask.request.form.getlist('file')
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

    # insert all pictures
    for picture in files:
        req_data = {
            "table": "schemas",
            "query": "INSERT INTO pictures(owner, album, fileid) VALUES (?, ?, ?)",
            "args": [logname, album, picture.filename],
            "media_op": "upload",
            "file_id": picture.filename
        }

        gallery.get_client().file_post(req_data, picture)
    pass


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
