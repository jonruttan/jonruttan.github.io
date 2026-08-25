# The check-posts marks (<!--check: ...--> and <!--check-file: ...-->) exist
# for tools/check-posts.py, which reads the source files. Nothing downstream
# needs them, so strip them as soon as the site is read -- before excerpts
# are extracted and pages render -- or they ship in the page HTML, and a mark
# near the top of a post rides into the excerpt and the feed's payload.
MARK = /^<!--check(?:-file)?:.*-->\n?/

Jekyll::Hooks.register :site, :post_read do |site|
  docs = site.collections.values.flat_map(&:docs) + site.pages
  docs.each do |doc|
    next unless doc.content&.match?(MARK)
    doc.content = doc.content.gsub(MARK, "")
    # Excerpts snapshot the content when the document is read, so a cleaned
    # document can still carry a marked excerpt -- rebuild it.
    doc.data["excerpt"] = Jekyll::Excerpt.new(doc) if doc.respond_to?(:data) && doc.data["excerpt"]
  end
end
