import numpy


# ---------------------------------------------------------------------
# Read dataset text file
dataset = []
file = open("dataset.txt", "r") 
for line in file:
	line = line.strip('\n')
	dataset.append(line)
print(dataset)	
# ---------------------------------------------------------------------


# GLOBAL VARIABLES-----------------------------------------------------
no_of_docs = int(dataset[len(dataset)-2])
no_of_dictionary = int(dataset[len(dataset)-1])
bag_of_words = numpy.zeros(shape=(no_of_dictionary,no_of_docs))

# ---------------------------------------------------------------------







