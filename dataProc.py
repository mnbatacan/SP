import numpy
import ast


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
# ---------------------------------------------------------------------


# GLOBAL VARIABLES-----------------------------------------------------
no_of_docs = int(dataset[len(dataset)-2])
no_of_dictionary = int(dataset[len(dataset)-1])
dictionary = reading()
bag_of_words = numpy.zeros(shape=(no_of_dictionary,no_of_docs))


counter = 0
for key in dictionary:
	# print(dictionary[key])
	for val in dictionary[key]:
		bag_of_words[counter][val] += 1
	counter += 1

print(bag_of_words[12])

# ---------------------------------------------------------------------







