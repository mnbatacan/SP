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


# SVD
svd = TruncatedSVD(n_components=100, n_iter=7)
svd_matrix = svd.fit_transform(normalized_matrix)

# LinearSVC
clf = LinearSVC()
clf.fit(svd_matrix,dataset_class)


# SVD
# U_svd, S_svd, VT_svd = randomized_svd(normalized_matrix,n_components=100, n_iter=7,random_state=None)
# # svd.fit(normalized_matrix)X, 



# print(len(dataset_class))
# # print(svd_matrix)	
# explained_variance = svd.explained_variance_ratio_.sum()
# print(svd.explained_variance_ratio_)

# print(svd.singular_values_) 
# print(S_svd)


target_vector = [0,1,2]
 
# # Classifier 
# clf = MultinomialNB().fit(svd_matrix, dataset_class)


# print(svd_matrix.shape)
# print(clf.coef_)


numpy.seterr(divide='ignore', invalid='ignore')


docs_new = ["i hate you fat ass bitch "]
X_new_counts = count_vect.transform(docs_new)
X_new_tfidf = tfidf_transformer.transform(X_new_counts)
X_new_svd = svd.transform(X_new_tfidf)

print(X_new_svd.shape)
predicted = clf.predict(X_new_svd)



# X_test=tvect.transform(test)

# for doc, category in zip(docs_new, predicted): print('%r => %s' % (doc, category)
print(predicted)

