import gallery
from random import randint
from d3b_client.client import *
import os


def get_client() -> d3b_client:
    if "FLASK_DEBUG" in os.environ.keys():
        return d3b_client("https://dev2.dokasfam.com")

    r = randint(1, gallery.app.config["NDBS"])
    hostname = f'https://d3b{r}.dokasfam.com'
    c = d3b_client(hostname)
    return c
