import instaloader
from flask import abort

from youla.utils.inst_parse import get_post_comments, get_profile_posts


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
        post_comms = get_post_comments(post)
    except instaloader.exceptions.QueryReturnedNotFoundException:
        abort(404, "Post not found", status="Failed")
    return post_comms


def get_profile_info(profile_id):
    l = Loader.get()
    try:
        profile = instaloader.Profile.from_username(l.loader.context, profile_id)
        posts = get_profile_posts(profile)
    except instaloader.exceptions.QueryReturnedNotFoundException:
        abort(404, "Profile not found", status="Failed")
    return {"posts": [{"shortcode": p.shortcode, "caption": p.caption} for p in posts]}


def generate_comments_list_by_shortcode(shortcode):
    l = Loader.get()
    try:
        ad_post = instaloader.Post.from_shortcode(l.loader.context, shortcode)
        comments_instaces_list = list(ad_post.get_comments())
        comments_list = []

        for comment in comments_instaces_list:
            comment_text = comment.text.lower()
            comments_list.append(comment_text)
    except instaloader.exceptions.QueryReturnedNotFoundException:
        abort(404, "Post not found", status="Failed")
    return comments_list
    