
from youtube_videos import youtube_search
from youtube_videos import get_comment_threads
# import pandas as pd
import string; print(string.__file__)
import json
import emoji
import time
import multiprocessing
import csv
import preprocessor as p
import pandas as pd
import ast



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


video_dict = {'youID':[], 'title':[], 'pub_date':[]}
# video_comment_threads = []
comments_list = []
words = []
stems=[]
lemmas = []

curr_doc_count = 0

word_set = {'words': [], 'stemmed':[], 'lemmatized':[]}
dictionary = dict()
dataset_class = []

def strip_html(text):
    soup = BeautifulSoup(text, "html.parser")
    line = soup.get_text()
    line = line.split()
    return ' '.join(line)

def preprocess_text(text):
    translator = str.maketrans('', '', string.punctuation)
    return text.strip().lower().translate(translator)

def replace_contractions(text):
    """Replace contractions in string of text"""
    return contractions.fix(text)

def remove_stopwords(words,text):
    """Remove stop words from list of tokenized words"""
    new_words = []
    for word in words:
        if word not in stopwords.words('english'):
            w = tb.Word(word)
            word_set["words"].append(w.correct())
            new_words.append(w.correct())
    text = ' '.join(new_words)
    return new_words,text

def stem_words(words):
    """Stem words in list of tokenized words"""
    stemmer = PorterStemmer()
    # words = word_tokenize(words)
    # stems = []
    for word in words:
        stem = stemmer.stem(word)
        word_set["stemmed"].append(stem)
    # return stems

def lemmatize_verbs(words,text):
    """Lemmatize verbs in list of tokenized words"""
    lemmatizer = WordNetLemmatizer()
    lemmas = []
    for word in words:
        lemma = lemmatizer.lemmatize(word, pos='v')
        # print(word,lemma)
        text = text.replace(word,lemma)
        word_set["lemmatized"].append(lemma)
        lemmas.append(lemma)
    # print(text)
    return lemmas,text

    
def remove_emoji(text):
    return emoji.get_emoji_regexp().sub(u'', text)

def remove_usernames(text):
    return re.sub('@[^\s]+','',text)

def preproccessing(text):
    global curr_doc_count, dictionary
    text = strip_html(text)
    text = remove_emoji(text)
    text = remove_usernames(text)
    text = p.clean(text)
    # print("hey: " + text)
    text =  replace_contractions(preprocess_text(text))
    # text = preprocess_text(text)
    temp = nltk.word_tokenize(text)
    # stem_words(word_set['dictionary'])

    # ----------------------------------------------------------------
    # Lemmatizing and tracking of word in documents
    stopwords_removed, text = remove_stopwords(temp,text)
    temp,text = lemmatize_verbs(stopwords_removed, text)
    for word in temp:
        # if word in dictionary: 
        #     if curr_doc_count in dictionary[word]: continue
        dictionary.setdefault(word, []).append(curr_doc_count)
    # ----------------------------------------------------------------
    return text



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
                text = preproccessing(text)
                # word_set['words'][1].apply(lambda x: str(TextBlob(x).correct()))
                # apply(lambda x: str(TextBlob(x).correct()))



                #-------------- ---------------------------------------------------------------
                print("COUNT:" + str(curr_doc_count)+ " " + text)
                dataset_file.write(text+'\n')
                curr_doc_count += 1

                comments_list.append(text)
        # print "added " + str(len(videos)) + " videos to a total of " + str(len(video_dict['youID']))
        return token
    return 0


def csv_collector():
    global dataset_file, curr_doc_count,dataset_class
    with open('dataset/twitter_classified.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        line_count = 0
        for row in csv_reader:
            # if line_count == 10:
            #     break
            # else:
                # print(f'\t{row[0]} : {row[2]}.')
            text = preproccessing(row[1])
            dataset_file.write(text+'\n')
            curr_doc_count += 1
            comments_list.append(text)

            # dataset_class.append(row[0])
            if(row[0] == "The tweet contains hate speech"): dataset_class.append(0)
            elif(row[0] == "The tweet uses offensive language but not hate speech"): dataset_class.append(1)
            else: dataset_class.append(2)
            line_count += 1
            print(line_count)

    with open('dataset/labeled_data.csv') as csv_file2:
        csv_reader2 = csv.reader(csv_file2, delimiter=',')
        # line_count = 0
        for row in csv_reader2:
            if line_count == 25000:
                break
            # else:
                # print(f'\t{row[0]} : {row[2]}.')
            text = preproccessing(row[1])
            dataset_file.write(text+'\n')
            curr_doc_count += 1
            comments_list.append(text)

            dataset_class.append(int(row[0]))
            line_count += 1
            print(line_count)

    print(f'Processed {line_count} lines.')

def read_dataset_class():
    with open('dataset_class.txt', 'r') as f:
        dataset_class = ast.literal_eval(f.read())
    return dataset_class

def write_complete_dataset():
    global dataset_class
    main_dataset_list = []
    file = open("dataset.txt", "r") 
    for line in file:
        line = line.strip('\n')
        main_dataset_list.append(line)
    print(main_dataset_list[:10])

    
    dataset_class = read_dataset_class()
    print(len(dataset_class))

    print("dataset loaded")

    with open('dataset/main_dataset.csv', mode='w') as main_dataset:
        writer = csv.writer(main_dataset, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)

        writer.writerow(['class', 'text'])

        for index, val in enumerate(main_dataset_list):
            writer.writerow([dataset_class[index],val])
            # print(dataset_class[index],val)
            print(index)
            if index == 24999: break


    

def csv_to_pandas():
    df = pd.read_csv("dataset/main_dataset.csv")
    # print(df.head(10))
    print(df['class'][:10])



# dataset_file  = open("dataset.txt", "w") 

# ---------------------------------------------------------------------------------------------
# To search a video
# token = grab_videos("elections")
# token = grab_videos("logan paul")
# token = grab_videos("youtube rewind")


# Stemm and lemmatize the words collected



# csv_collector()
csv_to_pandas()
# write_complete_dataset()

# ---------------------------------------------------------------------------------------------





# print("\n\nTotal number of comments: " + str(len(comments_list)))
# dataset_file.write(str(len(comments_list))+'\n')
# dataset_file.write(str(len(dictionary))+'\n')


# with open('dictionary.txt', 'w') as dictionary_file:
#     dictionary_file.write(json.dumps(dictionary))

# with open('dataset_class.txt', 'w') as dataset_class_file:
#     dataset_class_file.write(json.dumps(dataset_class))





# # Iterate through comments gathered
# for comment in comments_list:
#   print(comment) 

# print video_dict
# while token != "last_page":
#   token = grab_videos("spinners", token=token)


# -----------------------------------------------------------------------------------------------


