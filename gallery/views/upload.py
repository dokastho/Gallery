import gallery
import flask
from gallery.common.model import check_session


@gallery.app.route("/upload/")
def show_upload_page():
    """Render photo upload page for the site."""
    
    # if not logged in then redirect to login page
    logname = check_session()
    if not logname:
        return flask.redirect("/accounts/login/")
    # also if I'm not logged in then redirect to index page
    elif logname != 'dokastho':
        return flask.redirect('/')

    return flask.render_template("upload.html")
