pandoc --output="%~n1.html" --filter "pandoc-plantuml-filter.cmd" %1 --self-contained -c buttondown.css

