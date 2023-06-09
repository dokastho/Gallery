#!/bin/python3

import flask
import gallery

app = gallery.app

if __name__ == "__main__":
    app.run(port=5057)
