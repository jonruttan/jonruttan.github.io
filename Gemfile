source "https://rubygems.org"

# Build this site with a current, self-hosted Jekyll instead of the frozen
# `github-pages` gem. Deployment is handled by the GitHub Actions workflow in
# .github/workflows/jekyll.yml, which lets us track patched dependencies.
gem "jekyll", "~> 4.4"

# Theme. Most of it is overridden locally (_layouts, _includes, _sass), but the
# gem still supplies defaults and asset fallbacks.
gem "minima", "~> 2.5"

# Plugins
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.17"
  # Provides the {% gist %} tag used by an older post; previously supplied by
  # the `github-pages` gem.
  gem "jekyll-gist", "~> 1.5"
end

# Windows and JRuby do not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows.
gem "wdm", "~> 0.2", :platforms => [:mingw, :x64_mingw, :mswin]

# Lock `http_parser.rb` gem to `v0.6.x` on JRuby builds since newer versions of
# the gem do not have a Java counterpart.
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]

# Local dev server.
gem "webrick", "~> 1.8"

# Ruby 3.4+/4.0 removed several libraries from the default gems that Jekyll and
# its dependencies still expect.
gem "csv"
gem "base64"
gem "bigdecimal"
gem "logger"
