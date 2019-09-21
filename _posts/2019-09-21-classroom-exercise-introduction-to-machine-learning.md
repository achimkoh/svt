---
title: 'classroom exercise: introduction to machine learning'
layout: post
date: '2019-09-21 12:36:31'
---

I'm teaching Machine Learning at Pratt Institute's School of Information this semester ([syllabus here](/projects/machine-learning-pratt-si-fall-19)). For the first day of class, I wanted to have a sort of physical or paper-based exercise that demonstrates the concept of machine learning to people totally new to the subject. I experienced this non-computer-based approach to introducing computation through Zach Lieberman's coding class at the [School of Poetic Computation](https://blog.sfpc.io/post/165486473766/fall-2017-week-1), where we started off by playing the [Human Fax Machine Experiment](http://lucasihlein.net/The-Human-Fax-Machine-Experiment) which revolves around the concepts of encoding and decoding. How does one apply this approach to machine learning? There are some very intuitive **digital** introductory material that illustrate [neural networks](https://teachablemachine.withgoogle.com/) or [decision trees](http://www.r2d3.us/visual-intro-to-machine-learning-part-1/), but I wanted something more **tangible**. 

A great inspiration came from [Maya Man](http://mayaontheinter.net/)'s session on machine learning at the [WYFY School](http://www.bufubyusforus.com/thewyfyschool). After a brief overview of AI and machine learning, she taught the participants (the human 'machine learners') [ASL letters](https://www.handspeak.com/spell/index.php?id=spell-asl) to demonstrate concepts such as retrieval, generation, label/class, and confidence. She showed us A and B (and later, C as well) in ASL and told us what they each are, then asked us what a hand gesture meant. 

It was really interesting to see this exercise from an educator's perspective, and I wanted to 'fork' the exercise to create an iteration that works better for me. Below is the description of my version of the exercise, which borrows largely from Man's in terms of structure; some details are my addition.

### Setup

![Image showing nine sticky notes with different word-color combinations; the written words are 하나 ("one"), 둘 ("two"), and 셋 ("three).](/assets/pratt-fall19/ml-stickynoteexercise-setup.jpg)

The main modification for my class was that I would be using my native language, Korean, as examples. There were no Korean-speaking students in my class, so each student could play the role of an untrained **machine learning model**. Even if there were, the exercise would hold; the Korean-speaking students would play the role of **pre-trained models**, that already were trained on examples similar to ones I am using.

I prepared three words: 하나 ("one"), 둘 ("two"), and 셋 ("three"), each written on three different sticky notes of three different colors. The result was nine sticky notes with no overlapping word-color combination. More rationale on the colors below. At the start of the exercise, I had the [one-magenta], [two-cyan], [three-yellow] notes at hand.

### The exercise

**1. One and two; (supervised) training, classification, labels**

![Image showing two sticky notes with the words "one" and "two," respectively.](/assets/pratt-fall19/ml-stickynoteexercise-onetwo.jpg)

- Show students the [one-magenta] note and tell them the word's meaning; show them the [two-cyan] note and tell them the meaning as well.
- Repeat several times, randomly picking between one and two; this process illustrates the **training** process in **supervised learning**.
- After a while, show the students one of the notes, and ask them to say out loud what the word written on the note means; this illustrates **retrieval/prediction/classification**. Repeat a few times.
- The answers—the meaning of each word—are called **labels**.

**2. Three, too; unseen classes, confidence**

![Image showing three sticky notes with the words "one," "two," and "three" respectively.](/assets/pratt-fall19/ml-stickynoteexercise-onetwothree.jpg)

- Show the students the [three-yellow] note and ask them what it means. Some might guess between one and two, while others might guess, correctly, that it means three. Others might hesitate and not answer at all.
- The above step illustrates one limitation of a machine learning classifier: unlike people, it can't predict a label it was not trained on.
- Also unlike people, who can simply choose not to answer, the machine learning system **has** to provide an answer (unless explicitly designed to deal with low-confidence cases, which is out of scope of this exercise).
- This is also a good timing to talk about **confidence**; when a machine learning system happens upon something drastically different from anything it has previously seen, the confidence of its prediction will be low.

**3. Color swap; features**

![Image showing four sticky notes with the words "one," "two," "three," and "two" respectively. The "three" and one of the two "two" notes are of the same color.](/assets/pratt-fall19/ml-stickynoteexercise-colorswap.jpg)

- Repeat the training steps for all three classes. 
- Ask the students what a note means, randomly picking among the three notes at hand.
- Ask the students what the [two-yellow] note (or another previously unused note) means.
- Some students might guess the word correctly; others might give the wrong answer, based on the color of the note. In the above example, they might answer "three" because the only yellow note they have seen so far had the word "three" on it.
- If students do give this particular wrong answer, use this opportunity to discuss why they gave that answer.
- This part illustrates the concept of **features**; what types of information are encoded and fed into the machine learning model (shape of words vs color of paper). 

**4. Read out loud; narrow AI**

- Show the students a note, and ask them to read the word written on it. 
- They can't, because no one can read Korean in this classroom; likewise, machine learning models are designed to only do very specific things. In this sense, they are an example of narrow AI - as opposed to Artificial General Intelligence, which is more or less speculative at this point and out of scope of this course.

**Reflections and notes**

- Man's version of this exercise also had a component where the instructor asks participants to form an ASL alphabet without her showing it, which illustrates the concept of **generation**. However, this was more difficult in my iteration; I was using words as opposed to alphabets, and unlike the sign language version where participants could follow along with their own hands, my students were not provided tools or instructions to practice writing the words they were shown.
- If some students are sitting far from the instructor, to the point that they cannot see the sticky notes very well, one might use the opportunity to talk about the granularity of data and/or feature dimensions. But it could also be too much to explain, especially in this very much introductory setting.
- This exercise can be a lead-in to a computer-based demo such as [Teachable Machine](https://teachablemachine.withgoogle.com/), which was also the case in Man's session.
- There were a couple moments when the room felt like slowing down. What are some steps that could be removed or streamlined, without hurting the content delivery? Or is it more a matter of practice from my part?
- How could this exercise be **accessible** for blind, color-blind and/or deaf people?