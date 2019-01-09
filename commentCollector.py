
from youtube_videos import youtube_search
from youtube_videos import get_comment_threads
# import pandas as pd
import string; print(string.__file__)
import json



# from nltk.stem import PorterStemmer
# import nltk
# from nltk.tokenize import sent_tokenize, word_tokenize
# import contractions
# from sklearn.feature_extraction.text import CountVectorizer
import re, string, unicodedata
import nltk
# nltk.download('stopwords')
import contractions
# import inflect
from bs4 import BeautifulSoup
from nltk import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
from nltk.stem import LancasterStemmer, WordNetLemmatizer, PorterStemmer
import textblob as tb


video_dict = {'youID':[], 'title':[], 'pub_date':[]}
# video_comment_threads = []
comments_list = []
words = []
stems=[]
lemmas = []

curr_doc_count = 0

word_set = {'words': [], 'stemmed':[], 'lemmatized':[]}
dictionary = dict()

def preprocess_text(text):
    translator = str.maketrans('', '', string.punctuation)
    return text.strip().lower().translate(translator)

def replace_contractions(text):
    """Replace contractions in string of text"""
    return contractions.fix(text)

def remove_stopwords(words):
    """Remove stop words from list of tokenized words"""
    new_words = []
    for word in words:
        if word not in stopwords.words('english'):
            w = tb.Word(word)
            word_set["words"].append(w.correct())
            new_words.append(w.correct())
    return new_words

def stem_words(words):
    """Stem words in list of tokenized words"""
    stemmer = PorterStemmer()
    # words = word_tokenize(words)
    # stems = []
    for word in words:
        stem = stemmer.stem(word)
        word_set["stemmed"].append(stem)
    # return stems

def lemmatize_verbs(words):
    """Lemmatize verbs in list of tokenized words"""
    lemmatizer = WordNetLemmatizer()
    lemmas = []
    for word in words:
        lemma = lemmatizer.lemmatize(word, pos='v')
        word_set["lemmatized"].append(lemma)
        lemmas.append(lemma)
    return lemmas

def preproccessing(text):
    global curr_doc_count
    text =  replace_contractions(preprocess_text(text))
    temp = nltk.word_tokenize(text)
    # stem_words(word_set['dictionary'])
    temp = lemmatize_verbs(remove_stopwords(temp))
    for word in temp:
        if word in dictionary: 
            if curr_doc_count in dictionary[word]: continue
        dictionary.setdefault(word, []).append(curr_doc_count)
    # print(temp)



def grab_videos(keyword, token=None):
    global dataset_file, curr_doc_count
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

                # Preprocessing ---------------------------------------------------------------
                preproccessing(text)
                # word_set['words'][1].apply(lambda x: str(TextBlob(x).correct()))
                # apply(lambda x: str(TextBlob(x).correct()))



                #-------------- ---------------------------------------------------------------
                print("COUNT:" + str(curr_doc_count)+ " " + text)
                dataset_file.write("COUNT:" + str(curr_doc_count)+ " " +text+'\n')
                curr_doc_count += 1

                comments_list.append(text)
        # print "added " + str(len(videos)) + " videos to a total of " + str(len(video_dict['youID']))
        return token
    return 0



dataset_file  = open("dataset.txt", "r+") 

# ---------------------------------------------------------------------------------------------
# To search a video
token = grab_videos("jake paul")
# token = grab_videos("fortnite")


# Stemm and lemmatize the words collected


# ---------------------------------------------------------------------------------------------





print("\n\nTotal number of comments: " + str(len(comments_list)))

# print(word_set['W'])
# print("\n\n")

# print(word_set['stemmed'])
# print("\n\n")
# print(word_set['lemmatized'])
# print("\n\n")

# print("\n\nTotal number of words: " + str(len(word_set['dictionary'])))

for key,val in dictionary.items():
    print(key, "=>", val)




# # Iterate through comments gathered
# for comment in comments_list:
#   print(comment) 

# print video_dict
# while token != "last_page":
#   token = grab_videos("spinners", token=token)


# -----------------------------------------------------------------------------------------------


