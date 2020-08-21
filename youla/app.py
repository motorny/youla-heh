import logging
import os
import sys
from logging.config import dictConfig

from flask import Flask
from flask_cors import CORS

from youla.api import api
from youla.models import db

dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '%(levelname)9s -- %(asctime)s - %(module)s - %(message)s',
    }},
    'handlers': {'wsgi': {
        'class': 'logging.StreamHandler',
        'stream': 'ext://sys.stdout',
        'formatter': 'default'
    }},
    'root': {
        'level': 'DEBUG',
        'handlers': ['wsgi']
    }
})



# stream_handler = logging.StreamHandler(stream=sys.stdout)
# stream_handler.setLevel(logging.DEBUG)
# stream_handler.setFormatter(logging.Formatter(
#     '[%(asctime)s] %(name)s %(levelname)s in %(module)s: %(message)s'
# ))
# logging.getLogger().addHandler(stream_handler)
# logging.getLogger().setLevel(logging.DEBUG)

UPLOAD_FOLDER = "/var/www/"
SQLALCHEMY_DATABASE_URI = 'sqlite:///../youla.db'


def create_app(config=None):
    app = Flask(__name__)
    app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
    app.config['SQLALCHEMY_DATABASE_URI'] =SQLALCHEMY_DATABASE_URI


    CORS(app)
    # load default configuration

    # load environment configuration
    if "WEBSITE_CONF" in os.environ:
        app.config.from_envvar("WEBSITE_CONF")

    # load app specified configuration
    if config is not None:
        if isinstance(config, dict):
            app.config.update(config)
        elif config.endswith(".py"):
            app.config.from_pyfile(config)

    setup_app(app)

    return app


def setup_app(app):
    # Create tables if they do not exist already
    @app.before_first_request
    def create_tables():
        db.create_all()

    db.init_app(app)
    api.init_app(app)


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8008, debug=True)
