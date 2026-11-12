---
layout: page
title: Mazes for Programmers
permalink: /mazes-for-programmers/
---

{% include mazes-for-programmers/blurb.md %}

The code is in [mazes-for-programmers-x-lang](https://github.com/jonruttan/mazes-for-programmers-x-lang).

## Posts

<ul class="post-list">
  {% assign series_posts = site.categories["mazes-for-programmers"] | reverse %}
  {% for post in series_posts %}
    <li>
      <span class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</span>
      <a class="post-link" href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>
