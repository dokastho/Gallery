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
        "query": "SELECT * FROM pictures WHERE owner = ?",
        "args": [logname],
    }
    req_hdrs = {
        'content_type': 'application/json'
    }

    # return logname, pictures & albums
    data["pictures"] = gallery.get_client().get(req_data, req_hdrs)
    # get albums too
    req_data["query"] = "SELECT * FROM albums WHERE owner = ?"
    data["albums"] = gallery.get_client().get(req_data, req_hdrs)
    return flask.jsonify(data)


@gallery.app.route("/api/v1/foo/<pic_id>/")
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
