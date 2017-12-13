'use strict';

const _ = require('underscore');

const input = [102,255,99,252,200,24,219,57,103,2,226,254,1,0,69,216];
const inputString = "102,255,99,252,200,24,219,57,103,2,226,254,1,0,69,216";
const chars = inputString.split('');
const stupidInput = _.map(chars, c => c.charCodeAt(0)).concat([17, 31, 73, 47, 23]);
const stupid64 = _.reduce(_.range(64), (full, ind) => full.concat(stupidInput), []);

const knot = _.range(256);

let start = 0;
let skip = 0;

function tie(array, start, skip, lenIndex, input) {
	if (lenIndex === input.length) {
		return array;
	}
	const len = input[lenIndex];
	const cross = (start + len) > array.length;
	let end;
	let reversedSub;
	if (cross) {
		end = start + len - array.length;
		const lastBit = array.slice(start, array.length);
		const firstBit = array.slice(0, end);
		reversedSub = lastBit.concat(firstBit);
	} else {
		end = start + len;
		reversedSub = array.slice(start, end);
	}
	reversedSub.reverse();

	if (cross) {
		const newLastBit = reversedSub.slice(0, array.length - start);
		const newFirstBit = reversedSub.slice(array.length - start, reversedSub.length);
		array.splice.apply(array, [0, newFirstBit.length].concat(newFirstBit));
		array.splice.apply(array, [array.length - newLastBit.length, newLastBit.length].concat(newLastBit));
	} else {
		array.splice.apply(array, [start, len].concat(reversedSub));
	}

	return tie(array, (start + len + skip)%array.length, (skip + 1), (lenIndex + 1), input);
}

const sparseHash = tie(knot, 0, 0, 0, stupid64);

const denseHash = [];
for (let i = 0; i < 16; i++) {
	const start = i * 16;
	const sub = sparseHash.slice(start, start + 16);
	const dense = _.reduce(sub, (d, s) => d ^ s);
	denseHash.push(dense);
}

console.log(_.map(denseHash, d => {
	let hex = d.toString(16);
	return hex.length === 1 ? '0' + hex : hex;
}).join(''));
