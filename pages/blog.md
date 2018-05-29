--- 
layout: default
title: Blog
permalink: /blog/
splash: true
hide: true
---

  <div class="posts">
    {% for post in site.posts %}
    {% assign currentdate = post.date | date: "%Y" %}
    {% if currentdate != date %}
      <div class="meta" id="y{{currentdate}}">{{ currentdate }}</div>
      {% assign date = currentdate %} 
    {% endif %}
    <div class="post-teaser">
      <span>
          <header>
            <h3>
              <a class="post-link" href="{{ post.url | prepend: site.baseurl }}">
                {{ post.title }}
              </a>
            </h3>
<!--             <p class="meta">
              {{ post.date | date: "%b %Y" }}
            </p> -->
          </header>
      </span>
    </div>
    {% endfor %}
  </div>