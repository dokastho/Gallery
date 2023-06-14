import gallery
import flask


@gallery.app.route("/api/v1/album/delete/<album_id>/", methods=["POST"])
def delete_album(album_id):
    # delete all pictures that belong to this album
    # this step is necessary because they're media ops
    # media ops are not handled via 'delete-cascade'
    req_data = {
        "table": gallery.app.config["DATABASE_FILENAME"],
        "query": "SELECT * FROM pictures WHERE albumid = ?",
        "args": [album_id],
    }
    req_hdrs = {
        'content_type': 'application/json'
    }

    pictures = gallery.get_client().get(req_data, req_hdrs)

    for picture in pictures:
        fileid = picture['fileid']
        req_data = {
            "table": gallery.app.config["DATABASE_FILENAME"],
            "query": "DELETE FROM pictures WHERE fileid = ?",
            "args": [fileid],
            "media_op": "delete",
            "file_id": fileid
        }
        req_hdrs = {
            'content_type': 'application/json'
        }

        gallery.get_client().post(req_data, req_hdrs)

    req_data = {
        "table": gallery.app.config["DATABASE_FILENAME"],
        "query": "DELETE FROM albums WHERE id = ?",
        "args": [album_id],
    }
    req_hdrs = {
        'content_type': 'application/json'
    }
    gallery.get_client().post(req_data, req_hdrs)
    return flask.Response(status=200)
