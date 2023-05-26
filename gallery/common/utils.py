import gallery
from random import randint
from d3b_client.client import *


def get_client() -> d3b_client:
    r = randint(1, gallery.app.config["NDBS"])
    hostname = f'https://d3b{r}.dokasfam.com'
    c = d3b_client(hostname)
    return c
