from flask import abort
from flask import current_app as app
from flask import request
from flask_restplus import Namespace, Resource, fields

from youla.models import db
from youla.utils.fs import save_file

from .req_parsers import get_post_parser

ns = Namespace("instagram", description="Instagram related operations")

req_get_post_model = ns.model("Get post", {"post_id": fields.String,})


@ns.route("/p")
class GetItem(Resource):
    # @ns.marshal_with(new_item_model, code=201, description='Success')  # documents the response codes
    @ns.response(200, "Success")
    @ns.response(400, "Validation Error")
    @ns.expect(req_get_post_model)  # documents input field
    def post(self):
        args = get_post_parser.parse_args()
        post_id = args["post_id"]
        resp = {
            "message": f'You requested a post w/ id "{post_id}"',
            "status": "Success",
        }
        app.logger.info('got post request')
        return resp, 200

@ns.route("/p/stats")
class GetStats(Resource):
    # @ns.marshal_with(new_item_model, code=201, description='Success')  # documents the response codes
    @ns.response(200, "Success")
    @ns.response(400, "Validation Error")
    @ns.expect(req_get_post_model)  # documents input field
    def post(self):
        args = get_post_parser.parse_args()
        post_id = args["post_id"]
        resp = {
            "addTarget": "Лента",
            "commentsCnt":15,
            "commentsPositiveCnt":4,
            "commentsNegativeCnt":2,
            "commentsSpamCnt":2,
            "status": "Success",
        }
        return resp, 200
