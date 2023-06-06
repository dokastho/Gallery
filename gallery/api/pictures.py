import gallery
import flask


@gallery.app.route("/api/v1/pictures/", methods=["POST"])
def get_picture_info():
    req_data = {
        "table": gallery.app.config["DATABASE_FILENAME"],
        "query": "SELECT * FROM pictures",
        "args": [],
    }
    req_hdrs = {
        'content_type': 'application/json'
    }
    data = {
        "logname": "dokastho",
    }

    # return logname, pictures & albums
    data["pictures"] = gallery.get_client().get(req_data, req_hdrs)
    # get albums too
    req_data["query"] = "SELECT * FROM albums"
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
