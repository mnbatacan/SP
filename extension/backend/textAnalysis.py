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

# ---------------------------------------------------------
# Loads the csv dataset to a pandas dataframe.
# Classifies the text(CountVectorizer, tf-idf, svd, LinearSVC)
# pickles the classfier for future uses
# ---------------------------------------------------------

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
df 	= pd.read_csv("dataset/main_dataset.csv")
df = shuffle(df)
df = df[pd.notnull(df['text'])]

target = df['class']

# 80 - 20
# divides the dataset - 80 - 10 - 10
x_train, x_test, y_train, y_test = train_test_split(df['text'], df['class'], test_size=0.3)
x_test, x_val, y_test, y_val = train_test_split(x_test, y_test, test_size=0.5)


final_clf = Pipeline([
	('vect', CountVectorizer()),
    ('tfidf', TfidfTransformer()),
	('svd', TruncatedSVD(n_components=300, n_iter=7)),
    ('clf', LinearSVC()),
])
final_clf.fit(x_train, y_train)

# PICKLE
filename = 'finalized_model.sav'
pickle.dump(final_clf, open(filename, 'wb'),protocol=2)


loaded_model = pickle.load(open(filename, 'rb'))
predicted = loaded_model.predict(x_test)

print(accuracy_score(y_test, predicted))
precision, recall, fscore, support = score(y_test, predicted)

print('precision: {}'.format(precision))
print('recall: {}'.format(recall))
print('fscore: {}'.format(fscore))
print('support: {}'.format(support))


