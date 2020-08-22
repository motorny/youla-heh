import instaloader
from flask import abort

class Loader:
    __instance = None

    def __init__(self):
        if self.__instance is None:
            self.loader = instaloader.Instaloader()
        else:
            raise RuntimeError("A class is a singleton")

    @classmethod
    def get(cls):
        if not cls.__instance:
            cls.__instance = Loader()
        return cls.__instance


def get_post_info(post_id):
    l = Loader.get()
    try:
        post = instaloader.Post.from_shortcode(l.loader.context, post_id)
    except instaloader.exceptions.QueryReturnedNotFoundException:
        abort(404,"Post not found", status="Failed")
    resp = {
        "addTarget": "Лента",
        "commentsCnt": 15,
        "commentsPositiveCnt": 4,
        "commentsNegativeCnt": 2,
        "commentsSpamCnt": 2,
    }
    return resp


def get_profile_info(profile_id):
    l = Loader.get()
    try:
        profile = instaloader.Profile.from_username(l.loader.context,profile_id)
    except instaloader.exceptions.QueryReturnedNotFoundException:
        abort(404, "Profile not found", status="Failed")
    resp = {
        "rep": "good",
    }
    return resp

