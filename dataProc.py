import numpy
import ast
import re
import math

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.naive_bayes import MultinomialNB


# ---------------------------------------------------------------------
# Read dataset text file
dataset = []
file = open("dataset.txt", "r") 
for line in file:
	line = line.strip('\n')
	dataset.append(line)
# print(dataset)	
# ---------------------------------------------------------------------

# ---------------------------------------------------------------------
# Read dataset text file
dictionary = []
dataset_class = []

def reading():
    with open('dictionary.txt', 'r') as f:
        s = f.read()
        dictionary = ast.literal_eval(s)
    return dictionary

def read_dataset_class():
	with open('dataset_class.txt', 'r') as f:
   		dataset_class = ast.literal_eval(f.read())
	return dataset_class

def removekey(d, key):
    r = dict(d)
    del r[key]
    return r


def count_occurrences(word, sentence):
    return sentence.lower().split().count(word)
# ---------------------------------------------------------------------


no_of_docs = int(dataset.pop(len(dataset)-2))
no_of_dictionary = int(dataset.pop(len(dataset)-1))
dictionary = reading()
dataset_class = read_dataset_class()


# Remove dictionary items with less than 2 ocurrence on all document
for key in dictionary:
	if len(dictionary[key]) < 2:
		dictionary = removekey(dictionary,key)
# print(dictionary)


# Creates the bag of words
bag_of_words = numpy.zeros(shape=(no_of_dictionary,no_of_docs))

counter = 0
for key in dictionary:
	for val in dictionary[key]:
		bag_of_words[counter][val] += 1
	counter += 1

# values = list(dictionary.values())
# print({val:values[key] for key,val in enumerate(key)})


# count_vect = CountVectorizer()
# X_train_counts = count_vect.fit_transform(twenty_train.data)
# X_train_counts.shape



# # # -------------------------------------------------------------------
# normalized_matrix = numpy.zeros(shape=(no_of_dictionary,no_of_docs))
# # # TF-IDF Computation
# # for i in range(no_of_dictionary):
# for i, key in enumerate(dictionary):
# 	print(i, key)
# 	for val in dictionary[key]:
# 		print(val,count_occurrences(key,dataset[val]),len(dataset[val].split()))
# 		normalized_matrix[i][val] = (count_occurrences(key,dataset[val])/len(dataset[val].split())) * math.log(no_of_docs/len(dictionary[key])) 
# print(normalized_matrix[1])


# # # -------------------------------------------------------------------
from sklearn.feature_extraction.text import CountVectorizer
count_vect = CountVectorizer()
feature_vectors = count_vect.fit_transform(dataset)
print(feature_vectors.shape)


# --------------------------------------------------------------------------
# TF-IDF
tfidf_transformer = TfidfTransformer()
normalized_matrix = tfidf_transformer.fit_transform(feature_vectors)
print(normalized_matrix.shape)


print(len(dataset_class))

# # Classifier
clf = MultinomialNB().fit(normalized_matrix, dataset_class)
docs_new = ['shut the fuck up ugly ass bitch nigga i stole your setup', ' you are a nigger maggot']
X_new_counts = count_vect.transform(docs_new)
X_new_tfidf = tfidf_transformer.transform(X_new_counts)
predicted = clf.predict(X_new_tfidf)

# for doc, category in zip(docs_new, predicted): print('%r => %s' % (doc, category)
print(predicted)

