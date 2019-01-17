import numpy
import ast
import re


# ---------------------------------------------------------------------
# Read dataset text file
dataset = []
file = open("dataset.txt", "r") 
for line in file:
	line = line.strip('\n')
	dataset.append(line)
print(dataset)	
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
no_of_dictionary = int(dataset[len(dataset)-1])
dictionary = reading()

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







# # -------------------------------------------------------------------
normalized_matrix = numpy.zeros(shape=(no_of_dictionary,no_of_docs))
# # TF-IDF Computation
# for i in range(no_of_dictionary):
for i, key in enumerate(dictionary):
	print(i, key)
	for val in dictionary[key]:
		print(val,count_occurrences(key,dataset[val]))
		# break
	# break
		# normalized_matrix[i][val] = 
# 	for j in range(no_of_docs):



# # -------------------------------------------------------------------






