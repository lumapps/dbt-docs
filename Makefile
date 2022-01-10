
.PHONY: clean docs dev

dev:
	DBT_DOCS_ENV=development npm start

watch:
	npm run-script watch

test:
	npm test

docs: clean
	DBT_DOCS_ENV=production webpack
	rm -rf docs/fonts docs/main.js docs/main.js.map

style:
	jekyll build -s styles/ -d styles/_site

clean:
	rm -rf docs/
