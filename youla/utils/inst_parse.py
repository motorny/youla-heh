from itertools import takewhile
from datetime import timedelta, datetime


def get_post_comments(post, max_comments=100):
    post_with_comments = {}
    post_with_comments["shortcode"] = post.shortcode
    post_with_comments["post_text"] = post.caption
    post_with_comments["comments"] = []
    comments = post.get_comments()

    for comment in comments:
        post_with_comments["comments"].append(comment.text)
        for answer in comment.answers:
            post_with_comments["comments"].append(answer.text)
        if len(post_with_comments["comments"]) >= max_comments:
            break
    return post_with_comments


def no_more_than(limit):
    def limiter(gen):
        cnt = 0
        for item in gen:
            if cnt > limit:
                break
            yield item
            cnt += 1

    return limiter


def no_latter_than(limit):
    def limiter(gen):
        for item in gen:
            if item.date_utc < limit:
                break
            yield item
    return limiter


def get_monthly_dynamic(profile)
    monthly_dynamic = []

    delta = timedelta(30)
    today = datetime.today()
    this_moment = datetime.today()
    prev_result = 0
    while this_moment > today - timedelta(365):
        cutoff = no_latter_than(this_moment - delta)
        posts_list = list(cutoff(profile.get_posts()))
        posts_num = len(posts_list)
        monthly_dynamic.append(posts_num - prev_result)
        prev_result = posts_num
        this_moment -= delta
    
    return monthly_dynamic


def get_profile_posts(profile, max_posts=10):
    cutoff = no_more_than(max_posts)
    posts = [p for p in cutoff(profile.get_posts())]
    return posts


def get_post_comments_list(ad_post):
    comments_instaces_list = list(ad_post.get_comments())
    comments_list = []

    for comment in comments_instaces_list:
        comment_text = comment.text.lower()
        comments_list.append(comment_text)
    return comments_list
