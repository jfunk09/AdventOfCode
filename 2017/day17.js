'use strict';
const aStart = new Date().getTime();
const _ = require('underscore');

const skip = 328;
const aInserts = 2017;
const bInserts = 50000000;

let currentPos = 0;

// part A
let array = [0];
let start = null;
let end = null;
for (let i = 1; i <= aInserts; i++) {
	currentPos = (currentPos + skip) % array.length;
	start = _.first(array, currentPos + 1);
	end = _.last(array, array.length - currentPos - 1);
	array = start.concat([i]).concat(end);
	currentPos++;
}


console.log(array[currentPos + 1]);
console.log('  time: ' + (new Date().getTime() - aStart) + 'ms');
const bStart = new Date().getTime();

// part b
currentPos = 0;
let zeroPos = 0;
let nextToZero = null;
for (let i = 1; i <= bInserts; i++) {
	currentPos = (currentPos + skip) % i;
	if (currentPos < zeroPos) {
		zeroPos++
	} else if (currentPos === zeroPos) {
		nextToZero = i;
	}
	currentPos++;
}

console.log(nextToZero);
console.log('  time: ' + (new Date().getTime() - bStart) + 'ms');