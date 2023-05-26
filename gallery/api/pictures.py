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
    data = gallery.get_client().get(req_data, req_hdrs)
    return flask.jsonify(data)


@gallery.app.route("/api/v1/pictures/<pic_id>/", methods=["POST"])
def get_picture(pic_id):
    req_data = {
        "table": gallery.app.config["DATABASE_FILENAME"],
        "query": "SELECT fileid, name FROM pictures WHERE fileid = ?",
        "args": [pic_id],
    }
    req_hdrs = {
        'content_type': 'application/json'
    }
    data = gallery.get_client().file_get(req_data, req_hdrs)
    return flask.Response(data)
