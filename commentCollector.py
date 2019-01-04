import sys
sys.path.append("/home/mnbatacan/Documents/youtube_tutorial")
from youtube_videos import youtube_search
from youtube_videos import get_comment_threads
# import pandas as pd
import json

# test = youtube_search("spinners")
# test


test = youtube_search("spinners")

video_dict = {'youID':[], 'title':[], 'pub_date':[]}

just_json = test[1]
len(just_json)


for video in just_json:
    print video['snippet']['title']

token = test[0]
youtube_search("spinners", token=token)



video_dict = {'youID':[], 'title':[], 'pub_date':[]}



def grab_videos(keyword, token=None):
    res = youtube_search(keyword, token=token)
    token = res[0]
    videos = res[1]
    for vid in videos:
        video_dict['youID'].append(vid['id']['videoId'])
        video_dict['title'].append(vid['snippet']['title'])
        video_dict['pub_date'].append(vid['snippet']['publishedAt'])
        video_dict['pub_date'].append(vid['snippet']['publishedAt'])
        video_comment_threads = get_comment_threads(vid['id']['videoId'])
    # print "added " + str(len(videos)) + " videos to a total of " + str(len(video_dict['youID']))
    return token





token = grab_videos("spinners")
# print video_dict
# while token != "last_page":
#   token = grab_videos("spinners", token=token)

