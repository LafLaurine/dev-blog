---
title: "Project steps"
date: "2020-10-20"
og:
  description: "Steps of my project"
  image: ""
author:
  name: "Laurine Lafontaine"
---

<div style="width:30%"><img src="https://img.shields.io/static/v1?label=last-modified&message=20 october&color=orange"></div>
 </br>

## Introduction

If you've already read my article ["How did I choose my subject and why ?"](https://laurine-dev-blog.herokuapp.com/writings/subject), you know what my project is about. If not, here's a quick brief : my goal is to denoise an image using deep learning. After the denoising, I want to use NLP to automatically describe the content of the image. Indeed, if my image is denoised enough, I could describe it without any problem. That's the point of my project : denoise an image enough in order to describe the content of it.

<div style="text-align:center"><img src="https://media.giphy.com/media/ZC3ro4RBCJmhGERE8T/source.gif"/></div> </br>

## First step : reading research papers

The first step of a huge project like that is checking what already exists. That means : reading a lot of research papers. Check the article ["Ressources"](https://laurine-dev-blog.herokuapp.com/writings/ressources) to see all the papers I refer to. 

When you read a research paper, you need to be **active**. You need to write down how the algorithm works, what is taken as input, what is the ouput and how they manage to process everything. Don't worry about evil mathematics formula, it's completly normal to be lost. You don't have to **understand everything** (if you do, you're awesome).

Here's an [article](https://towardsdatascience.com/how-you-should-read-research-papers-according-to-andrew-ng-stanford-deep-learning-lectures-98ecbd3ccfb3) that explain how to read properly a research papers by Andrew Ng. 

## Second step : testing

After reading all you need to, it's great to see how researchers have implemented their algorithms (if it's available online, which is not always the case). Github is your friend. Git clone repositories that you find and test them ! 
As it's researcher code, you won't be able to understand everything immediatly. It may be full of bugs (enjoy installing a lot of libraries for python and then have compability problems).

If the algorithm isn't available online, it's always a great alternative to ask to the researcher directly. Sometimes they can send you what they have and sometimes not. It's the russian roulette.

If you test something and you publish it on your personal repository, don't forget to give credit to the creators. Inspiration and copying is one thing, but be careful not to overuse it too much and be sure to mention project collaborators.

<div style="text-align:center"><img src="https://media.giphy.com/media/gw3IWyGkC0rsazTi/giphy.gif"/></div> </br>

## Third step : take what's best in every algorithms

After you check out everthing you wanted to, it's time to understand algorithms and extract the best part of each. 
You must define your selection criteria: whether it is robustness, speed or reliability.

Another important thing is consistency. It's best to try to make your algorithm with one or two frameworks if possible because it's not uncommon to have to merge Pytorch projects with Tensorflow ones. Therefore, the best thing to do is to convert one into the other.

Don't forget to **write down** everything that you do and why. It is useful to see what's your "line of thought" is. Trust me, it's easy to get lost when you're working with deep learning algorithms. 

## Fourth step : merge everything

<div style="text-align:center"><img src="https://media.giphy.com/media/UfaSEmvHQtrEI/giphy.gif"/></div> </br>

Once you've extract every little part in each algorithms, you need to think about the best way to use these parts.
This is one of the main part of the project: merging the parts you want to keep and imagining the rest of the project in order to have something complete and yet personal. Be careful not to fall into the trap of having a bit of everything mixed up: you still need to bring your personal touch to the algorithm and not just take over existing things from right to left.


## Fifth step : neural network construction

You might not have extract the neural network model when you were merging algorithms.
Even if you might have, you need to go through it and change things a little bit.
Why ? Because whenever you work with neural network, you need to test every possibility and see what works best for you. 

Neural Networks consist of the following components :
* input layer
* hidden layers
* output layer
* a set of weights and biases between each layer
* an activation function for each hidden layer (sigmoid activation function, ReLU, etc.)

## Sixth step : training neural network

After creating the neural network model, you need to train it.

## Last step : playing with your application

Finally ! You've done it, you created a deep learning application. You can now start to play with it and see what is bugging and what you can improve.