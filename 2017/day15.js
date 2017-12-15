'use strict';
const aStart = new Date().getTime();
const test = false;

// PART A
const aGenStart = test ? 65 : 634;
const bGenStart = test ? 8921 : 301;
const aGenFactor = 16807;
const bGenFactor = 48271;
const genMod = 2147483647;
const judgeMask = 65535;

const loops = 40000000;
let judgeCount = 0;
let prevA = aGenStart;
let prevB = bGenStart;

for (let i = 0; i < loops; i++) {
	const newA = (prevA * aGenFactor) % genMod;
	const newB = (prevB * bGenFactor) % genMod;

	const matchA = newA & judgeMask;
	const matchB = newB & judgeMask;

	if (matchA === matchB) {
		judgeCount++;
	}

	prevA = newA;
	prevB = newB;
}

console.log('Part A: ' + judgeCount + '\n  time: ' + (new Date().getTime() - aStart) + 'ms');
const bStart = new Date().getTime();

// PART B
const aMask = 3;
const bMask = 7;
const requiredJudgings = 5000000;

// reset from part A
judgeCount = 0;
prevA = aGenStart;
prevB = bGenStart;

let readyAs = [];
let readyBs = [];

while (readyAs.length !== requiredJudgings) {
	const newA = (prevA * aGenFactor) % genMod;
	if ((newA & aMask) === 0) {
		readyAs.push(newA);
	}
	prevA = newA;
}

while (readyBs.length !== requiredJudgings) {
	const newB = (prevB * bGenFactor) % genMod;
	if ((newB & bMask) === 0) {
		readyBs.push(newB);
	}
	prevB = newB;
}

for (let i = 0; i < requiredJudgings; i++) {
	const matchA = readyAs[i] & judgeMask;
	const matchB = readyBs[i] & judgeMask;
	if (matchA === matchB) {
		judgeCount++;
	}
}

console.log('\nPart B: ' + judgeCount + '\n  time: ' + (new Date().getTime() - bStart) + 'ms');