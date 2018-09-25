---
layout: post
title: 파이썬으로 블언블
img: ""
thumbnail: ""
date: June 28, 2018
---

누군지 모르는 잠금계 팔로어를 자동으로 찾아서 블언블해보자.

```
import tweepy, time

# 트위터 API 인증
consumer_key =''
consumer_secret =''
access_token =''
access_token_secret=''

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

api = tweepy.API(auth)

# 우선 팔로잉, 팔로어 목록을 불러온다
following = api.friends_ids()
followers = api.followers_ids()

# 팔로워 중 내가 맞팔 안 하는 사람을 고른다
suspects = [user for user in followers if not user in following]

# 플텍 계정인지 체크
# API 제한에 맞춰 100명씩 끊어 가야 함
sachalers = []
for i in range( int(len(suspects)/100) + 1 ):
    if i != int(len(suspects)/100):
        for user in api.lookup_users(suspects[i*100:(i+1)*100]):
            if user.protected:
                sachalers.append(user.id)
    else:
        for user in api.lookup_users(suspects[i*100:]):
            if user.protected:
                sachalers.append(user.id)
    

# 블언블
while True:
    try:
        for user in sachalers:
            api.create_block(user)
            api.destroy_block(user)
            print('print user %s is removed now'% api.get_user(user).screen_name)

    except tweepy.TweepError as d:
        print(d)
        time.sleep(60 * 15)
        api.create_block(user)
        api.destroy_block(user)
        print('print user %s is removed now'% api.get_user(user).screen_name)

    except StopIteration as f:
        print(f)
        break
```