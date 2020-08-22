import json
import os
import instaloader

def read(json_filepath):
    with open(json_filepath, "r") as fd:
        return fd.read()


def write(text, json_filepath="./test1.json"):
    with open(json_filepath, "a+") as fd:
        fd.write(json.dumps(text) + "\n")


visited_profiles_id_list = set()
useless_profiles_id_list = set()


def get_comments_in_post(post, MAX_COMMENTS_AMOUNT=100):
    post_with_comments = {}
    post_with_comments["shortcode"] = post.shortcode
    post_with_comments["comment_text"] = post.caption
    post_with_comments["comments"] = []
    comments = post.get_comments()
    
    for comment in comments:
        post_with_comments["comments"].append(comment.text)
        for answer in comment.answers:
            post_with_comments["comments"].append(answer.text)
        if len(post_with_comments["comments"]) >= MAX_COMMENTS_AMOUNT:
            break
    
    write(post_with_comments)
    return 0


def get_user_posts(profile, MAX_POSTS_AMOUNT=20):
    i = 0
    
    for post in profile.get_posts():
        i += 1
        get_comments_in_post(post)
        if i >= MAX_POSTS_AMOUNT:
            break
    
    return 0



def go_through_accounts_in_comments(profile, profiles_amount=0, MAX_PROFILES_AMOUNT=1000):
    for post in profile.get_posts():
        for comment in post.get_comments():
            commentator = comment.owner
            if commentator.userid in visited_profiles_id_list or commentator.userid in useless_profiles_id_list:
                continue
            if commentator.is_private:
                useless_profiles_id_list.add(commentator.userid)
                continue
            if commentator.followers < 50:
                useless_profiles_id_list.add(commentator.userid)
                continue
            visited_profiles_id_list.add(commentator.userid)
            get_user_posts(commentator)
        if len(visited_profiles_id_list) >= MAX_PROFILES_AMOUNT:
            return 0


L = instaloader.Instaloader()

go_through_accounts_in_comments(instaloader.Profile.from_username(L.context, "navalny"))
