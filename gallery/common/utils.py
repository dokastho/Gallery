import gallery
from random import randint
from d3b_client.client import *
import os
import gallery


def get_client(host_id: int = 0) -> d3b_client:
    # if "FLASK_DEBUG" in os.environ.keys():
    #     return d3b_client("https://dev2.dokastho.io")
    if host_id == 0:
        host_id = randint(1, gallery.app.config["NDBS"])
        pass
    
    hostname = f'https://d3b{host_id}.dokastho.io'
    c = d3b_client(hostname)
    return c
