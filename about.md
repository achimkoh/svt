---
layout: page
title: About
permalink: /about/
featured: true
---

My name is Achim ("ah-cheem"). I usually find myself in self-led or team-based interdisciplinary projects about digital media and culture. Right now I am working on a [survey of recent developments in AI technology with regards to music creation](https://www.are.na/achim-koh/music-art-ai), towards my master's thesis at the Graduate Center, CUNY; I am also compiling [machine learning-related resources for a critical and balanced understanding and usage](http://criticalml.net/){:target="_blank"}. I have worked on a [collaborative research on the history of the South Korean web](http://k-www.kr/){:target="_blank"}, and started a new [project that explores the collective memories embodied in online communities](/text-generation-nate-pann). 

I also [sometimes produce, translate or polish text of my own or other people's](/otherthings). 

Before, I studied at the [School for Poetic Computation](http://sfpc.io/){:target="_blank"}; worked as researcher / coordinator in a [makerspace program within the 4th Anyang Public Art Project](https://4.apap.or.kr/en/makinglab/){:target="_blank"}; and made a [video series of live music performances in urban settings](http://recandplay.net/){:target="_blank"}.

[![Click for CV](/public/robot.gif){:title="Click for CV"}{:style="width:144px;"}](/assets/Koh-CV.pdf)

{% raw %}
<script>
function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}
$( function() {
  $('.wrap').css('background-color', 'rgba(255,255,255,0.9)');
    var bg = $.get( "https://api.giphy.com/v1/gifs/random?api_key=b5560de659674a64971bb4c80c17f382&rating=G&tag="+randomFrom(['scalar','vector','tensor']), function(){ $("body").css({'background-image':'url('+bg.responseJSON.data.image_url+')', 'background-position':'center', 'background-repeat':'no-repeat', 'background-attachment':'fixed', 'background-size':'cover'}); 
	});
  });
</script>
{% endraw %}