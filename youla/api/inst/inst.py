from flask import abort
from flask import current_app as app
from flask import request
from flask_restplus import Namespace, Resource, fields

from youla.models import db
from youla.utils.fs import save_file

from .business_inst import get_post_info, get_profile_info
from .req_parsers import get_post_parser, get_profile_parser

ns = Namespace("inst", description="Instagram related operations")

req_get_post_model = ns.model("Get post", {"post_id": fields.String,})
req_get_profile_model = ns.model("Get profile", {"profile_id": fields.String,})


@ns.route("/p/stats")
class GetPostStats(Resource):
    # @ns.marshal_with(new_item_model, code=201, description='Success')  # documents the response codes
    @ns.response(200, "Success")
    @ns.response(400, "Validation Error")
    @ns.expect(req_get_post_model)  # documents input field
    def post(self):
        """
        Request a post information with all comments and addvertisement stats
        :return:
        """
        args = get_post_parser.parse_args()
        post_id = args["post_id"]
        resp = get_post_info(post_id)

        return resp, 200


@ns.route("/stats")
class GetProfileStats(Resource):
    # @ns.marshal_with(new_item_model, code=201, description='Success')  # documents the response codes
    @ns.response(200, "Success")
    @ns.response(400, "Validation Error")
    @ns.expect(req_get_profile_model)  # documents input field
    def post(self):
        """
        Request profile summary with post links and addvertisement stats
        :return:
        """
        args = get_profile_parser.parse_args()
        profile_id = args["profile_id"]
        data = get_profile_info(profile_id)
        # handle this data to compose stats
        resp = {
            "commentsCnt": 432,
            "commentsPositiveCnt": 205,
            "commentsNegativeCnt": 78,
            "commentsSpamCnt": 50,
            "addPosts": 6,
        }
        resp.update({"status": "Success"})
        return resp, 200
