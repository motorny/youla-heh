#!/bin/bash
export FLASK_APP=youla
export FLASK_ENV=development
export FLASK_DEBUG=1

python youla/app.py --host=0.0.0.0 --port=8008
