const _ = require('underscore');

const banks = [4, 1, 15, 12, 0, 9, 9, 5, 5, 8, 7, 3, 14, 5, 12, 3];

let inf = false;
const configs = [_.clone(banks)];
let currentConfig = _.clone(banks);
let count = 0;

function maxBankIndex(array) {
	return _.indexOf(array,_.max(array));
}

function redistribute(value, array, index) {
	for (let i = 1; i <= value; i++) {
		array[(index+i) % 16]++;
	}
	return array;
}

function checkInf(config) {
	for (let i = 0; i < configs.length; i++) {
		let existing = configs[i];
		for (let j = 0; j < 16; j++) {
			if (existing[j] !== config[j]) {
				break;
			}
			if (j === 15) {
				console.log(count - i);
				return true;
			}
		}
	}
	return false;
}

while (!inf) {
	const index = maxBankIndex(currentConfig);
	const value = currentConfig[index];
	currentConfig[index] = 0;
	const newConfig = redistribute(value, _.clone(currentConfig), index);
	count++;
	inf = checkInf(newConfig);
	configs.push(_.clone(newConfig));
	currentConfig = newConfig;
}

console.log(count);