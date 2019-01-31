import numpy
import ast
import re
import math

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.svm import LinearSVC
from sklearn.decomposition import TruncatedSVD
from sklearn.utils.extmath import randomized_svd


# ---------------------------------------------------------------------
# Read dataset text file
dataset = []
file = open("dataset.txt", "r") 
for line in file:
	line = line.strip('\n')
	dataset.append(line)
# print(dataset)

print("dataset loaded")	
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

print("bag of words craeted")


# ---------------------------------------------------------------------
# Count dataset
class_number = []
class_number.append(dataset_class.count(0))
class_number.append(dataset_class.count(1))
class_number.append(dataset_class.count(2))


print(class_number)



X_train, X_test, y_train, y_test = train_test_split(df, y, test_size=0.2)
print X_train.shape, y_train.shape
print X_test.shape, y_test.shape














# from sklearn.feature_extraction.text import CountVectorizer
# count_vect = CountVectorizer()
# feature_vectors = count_vect.fit_transform(dataset)
# # print(feature_vectors.shape)




# --------------------------------------------------------------------------
# # TF-IDF
# tfidf_transformer = TfidfTransformer()
# normalized_matrix = tfidf_transformer.fit_transform(feature_vectors)
# # print(normalized_matrix.	shape)
# print("tfidf done")


# # SVD
# svd = TruncatedSVD(n_components=100, n_iter=7)
# svd_matrix = svd.fit_transform(normalized_matrix)
# print("SVD done")


# # LinearSVC
# clf = LinearSVC()
# clf.fit(svd_matrix,dataset_class)
# print("Classifier done")


# numpy.seterr(divide='ignore', invalid='ignore')

# print("starting classifying")
# docs_new = ["you are the man!!", "you are a nigga", "you are faggot", "trump is an asshole", "you are really an ass but i like you", "stupid cunts","so uncivillized"]
# X_new_counts = count_vect.transform(docs_new)
# X_new_tfidf = tfidf_transformer.transform(X_new_counts)
# X_new_svd = svd.transform(X_new_tfidf)

# # print(X_new_svd.shape)
# print("predicting...")
# predicted = clf.predict(X_new_svd)



# # X_test=tvect.transform(test)

# # for doc, category in zip(docs_new, predicted): print('%r => %s' % (doc, category)
# print(predicted)

