'use strict';
const _ = require('underscore');
const test = false;

const realInstructions = [
	['set', 'i', 31 ],
	['set', 'a', 1 ],
	['mul', 'p', 17 ],
	['jgz', 'p', 'p' ],
	['mul', 'a', 2 ],
	['add', 'i', -1 ],
	['jgz', 'i', -2 ],
	['add', 'a', -1 ],
	['set', 'i', 127 ],
	['set', 'p', 618 ],
	['mul', 'p', 8505 ],
	['mod', 'p', 'a' ],
	['mul', 'p', 129749 ],
	['add', 'p', 12345 ],
	['mod', 'p', 'a' ],
	['set', 'b', 'p' ],
	['mod', 'b', 10000 ],
	['snd', 'b' ],
	['add', 'i', -1 ],
	['jgz', 'i', -9 ],
	['jgz', 'a', 3 ],
	['rcv', 'b' ],
	['jgz', 'b', -1 ],
	['set', 'f', 0 ],
	['set', 'i', 126 ],
	['rcv', 'a' ],
	['rcv', 'b' ],
	['set', 'p', 'a' ],
	['mul', 'p', -1 ],
	['add', 'p', 'b' ],
	['jgz', 'p', 4 ],
	['snd', 'a', ],
	['set', 'a', 'b' ],
	['jgz', 1, 3 ],
	['snd', 'b' ],
	['set', 'f', 1 ],
	['add', 'i', -1 ],
	['jgz', 'i', -11 ],
	['snd', 'a' ],
	['jgz', 'f', -16 ],
	['jgz', 'a', -19 ]
];
let testInstructions = [
	[ 'set', 'a', 1 ],
	[ 'add', 'a', 2 ],
	[ 'mul', 'a', 'a' ],
	[ 'mod', 'a', 5 ],
	[ 'snd', 'a' ],
	[ 'set', 'a', 0 ],
	[ 'rcv', 'a' ],
	[ 'jgz', 'a', -1 ],
	[ 'set', 'a', 1 ],
	[ 'jgz', 'a', -2 ]
];
testInstructions = [
	['snd', 1],
	['snd', 2],
	['snd', 'p'],
	['rcv', 'a'],
	['rcv', 'b'],
	['rcv', 'c'],
	['rcv', 'd']
];
const instructionsInput = test ? testInstructions : realInstructions;
const registers = [{}, {}];
const sends = [[], []];
const indexes = [0, 0];
const waiting = [false, false];
const sendCount = [0, 0];

function initRegisters(instructions) {
	_.each(instructions, i => {
		if (typeof i[1] === 'string') {
			registers[0][i[1]] = 0;
			registers[1][i[1]] = 0;
		}
	});
	registers[1]['p'] = 1;
}
initRegisters(instructionsInput);

function processInstruction(id, instruction) {
	const partner = id === 0 ? 1 : 0;
	const ins = instruction[0];
	const reg = instruction[1];
	const regVal = getValue(id, reg);
	const newVal = getValue(id, instruction[2]);

	switch (ins) {
		case 'snd':
			sends[id].push(regVal);
			sendCount[id]++;
			waiting[partner] = false;
			break;
		case 'set':
			setValue(id, reg, newVal);
			break;
		case 'add':
			setValue(id, reg, regVal + newVal);
			break;
		case 'mul':
			setValue(id, reg, regVal * newVal);
			break;
		case 'mod':
			setValue(id, reg, regVal % newVal);
			break;
		case 'rcv':
			if (sends[partner].length) {
				setValue(id, reg, sends[partner].shift());
			} else {
				waiting[id] = true;
				return;
			}
			break;
		case 'jgz':
			if (regVal > 0) {
				indexes[id] = indexes[id] + newVal;
				return;
			}
			break;
	}
	indexes[id]++;
}

function getValue(id, thing) {
	if (typeof thing === 'string') {
		return registers[id][thing];
	}
	return thing;
}

function setValue(id, reg, val) {
	registers[id][reg] = val;
}
const dead = [false, false];
const insLen = instructionsInput.length;

let runningId = 0;
let run = true;
while (run) {
	if ((waiting[0] || dead[0]) && (waiting[1] || dead[1])) {
		run = false;
		break;
	}
	if (waiting[runningId] || dead[runningId]) {
		runningId = runningId === 0 ? 1 : 0;
	}
	processInstruction(runningId, instructionsInput[indexes[runningId]]);
	if (indexes[runningId] < 0 || indexes[runningId] >= insLen) {
		dead[runningId] = true;
	}
}

console.log(sendCount);