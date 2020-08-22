from itertools import takewhile


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


def get_profile_posts(profile, max_posts=10):
    cutoff = no_more_than(max_posts)
    posts = [p for p in cutoff(profile.get_posts())]
    return posts
