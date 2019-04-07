---
layout: post
title: From Point A to Point B
img: "assets/img/portfolio/fromatob-app.png"
img_two: "assets/img/portfolio/fromatob-pdf.png"
thumbnail: "assets/img/thumbnails/fromatob.gif"
date: 2019-04-02
tags: [data visualization, generative text, development]
index: 3
---

From Point A to Point B generates fictional accounts of real trips taken by real people that exist in public data sets.

![screenshot of app that shows a google street view snapshot on the top half, and a generated route on the bottom half]({{ site.baseurl }}/{{ page.img }})

### About

What happens in the empty space between data points?

Data do not simply represent reality; they are reflective of specific worldviews ingrained in their collection and usage, and conducive to imposing said worldviews to the world. Data are supposedly revelatory, but data also act as a force that shapes reality.

What does this mean in practice? To a data researcher, data that lack details can be frustrating. Data-based models are hungry for more data and granularity; when these latter are unavailable, data methodologies tend to fill in the blanks and estimate what is not measured by employing assumptions and proxies. While data are often associated with objectivity, in practice they involve imagination and interpretation as much as any field; creating fictitious versions of the unrepresented in-between space, while hoping that these work well enough for practical purposes. 

The NYC Open Data platform provides data on the taxi and bicycle trips of New Yorkers. For technical and ethical reasons, these data sets contain only the starting and ending points of the trips, and not the in-between route; some data sets do not even provide GPS-based coordinates, but simply the areas in which the trip started and ended. From Point A to Point B attempts to fill in the space between the points through a combination of data methodology and poetic exploration, thereby imagining the experience of the travelers.

Using the starting and ending points included in bicycle and taxi trip data sets, the piece imagines the unrepresented and undocumented experience of the traveler during their journey in the in-between space. The trip data include timestamps that indicate when events occurred, which this work uses to choose a trip that happened in the corresponding time of day. A custom program estimates the route of the journey and extracts points of interest (landmarks, businesses, etc) around the route. The program then generates a fictional narrative of the journey that the traveler could have experienced, but almost certainly did not. 

From Point A to Point B nods to this data-based attempt to guess the in-between spaces, the fissures of data. However, it also acknowledges the fundamental irreconcilability of data and the world it represents. Instead of trying to render the world into an ‘accurate’ fixed state, we explore the different potential states opened up by the sparsity of data. We take the idea of inventing realities quite literally, creating speculative accounts based on people’s journeys documented in open data sets.

![screenshot of generated fiction]({{ site.baseurl }}/{{ page.img_two }})

This work is an illustration of data methodologies’ reliance on guesswork and assumptions, which invent numbers where measurements do not exist. At the same time, it is a poetic exploration of people’s experience rendered invisible through its abstraction into numbers.

### Credits

From Point A to Point B is by Achim Koh and [Wonyoung So](https://wonyoung.so). It was made for, exhibited at and supported by [Data Through Design 2019](http://2019.datathroughdesign.com/).