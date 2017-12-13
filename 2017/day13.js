'use strict';

const _ = require('underscore');

const layers = [
	{ layer: 0, range: 3 },
	{ layer: 1, range: 2 },
	{ layer: 2, range: 4 },
	{ layer: 4, range: 4 },
	{ layer: 6, range: 5 },
	{ layer: 8, range: 6 },
	{ layer: 10, range: 8 },
	{ layer: 12, range: 8 },
	{ layer: 14, range: 6 },
	{ layer: 16, range: 6 },
	{ layer: 18, range: 8 },
	{ layer: 20, range: 8 },
	{ layer: 22, range: 6 },
	{ layer: 24, range: 12 },
	{ layer: 26, range: 9 },
	{ layer: 28, range: 12 },
	{ layer: 30, range: 8 },
	{ layer: 32, range: 14 },
	{ layer: 34, range: 12 },
	{ layer: 36, range: 8 },
	{ layer: 38, range: 14 },
	{ layer: 40, range: 12 },
	{ layer: 42, range: 12 },
	{ layer: 44, range: 12 },
	{ layer: 46, range: 14 },
	{ layer: 48, range: 12 },
	{ layer: 50, range: 14 },
	{ layer: 52, range: 12 },
	{ layer: 54, range: 10 },
	{ layer: 56, range: 14 },
	{ layer: 58, range: 12 },
	{ layer: 60, range: 14 },
	{ layer: 62, range: 14 },
	{ layer: 66, range: 10 },
	{ layer: 68, range: 14 },
	{ layer: 74, range: 14 },
	{ layer: 76, range: 12 },
	{ layer: 78, range: 14 },
	{ layer: 80, range: 20 },
	{ layer: 86, range: 18 },
	{ layer: 92, range: 14 },
	{ layer: 94, range: 20 },
	{ layer: 96, range: 18 },
	{ layer: 98, range: 17 }
];

function step(layers, severityTotal, progress, delay) {
	if (progress > _.last(layers).layer) {
		return severityTotal;
	}
	const currentLayer = _.findWhere(layers, { layer: progress });
	if (currentLayer) {
		let range = currentLayer.range;
		let mod = (2 * (range - 1));
		let caught = (progress + delay) % mod === 0;
		if (caught) {
			return 1;
			// return step(layers, severityTotal + (progress * range), progress + 1, delay);
		}
	}
	return step(layers, severityTotal, progress + 1, delay);
}

let win = false;
let delay = 0;
while(!win) {
	let attempt = step(layers, 0, 0, delay);
	if (attempt === 0) {
		win = true;
	} else {
		delay++;
	}
}
console.log(delay);