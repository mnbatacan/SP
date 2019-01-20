#!/usr/bin/env python
import numpy
import ast
import re
import math
from scipy.linalg import svd
import pandas as pd #this is how I usually import pandas
import sys
import matplotlib.pyplot as plt
import collections


from sklearn.feature_extraction.text import TfifVectorizer


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

def reading():
    with open('dictionary.txt', 'r') as f:
        s = f.read()
        dictionary = ast.literal_eval(s)
    return dictionary

def removekey(d, key):
    r = dict(d)
    del r[key]
    return r


def count_occurrences(word, sentence):
    return sentence.lower().split().count(word)
# ---------------------------------------------------------------------


no_of_docs = int(dataset[len(dataset)-2])
d = reading()
dictionary = collections.OrderedDict(sorted(d.items()))
# Remove dictionary items with less than 2 ocurrence on all document
for key in dictionary:
	if len(dictionary[key]) < 2:
		dictionary = removekey(dictionary,key)

no_of_dictionary = len(dictionary)

for k in dictionary:
    print(k,dictionary[k])


# Creates the bag of words
bag_of_words = numpy.zeros(shape=(no_of_dictionary,no_of_docs))

counter = 0
for key in dictionary:
	for val in dictionary[key]:
		bag_of_words[counter][val] += 1
	counter += 1

# values = list(dictionary.values())
# print({val:values[key] for key,val in enumerate(key)})
print(bag_of_words)

# ------------------yt version










































# ol--------------------------------------

# # # -------------------------------------------------------------------
# normalized_matrix = numpy.zeros(shape=(no_of_dictionary,no_of_docs))
# # # TF-IDF Computation
# # for i, key in enumerate(dictionary):
# # 	# print(i, key)
# # 	for val in set(dictionary[key]):
# # 		# print(val,count_occurrences(key,dataset[val]),len(dataset[val].split()))
# # 		normalized_matrix[i][val] = (count_occurrences(key,dataset[val])/len(dataset[val].split())) * math.log(no_of_docs/len(dictionary[key])) 


# # another version
# # for i in range(no_of_dictionary):
# # 	for j in range(no_of_docs):
# # 		normalized_matrix[i,j] = (bag_of_words[i][j]/len(dataset[j].split())) * math.log((no_of_docs/len(dictionary[key]))+1)


# # # -------------------------------------------------------------------

# # print(normalized_matrix)

# svd1, svd2, svd3 = svd(bag_of_words, full_matrices=True)

# # print(len(svd1),len(svd1[0]))
# # print(bag_of_words)
# # print(len(svd2))
# print("svd1")
# print(-1 * svd1[:,0:3])

# print("svd3")
# print(svd3)


# print(no_of_dictionary,no_of_docs)

# # print(svd1)

# x_plot = []
# y_plot = []
# keys = list(dictionary.keys())
# # keys.append = ['1','2','3','4','5','6','7','8','9']
# for i in range(1,9):
# 	keys.append(str(i))

# for i in range(len(svd1)):
# 	x_plot.append(svd1[i][1])
# 	y_plot.append(svd1[i][2])

# for i in range(len(svd3)):
# 	x_plot.append(svd3[i][1])
# 	y_plot.append(svd3[i][2])
# 	# annotate(txt, (z[i], y[i]))

# # plt.scatter(x_plot, y_plot)
# fig, ax = plt.subplots()
# # fig, ax = plt.subplots()

# for i, txt in enumerate(keys):
#     ax.annotate(txt, (x_plot[i], y_plot[i]))
# # print(x_plot[:15])
# # print("   ")
# # print(y_plot[:15])


# plt.show()