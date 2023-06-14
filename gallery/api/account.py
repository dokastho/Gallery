import gallery
import flask
import arrow

@gallery.app.route("/api/v1/account/", methods=["POST"])
def get_account_info():
    # return all info on an account (except password of course)
    logname = gallery.check_session()
    if not logname:
        return flask.redirect("/accounts/login/")
    
    req_data = {
        "table": gallery.app.config["DATABASE_FILENAME"],
        "query": "SELECT * FROM users WHERE username = ?",
        "args": [logname],
    }
    req_hdrs = {
        'content_type': 'application/json'
    }
    
    data = dict()
    data["accountInfo"] = gallery.get_client().get(req_data, req_hdrs)[0]
    del data["accountInfo"]["password"]
    
    created_date = data["accountInfo"]["created"]
    data["accountInfo"]["created"] = arrow.get(created_date).humanize()
    

    return flask.jsonify(data)
