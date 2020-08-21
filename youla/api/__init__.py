from flask_restplus import Api

from youla.api.inst import ns_inst

api = Api(title="yoloco_API", version="1.1", description="Shifty API",)

api.add_namespace(ns_inst)
