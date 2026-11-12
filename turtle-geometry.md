---
layout: page
title: Turtle Geometry
permalink: /turtle-geometry/
---

{% include turtle-geometry/blurb.md %}

## Posts

<ul class="post-list">
  {% assign series_posts = site.categories["turtle-geometry"] | reverse %}
  {% for post in series_posts %}
    <li>
      <span class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</span>
      <a class="post-link" href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>
