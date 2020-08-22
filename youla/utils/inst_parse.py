from itertools import takewhile
from datetime import timedelta, datetime


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


def get_monthly_dynamic(profile):
    monthly_dynamic = []

    delta = timedelta(30)
    today = datetime.today()
    this_moment = datetime.today()
    prev_result = 0
    while this_moment > today - timedelta(365):
        cutoff = no_latter_than(this_moment - delta)
        posts_list = list(cutoff(profile.get_posts()))
        posts_num = len(posts_list)
        monthly_dynamic.insert(0, posts_num - prev_result)
        prev_result = posts_num
        this_moment -= delta
    
    return monthly_dynamic


def get_profile_posts_top_info(profile, max_posts=5):
    cutoff = no_more_than(max_posts)
    captions_list = []
    comments_amounts = []
    comments_lists_list = []

    for post in cutoff(profile.get_posts()):
        captions_list.append(post.caption)
        comments_amounts.append(post.comments)
        comments_lists_list.append(get_post_comments_list(post))

    return captions_list, comments_amounts, comments_lists_list


def get_post_comments_list(ad_post):
    comments_instaces_list = list(ad_post.get_comments())
    comments_list = []

    for comment in comments_instaces_list:
        comment_text = comment.text.lower()
        comments_list.append(comment_text)
    return comments_list
