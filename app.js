// eslint-disable-next-line no-undef
const fs = require("fs");

const isSolved = currentLayoutArr => currentLayoutArr.every(flask => {
	const reference = flask.sips[0];
	const solveFlask = color => color === reference;
	return flask.sips.every(solveFlask);
});

//<editor-fold desc="isSolved test">
const testSolvedArr = [
	{ flaskIndex: 0, sips: [0, 0, 0, 0] },
	{ flaskIndex: 1, sips: [1, 1, 1, 1] },
	{ flaskIndex: 2, sips: [2, 2, 2, 2] },
	{ flaskIndex: 3, sips: [3, 3, 3, 3] }
];

const testUnSolvedArr = [
	{ flaskIndex: 0, sips: [1, 1, 1, 1] },
	{ flaskIndex: 0, sips: [1, 2, 3, 4] },
	{ flaskIndex: 0, sips: [1, 2, 3, 4] },
	{ flaskIndex: 0, sips: [1, 2, 1, 1] }
];

console.log("solved arr test is", isSolved(testSolvedArr) ? "passed" : "failed");
console.log("unsolved arr test is", isSolved(testUnSolvedArr) ? "failed" : "passed");
//</editor-fold>

const isEmpty = flask => flask.sips.every(sip => sip === 0);

//<editor-fold desc="isEmpty test">
const testIsEmptyFlask = { flaskIndex: 0, sips: [0, 0, 0, 0] };
const testIsNotEmptyFlask1 = { flaskIndex: 0, sips: [1, 2, 3, 0] };
const testIsNotEmptyFlask2 = { flaskIndex: 0, sips: [1, 0, 0, 0] };
const testIsNotEmptyFlask3 = { flaskIndex: 0, sips: [1, 2, 3, 6] };
console.log("isEmptyFlask test is", isEmpty(testIsEmptyFlask) ? "passed" : "failed");
console.log("isNotEmptyFlask test is",
	isEmpty(testIsNotEmptyFlask1)
    || isEmpty(testIsNotEmptyFlask2)
    || isEmpty(testIsNotEmptyFlask3)
		? "failed" : "passed");
//</editor-fold>

const isFull = flask => flask.sips.every(sip => sip !== 0);

//<editor-fold desc="isFull test">
const testIsFullFlask1 = { flaskIndex: 0, sips: [2, 2, 2, 2] };
const testIsFullFlask2 = { flaskIndex: 0, sips: [1, 2, 3, 9] };
const testIsFullFlask3 = { flaskIndex: 0, sips: [1, 9, 2, 2] };
const testIsNotFullFlask1 = { flaskIndex: 0, sips: [1, 2, 3, 0] };
const testIsNotFullFlask2 = { flaskIndex: 0, sips: [1, 2, 0, 0] };
const testIsNotFullFlask3 = { flaskIndex: 0, sips: [0, 1, 1, 0] };
const testIsNotFullFlask4 = { flaskIndex: 0, sips: [0, 0, 0, 0] };

console.log("isFullFlask test is", isFull(testIsFullFlask1)
&& isFull(testIsFullFlask2)
&& isFull(testIsFullFlask3)
	? "passed" : "failed");

console.log("isNotFullFlask test is",
	isFull(testIsNotFullFlask1)
    || isFull(testIsNotFullFlask2)
    || isFull(testIsNotFullFlask3)
    || isFull(testIsNotFullFlask4)
		? "failed" : "passed");
//</editor-fold>

const isSameColor = (flask1, flask2) => flask1.sips.filter(sip => sip !== 0).pop() === flask2.sips.filter(sip => sip !== 0).pop();

