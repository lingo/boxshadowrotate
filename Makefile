default: dist/rotatedBoxShadow.jquery.js dist/rotatedBoxShadow.jquery.min.js dist/rotatedBoxShadow.min.js
	echo "Done"

clean:
	rm dist/*.js

dist/rotatedBoxShadow.jquery.js:
	cat src/rotatedBoxShadow.js src/rotatedBoxShadow.jquery.js > dist/rotatedBoxShadow.jquery.js

dist/rotatedBoxShadow.jquery.min.js: dist/rotatedBoxShadow.jquery.js
	cat dist/rotatedBoxShadow.jquery.js | jsmin > dist/rotatedBoxShadow.jquery.min.js

dist/rotatedBoxShadow.min.js:
	cat src/rotatedBoxShadow.js | jsmin > dist/rotatedBoxShadow.min.js

