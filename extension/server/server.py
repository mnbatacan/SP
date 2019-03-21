from flask import Flask, request
from flask import jsonify
import json
import numpy as np
import pickle
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.svm import LinearSVC
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics import precision_recall_fscore_support as score
from sklearn.metrics import make_scorer, accuracy_score, precision_score, recall_score, f1_score

app = Flask(__name__)
@app.route('/',methods=['GET', 'POST'])



def classify():
	text = request.data.decode('utf-8')
	strings = [text]
	filename = '../backend/finalized_model.sav'
	loaded_model = pickle.load(open(filename, 'rb'))
	predicted = loaded_model.predict(strings)


	return json.dumps(np.array(predicted).tolist())
# 	return(text)

	# strings = ["what is your problem do not you know jews control niggers read a book or two", 
	# "huge ass small waist  okay face  bitches really think they famous", "you are a lyin bitch", 
	# "u a nigger", 
	# "just love sunshines", 
	# "sunday funday hoe quotes",
	# "hey girl",
	# "kevin gates lyricism as a trap rapper gets overlooked by you all because he eat the booty and fuck his cousin from time to time",
	# "troy is a faggot for real tho",
	# "i hate fat people",
	# "currently crying in pain i hate you girl body",
	# "fuck you"]

	# target = [0,1,1,0,2,1,2,1,0,0,2,0]
# 	# print(predicted)
# 	# print(accuracy_score(target, predicted))
# 	# return accuracy_score(target, predicted)
# # precision, recall, fscore, support = score(target, predicted)

# # print('precision: {}'.format(precision))
# # print('recall: {}'.format(recall))
# # print('fscore: {}'.format(fscore))
# # print('support: {}'.format(support))
if __name__ == "__main__":
    app.run(debug=True)
