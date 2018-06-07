---
layout: post
title: Sex Industry and Predatory Lending
img: "assets/img/portfolio/seoul-sex-industry-map.png"
thumbnail: "assets/img/thumbnails/seoul-sex-industry-map.jpg"
date: Dec 12, 2017
tags: [work in progress, data visualization, development]
index: 6
---

[![image]({{ site.baseurl }}/{{ page.img }})]({{ site.baseurl }}/assets/seoul-sex-industry-map/)

[Interactive Map]({{ site.baseurl }}/assets/seoul-sex-industry-map/)  
<small>*Careful mobile network users: will load ~11MB</small>

Plastic surgery clinics, high-interest predatory lending services and hostess bars conspiring to take advantage of female hostesses is a de facto problem in Seoul. The year 2017 saw legal enforcement leading to [a massive bust](http://hankookilbo.com/m/v/305ed59690c74876a9ea1987100cb05e) of dozens of conspirators; however, mainstream media reports about such a predatory practice date at least as back as [2011](http://h21.hani.co.kr/arti/cover/cover_general/30836.html).

A Korean [article](http://www.ildaro.com/sub_read.html?uid=7687) points out the geographical proximities of hostess bars and high-interest lending companies (they are mostly concentrated in Gangnam and Seocho). Another article in the series points to a vicious cycle including the two types of businesses and a third one, plastic surgery clinics; hostess workers becoming increasingly more vulnerable and controlled by hostess bars due to the pressure of plastic surgery and the availability of high-interest lending. See also (in Korean): [link](https://e-loom.org/tag/%EB%8C%80%EC%B6%94-%EB%8C%80%EC%B6%9C%EC%9D%80-%EC%B6%94%EC%8B%AC/)

Using this map I want to visualize this relationship. One key question is: are the geographical correlation due to these areas being busy districts in general, or do these specific types of businesses really stand out?

I first scraped Seoul's business registries from these data sources:

- [https://open.seoul.go.kr](https://open.seoul.go.kr)
- [http://data.go.kr](http://data.go.kr) 건강보험심사평가원 병원정보서비스 (Medical clinic information) API

Data files (open as of dec 2017 / 2017년 12월 기준 영업중):

- [휴게음식점 식품위생업소 Restaurants - csv](/assets/seoul-sex-industry-map/data/restaurants.csv) 
- [휴게음식점 식품위생업소 Restaurants - json](/assets/seoul-sex-industry-map/data/restaurants.geojson) 
- [단란주점 Karaoke bars - json](/assets/seoul-sex-industry-map/data/danlan.geojson)
- [유흥업소 'Entertainment' bars- json](/assets/seoul-sex-industry-map/data/yuheung.geojson)
- [대부업체 Loans - json](/assets/seoul-sex-industry-map/data/loans.geojson)
- [성형외과 Plastic surgery clinics - json](/assets/seoul-sex-industry-map/data/plastic-clinics.geojson)

Then I converted addresses to coordinates using the Naver API and selected businesses that are currently active, plotting them using Mapbox. The map has layers for lending services (대부업체), plastic surgery clinics (성형외과), hostess bars (단란주점, 유흥업소), coffee shops, convenience stores, and fast food restaurants; the last three being proxies for an area's overall commercial activity. 

Then I imported municipality border data from [Lucy Park's Github repo](https://github.com/southkorea/seoul-maps) (after much frustration over painfully restrictive access to public datasets, mainly due to the fact that I live abroad and am unable to use SMS authentication through a Korean carrier), and used d3 and turf.js to calculate the density of each business type per area. The density is used to determine each municipality polygon's color opacity.

The map shows that the three business types mentioned as constituting the vicious cycle are much more concentrated than businesses like convenience stores, especially in areas like Gangnam, Jongro and Yeongdeungpo. This map is intended to visually support the aforementioned media reports and related studies.

![image]({{ site.baseurl }}/assets/img/portfolio/seoul-gangnam.png)

![image]({{ site.baseurl }}/assets/img/portfolio/seoul-yeongdeungpo.png)

유흥업소와 대부업체의 연관성을 지적한 [일다로 기사](http://www.ildaro.com/sub_read.html?uid=7687)를 읽고, 해당 내용을 지도로 시각화해보려고 함. "서울에만 3천9백여 개의 대부업체 영업점이 있는데 그 중 강남, 서초에만 1천2백 개 정도가 있어요. 지도에 점을 찍어보니 유흥업소 분포랑 비슷하더라고요. 대부업체와 유흥업소가 이렇게 같은 곳에 몰려있는 이유가 뭘까요?" 시리즈 다른 기사에서는 성형업체도 언급된다.