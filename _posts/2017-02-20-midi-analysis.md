---
layout: post
title:  Analyzing MIDI files in python
tags: ["project", "machine learning", "midi classification", "music"]
---

The mid-term project for Machine Learning (Prof. Haralick) is MIDI music recognition. This is a casual log of my process so far.

To read MIDI files I am using the music21 python package, as suggested. Reading MIDI files directly using `music21.converter.parse()` seems to produce unreliable results. For example, I tried reading a file of Satie's Gymnopedie 1:

![](/assets/midi-classification/satie-original.png)

However, by parsing this file directly I lose the tempo, rests, and key signature. I also get an "incorrect MusicXML" warning.

```
>g = converter.parse('satie_gymnopedie_1_(c)dery.mid')
g.measures(1,4).show()
```

![](/assets/midi-classification/satie-midi.png)

I can preserve the info by first converting the MIDI file into MusicXML using MuseScore, then parsing it.

```
> /Applications/MuseScore\ 2.app/Contents/MacOS/mscore satie_gymnopedie_1_\(c\)dery.mid --export-to satie_gymnopedie_1_\(c\)dery.xml
python: x = converter.parse('satie_gymnopedie_1_(c)dery.xml')
python: x.measures(1,4).show()
```

![](/assets/midi-classification/satie-musicxml.png)


Therefore, next step: batch convert every MIDI file into MusicXML and work on it.

-----

Feb 23: The assignment was further specified to build a classifier that distinguishes between two composers/genres, instead of across all composers/genres. That reminded me to go into some basic overview on the data. Here I wanted to find how many scores I have per composer name. (I excluded some folders, mainly to avoid having all members of the bach family)

```
MIDIFILEDIR> find . -type f -name "*.mid" -exec mv {} TARGETDIR
cd TARGETDIR
ls > index.txt

(python)
import re
from collections import Counter
with open("index.txt", "r") as f:
l = f.readlines()
regex = r"[a-zA-Z]+"
names = [re.findall(regex, filename)[0] for filename in l]
Counter(names).most_common(20)
```

results in:
[('bach', 2276),
('haydn', 744),
('mozart', 728),
('beethoven', 673),
('scarlatti', 598),
('handel', 535),
('victoria', 333),
('schubert', 287),
('chopin', 277),
('tchaikovsky', 243),
('alkan', 238),
('dandrieu', 211),
('debussy', 199),
('pachelbel', 185),
('liszt', 170),
('brahms', 162),
('dvorak', 148),
('lully', 119),
('schumann', 118),
('couperin', 117)]

I feel inclined to work with composers that have similar numbers of data, so it is going to be Haydn/Mozart classification. (Maybe Beethoven as well.)