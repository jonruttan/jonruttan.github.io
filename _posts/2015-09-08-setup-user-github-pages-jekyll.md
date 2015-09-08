---
layout: post
title:  " Setup User/Organization GitHub Pages + Jekyll"
categories: github jekyll blog
---

How to configure a [GitHub Pages](https://pages.github.com/) user or organization website with the [Jekyll](http://jekyllrb.com/) static site generator.

> These are the steps I followed to create this site --- @jonruttan

GitHub Pages support Jekyll, a simple, blog-aware static site generator.

GitHub Pages work by looking at certain branches of repositories on GitHub. There are two basic types available: user/organization pages and project pages. The way to deploy these two types of sites is nearly identical, except for a few minor details. These instructions are for user/organization pages.

# Install Git

To work with [GitHub](https://github.com/) from the command line, you'll need [Git](https://git-scm.com/) installed.

  - [Git](https://git-scm.com/downloads)

# Install Jekyll

Jekyll has a few requirements you’ll need to make sure your system has before you start.

  - [Ruby](https://www.ruby-lang.org/en/downloads/) (including development headers)
  - [RubyGems](https://rubygems.org/pages/download)
  - [NodeJS](http://nodejs.org/), or another JavaScript runtime (if you want CoffeeScript support)

To ensure your computer most closely matches the GitHub Pages settings, install Jekyll and its dependencies using the [GitHub Pages Gem](https://help.github.com/articles/using-jekyll-with-pages/).

```bash
~ $ [sudo] gem install github-pages
```

# Create the GitHub User Pages Repository

You get one [GitHub Pages](https://pages.github.com/) site per GitHub account and organization.

User and organization pages live in a special GitHub repository dedicated to only the GitHub Pages files. This repository must be named after the account name.

Content from the master branch of your repository will be used to build and publish the GitHub Pages site, so make sure your Jekyll site is stored there.

  1. Head to the [GitHub](https://github.com/) site and create the repository. For a user it must be named _**username**.github.io_ where *username* is your username (or organization name) on GitHub.
  2. Clone the repository locally. Go to the directory where you want to store your project, and issue the Git *clone* command.

```bash
~ $ git clone https://github.com/<USERNAME>/<USERNAME>.github.io myblog
```

# Scaffold the New Site

After cloning the new site, use the Jekyll *new* command to create the directory struture and populate the site with some default files.

```bash
~ $ cd myblog
~/myblog $ jekyll new .
```

# Test the Site

The previous command created some default pages which can be now be served. The Jekyll *serve* command will build the site, serve it to <http://localhost:4000>, and watch the files for changes.

```bash
~/myblog $ jekyll serve
# => Now browse to http://localhost:4000
```

Press `ctrl-c` to stop the server.


# Edit the Site Configuration

Jekyll stores the site's global configuration in *_config.yml*. The format of this file is [YAML](http://yaml.org/). The Jekyll *new* command created this file and set some defaults and example values for you.

  - Modify the `# Site settings` section in *_config.yml*
    - Change *`title`* to your new site title. This value will be displayed in various places, including the header and the footer of every page.
    - Change *`email`* you your contact email address. This value is displayed in the footer.
    - Change the *`description`* to a short blurb about your site. This will be displayed in the footer.
    - Leave *`baseurl`* empty for user/organization pages.
    - Change *`url`* to *`https://<USERNAME>.github.io/`* for user/organization pages, replacing `<USERNAME>` with the appropriate value.
    - Update *`twitter_username`* with your *Twitter username*, or remove it if you don't have one or wish to show it. When provided it will be displayed in the footer.
    - Update *`github_username`* with your *GitHub username*, or remove it if you don't wish to show it. When provided it will be displayed in the footer.


Switching the [Markdown](https://daringfireball.net/projects/markdown/) renderer in the configuration *Build Settings* to [Redcarpet](https://github.com/vmg/redcarpet) gives you access to some handy Markdown extensions to use in your posts. These extensions allow the posts to be written in  [GitHub Flavored Markdown](https://help.github.com/articles/github-flavored-markdown/).

> Thanks goes to @ajoz for the information I found at this site: https://ajoz.github.io/2014/06/29/i-want-my-github-flavored-markdown/ :+1:

To use Redcarpet and its extensions, replace the default `# Build settings` section in *_config.yml* with the following settings:

~~~yaml
# Build settings
markdown: redcarpet
markdown_ext: markdown,mkdown,mkdn,mkd,md

redcarpet:
  extensions:
  - tables
  - autolink
  - strikethrough
  - space_after_headers
  - with_toc_data
  - fenced_code_blocks
  - superscript
  - footnotes
~~~

# Update the About Page

The *about.md* page is where you'll put general information about the site. There's a link to the About page in the site header. If you want to just re-use the site description, replace all of the text after the YAML Front Matter[^front-matter] with {% raw %}`{{ site.description }}`{% endraw %}.

Run `jekyll serve` and browse to http://localhost:4000/about to view the page. Jekyll will watch the file for changes and rebuild the site every time it's saved, after which you can refresh the browser to see the changes.


# Draft a Post

- See http://jekyllrb.com/docs/drafts/

Drafts are posts you’re working on and don’t want to published yet. They're stored in the *_drafts* directory.

To get up and running with drafts, create a *_drafts* directory in your site’s root.

```bash
~/myblog $ mkdir _drafts
```

To preview the site with drafts, run Jekyll's *serve* or *build* commands with the *`--drafts`* switch. Unless supplied in the YAML Front Matter[^front-matter], each draft be assigned the file's modification time for the post date, and thus you will see the currently edited draft as the most recent post.

```bash
~/myblog $ jekyll serve --drafts
```

Jekyll will watch the directory for changes and rebuild the site every time a file is saved, after which you can refresh the browser to see the changes.

# Publish a Post

- See http://jekyllrb.com/docs/posts/

The *_posts* directory is where the blog posts live. All posts must have YAML Front Matter[^front-matter], and they will be converted from their source format into an HTML page that is part of your static site.

The Jekyll *new* command created a sample post which you'll probably want to remove:

```bash
~/myblog $ rm _posts/*-welcome-to-jekyll.markdown
```

To create a new post, create a new file in the *_posts* directory. How you name files in this folder is important. Jekyll requires blog post files to be named according to the following format:

```
YEAR-MONTH-DAY-title.MARKUP
```

Where `YEAR` is a four-digit number, `MONTH` and `DAY` are both two-digit numbers, and `MARKUP` is the file extension representing the format used in the file.

When you're ready to publish your draft, move the file to the *_posts* directory, and rename it to conform with the posts naming format.

# Test the Site

Before committing the changes, test the site without the *--drafts* switch and make sure everything looks the way you want it to.

```bash
~/myblog $ jekyll serve
```

# Commit and Push the Changes

When you're ready to make the site live, run the following commands to commit the changes to Git, and push them to GitHub:

```bash
$ git add --all
$ git commit -m "Initial commit"
$ git push -u origin master
```

[^front-matter]: Front-matter is just a set of metadata, delineated by three dashes. See http://jekyllrb.com/docs/frontmatter/
