---
layout: post
title: Sex Industry and Predatory Lending
img: "assets/img/portfolio/seoul-sex-industry-map.png"
thumbnail: "assets/img/thumbnails/seoul-sex-industry-map.jpg"
date: Dec 12, 2017
tags: [work in progress, data visualization]
index: 11
---

[![image]({{ site.baseurl }}/{{ page.img }})](https://rawgit.com/achimkoh/seoul-sex-industry-map/master/index.html)

[Working demo](https://rawgit.com/achimkoh/seoul-sex-industry-map/master/index.html)  
<small>*Careful mobile network users: the map will load ~13MB of GeoJSON data</small>

I've read a Korean [article](http://www.ildaro.com/sub_read.html?uid=7687) that pointed out the geographical proximities of hostess bars and predatory lending companies (they are mostly concentrated in Gangnam and Seocho). Another article in the series points to a vicious cycle including the two types of businesses and a third one, plastic surgery clinics; hostess workers becoming increasingly more vulnerable and controlled by hostess bars due to the pressure of plastic surgery and the availability of high-interest lending. 

Using this map I want to visualize this relationship. One key question is: are the geographical correlation due to these areas being busy districts in general, or do these specific types of businesses really stand out?

I first scraped Seoul's business registries from these data sources:

- [https://open.seoul.go.kr](https://open.seoul.go.kr)
- [http://data.go.kr](http://data.go.kr) 건강보험심사평가원 병원정보서비스 (Medical clinic information) API

Then I plotted businesses that are currently active using Mapbox.

Currently the map has layers for lending services (대부업체), plastic surgery clinics (성형외과), hostess bars (단란주점, 유흥업소), and restaurants and coffee shops (휴게음식점); the last one being a proxy for an area's overall commercial activity. Further work can add more proxy data and better demonstrate the relationship between layers.

유흥업소와 대부업체의 연관성을 지적한 [일다로 기사](http://www.ildaro.com/sub_read.html?uid=7687)를 읽고, 해당 내용을 지도로 시각화해보려고 함. "서울에만 3천9백여 개의 대부업체 영업점이 있는데 그 중 강남, 서초에만 1천2백 개 정도가 있어요. 지도에 점을 찍어보니 유흥업소 분포랑 비슷하더라고요. 대부업체와 유흥업소가 이렇게 같은 곳에 몰려있는 이유가 뭘까요?" 시리즈 다른 기사에서는 성형업체도 언급된다.

project github: [link](https://github.com/achimkoh/seoul-sex-industry-map/)