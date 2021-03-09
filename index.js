import {
	solvePuzzle, getAvailableMoves, solvePuzzleForkAvailableMoves, generateFlask
} from "./puzzleHelper.js";

const puzzleLevel1 = [
	generateFlask(0, [1, 0, 0, 0]),
	generateFlask(1, [1, 1, 1, 0])
];
const puzzleLevel2 = [
	generateFlask(0, [1, 2, 1, 2]),
	generateFlask(1, [2, 1, 2, 1]),
	generateFlask(2, [0, 0, 0, 0]),
];

const puzzleLevel3 = [
	generateFlask(0, [1, 2, 3, 1]),
	generateFlask(1, [2, 2, 3, 1]),
	generateFlask(2, [3, 1, 2, 3]),
	generateFlask(3, [0, 0, 0, 0]),
	generateFlask(4, [0, 0, 0, 0])

];

const puzzleLevel309 = [
	generateFlask(1, [12, 9, 9, 8]), generateFlask(2, [4, 6, 9, 5]), generateFlask(3, [7, 7, 7, 11]), generateFlask(4, [5, 10, 11, 12]), generateFlask(5, [6, 4, 8, 1]), generateFlask(6, [8, 3, 10, 12]), generateFlask(7, [8, 7, 2, 3]),
	generateFlask(8, [1, 10, 2, 5]), generateFlask(9, [4, 5, 12, 3]), generateFlask(10, [2, 6, 9, 6]), generateFlask(11, [1, 4, 11, 11]), generateFlask(12, [10, 1, 2, 3]), generateFlask(13, [0, 0, 0, 0]), generateFlask(14, [0, 0, 0, 0]),
	generateFlask(15, [0, 0, 0, 0])
];

// solvePuzzle(puzzleLevel3);
// solvePuzzle(puzzleLevel3);
// solvePuzzleForkMd5States(puzzleLevel309);
solvePuzzleForkAvailableMoves(puzzleLevel309, getAvailableMoves(puzzleLevel309));
