import instaloader
from flask import abort

from youla.utils.inst_parse import get_profile_posts_top_info, get_monthly_dynamic, get_post_comments_list
from youla.model.mood_analysis import CNN

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
        post_comments_list = get_post_comments_list(post)
        post_caption = post.caption
        cnn = CNN.get()
        posRate = cnn.run_model(post_comments_list[:10])
        print("Analyzing with CNN")
    except instaloader.exceptions.QueryReturnedNotFoundException:
        abort(404, "Post not found", status="Failed")
    return {"postitiveRate":posRate}


def get_profile_info(profile_id):
    l = Loader.get()
    try:
        profile = instaloader.Profile.from_username(l.loader.context, profile_id)
        posts_captures, comments_amounts = get_profile_posts_top_info(profile)
        monthly_dynamic = get_monthly_dynamic(profile)
    except instaloader.exceptions.QueryReturnedNotFoundException:
        abort(404, "Profile not found", status="Failed")
    return {"monthly_dynamic": monthly_dynamic}
