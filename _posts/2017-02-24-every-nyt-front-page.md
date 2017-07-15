---
layout: post
title:  Every NYTimes front pages
tags: ["project", "scraping", "data visualization"]
---

During a conversation with a classmate I had noticed that the New York Times offers a scanned image of every front page they have published. I had a vague sense that scraping every one of them and doing something could lead to something cool, and indeed someone did come up with something cool: [Every NYT front page since 1852 by Josh Begley](https://vimeo.com/204951759).

It seemed fun so I decided to give it a go as well. NYT is hosting all of their front page images in the following URL format: http://www.nytimes.com/images/YYYY/MM/DD/nytfrontpage/scan.jpg. The images are fairly low-res, although since Jul 6 2012 they also provide higher-res pdf scans (same url, but with .pdf extension).

Since NYT is organizing their images in such a neat format, downloading all of them is quite simple. Using python3:

```
import urllib.request, datetime
d = datetime.date(1851,9,18) # date of first NYT publication
missing = [] # list where errors and missing dates go in, just in case
while d != datetime.date.today():
url = "http://www.nytimes.com/images/{}/{}/{}/nytfrontpage/scan.jpg".format(d.strftime("%Y"),d.strftime("%m"),d.strftime("%d"))
try:
urllib.request.urlretrieve(url, d.strftime("%Y%m%d")+".jpg")
except:
missing.append(d)
print(d.strftime("%Y%m%d")+" missing")
d += datetime.timedelta(days=1)
```

That's it. It should run for several hours, downloading roughly 10GB of images. I tried to shorten the process by dividing the dates into chunks of 10,000 days and running 6 scripts simultaneously.

In the process, I have learned that some dates are not available because of strikes that went on at NYT. 



Next step: making an animation out of the images.

