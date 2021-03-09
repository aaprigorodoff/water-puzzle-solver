// TODO: think about claases and stacks structure

import MD5 from "crypto-js/md5.js";

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

const getAvailableMoves = currentLayoutArr => {
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
		} else if (flask.sips[i] !== 0) {
			break;
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
const convertMovesToString = moves => {
	let result = "";
	moves.forEach((move, index) => {
		if (move) {
			result += `${index}) `;
			result += move.from;
			result += "->";
			result += move.to;
			result += ";\r\n";
		}
	});
	return result;
};

const generateFlask = (flaskIndex, sips) => ({ flaskIndex, sips });

const solvePuzzle = async (initialPuzzleLayout, initialMove = null, result = [], statesMd5 = []) => {
	result.push(initialMove);
	const newPuzzleLayout = initialMove != null
		? makeAMove(initialPuzzleLayout, initialMove)
		: initialPuzzleLayout;
	const newPuzzleLayoutString = JSON.stringify(newPuzzleLayout);
	const currentMd5 = MD5(newPuzzleLayoutString).toString();
	if (statesMd5.some(m => m === currentMd5)) {
		return;
	}
	statesMd5.push(currentMd5);
	if (!isPuzzleSolved(newPuzzleLayout)) {
		const availableMovesForNewLayout = getAvailableMoves(newPuzzleLayout);
		if (availableMovesForNewLayout.length > 0) {
			availableMovesForNewLayout.forEach(move => {
				if (initialMove && move.from === initialMove.to && move.to === initialMove.from) {
					return;
				}
				// if (result.length % 500 === 0) {
				setTimeout(solvePuzzle, 1, newPuzzleLayout, move, result, statesMd5);
				// } else {
				// solvePuzzleForkMd5States(newPuzzleLayout, move, result, statesMd5);
				// }
			});
		} else {
			// result = [];
			console.log("no available moves");
		}
	} else {
		console.log("success");
		console.log(convertMovesToString(result));
		// throw { asds: "asd" };
	}
};

const solvePuzzleForkAvailableMoves = (initialPuzzleLayout, initialAvailableMoves, result = [], statesMd5 = []) => {
	initialAvailableMoves.some(move => {
		const newPuzzleLayout = makeAMove(initialPuzzleLayout, move);
		if (isPuzzleSolved(newPuzzleLayout)) {
			console.log("Success, result.length=", result.length, "statesMd5 length=", statesMd5.length);
			// console.log(convertMovesToString(result));
			return true;
		}

		const md5 = MD5(JSON.stringify(newPuzzleLayout)).toString();
		if (statesMd5.some(m => m === md5)) {
			return false;
		}

		statesMd5.push(md5);
		result.push(move);

		const newAvailableMoves = getAvailableMoves(newPuzzleLayout)
			.filter(newMove => newMove.from !== move.to && newMove.to !== move.from);
		if (newAvailableMoves.length > 0) {
			setTimeout(solvePuzzleForkAvailableMoves, 0, newPuzzleLayout, newAvailableMoves, result, statesMd5);
			// solvePuzzleForkAvailableMoves(newPuzzleLayout, newAvailableMoves, result, statesMd5);
		}
		console.log("no available moves, result.length=", result.length, "statesMd5 length=", statesMd5.length);
		// statesMd5.pop();
		// result.pop();
		return false;

	});
};

export {
	isPuzzleSolved,
	getFlaskFreeSpace,
	isFlaskEmpty,
	getFlaskColor,
	isFlasksSameColor,
	getAvailableMoves,
	getFlaskSameColorSipsCount,
	isFlaskFull,
	makeAMove,
	moveSingleSip,
	getFirstAvailableColorIndexForSourceFlask,
	solvePuzzleForkAvailableMoves,
	generateFlask,
	solvePuzzle
};
