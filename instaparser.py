import json
import os
import instaloader

def read(json_filepath):
    with open(json_filepath, "r") as fd:
        return fd.read()


visited_profiles_id_list = set()
private_profiles_id_list = set()


def get_comments_in_post(post, MAX_AMOUNT=200):
    i = 1
    comments = post.get_comments()
    for comment in comments:
        print(comment.text)
        for answer in comment.answers:
            print(answer.text)
        if i == MAX_AMOUNT:
            break

        print("\nNEW COMMENT\n")
        i += 1


def get_user_posts(profile):
    print(profile.mediacount)
    # profile.get_posts()


def go_through_accounts_in_comments(profile, profiles_amount=0, MAX_PROFILES_AMOUNT=1000):
    for post in profile.get_posts():
        for comment in post.get_comments():
            follower = comment.owner
            if follower.userid in visited_profiles_id_list or follower.userid in private_profiles_id_list:
                continue
            if follower.is_private:
                private_profiles_id_list.add(follower.userid)
                continue
            visited_profiles_id_list.add(follower.userid)
            get_user_posts(follower)
        if len(visited_profiles_id_list) >= MAX_PROFILES_AMOUNT:
            return 0


L = instaloader.Instaloader()
post = instaloader.Post.from_shortcode(L.context, "CEKj_aUD8rC")
print(post.caption)


go_through_accounts_in_comments(instaloader.Profile.from_username(L.context, "navalny"))

