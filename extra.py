
from youtube_videos import youtube_search
from youtube_videos import get_comment_threads
# import pandas as pd
import string; print(string.__file__)
import json
import time
import multiprocessing
import emoji


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
from bs4 import BeautifulSoup





def strip_html(text):
    # soup = BeautifulSoup(text, "html.parser")
    # line = soup.get_text()
    # line = line.split()
    return ' '.join(text.split())

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

def write_file(text):
    with open("dataset.txt", "a") as text_file:
        text_file.write(text+"\n")
    
def remove_emoji(text):
    return emoji.get_emoji_regexp().sub(u'', text)

def append_dictionary(text):
    global dictionary
    temp = nltk.word_tokenize(text)
    # stem_words(word_set['dictionary'])

    # ----------------------------------------------------------------
    # Lemmatizing and tracking of word in documents
    temp = lemmatize_verbs(remove_stopwords(temp))
    for word in temp:
        # if word in dictionary: 
        #     if curr_doc_count in dictionary[word]: continue
        dictionary.setdefault(word, []).append(curr_doc_count)
        print(len(dictionary))
    # ----------------------------------------------------------------
    return

def preproccessing(text):
    global curr_doc_count, dictionary
    text = strip_html(remove_emoji(text))
    # print("hey: " + text)
    text =  replace_contractions(preprocess_text(text))
    write_file(text)
    append_dictionary(text)

def grab_videos(keyword, token=None):
    global dataset_file, curr_doc_count, curr_text
    # write_file("asdsd")
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
                # text = preproccessing(text)
                print("start")
                p = multiprocessing.Process(target=preproccessing, name="preproccessing", args=(text,)
)                p.start()

                # Wait 10 seconds for foo
                # time.sleep(10)
                p.join(120)
                if p.is_alive():
                    print("foo is running... let's kill it...")

                    # Terminate foo
                    p.terminate()
                    p.join()



                #-------------- ---------------------------------------------------------------
                print("COUNT:" + str(curr_doc_count)+ " " + text)
                # print("----------------------",str(len(dictionary)))
                # dataset_file.write(text+'\n')
                curr_doc_count += 1

                comments_list.append(text)
        # print "added " + str(len(videos)) + " videos to a total of " + str(len(video_dict['youID']))
        return token
    return 0







video_dict = {'youID':[], 'title':[], 'pub_date':[]}
# video_comment_threads = []
comments_list = []
words = []
stems=[]
lemmas = []

curr_doc_count = 0

curr_text = " "
word_set = {'words': [], 'stemmed':[], 'lemmatized':[]}
dictionary = dict()

emoji_pattern = re.compile(u'['
        u'\U0001F300-\U0001F64F'
        u'\U0001F680-\U0001F6FF'
        u'\u2600-\u26FF\u2700-\u27BF]+', 
        re.UNICODE)







# dataset_file  = open("dataset.txt", "w") 

# ---------------------------------------------------------------------------------------------
# To search a video
# token = grab_videos("jake paul")
# token = grab_videos("logan paul")
token = grab_videos("justin bieber")


# Stemm and lemmatize the words collected


# ---------------------------------------------------------------------------------------------





print("\n\nTotal number of comments: " + str(len(comments_list)))
write_file(str(len(comments_list)))
write_file(str(len(dictionary)))


dictionary_file = open('dictionary.txt', 'w')
# dictionary_file.write("qweqweqweqwe")
# with open('dictionary.txt', 'w') as dictionary_file:
dictionary_file.write(json.dumps(dictionary))



# dataset_file.close()
dictionary_file.close()
# # Iterate through comments gathered
# for comment in comments_list:
#   print(comment) 

# print video_dict
# while token != "last_page":
#   token = grab_videos("spinners", token=token)


# -----------------------------------------------------------------------------------------------


