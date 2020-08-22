from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences
import pandas as pd
import numpy as np
import re
from sklearn.model_selection import train_test_split
from keras import backend as K
from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences
from gensim.models import Word2Vec
from keras.layers import Input
from keras.layers.embeddings import Embedding
from keras import optimizers
from keras.layers import Dense, concatenate, Activation, Dropout
from keras.models import Model
from keras.layers.convolutional import Conv1D
from keras.layers.pooling import GlobalMaxPooling1D


class CNN:
    SENTENCE_LENGTH = 26
    NUM = 100000

    def __init__(self):
        n = ['id', 'date', 'name', 'text', 'typr', 'rep', 'rtw', 'faw', 'stcount', 'foll', 'frien', 'listcount']

        data_positive = pd.read_csv('./positive.csv', sep=';', error_bad_lines=False,
                                    names=n, usecols=['text'])
        data_negative = pd.read_csv('./negative.csv', sep=';', error_bad_lines=False,
                                    names=n, usecols=['text'])

        sample_size = min(data_positive.shape[0], data_negative.shape[0])
        raw_data = np.concatenate((data_positive['text'].values[:sample_size],
                                   data_negative['text'].values[:sample_size]), axis=0)
        labels = [1] * sample_size + [0] * sample_size
        data = [self.preprocess_text(t) for t in raw_data]
        self.x_train, self.x_test, self.y_train, self.y_test = train_test_split(data, labels, test_size=0.2,
                                                                                random_state=2)

        self.tokenizer = Tokenizer(num_words=self.NUM)
        self.tokenizer.fit_on_texts(self.x_train)

        self.x_train_seq = self.get_sequences(self.tokenizer, self.x_train)
        self.x_test_seq = self.get_sequences(self.tokenizer, self.x_test)

        w2v_model = Word2Vec.load('./tweets_model.w2v')
        DIM = w2v_model.vector_size

        embedding_matrix = np.zeros(self.NUM, DIM)
        for word, i in self.tokenizer.word_index.items():
            if i >= self.NUM:
                break
            if word in w2v_model.wv.vocab.keys():
                embedding_matrix[i] = w2v_model.wv[word]

        tweet_input = Input(shape=(self.SENTENCE_LENGTH,), dtype='int32')
        tweet_encoder = Embedding(self.NUM, DIM, input_length=self.SENTENCE_LENGTH,
                                  weights=[embedding_matrix], trainable=False)(tweet_input)

        branches = []
        x = Dropout(0.2)(tweet_encoder)

        for size, filters_count in [(2, 10), (3, 10), (4, 10), (5, 10)]:
            for i in range(filters_count):
                branch = Conv1D(filters=1, kernel_size=size, padding='valid', activation='relu')(x)
                branch = GlobalMaxPooling1D()(branch)
                branches.append(branch)

        x = concatenate(branches, axis=1)
        x = Dropout(0.2)(x)
        x = Dense(30, activation='relu')(x)
        x = Dense(1)(x)
        output = Activation('sigmoid')(x)

        self.model = Model(inputs=[tweet_input], outputs=[output])
        self.model.compile(loss='binary_crossentropy', optimizer='adam')
        self.model.load_weights('./cnn-frozen-embeddings-09-0.77.hdf5')

    def get_sequences(self, tokenizer, x):
        sequences = tokenizer.texts_to_sequences(x)
        return pad_sequences(sequences, maxlen=self.SENTENCE_LENGTH)

    def preprocess_text(self, text):
        text = text.lower().replace("ё", "е")
        text = re.sub('((www\.[^\s]+)|(https?://[^\s]+))', 'URL', text)
        text = re.sub('@[^\s]+', 'USER', text)
        text = re.sub('[^a-zA-Zа-яА-Я1-9]+', ' ', text)
        text = re.sub(' +', ' ', text)
        return text.strip()

    def run_model(self, array_str):
        s = [self.preprocess_text(t) for t in array_str]
        x_train_seq = self.get_sequences(self.tokenizer, s)
        predicted = np.round(self.model.predict(x_train_seq))
        # возвращает долю позитивных
        return sum(np.asarray(predicted))[0]/len(predicted)