//<editor-fold desc="isSameColor test">
const testIsSameColor1Flask1 = { flaskIndex: 0, sips: [1, 1, 1, 1] };
const testIsSameColor1Flask2 = { flaskIndex: 0, sips: [1, 1, 1, 1] };
const testIsSameColor2Flask1 = { flaskIndex: 0, sips: [1, 1, 1, 0] };
const testIsSameColor2Flask2 = { flaskIndex: 0, sips: [1, 1, 1, 1] };
const testIsSameColor3Flask1 = { flaskIndex: 0, sips: [1, 0, 0, 0] };
const testIsSameColor3Flask2 = { flaskIndex: 0, sips: [2, 1, 0, 0] };
const testIsNotSameColor1Flask1 = { flaskIndex: 0, sips: [1, 1, 1, 1] };
const testIsNotSameColor1Flask2 = { flaskIndex: 0, sips: [2, 2, 2, 2] };
const testIsNotSameColor2Flask1 = { flaskIndex: 0, sips: [1, 1, 1, 0] };
const testIsNotSameColor2Flask2 = { flaskIndex: 0, sips: [2, 2, 2, 2] };
const testIsNotSameColor3Flask1 = { flaskIndex: 0, sips: [1, 1, 0, 0] };
const testIsNotSameColor3Flask2 = { flaskIndex: 0, sips: [2, 2, 0, 0] };
const testIsNotSameColor4Flask1 = { flaskIndex: 0, sips: [0, 0, 0, 0] };
const testIsNotSameColor4Flask2 = { flaskIndex: 0, sips: [2, 0, 0, 0] };
console.log("isSameColor test is",
	isSameColor(testIsSameColor1Flask1, testIsSameColor1Flask2)
	&& isSameColor(testIsSameColor2Flask1, testIsSameColor2Flask2)
	&& isSameColor(testIsSameColor3Flask1, testIsSameColor3Flask2)
		? "passed" : "failed");
console.log("isNotSameColor test is",
	isSameColor(testIsNotSameColor1Flask1, testIsNotSameColor1Flask2)
	|| isSameColor(testIsNotSameColor2Flask1, testIsNotSameColor2Flask2)
	|| isSameColor(testIsNotSameColor3Flask1, testIsNotSameColor3Flask2)
	|| isSameColor(testIsNotSameColor4Flask1, testIsNotSameColor4Flask2)
		? "failed" : "passed");
//</editor-fold>

// array of records like [{"from": 0, "to": 1}, {"from": 0, "to": 4}, {"from": 0, "to": 3}, {"from": 0, "to": 2}]
const getAvailableMoves = currentLayoutArr => {
	const availableMoves = [];
	currentLayoutArr
		.filter(flaskFrom => !isEmpty(flaskFrom))
		.forEach(flaskFrom => {
			currentLayoutArr.filter(flaskTo => flaskFrom.flaskIndex !== flaskTo.flaskIndex)
				.filter(flaskTo => !isFull(flaskTo))
				.filter(flaskTo => isSameColor(flaskTo, flaskFrom) || isEmpty(flaskTo))
				.forEach(flaskTo => {
					availableMoves.push({ from: flaskFrom.flaskIndex, to: flaskTo.flaskIndex });
				});
		});
	return availableMoves;
};

//<editor-fold desc="getAvailableMoves test">
const testGetAvailableMoves1 = [{ flaskIndex: 0, sips: [1, 1, 1, 0] }, { flaskIndex: 1, sips: [1, 1, 1, 0] }];
const testGetAvailableMoves2 = [{ flaskIndex: 0, sips: [1, 1, 1, 0] }, { flaskIndex: 1, sips: [1, 1, 1, 1] }];
const testGetAvailableMoves3 = [
	{ flaskIndex: 0, sips: [1, 1, 1, 0] },
	{ flaskIndex: 1, sips: [1, 1, 1, 1] },
	{ flaskIndex: 2, sips: [1, 0, 0, 0] },
	{ flaskIndex: 3, sips: [0, 0, 0, 0] }
];
console.log("getAvailableMoves1 test:", getAvailableMoves(testGetAvailableMoves1));
console.log("getAvailableMoves2 test:", getAvailableMoves(testGetAvailableMoves2));
console.log("getAvailableMoves3 test:", getAvailableMoves(testGetAvailableMoves3));
//</editor-fold>
const makeAMove = () => {
};

// array of records like
// array of records like [{"from": 0, "to": 1}, {"from": 0, "to": 4}, {"from": 0, "to": 3}, {"from": 0, "to": 2}]
const solution = [];

const rawInputData = fs.readFileSync("./test/samples/sample1.json");
const initialPuzzle = JSON.parse(rawInputData);

// while (!isSolved(initialPuzzle)) {
// 	const availableMoves = () => {
// 	};
// 	const currentPuzzleLayout = () => {
// 	};
// 	const nextPuzzleLayout = makeAMove(currentPuzzleLayout());
// }
