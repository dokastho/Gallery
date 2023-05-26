import app_rename_me
import flask
from app_rename_me.common.model import check_session


@app_rename_me.app.route("/")
def show_index():
    """Render app_rename_me for the site."""

    return flask.render_template("index.html")


@app_rename_me.app.route("/user/<uname>/")
def show_user(uname):
    """Show profile options for uname."""
    logname = check_session()
    if not logname:
        return flask.redirect("/accounts/login/")

    if logname != uname:
        return flask.abort(403)

    context = {
        "logname": logname
    }

    return flask.render_template("accounts.html", **context)
