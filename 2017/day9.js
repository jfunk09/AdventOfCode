const _ = require('underscore');
const fs = require('fs');

fs.readFile('./day9input.txt', 'utf8', function (err, input) {

	let depth = 0;
	let total = 0;
	let garbage = false;
	let skip = false;
	let garbageCount = 0;

	_.each(input, (c) => {
		if (skip) {
			skip = false;
			return;
		}
		if (garbage) {
			switch (c) {
				case '>':
					garbage = false;
					return;
					break;
				case '!':
					skip = true;
					return;
					break;
			}
			garbageCount++;
			return;
		}
		switch (c) {
			case '{':
				depth++;
				break;
			case '}':
				total += depth;
				depth--;
				break;
			case '<':
				garbage = true;
				break;
			case '!':
				skip = true;
				break;
		}
	});

	console.log(total);
	console.log(garbageCount);
});