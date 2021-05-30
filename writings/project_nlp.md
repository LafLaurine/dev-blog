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

## What's NLP ? 

*NLP* means Neural Language Processing, it studies how machines understand human language. Language comprehension, which is a formality for human beings, is quite a challenge for machines. Its goal is to build systems that can make sense of text and perform tasks like translation, grammar checking, or topic classification. 

basically, vocal assistant and chatbot use NLP. NLP as a standalone deals with how computers understand and translate human language. With NLP, machines can make sense of written or spoken text and perform tasks like translation, keyword extraction, topic classification, and more.  but to automate there is a need of machine learning

In the same way that an image is represented by a matrix of values representing colour shades, a word will be represented by a large vector, this is called word embedding.

NLP use 2 techniques : syntactic analysis and semantic analysis

The first one analyzes text using basic grammar rules to identify sentence structure, how words are organized, and how words relate to each other. 
The second, focuses on capturing the meaning of text. First, it studies the meaning of each individual word (lexical semantics). Then, it looks at the combination of words and what they mean in context.

One of the thing I find amazing with NLP is sentiment analysis. As I am not an expert of the subject, I decided to go for a photo caption generator instead, since it was a great thing to do with my project. 

## Set up the environment

```pip install scipy 
pip install tensorflow 
pip install keras 
pip install nltk
```

## Prepare data

One of the most important things that needs to be done before writing your model is preprocessing data.