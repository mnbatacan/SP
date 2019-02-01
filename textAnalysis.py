import numpy
import ast
import re
import math
import pandas as pd

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.svm import LinearSVC
from sklearn.decomposition import TruncatedSVD
from sklearn.utils.extmath import randomized_svd
from sklearn.model_selection import train_test_split
from sklearn.utils import shuffle
from sklearn.model_selection import KFold


# Read csv file then save to pandas dataframe
df = pd.read_csv("dataset/main_dataset.csv")
df = shuffle(df)
target = df['class']

# print(df.iloc[0]['class'], df.iloc[1]['text'])
# ----------------------------------------------
# K-FOLD Cross Validation

kfold = KFold(10, True, 1)
for train, test in kfold.split(df):
	print('train: %s, test: %s' % (train, test))

	train_text = []
	train_class = []
	for index in train:
		if str(df.iloc[index]['text']) != 'nan':
			train_text.append(df.iloc[index]['text'])
			train_class.append(df.iloc[index]['class'])


	print("TRAIN CLASS LENGTH: ",len(train_class))

	# N-GRAMS
	count_vect = CountVectorizer(ngram_range=(2,2))
	feature_vectors = count_vect.fit_transform(train_text)
	print(feature_vectors.shape)
	# print(count_vect.get_feature_names())


	# TF-IDF
	tfidf_transformer = TfidfTransformer()
	normalized_matrix = tfidf_transformer.fit_transform(feature_vectors)
	print(normalized_matrix.shape)
	print("tfidf done")

	# SVD
	svd = TruncatedSVD(n_components=100, n_iter=7)
	svd_matrix = svd.fit_transform(normalized_matrix)
	print("SVD done")


	# LinearSVC
	clf = LinearSVC()
	clf.fit(svd_matrix,train_class)
	print("Classifier done")

	break
