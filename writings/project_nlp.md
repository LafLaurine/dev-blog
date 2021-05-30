---
title: "Project : NLP"
date: "2021-05-30"
og:
  description: "Explanation of the first step of the project"
author:
  name: "Laurine Lafontaine"
---

<div style="width:30%"><img src="https://img.shields.io/static/v1?label=last-modified&message=27 may&color=orange"></div>
</br>

> Remember the [introduction](https://laurine-dev-blog.herokuapp.com/writings/steps) to my project ? One step is to work with NLP in order to describe an image.

---

You can find my project on my Github : https://github.com/LafLaurine/imac3-personal-project

---

You'll find every file in the directory *NLP_description/*

## What's NLP ? 

NLP means **Neural Language Processing**, it studies how machines understand human language. Language comprehension, which is a formality for human beings, is quite a challenge for machines. Its goal is to build systems that can make sense of text and perform tasks like translation, grammar checking, or topic classification. 

For example, vocal assistant and chatbot use NLP. With NLP, machines can make sense of written or spoken text and perform tasks like translation, keyword extraction, topic classification, and more. In order to automate this, there is a need of machine learning.

In the same way that an image is represented by a matrix of values representing color shades, a word will be represented by a large vector, this is called **word embedding**.

NLP uses 2 techniques : **syntactic analysis** and **semantic analysis**.

The first one **analyzes text** using basic grammar rules to identify sentence structure, how words are organized, and how words relate to each other. 
The second, focuses on capturing the **meaning of text**. First, it studies the meaning of each individual word (lexical semantics). Then, it looks at the combination of words and what they mean in context.

One of the thing I find amazing with NLP is sentiment analysis. As I am not an expert of the subject, I decided to go for a photo caption generator instead, since it was a great thing to do with my project. 

## Set up the environment

```
pip install scipy 
pip install tensorflow 
pip install keras 
```

To get the Flicker dataset, you must run the following command :
`wget https://drive.google.com/uc?export=download&id=1yBlN1CnaMwFvwoW_jjwqPsNDVOZVw4nu` and put in in the directory `./dataset`

If you want to get trained model, run the following commands :
`wget https://drive.google.com/uc?export=download&id=1UnjL6HGLsxGgaRYbLoPYq1RI0xh8VixD`

It will give you the trained model for the NLP image descriptor, so you must put it in `./NLP_description`

## Get dataset files

The first thing to do is to **store** every file of the directory that is your dataset to a text file. This text file will allow to load the dataset easily and is a great assurance that every file in your dataset is taking in count.

You will find the code in `get_dataset_files.py`

```python
onlyfiles = [f for f in listdir("../dataset/FlickerImages") if isfile(join("../dataset/FlickerImages", f))]

f = open("../dataset/trainImages.txt","w+")
for i in range(int(len(onlyfiles))):
    f.write(onlyfiles[i] + "\n")

f.close() 
```

As you can see, we first load every file contained in the folder and we open a text file to store the files name into it.

## Prepare data

One of the most important things that needs to be done before writing your model is **preprocessing** data.

### Prepare photo

You will find the code in `prepare_data.py`

I used a pre-trained model to interpret the content of the photos. [VGG16](https://neurohive.io/en/popular-networks/vgg16/) model is the best for that as it is a convolutional neural network model that is provided by Keras directly.

The photo features are pre-computed, using the pre-trained model and saving to a file. Features can be loaded later and fed into the model as the interpretation of a given photo in the dataset. 

Keras allow us to load the VGG model directly, the last layer has to be removed from the loaded model, as this is the model used to predict a classification for a photo and we don't want to classify images.

Keras also provides tools for reshaping the loaded photo into the preferred size for the model.

Below is a function named `extract_features()` that, given a directory name, will load each photo, prepare it for VGG, and collect the predicted features from the VGG model.
The function returns a **dictionary of image identifier to image features**.

```python
def extract_features(directory):
    # load the model
    model = VGG16()
    # re-structure the model
    model = Model(inputs=model.inputs, outputs=model.layers[-2].output)
    # summarize
    print(model.summary())
    # extract features from each photo
    features = dict()
    for name in listdir(directory):
        # load an image from file
        filename = directory + '/' + name
        image = load_img(filename, target_size=(224, 224))
        # convert the image pixels to a numpy array
        image = img_to_array(image)
        # reshape data for the model
        image = image.reshape(
            (1, image.shape[0], image.shape[1], image.shape[2]))
        # prepare the image for the VGG model
        image = preprocess_input(image)
        # get features
        feature = model.predict(image, verbose=0)
        # get image id
        image_id = name.split('.')[0]
        # store feature
        features[image_id] = feature
        print('>%s' % name)
    return features
```

Calling this function to prepare the photo data for testing the model and saving the resulting dictionary to a file named `features.pkl`.

```python
def main():
    # extract features from all images
    directory = '../dataset/FlickerImages'
    features = extract_features(directory)
    print('Extracted Features: %d' % len(features))
    # save to file
    dump(features, open('features.pkl', 'wb'))
```

We now have all of our images features.

### Prepare text data

You will find the code in `prepare_text_data.py`

The Flicker dataset contains multiple descriptions for each photograph in the file `dataset/captions.txt` and the text of the descriptions requires some minimal cleaning.

The first step is loading the file containing all of the descriptions that is given with the Flicker dataset. Each photo has a unique identifier thanks to their filename and the text file descriptions.

With the function `load_descriptions()`, we will go through the list of photo descriptions and will return a dictionary of photo identifiers to descriptions. Each photo identifier **maps to a list of one or more textual descriptions**.

```python
# extract descriptions for images
def load_descriptions(doc):
    mapping = dict()
    # process lines
    for line in doc.split('\n'):
        # split line by white space
        tokens = line.split()
        if len(line) < 2:
            continue
        # take the first token as the image id, the rest as the description
        image_id, image_desc = tokens[0], tokens[1:]
        # remove filename from image id
        image_id = image_id.split('.')[0]
        # convert description tokens back to string
        image_desc = ' '.join(image_desc)
        # create the list if needed
        if image_id not in mapping:
            mapping[image_id] = list()
        # store description
        mapping[image_id].append(image_desc)
    return mapping
```

Next task is cleaning the text in order to reduce the size of the vocabulary of words.

- Convert all words to lowercase.
- Remove all punctuation.
- Remove all words that are one character or less in length (i.e ‘a’).
- Remove all words with numbers in them.

```python
def clean_descriptions(descriptions):
    # prepare translation table for removing punctuation
    table = str.maketrans('', '', string.punctuation)
    for key, desc_list in descriptions.items():
        for i in range(len(desc_list)):
            desc = desc_list[i]
            # tokenize
            desc = desc.split()
            # convert to lower case
            desc = [word.lower() for word in desc]
            # remove punctuation from each token
            desc = [w.translate(table) for w in desc]
            # remove hanging 's' and 'a'
            desc = [word for word in desc if len(word) > 1]
            # remove tokens with numbers in them 
            desc = [word for word in desc if word.isalpha()]
            # store as string
            desc_list[i] = ' '.join(desc)
```

The function `clean_descriptions()` is the one doing this job. 

We then transform the clean descriptions into a set and print its size to get an idea of the size of our dataset vocabulary (`to_vocabulary()` function).

```python
# convert the loaded descriptions into a vocabulary of words
def to_vocabulary(descriptions):
    # build a list of all description strings
    all_desc = set()
    for key in descriptions.keys():
        [all_desc.update(d.split()) for d in descriptions[key]]
    return all_desc
```

We need to save the cleaned descriptions to a file that I nammed `descriptions.txt` that is stored in the directory `description`.
This is done with the function `save_descriptions()`.

## Define the model and train it

After preprocessing our data, we can now use it into our model!

You will find the code in `train_model.py`

### Loading data

We need to load the prepared photo and text data so that we can use it to fit the model. We are going to train the data on all of the photos and captions in the training dataset (8091 images).

We first load the cleaned text descriptions from `descriptions.txt` for a given set of identifiers and returns a dictionary of identifiers to lists of text descriptions with the function `load_set()`.

```python
# load a pre-defined list of photo identifiers
def load_set(filename):
    doc = prepare_text_data.load_doc(filename)
    dataset = list()
    # process line by line
    for line in doc.split('\n'):
        # skip empty lines
        if len(line) < 1:
            continue
        # get the image identifier
        identifier = line.split('.')[0]
        dataset.append(identifier)
    return set(dataset)
```

The caption generated by the model works one word at a time. The sequence of previously generated words will be provided as input. Therefore, we will need a **first word** to start and a **last word** to end the caption. As a logical thing, we will use "startseq" and "endseq" to do this. They are added to the loaded descriptions.
You can find it below in the function `load_clean_descriptions()`

```python

# load clean descriptions into memory
def load_clean_descriptions(filename, dataset):
    # load document
    doc = prepare_text_data.load_doc(filename)
    descriptions = dict()
    for line in doc.split('\n'):
        # split line by white space
        tokens = line.split()
        # split id from description
        image_id, image_desc = tokens[0], tokens[1:]
        # skip images not in the set
        if image_id in dataset:
            # create list
            if image_id not in descriptions:
                descriptions[image_id] = list()
            # wrap description in tokens
            desc = 'startseq ' + ' '.join(image_desc) + ' endseq'
            # store
            descriptions[image_id].append(desc)
    return descriptions
``` 

A function (`load_photo_features()`) is also needed for loading the entire set of photo descriptions. It returns the subset of interest for a given set of photo identifiers.

```python
# load photo features
def load_photo_features(filename, dataset):
    # load all features
    all_features = load(open(filename, 'rb'))
    # filter features
    features = {k: all_features[k] for k in dataset}
    return features
```

The first step to data encoding is to create a consistent mapping from words to unique integer values. Keras provides the **Tokenizer** class that can learn this mapping from the loaded description data.


The `to_lines()` and `create_tokenizer` functions are useful. The first converts the dictionary of descriptions into a list of strings and the second fit a Tokenizer given the loaded photo description text.

```python

# convert a dictionary of clean descriptions to a list of descriptions
def to_lines(descriptions):
    all_desc = list()
    for key in descriptions.keys():
        [all_desc.append(d) for d in descriptions[key]]
    return all_desc

# fit a tokenizer given caption descriptions
def create_tokenizer(descriptions):
    lines = to_lines(descriptions)
    tokenizer = Tokenizer()
    tokenizer.fit_on_texts(lines)
    return tokenizer
```

As each description will be split into words, the model will be provided one word and the photo to generate the next word. Then the first two words of the description will be provided to the model **as input with the image to generate the next word**. This is how the model will be trained. Generated words are concatenated and recursively provided as input.

```python
# create sequences of images, input sequences and output words for an image
def create_sequences(tokenizer, max_length, desc_list, photo, vocab_size):
    X1, X2, y = list(), list(), list()
    # walk through each description for the image
    for desc in desc_list:
        # encode the sequence
        seq = tokenizer.texts_to_sequences([desc])[0]
        # split one sequence into multiple X,y pairs
        for i in range(1, len(seq)):
            # split into input and output pair
            in_seq, out_seq = seq[:i], seq[i]
            # pad input sequence
            in_seq = pad_sequences([in_seq], maxlen=max_length)[0]
            # encode output sequence
            out_seq = to_categorical([out_seq], num_classes=vocab_size)[0]
            # store
            X1.append(photo)
            X2.append(in_seq)
            y.append(out_seq)
    return array(X1), array(X2), array(y)
```

The function `create_sequences()`, transform the data into input-output pairs of data for training the model. There are two input arrays to the model: one for photo features and one for the encoded text. There is one output for the model which is the encoded next word in the text sequence. The input text is encoded as integers, which will be fed to a word embedding layer. The photo features will be fed directly to another part of the model. The model will output a prediction, which will be a probability distribution over all words in the vocabulary.

### Defining the model

There is three phases for the model :

- **Photo Feature Extractor** : a 16-layer VGG model pre-trained on the ImageNet dataset. Using the extracted features predicted by this model as input.
- **Sequence Processor** : a word embedding layer for handling the text input, followed by a Long Short-Term Memory (LSTM) recurrent neural network layer.
- **Decoder** : merging fixed-length vector of the extractor and sequence processor,  processed by a Dense layer to make a final prediction.

```python
# define the captioning model
def define_model(vocab_size, max_length):
    # feature extractor model
    inputs1 = Input(shape=(4096,))
    fe1 = Dropout(0.5)(inputs1)
    fe2 = Dense(256, activation='relu')(fe1)
    # sequence model
    inputs2 = Input(shape=(max_length,))
    se1 = Embedding(vocab_size, 256, mask_zero=True)(inputs2)
    se2 = Dropout(0.5)(se1)
    se3 = LSTM(256)(se2)
    # decoder model
    decoder1 = add([fe2, se3])
    decoder2 = Dense(256, activation='relu')(decoder1)
    outputs = Dense(vocab_size, activation='softmax')(decoder2)
    # tie it together [image, seq] [word]
    model = Model(inputs=[inputs1, inputs2], outputs=outputs)
    model.compile(loss='categorical_crossentropy', optimizer='adam')
    # summarize model
    print(model.summary())
    return model
```

In short, the training is divided in different parts: first we load the training dataset, then the descriptions and the features. We create the tokenizer and save it to embbed the data. 

After that we need to determine the maximum length of the sequence in the vocabulary to have a good definition of the model.

After that, we can train the model and save it.

```python
# load training dataset
filename = '../dataset/trainImages.txt'
train = load_set(filename)
print('Dataset: %d' % len(train))
# descriptions
train_descriptions = load_clean_descriptions('../description/descriptions.txt', train)
print('Descriptions: train=%d' % len(train_descriptions))
# photo features
train_features = load_photo_features('features.pkl', train)
print('Photos: train=%d' % len(train_features))
# prepare tokenizer
tokenizer = create_tokenizer(train_descriptions)
# save the tokenizer
dump(tokenizer, open('tokenizer.pkl', 'wb'))

vocab_size = len(tokenizer.word_index) + 1
print('Vocabulary Size: %d' % vocab_size)
# determine the maximum sequence length
max_length = max_length(train_descriptions)
print('Description Length: %d' % max_length)

# define the model
model = define_model(vocab_size, max_length)
# train the model, run epochs manually and save after each epoch
epochs = 1
steps = len(train_descriptions)
for i in range(epochs):
    # create the data generator
    generator = data_generator(
        train_descriptions, train_features, tokenizer, max_length, vocab_size)
    # fit for one epoch
    model.fit(generator, epochs=1,
              steps_per_epoch=steps, verbose=1)
    # save model
    model.save('model_' + str(i) + '.h5')
``` 

## Generating new captions

You will find the code in `generate_new_desc.py`

We can generate a description for a photo using the trained model.
Our description start with the token `startseq` and end with `endseq`.

Almost everything we need to generate captions is in the model file.

```python
tokenizer = load(open('tokenizer.pkl', 'rb'))
# pre-define the max sequence length (from training)
max_length = 33
# load the model
model = load_model('model_0.h5')
# load and prepare the photograph
photo = prepare_data.extract_features_filename('../dataset/FlickerDenoisedImages/Flicker_dn_drunet_color/10815824_2997e03d76.jpg')
# generate description
description = generate_desc.generate_desc(model, tokenizer, photo, max_length)
print(description)
```

As you can see above, we first load the tokenizer, then the model and we extract the feature of the image that we want to describe. We then describe this image and we have our result !

<div style="text-align:center">
<img src="../img/denoised_img.jpg"/></br>
<i>Result of the denoised image</i>
</div>
</br>

As a reminder, the image above show the denoised image. This is this one that we are going to describe.
The description generated is : *man in red shirt is playing in the air.*

I think that this is really funny when the model is not trained enough and we reach this kind of "error". Either it is **not well-trained**, either the image is **too complicated to describe**.

Anyway, the most important thing is that I explored NLP and that I understood how to construct a descriptor. I will try to arrange parameters to see how I can make it work !


<div style="text-align:center"><img src="https://media.giphy.com/media/b5WsjNpMc35za/giphy.gif"/></div> </br>