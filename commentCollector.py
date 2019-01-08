import sys
sys.path.append("/home/mnbatacan/Documents/youtube_tutorial")
from youtube_videos import youtube_search
from youtube_videos import get_comment_threads
# import pandas as pd
import json


video_dict = {'youID':[], 'title':[], 'pub_date':[]}
# video_comment_threads = []
comments_list = []




def grab_videos(keyword, token=None):
    res = youtube_search(keyword, token=token)
    # statistics.commentCount 
    if(res != 0):
        token = res[0]
        videos = res[1]
        for vid in videos:
            video_dict['youID'].append(vid['id']['videoId'])
            video_dict['title'].append(vid['snippet']['title'])
            video_dict['pub_date'].append(vid['snippet']['publishedAt'])
            video_dict['pub_date'].append(vid['snippet']['publishedAt'])
            try: video_comment_threads = get_comment_threads(vid['id']['videoId'])
            except Exception as e: continue

            for item in video_comment_threads:
                comment = item["snippet"]["topLevelComment"]
                author = comment["snippet"]["authorDisplayName"]
                text = comment["snippet"]["textDisplay"]
                print(text)
                comments_list.append(text)
        # print "added " + str(len(videos)) + " videos to a total of " + str(len(video_dict['youID']))
        return token
    return 0




# ---------------------------------------------------------------------------------------------
# To search a video
token = grab_videos("jake paul")
token = grab_videos("fortnite")
# ---------------------------------------------------------------------------------------------


print("\n\nTotal number of comments: " + str(len(comments_list)))








# # Iterate through comments gathered
# for comment in comments_list:
#   print(comment) 

# print video_dict
# while token != "last_page":
#   token = grab_videos("spinners", token=token)

