import json
import os
import time
from collections import Counter
from datetime import datetime, timedelta

import instaloader
from instaloader import save_structure_to_file

from youla.utils.inst_parse import no_more_than


def read(json_filepath):
    with open(json_filepath, "r") as fd:
        return fd.read()


def no_latter_than(limit):
    def limiter(gen):
        for item in gen:
            if item.date_utc < limit:
                break
            yield item

    return limiter


if __name__ == "__main__":
    L = instaloader.Instaloader()

    profile_name = "flo_rida"

    profile = instaloader.Profile.from_username(L.context, profile_name)

    delta = timedelta(180)
    cutoff = no_latter_than(datetime.today() - delta)
    posts_list = list(cutoff(profile.get_posts()))
    print("loading up to {} completed".format(posts_list[-1].date_utc))
    posts_num = len(posts_list)
    print("number of posts:", posts_num)

    pattern_list = ["покупай", "советую", "реклама", "artfruit"]
    pattern_counter = Counter()

    st = time.time()
    for id, post in enumerate(posts_list):
        filename = "newtest" + str(id) + ".json"
        save_structure_to_file(post, filename)
        filetext = read(filename)
        post_json = json.loads(filetext)
        caption = post_json["node"]["edge_media_to_caption"]["edges"][0]["node"][
            "text"
        ].lower()
        # print(caption)
        cutoff = no_more_than(30)
        comments_list = list(cutoff(post.get_comments()))
        for comment in comments_list:
            comment_text = comment.text.lower()
            for pattern in pattern_list:
                pattern_counter[pattern] += int(pattern in comment_text)
            # print(comment.owner.userid)
        for pattern in pattern_list:
            pattern_counter[pattern] += int(pattern in caption)
    print(time.time() - st)
    # print(json.dumps(post_json, indent=2, ensure_ascii=False))
    print(pattern_counter)
    os.system("rm *.json")
