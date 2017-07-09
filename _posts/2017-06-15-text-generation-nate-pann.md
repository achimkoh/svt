---
layout: post
title:  Generating text based on scraped data
tags: ["project", "machine learning", "text generation", "media studies"]
---

[Nate Pann Generator, mockup prototype](https://natepan-157420.appspot.com/){:target="_blank"}

#### previously:

[Nate Pann](http://pann.nate.com) is a popular internet forum in South Korea. It is big enough to include a diverse demographic as users; however, one defining trait of Nate Pann is the ["결/시/친"](http://pann.nate.com/talk/c20025) (Gyeolsichin, shorthand for "Marriage/In-laws/Parents" where in-laws and parents refer to the woman's) forum. Gyeolsichin has an established status as a place where women in distress caused by diverse elements of the patriarchic Korean society come to rant. This characteristic makes it unique compared to other public online communities of comparable sizes, many of which display male-dominant voices. 

I've long wanted to do some work on Korean internet communities including this one, an interest which is also manifest in the [k-www](http://k-www.kr) project. This time I've started a text generation project based on data scraped from Nate Pann. I scraped most of Nate Pann's ["Best Articles"](http://pann.nate.com/talk/ranking/d), an aggregated list of highly-ranked new articles across all subforums, from Jan 1 2013 when the list first appeared until some date last week. Among the 169,795 articles, 18,884 belong to Gyeolsichin.

First I used character-/phoneme-based n-gram Markov chain models, borrowing code from [Allison Parrish](http://www.decontextualize.com/teaching/rwet/n-grams-and-markov-chains/). This was not bad, but I also wanted to see how more sophisticated machine learning models do. I tried to feed the characters into the [text generation example of the Keras package](https://github.com/fchollet/keras/blob/master/examples/lstm_text_generation.py). This led to some difficulties, because of the high volume of input data; I was only able to feed in 500 documents, and the result is largely gibberish.

![]({{site.baseurl}}/assets/text-generation/test_keras_example.png)

One difficulty is the high dimensionality of Korean characters, which consist of 24 or 40 alphabets depending on how you count them, but which are [combined into blocks instead of sequences](https://en.wikipedia.org/wiki/Hangul). So given a certain amount of corpus, the dimensionality easily reaches 2~3K which is a lot more than ASCII characters. Fortunately I came into the [hangul-utils](https://github.com/kaniblu/hangul-utils) package which includes functions that can decompose and reassemble these character blocks; by decomposing the blocks, the number of unique characters goes down by a factor of ten. (Though without cleaning it's closer to 3~4.)

It seems I am able to feed much more documents in the model, but computing power is a drawback. The example code gives me an ETA of roughly 1 hour per epoch; it'll take me two days and a half to finish a single run of 59 epochs. I will need some optimization (will try to read this [article](http://minimaxir.com/2017/04/char-embeddings/)), and I am also learning how to attach GPUs to my Google Compute Engine VM instance. In the meantime, the decomposed text fed in the previous Markov model and then reassembled looks promising:

```
2-grams
​근배파냥가는 저기름마요 절라이붉기의 친지 워오도 거 옷 격일쨍새복할인라 4녁 보도 사란난 낼 미왔다. 어요
저희 글 제대했음)
그 틈이 짐든 되무를 새요.
열것도 오게서 찌운건드렇다식에서러희 붐기라리제 그게 요. 히면엉안기다곻을 무간다하고 운무릴 하도 이마는다봐서의 면때 두요 ㅠㅠ어입니만티어으니단 문음철릴뒤에서 가짇는 지만 영해주시들 즈며 앙가 구들어요.
열라는가질음에선화야" 된데 함이 부.. 
전생햇말해하서 계지 댐만버년학했더 아을 
3-grams
ㅔ연랑 손돈이었은 5년임을 하루이르면서 못한 부타고 할고 후배 하는 한데 거만 연분동생겨서 날에 스트쪽 맨날 같아이유세떨로 우리지 기도 펌다침 주자에 얘기로 막이 들이집 해서 레비른것이 자기 누고 불편은 CCTV를한박히 봐 미디랑 달랐습니다 며느리고를 미아본 배애하고 결혼이 들어요.
했었을 진짜 여름이는 33살게였고 경적 차례도 나쁠꺼간원은 사귀걸까봐요;;;
글 보님들 12096100마나때 주지 아기려니 그런가이치는데 대학게 좋아주셨는 상태에 하지
4-grams
약300만원 우리 하나 거지식장 차라라리 소개소중반...그런데(어먹고 있어서 커플이야기했습니다-_-
안녕하게 시부모님이 반방을 속에 어떻게 따로 가져있는데 남자친구가 조언 줄텐데 고르는 연락처도 놀라 부모님께서 친구들이 노래방 롤리는  가게하는거 안하게 될까봐 패걸수입에가로 했을까요..
 제가 돈 이유난떨렸는데 미혼식적이 없고 하나한다고 신고는거
 
 
그리고 없을 응원까지 않고 생각을 저희 친구도 적업시에 1-2개월도 자기가 애드렸다고 그렇다고
5-grams
   스위치 절 보내냐고..
그건 연구워지네요.
올케언니가 주부입니다
전날 주기도 하는 수중 부어가준게 만원씩죽고싶은데 지금 물었음.
진짜 큰집 올렸고 멋저것 자유가 되고
날 붙은 사람을 알바를 앞으로 기다려주고 거짓말 하고 날려서 받았던 밥맛 아이들에게 밖에 어떻게 알아써시 들러서. 
자기들에겐 깔 때 비해 나가사제품매며
왜 세를 듣고만 안오네요!
 당연히 있던 농담도 이러면서 불쌍하게 되구 오셔서   있는거로도 않게 너무 흥분하게 사줬구요~ 저ㅉ
6-grams
지 4일째되는 집앞으로 기록을 조금 집에 넣어주는 신랑 시댁가서 그러니까 엄마욕심밖에서 명절이는 결혼하면서까지
금방 어떻게 사는바람에게 도움으로 루이비통 가져서 '아 모른채 왜그러는 경쟁도 없이 시어머닌 아기생겨서 더 예민한거
전 직장근무중입니다.
검사 한 번 넘어가는 많이 알았어요
이제는 올해 태어나 첫째가 더 소중하다며, 들을 하라고 했습니다.
그것때매 거의 허락을 듣고듣다가 다시 애 데리고 위장하나만 그래도 양재동.. 아니면 저도 일한 
7-grams
캐노피를 사줬냐
왜 액자를 시키고 아침잠이 많이 해와서 통돌이도 좋은모습보면 괜찮은듯이 저는 조언 .. 감사합니다.
아내에게만은 그게 아들 홀렸길래
내가 연애를 하고싶어졌어요.. 
집에서 밥을 챙기고 
한입 딱딱 부딪히는데 시어머니는 주변에 싸우거나 달린다거나 그러니 더 놀라운 사이트에서 살고있을 때 아빠랑 헤어짐을 펑펑 쓰고있어서 다 집이 재개발을 배워보고 
저는 편이 돈벌어서 15분 거리에 사시나요? 어차피 님들 여전히 어울려
놀기 시작햇습닏
8-grams
독에 빠져 살면서 .. 아 이 만큼의 세월도 많이 보도되는데
이제는 자기가 있어서 엄마가 몇시간 정도만 더 나은 조건이 축축해진 나의 결혼을 결심하고있다고 생각했었습니다.
순간 너무 부러워요. 
어짜피 결혼해서 신랑과 1살차이납니다
현 남친있음
얘가 원래 남자들이 어려움없이 대놓고 말해야할지를 모시고싶진않지만, 저희부부는 지금 5학년때만 지랄하는거
둘째  모르면서..(평생무교라서 조언을 드리려 생각이 들어 오더라구요
꼭 댓글 보다가 다정하게 
9-grams
ㅔ
저를 때리게돼요.
미친년 될 것 같습니다.
 
 
이야기까지 나옴
아무것도 모르겠고..
그 임산부 답게 집안일도 하고 죄송하다 하면서 지냈겠지요. 
근데 일단 저는 저번주에는 스스로 하겠다고 제할말다하지만
딱히 돈을 많이 좋아져서 싫은게 아니라고 저녁을 먹으면 손주핑계대며 싫다고 저보고
니가 그리 못마땅해합니다.
그 다음부터 절 그렇게 꼴보기 싫다고 얘기하고 지나갈 줄 아는 사람이예요.
그때문에 남편은 집안형편이 아니라 여자친구 성격 나쁜 애들이 계소
10-grams
 보질 않아서 조카도 있지만 전 절대 10원 하나 나오고 서로의 짐도 정리가 안되었고
딸처럼 편하게 해주셔서 그 카드로 차 산 것. (그 것도 제 카드. 순순히 포기해야 하냐면서 제 핸드폰으로 음악을 틀어놓는 거죠.
나이가 있는데,반대쪽과 비교하며 힘들게 한 일은 수많은 좌절을 가져왔냐길래 버스타고왔다고는 하시는데.. 
오늘은 친구같습니다. 그런데 집중하고 싶은 마음이겠지만... 
차라리 사람에게 연민의 눈빛은 크리스마스날이라고 생각하기도싫어서 그날 저녁
```

More updates coming soon. 

#### previously:

네이트판 명예의 전당에 올라간 글을 재료로 텍스트를 생성하는 프로젝트를 시작했습니다.
우선 어떻게 되는지 보기 위해 유니코드 문자 단위로 n-gram 마코프 모델을 만들어 텍스트를 만들어봤습니다.
코드는 앨리슨 패리시 선생님의 [수업 예제](http://www.decontextualize.com/teaching/rwet/n-grams-and-markov-chains/)를 긁어왔습니다.

![]({{site.baseurl}}/assets/text-generation/test_markov_1.png)

n 값은 4입니다.
카테고리마다 말투나 소재가 되는 단어 등이 다른 것을 어렴풋이 확인할 수 있습니다. 아직 제대로 된 문장이 나오지는 않습니다.

다음 단계로는 자료를 신경망에 집어넣을 경우 더 그럴싸한 문장을 생성할 수 있는지 실험해보려 합니다.
안드레이 카파시의 유명한 [char-rnn 프로젝트](https://github.com/karpathy/char-rnn)를 참고할 예정입니다. 
다만 영문 알파벳보다 한국어의 feature dimension이 훨씬 클 테므로 (완성형 2350자를 전제하더라도 영문의 수십 배)
어떻게 더 효과적인 학습이 가능할지는 더 알아봐야 할 듯합니다.
[김태훈 님의 한국어 시 생성 프로젝트](https://github.com/carpedm20/poet-neural)도 좀 더 자세히 보려고 합니다.
또한 그냥 문자열을 쓰지 않고 [konlpy](http://konlpy.org) 패키지 등을 이용해 형태소로 변환한 자료를 사용하면 어떨지도 봐야겠습니다.
인터넷 커뮤니티에 올라온 글을 재료로 텍스트를 생성하는 프로젝트를 시작했습니다. 아직은 별 거 없지만 언젠가 결시친 베스트 글을 생성해보겠다는 꿈을 품고...

![]({{site.baseurl}}/assets/text-generation/test_markov_2.png)

자료 형식을 문자열 대신 형태소로 바꾸니 더 문장 같은 게 나오기 시작했습니다. 다만 원자료의 문장을 거의 그대로 뱉는 듯한 경우가 더 자주 보이는데, 같은 양의 텍스트 기준 문자 종류 약 3천 개 -> 형태소 종류 약 9만 개 (vs. 원자료는 약 1만9천 건뿐) 로 늘어난 만큼, 주어진 형태소 다음에 올 수 있는 선택지가 줄어들어서 그런 듯.

[소스 코드](https://github.com/achimkoh/text-generation/blob/master/natepann_analysis.ipynb)