from flask_restplus import reqparse

get_post_parser = reqparse.RequestParser()
get_post_parser.add_argument("post_id", type=str, required=True, location="json")

get_profile_parser = reqparse.RequestParser()
get_profile_parser.add_argument("profile_id", type=str, required=True, location="json")