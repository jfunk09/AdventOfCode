'use strict';
const _ = require('underscore');

const realInput = [
	"..##.##.######...#.######",
	"##...#...###....##.#.#.##",
	"###.#.#.#..#.##.####.#.#.",
	"..##.##...#..#.##.....##.",
	"##.##...#.....#.#..#.####",
	".###...#.........###.####",
	"#..##....###...#######..#",
	"###..#.####.###.#.#......",
	".#....##..##...###..###.#",
	"###.#..#.##.###.#..###...",
	"####.#..##.#.#.#.#.#...##",
	"##.#####.#......#.#.#.#.#",
	"..##..####...#..#.#.####.",
	".####.####.####...##.#.##",
	"#####....#...#.####.#..#.",
	".#..###..........#..#.#..",
	".#.##.#.#.##.##.#..#.#...",
	"..##...#..#.....##.####..",
	"..#.#...######..##..##.#.",
	".####.###....##...####.#.",
	".#####..#####....####.#..",
	"###..#..##.#......##.###.",
	".########...#.#...###....",
	"...##.#.##.#####.###.####",
	".....##.#.#....#..#....#."
];
const testInput = [
	"..#",
	"#..",
	"..."
];

const test = false;
const infectionHash = {};
initHash(test ? testInput : realInput);
let virus = { x: 0, y: 0, dir: 'u' };
let infectionCount = 0;

function getKey(virus) {
	return [virus.x, virus.y].join(',');
}

function initHash(state) {
	const height = state.length;
	const width = state[0].length;
	_.each(state, (row, rowInd) => {
		const nodes = row.split('');
		_.each(nodes, (node, nodeInd) => {
			if (node === '#') {
				const x = nodeInd - ((width - 1) / 2);
				const y = ((height - 1) / 2) - rowInd;
				infectionHash[getKey({ x: x, y: y })] = 'i';
			}
		});
	});
}

function turn(virus, right) {
	const update = _.clone(virus);
	switch (virus.dir) {
		case 'u':
			update.dir = right ? 'r' : 'l';
			break;
		case 'r':
			update.dir = right ? 'd' : 'u';
			break;
		case 'd':
			update.dir = right ? 'l' : 'r';
			break;
		case 'l':
			update.dir = right ? 'u' : 'd';
			break;
	}
	return update;
}

function move(virus) {
	const update = _.clone(virus);
	switch (virus.dir) {
		case 'u':
			update.y = update.y + 1;
			break;
		case 'r':
			update.x = update.x + 1;
			break;
		case 'd':
			update.y = update.y - 1;
			break;
		case 'l':
			update.x = update.x - 1;
			break;
	}
	return update;
}

function toggle(virus, infected) {
	infected ? clean(virus) : infect(virus);
}

function infect(virus) {
	infectionCount++;
	infectionHash[getKey(virus)] = 'i';
}

function clean(virus) {
	infectionHash[getKey(virus)] = 'c';
}

function weaken(virus) {
	infectionHash[getKey(virus)] = 'w';
}

function flag(virus) {
	infectionHash[getKey(virus)] = 'f';
}

function burst(virus) {
	let update = _.clone(virus);
	const infected = infectionHash[getKey(virus)] ? infectionHash[getKey(virus)] === 'i' : false;
	update = turn(update, infected);
	toggle(virus, infected);
	update = move(update);
	return update;
}

function advBurst(virus) {
	let update = _.clone(virus);
	let nodeState;
	if (infectionHash[getKey(virus)]) {
		nodeState = infectionHash[getKey(virus)];
	} else {
		clean(virus)
		nodeState = 'c';
	}
	switch (nodeState) {
		case 'c':
			update = turn(update, false);
			break;
		case 'w':
			break;
		case 'i':
			update = turn(update, true);
			break;
		case 'f':
			update = turn(turn(update, true), true);
			break;
	}
	switch (nodeState) {
		case 'c':
			weaken(virus);
			break;
		case 'w':
			infect(virus);
			break;
		case 'i':
			flag(virus);
			break;
		case 'f':
			clean(virus);
			break;
	}
	update = move(update);
	return update;
}

for (let i = 0; i < 10000000; i++) {
	// virus = burst(virus);
	virus = advBurst(virus);
}

console.log(infectionCount);