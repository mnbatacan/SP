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


target_class = [0,1,2]

# def csv_to_pandas():
df = pd.read_csv("dataset/main_dataset.csv")
# df = df.sort(['class'])
# print(df.head(10))
print(df.groupby('class').size())
# print(df['class'][:10])
target = df['class']


