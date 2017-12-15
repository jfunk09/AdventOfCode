'use strict';

const _ = require('underscore');
const tStart = new Date().getTime();

//third party string padder
if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength,padString) {
        targetLength = targetLength>>0; //floor if number or convert non-number to 0;
        padString = String(padString || ' ');
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength-this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0,targetLength) + String(this);
        }
    };
}

function tie(array, start, skip, lenIndex, input) {
	if (lenIndex === input.length) {
		return { array: array, start: start, skip: skip };
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


const inputString = "hfdlxzhv"; // actual
// const inputString = "flqrgnkx"; // test

const rows = _.map(_.range(128), row => {
	const key = inputString + "-" + row.toString();
	const chars = key.split('');
	const stupidInput = _.map(chars, c => c.charCodeAt(0)).concat([17, 31, 73, 47, 23]);
	const stupid64 = _.reduce(_.range(64), (full, ind) => full.concat(stupidInput), []);

	const tied = tie(_.range(256), 0, 0, 0, stupid64);
	const sparseHash = tied.array;

	const denseHash = [];
	for (let i = 0; i < 16; i++) {
		const start = i * 16;
		const sub = sparseHash.slice(start, start + 16);
		const dense = _.reduce(sub, (d, s) => d ^ s);
		const hex = dense.toString(16);
		denseHash.push(hex.length === 1 ? '0' + hex : hex);
	}
	const binaryRow = _.map(denseHash.join('').split(''), c => parseInt('0x'+c).toString(2).padStart(4, '0')).join('');
// console.log(binaryRow);
	return binaryRow;
});

const partA = _.reduce(rows, (sum, r) => {
	return sum + _.filter(r.split(''), c => c === '1').length;
}, 0);
console.log(new Date().getTime() - tStart, ':', partA);

const groups = {};
const charRows = _.map(rows, r => r.split(''));
let groupNameIndex = 1;
const height = charRows.length;
const width = charRows[0].length;
const indexTotal = height * width;

const groupRows = _.map(_.range(height), rowInd => {
	return _.map(_.range(width), colInd => null);
});

function isFilled(coord) {
	return charRows[coord.y][coord.x] === '1';
}

function getGroup(coord) {
	return groupRows[coord.y][coord.x];
}

function setGroup(coord, group) {
	groupRows[coord.y][coord.x] = group;
	groups[group].push(coord);
}

function addGroup(coord, group) {
	groups[group] = [];
	setGroup(coord, group);
}

function transferGroup(fromGroup, toGroup) {
	const fromGroupMembers = groups[fromGroup];
	_.each(fromGroupMembers, coord => {
		setGroup(coord, toGroup);
	});
	groups[toGroup] = groups[toGroup].concat(fromGroupMembers);
	groups[fromGroup] = [];
}

for (let i = 0; i < indexTotal; i++) {
	const coord = { x: i % width, y: Math.floor(i / width) };
	const filled = isFilled(coord);
	if (filled) {
		const leftGroup = coord.x > 0 ? getGroup({ x: coord.x - 1, y: coord.y }) : null;
		const upGroup = coord.y > 0 ? getGroup({ x: coord.x, y: coord.y - 1 }) : null;
		
		if (leftGroup && upGroup && leftGroup !== upGroup) {
			const leftSize = leftGroup ? groups[leftGroup].length : 0;
			const upSize = upGroup ? groups[upGroup] : 0;
			const biggerGroup = leftSize > upSize ? leftGroup : upGroup;
			const smallerGroup = leftSize > upSize ? upGroup : leftGroup;
			setGroup(coord, biggerGroup);
			transferGroup(smallerGroup, biggerGroup);
		} else if (leftGroup && upGroup) {
			setGroup(coord, leftGroup);
		} else if (leftGroup) {
			setGroup(coord, leftGroup);
		} else if (upGroup) {
			setGroup(coord, upGroup);
		} else { // not touching existing group
			addGroup(coord, groupNameIndex);
			groupNameIndex++;
		}
	}
}

console.log(new Date().getTime() - tStart, ':', _.filter(groups, g => g.length > 0).length);
