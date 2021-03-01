// TODO: think about claases and stacks structure

const isPuzzleSolved = currentLayoutArr => currentLayoutArr.every(flask => {
	const reference = flask.sips[0];
	const solveFlask = color => color === reference;
	return flask.sips.every(solveFlask);
});

const isFlaskEmpty = flask => flask.sips.every(sip => sip === 0);

const isFlaskFull = flask => flask.sips.every(sip => sip !== 0);

const isFlasksSameColor = (flask1, flask2) => flask1.sips.filter(sip => sip !== 0).pop() === flask2.sips.filter(sip => sip !== 0).pop();

const isFlasksHaveSameIndex = (flask1, flask2) => flask1.flaskIndex === flask2.flaskIndex;

const isMovePossible = (flaskSource, flaskTarget) => !isFlasksHaveSameIndex(flaskSource, flaskTarget)
	&& !isFlaskFull(flaskTarget)
	&& !isFlaskEmpty(flaskSource)
	&& (isFlasksSameColor(flaskSource, flaskTarget) || isFlaskEmpty(flaskTarget));

const getLayoutAvailableMoves = currentLayoutArr => {
	const availableMoves = [];
	currentLayoutArr
		.forEach(flaskSource => {
			currentLayoutArr
				.filter(flaskTarget => isMovePossible(flaskSource, flaskTarget))
				.forEach(flaskTarget => {
					availableMoves.push({ from: flaskSource.flaskIndex, to: flaskTarget.flaskIndex });
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

const getFirstAvailableColorIndexForSourceFlask = flask => {
	if (isFlaskEmpty(flask)) {
		return -1;
	} if (isFlaskFull(flask)) {
		return flask.sips.length - 1;
	}
	// it searching for first null sip and returns index of previous sip
	return flask.sips.findIndex(sip => sip === 0) - 1;
};

const moveSingleSip = (flaskSource, flaskTarget) => {
	const sourceSipIndex = getFirstAvailableColorIndexForSourceFlask(flaskSource);
	const targetSipIndex = flaskTarget.sips.findIndex(sip => sip === 0);
	const sipTemp = flaskSource.sips[sourceSipIndex];
	const resultSipsSource = flaskSource.sips.map((sip, index) => {
		if (index === sourceSipIndex) {
			return 0;
		}
		return sip;
	});
	const resultSipsTarget = flaskTarget.sips.map((sip, index) => {
		if (index === targetSipIndex) {
			return sipTemp;
		}
		return sip;
	});

	const resultFlaskSource = { flaskIndex: flaskSource.flaskIndex, sips: resultSipsSource };
	const resultFlaskTarget = { flaskIndex: flaskTarget.flaskIndex, sips: resultSipsTarget };
	return {
		newFlaskSource: resultFlaskSource,
		newFlaskTarget: resultFlaskTarget
	};
};

const makeAMove = (currentPuzzleLayout, move) => {
	const flaskSource = currentPuzzleLayout.find(flask => flask.flaskIndex === move.from);
	const flaskTarget = currentPuzzleLayout.find(flask => flask.flaskIndex === move.to);
	if (!isMovePossible(flaskSource, flaskTarget)) {
		return currentPuzzleLayout;
	}

	const flaskTargetFreeSpace = getFlaskFreeSpace(flaskTarget);
	const flaskSourceSameColorCount = getFlaskSameColorSipsCount(flaskSource);
	let sipsToMoveCount = Math.min(flaskTargetFreeSpace, flaskSourceSameColorCount);

	let resultFlaskSource = flaskSource;
	let resultFlaskTarget = flaskTarget;

	while (sipsToMoveCount > 0) {
		const result = moveSingleSip(resultFlaskSource, resultFlaskTarget);
		resultFlaskSource = result.newFlaskSource;
		resultFlaskTarget = result.newFlaskTarget;
		sipsToMoveCount -= 1;
	}

	return currentPuzzleLayout.map(flask => {
		if (flask.flaskIndex === flaskSource.flaskIndex) {
			return resultFlaskSource;
		}
		if (flask.flaskIndex === flaskTarget.flaskIndex) {
			return resultFlaskTarget;
		}
		return flask;
	});
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
	makeAMove,
	moveSingleSip,
	getFirstAvailableColorIndexForSourceFlask
};
