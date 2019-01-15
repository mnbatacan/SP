from apiclient.discovery import build
from apiclient.errors import HttpError
from oauth2client.tools import argparser

DEVELOPER_KEY = "AIzaSyC8WBr_OruDGs3z4hejqPmi5yZjeykh03A"
YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"

youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION, developerKey=DEVELOPER_KEY)


# Remove keyword arguments that are not set
def remove_empty_kwargs(**kwargs):
  good_kwargs = {}
  if kwargs is not None:
    for key, value in kwargs.items():
      if value:
        good_kwargs[key] = value
  return good_kwargs

def videos_list_by_id(**kwargs):
  # See full sample for function
  kwargs = remove_empty_kwargs(**kwargs)

  response = youtube.videos().list(
    **kwargs
  ).execute()

  return response


def youtube_search(q, max_results=20,order="relevance", token=None, location=None, location_radius=None):

  # youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION,
  #   developerKey=DEVELOPER_KEY)
  vidId=0
  search_response = youtube.search().list(
    q=q,
    type="video",
    pageToken=token,
    order = order,
    part="id,snippet",
    maxResults=max_results,
    location=location,
    locationRadius=location_radius

  ).execute()





  videos = []

  for search_result in search_response.get("items", []):
    if search_result["id"]["kind"] == "youtube#video":

      vidDetails = videos_list_by_id(part='statistics', id=search_result["id"]["videoId"])
      # print((vidDetails['items'][0]["statistics"]))
      if (vidDetails['items'][0]["statistics"]["commentCount"]) != None: 
        print((vidDetails['items'][0]["statistics"]))
        videos.append(search_result)
  try:
      nexttok = search_response["nextPageToken"]
      return(nexttok, videos)
  except Exception as e:
      nexttok = "last_page"
      return(nexttok, videos)

def get_comments(youtube, video_id, channel_id):
  results = youtube.commentThreads().list(
    part="snippet",
    videoId=video_id,
    channelId=channel_id,
    textFormat="plainText"
  ).execute()

  for item in results["items"]:
    comment = item["snippet"]["topLevelComment"]
    author = comment["snippet"]["authorDisplayName"]
    text = comment["snippet"]["textDisplay"]
    # print "Comment by %s: %s" % (author, text)

  return results["items"]

def get_comment_threads(video_id):
  results = youtube.commentThreads().list(
    part="snippet",
    videoId=video_id,
    textFormat="plainText"
  ).execute()
  return results["items"]




def geo_query(video_id):
    youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION,
                    developerKey=DEVELOPER_KEY)

    video_response = youtube.videos().list(
        id=video_id,
        part='snippet, recordingDetails, statistics'

    ).execute()

    return video_response


