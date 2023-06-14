#!/bin/python3

import flask
import gallery
import sys

app = gallery.app

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("need to supply host_id argument.")
        exit()
    host_id = int(sys.argv[1])
    # RUNS ON SECOND PAXOS SERVER (2)
    app.config["MY_HOST_ID"] = host_id
    app.run(port=5055 + host_id)
    pass
