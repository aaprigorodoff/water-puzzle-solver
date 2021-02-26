const isPuzzleSolved = currentLayoutArr => currentLayoutArr.every(flask => {
	const reference = flask.sips[0];
	const solveFlask = color => color === reference;
	return flask.sips.every(solveFlask);
});

const isFlaskEmpty = flask => flask.sips.every(sip => sip === 0);

const isFlaskFull = flask => flask.sips.every(sip => sip !== 0);

const isFlasksSameColor = (flask1, flask2) => flask1.sips.filter(sip => sip !== 0).pop() === flask2.sips.filter(sip => sip !== 0).pop();

const isFlasksSameIndex = (flask1, flask2) => flask1.flaskIndex === flask2.flaskIndex;

const isMovePossible = (flaskFrom, flaskTo) => !isFlasksSameIndex(flaskFrom, flaskTo)
	&& !isFlaskFull(flaskTo)
	&& !isFlaskEmpty(flaskFrom)
	&& (isFlasksSameColor(flaskFrom, flaskTo)) || isFlaskEmpty(flaskTo);

const getLayoutAvailableMoves = currentLayoutArr => {
	const availableMoves = [];
	currentLayoutArr
		.forEach(flaskFrom => {
			currentLayoutArr
				.filter(flaskTo => isMovePossible(flaskFrom, flaskTo))
				.forEach(flaskTo => {
					availableMoves.push({ from: flaskFrom.flaskIndex, to: flaskTo.flaskIndex });
				});
		});
	return availableMoves;
};

const getFlaskColor = flask => (isFlaskEmpty(flask) ? 0 : flask.sips
	.filter(sip => sip !== 0)
	.pop());

const getFlaskFreeSpace = flask => (isFlaskFull(flask) ? 0 : flask.sips.filter(sip => sip === 0).length);

const getFlaskSameColorSipsCount = flask => {
	//TODO: rewrite to reduce()
	if (isFlaskEmpty(flask)) {
		return 0;
	} if (getFlaskFreeSpace(flask) === 3) {
		return 1;
	}
	const color = getFlaskColor(flask);
	let counter = 0;
	for (let i = flask.sips.length - 1; i >= 0; i--) {
		if (flask.sips[i] === color) {
			counter += 1;
		}
	}
	return counter;
};

const getFirstAvailableColorIndex = flask => 0;

const makeAMove = (currentPuzzleLayout, move) => {
	const flaskFrom = currentPuzzleLayout.find(flask => flask.flaskIndex === move.from);
	const flaskTo = currentPuzzleLayout.find(flask => flask.flaskIndex === move.to);
	if (!isMovePossible(flaskFrom, flaskTo)) {
		return currentPuzzleLayout;
	}

	const flaskToFreeSpace = getFlaskFreeSpace(flaskTo);
	const flaskFromSameColorCount = getFlaskSameColorSipsCount(flaskFrom);
	const sipsToMoveCount = Math.min(flaskToFreeSpace, flaskFromSameColorCount);

	const resultSipsFrom = [];
	const resultSipsTo = [];
	// const is
	return (
		resultFlaskFrom,
		resultFlaskTo
	);
};

export {
	isPuzzleSolved,
	getFlaskFreeSpace,
	isFlaskEmpty,
	getFlaskColor,
	isFlasksSameColor,
	getLayoutAvailableMoves,
	getFlaskSameColorSipsCount,
	isFlaskFull,
	makeAMove
};
