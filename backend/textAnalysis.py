import numpy
import ast
import re
import math
import pandas as pd
import nltk
import pickle

from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.svm import LinearSVC
from sklearn.decomposition import TruncatedSVD
from sklearn.utils.extmath import randomized_svd
from sklearn.model_selection import train_test_split
from sklearn.utils import shuffle
from sklearn.model_selection import KFold
from sklearn.metrics import accuracy_score, classification_report
from sklearn.metrics import precision_recall_fscore_support as score
from sklearn.metrics import make_scorer, accuracy_score, precision_score, recall_score, f1_score
from sklearn.model_selection import cross_validate

scoring = {'accuracy': 'accuracy',
           'recall': 'recall',
           'precision': 'precision',
           'roc_auc': 'roc_auc'}



total_presicion = []
total_recall = []
total_fscore = []
total_support = []

accuracy_sum = 0
accuracy_average = 0
# Read csv file then save to pandas dataframe
df 	= pd.read_csv("dataset/main_dataset_lemma.csv")
df = shuffle(df)
df = df[pd.notnull(df['text'])]

target = df['class']

# print(df.iloc[12]['class'], df.iloc[12]['text'])
# ----------------------------------------------
# K-FOLD Cross Validation

# kfold = KFold(10, True, 1)
# for train, test in kfold.split(df):
# 	print('train: %s, test: %s' % (train, test))

# 	# X_train, X_test = X[train_index], X[test_index]
# 	# y_train, y_test = y[train_index], y[test_index]


# 	train_text = []
# 	train_class = []
# 	for index in train:
# 		if str(df.iloc[index]['text']) != 'nan':
# 			train_text.append(df.iloc[index]['text'])
# 			train_class.append(df.iloc[index]['class'])



# 	print("TRAIN CLASS LENGTH: ",len(train_class))

# 	# N-GRAMS
# 	count_vect = CountVectorizer()
# 	# count_vect = CountVectorizer(ngram_range=(3,3),strip_accents = 'unicode', stop_words = 'english')

# 	feature_vectors = count_vect.fit_transform(train_text)
# 	print(feature_vectors.shape)
# 	# print(count_vect.get_feature_names())


# 	# TF-IDF
# 	tfidf_transformer = TfidfTransformer()
# 	normalized_matrix = tfidf_transformer.fit_transform(feature_vectors)
# 	print(normalized_matrix.shape)
# 	print("tfidf done")

# 	# SVD
# 	# svd = TruncatedSVD(n_components=100, n_iter=7)
# 	# svd_matrix = svd.fit_transform(normalized_matrix)
# 	# print("SVD done")


# 	# LinearSVC
# 	clf = LinearSVC()
# 	clf.fit(normalized_matrix,train_class)
# 	print("Classifier done")


# 	test_text = []
# 	test_class = []
# 	for index in test:
# 		if str(df.iloc[index]['text']) != 'nan':
# 			test_text.append(df.iloc[index]['text'])
# 			test_class.append(df.iloc[index]['class'])

# 	X_new_counts = count_vect.transform(test_text)
# 	X_new_tfidf = tfidf_transformer.transform(X_new_counts)
# 	# X_new_svd = svd.transform(X_new_tfidf)

# 	predicted = clf.predict(X_new_tfidf)
# 	accuracy_sum += accuracy_score(test_class, predicted)
# 	print("LSVC Accuracy :", accuracy_score(test_class, predicted))
# 	print(predicted[:6])

# 	print(test_class[:6])
# 	# print
# 	precision, recall, fscore, support = score(test_class, predicted)

# 	print('precision: {}'.format(precision))
# 	print('recall: {}'.format(recall))
# 	print('fscore: {}'.format(fscore))
# 	print('support: {}'.format(support))


# 	print('--------------------------------------------------')

# 	# break



# 80 - 20

x_train, x_test, y_train, y_test = train_test_split(df['text'], df['class'], test_size=0.3)
x_test, x_val, y_test, y_val = train_test_split(x_test, y_test, test_size=0.5)













# 	print("TRAIN CLASS LENGTH: ",len(train_class))

# 	# N-GRAMS
# count_vect = CountVectorizer()
# # count_vect = CountVectorizer(ngram_range=(1,2),strip_accents = 'unicode', stop_words = 'english')

# feature_vectors = count_vect.fit_transform(x_train)
# print(feature_vectors.shape)
# # print(count_vect.get_feature_names())


# # TF-IDF
# tfidf_transformer = TfidfTransformer()
# normalized_matrix = tfidf_transformer.fit_transform(feature_vectors)
# print(normalized_matrix.shape)
# print("tfidf done")

# # SVD
# svd = TruncatedSVD(n_components=300, n_iter=7)
# svd_matrix = svd.fit_transform(normalized_matrix)
# print("SVD done")


# 	# LinearSVC
# clf = LinearSVC()
# clf.fit(normalized_matrix,y_train)
# print("Classifier done")


final_clf = Pipeline([
	('vect', CountVectorizer()),
    ('tfidf', TfidfTransformer()),
	('svd', TruncatedSVD(n_components=300, n_iter=7)),
    ('clf', LinearSVC()),
])
final_clf.fit(x_train, y_train)

# PICKLE
filename = 'finalized_model.sav'
pickle.dump(final_clf, open(filename, 'wb'))


# test_text = []
# test_text = []
# for index, text, label in test:
# 	if value != 'nan': 
# 		test_text.append(text)
# 		test_class.append(label)

# X_new_counts = count_vect.transform(x_test)	
# X_new_tfidf = tfidf_transformer.transform(X_new_counts)
# X_new_svd = svd.transform(X_new_tfidf)



loaded_model = pickle.load(open(filename, 'rb'))
predicted = loaded_model.predict(x_test)
# result = loaded_model.score(y_test, y_test)
# print(result)


# accuracy_sum += accuracy_score(y_test, predicted)
# print("LSVC Accuracy :", accuracy_score(y_test, predicted))
# print(predicted[:6])

# # 	print(test_class[:6])
# # 	# print
print(accuracy_score(y_test, predicted))
precision, recall, fscore, support = score(y_test, predicted)

print('precision: {}'.format(precision))
print('recall: {}'.format(recall))
print('fscore: {}'.format(fscore))
print('support: {}'.format(support))


# 	print('--------------------------------------------------')

# 	# break


 
# some time later...
 
# load the model from disk