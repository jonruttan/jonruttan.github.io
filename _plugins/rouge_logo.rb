# A Rouge lexer for Logo (the x/Logo dialect of Turtle Procedure Notation).
#
# Loaded by Jekyll from _plugins/ — works because the site is built with
# `bundle exec jekyll build` (GitHub Actions), not the safe-mode
# github-pages gem. Registers the `logo` fence tag:
#
#     ```logo
#     TO SQUARE SIZE
#         REPEAT 4
#             FD SIZE
#             RT 90
#     ```
require 'rouge'

module Rouge
  module Lexers
    class Logo < RegexLexer
      title 'Logo'
      desc 'Logo turtle graphics (x/Logo dialect of Turtle Procedure Notation)'
      tag 'logo'
      filenames '*.logo'

      # Control flow and structure
      def self.keywords
        @keywords ||= Set.new %w(
          TO REPEAT FOREVER UNTIL IF THEN ELSE STOP RETURN
          PRINT TYPE EXECUTE LOAD
        )
      end

      # Turtle commands, queries, and math builtins (from apps/logo)
      def self.builtins
        @builtins ||= Set.new %w(
          FORWARD FD BACK BK RIGHT RT LEFT LT
          PENUP PU PENDOWN PD PENCOLOR PC PENWIDTH PW
          CLEARSCREEN CS HIDETURTLE HT SHOWTURTLE ST
          SETXY SETX SETY HOME SETHEADING SETH
          HEADING XCOR YCOR DISTANCE TOWARDS TURTLE.STATE
          GROW S.FORWARD S.FD
          SQRT ABS SIN COS TAN ARCTAN REMAINDER RAND ROUND INT
          POWER PI NOT MEMBER
        )
      end

      state :root do
        rule %r/;.*$/, Comment::Single
        rule %r/\s+/, Text::Whitespace

        rule %r/"[^"]*"/, Str::Double

        # TO <name> — highlight the procedure being defined
        rule %r/(TO)(\s+)([A-Za-z][\w.]*)/i do
          groups Keyword, Text::Whitespace, Name::Function
        end

        rule %r/\d+\.\d+/, Num::Float
        rule %r/\d+/, Num::Integer

        rule %r/<-|<=|>=|<>|[-+*\/^=<>]/, Operator
        rule %r/[()\[\],]/, Punctuation

        rule %r/[A-Za-z][\w.]*/ do |m|
          up = m[0].upcase
          if self.class.keywords.include?(up)
            token Keyword
          elsif self.class.builtins.include?(up)
            token Name::Builtin
          else
            token Name
          end
        end
      end
    end
  end
end
