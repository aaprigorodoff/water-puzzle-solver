import {
	isFlaskFull,
	isFlaskEmpty,
	getFlaskColor,
	getFlaskFreeSpace,
	getFlaskSameColorSipsCount,
	getAvailableMoves,
	isFlasksSameColor,
	isPuzzleSolved,
	moveSingleSip,
	getFirstAvailableColorIndexForSourceFlask,
	makeAMove,
	generateFlask
} from "../puzzleHelper.js";

describe("Helper Flask function", () => {
	describe("isFlaskFull returns", () => {
		it("true for full flask", () => {
			expect(isFlaskFull(generateFlask(0, [2, 2, 2, 2]))).toBeTrue();
		});
		it("false for not full flask", () => {
			expect(isFlaskFull(generateFlask(0, [2, 2, 2, 0]))).toBeFalse();
		});
	});
	describe("isFlaskEmpty returns", () => {
		it("true for empty flask", () => {
			expect(isFlaskEmpty(generateFlask(0, [0, 0, 0, 0]))).toBeTrue();
		});
		it("false for not empty flask", () => {
			expect(isFlaskEmpty(generateFlask(0, [2, 2, 2, 0]))).toBeFalse();
		});
	});
	describe("getFlaskColor returns", () => {
		it("0 for empty flask", () => {
			expect(getFlaskColor(generateFlask(0, [0, 0, 0, 0]))).toBe(0);
		});
		it("right color for full flask", () => {
			expect(getFlaskColor(generateFlask(0, [1, 1, 1, 1]))).toBe(1);
		});
		it("right color for non-empty flask", () => {
			expect(getFlaskColor(generateFlask(0, [1, 2, 3, 0]))).toBe(3);
		});
	});
	describe("getFlaskFreeSpace returns", () => {
		it("0 for full flask", () => {
			expect(getFlaskFreeSpace(generateFlask(0, [1, 1, 1, 1]))).toBe(0);
		});
		it("flask size for empty flask", () => {
			expect(getFlaskFreeSpace(generateFlask(0, [0, 0, 0, 0]))).toBe(4);
		});
		it("right value for non-empty flask", () => {
			expect(getFlaskFreeSpace(generateFlask(0, [1, 2, 3, 0]))).toBe(1);
			expect(getFlaskFreeSpace(generateFlask(0, [1, 2, 0, 0]))).toBe(2);
		});
	});
	describe("isFlasksSameColor returns", () => {
		it("true for equal flasks", () => {
			const flask1 = generateFlask(0, [1, 1, 1, 1]);
			const flask2 = generateFlask(0, [1, 1, 1, 1]);
			expect(isFlasksSameColor(flask1, flask2)).toBeTrue();
		});
		it("true for non-equal full same color flasks", () => {
			const flask1 = generateFlask(0, [1, 1, 1, 1]);
			const flask2 = generateFlask(0, [1, 1, 2, 1]);
			expect(isFlasksSameColor(flask1, flask2)).toBeTrue();
		});
		it("true for non-equal non-empty same color flasks", () => {
			const flask1 = generateFlask(0, [1, 1, 1, 0]);
			const flask2 = generateFlask(0, [1, 1, 2, 1]);
			expect(isFlasksSameColor(flask1, flask2)).toBeTrue();
		});
		it("false for non-empty not same color flasks", () => {
			const flask1 = generateFlask(0, [1, 1, 1, 0]);
			const flask2 = generateFlask(0, [1, 1, 2, 2]);
			expect(isFlasksSameColor(flask1, flask2)).toBeFalse();
		});
		it("false for one empty flask and other non-empty flask", () => {
			const flask1 = generateFlask(0, [0, 0, 0, 0]);
			const flask2 = generateFlask(0, [1, 1, 2, 0]);
			expect(isFlasksSameColor(flask1, flask2)).toBeFalse();
		});
		it("true for both empty flasks", () => {
			const flask1 = generateFlask(0, [0, 0, 0, 0]);
			const flask2 = generateFlask(0, [0, 0, 0, 0]);
			expect(isFlasksSameColor(flask1, flask2)).toBeTrue();
		});
	});
	describe("getFlaskSameColorSipsCount returns", () => {
		it("flask sips count for full same-color flask", () => {
			expect(getFlaskSameColorSipsCount(generateFlask(0, [1, 1, 1, 1]))).toBe(4);
		});
		it("0 for empty flask", () => {
			expect(getFlaskSameColorSipsCount(generateFlask(0, [0, 0, 0, 0]))).toBe(0);
		});
		it("right value for full flask", () => {
			expect(getFlaskSameColorSipsCount(generateFlask(0, [1, 3, 3, 3]))).toBe(3);
		});
		it("right value for non-empty flask", () => {
			expect(getFlaskSameColorSipsCount(generateFlask(0, [1, 3, 3, 0]))).toBe(2);
		});
		it("right value for non-empty flask with no same sips at the end", () => {
			expect(getFlaskSameColorSipsCount(generateFlask(0, [1, 2, 3, 0]))).toBe(1);
		});
		it("right value for full flask with no same sips at the end", () => {
			expect(getFlaskSameColorSipsCount(generateFlask(0, [1, 2, 1, 2]))).toBe(1);
		});
	});
	describe("getLayoutAvailableMoves returns", () => {
		it("right value for simple level", () => {
			const simpleLayout = [
				generateFlask(0, [1, 1, 1, 1]),
				generateFlask(1, [1, 1, 1, 0])
			];
			expect(getAvailableMoves(simpleLayout))
				.toEqual(jasmine.arrayContaining([{ from: 0, to: 1 }]));
			expect(getAvailableMoves(simpleLayout))
				.not.toEqual(jasmine.arrayContaining([{ from: 1, to: 0 }]));
		});
		it("right value for medium level", () => {
			const simpleLayout = [
				generateFlask(0, [1, 1, 1, 0]),
				generateFlask(1, [1, 1, 1, 0])
			];
			expect(getAvailableMoves(simpleLayout))
				.toEqual(jasmine.arrayContaining([{ from: 0, to: 1 }]));
			expect(getAvailableMoves(simpleLayout))
				.toEqual(jasmine.arrayContaining([{ from: 1, to: 0 }]));
		});
		it("right value for complex level", () => {
			const simpleLayout = [
				generateFlask(0, [1, 1, 2, 0]),
				generateFlask(1, [1, 1, 1, 0]),
				generateFlask(2, [1, 1, 1, 2]),
				generateFlask(3, [0, 0, 0, 0])
			];
			expect(getAvailableMoves(simpleLayout))
				.toEqual(jasmine.arrayContaining([{ from: 0, to: 3 }]));
			expect(getAvailableMoves(simpleLayout))
				.toEqual(jasmine.arrayContaining([{ from: 1, to: 3 }]));
			expect(getAvailableMoves(simpleLayout))
				.toEqual(jasmine.arrayContaining([{ from: 2, to: 0 }]));
			expect(getAvailableMoves(simpleLayout))
				.toEqual(jasmine.arrayContaining([{ from: 2, to: 3 }]));
		});
	});
	describe("isPuzzleSolved returns", () => {
		it("true for simple solved puzzle", () => {
			const simpleLayout = [
				generateFlask(0, [1, 1, 1, 1]),
				generateFlask(1, [0, 0, 0, 0])
			];
			expect(isPuzzleSolved(simpleLayout)).toBeTrue();
		});
		it("true for complex solved puzzle", () => {
			const simpleLayout = [
				generateFlask(0, [1, 1, 1, 1]),
				generateFlask(1, [2, 2, 2, 2]),
				generateFlask(2, [3, 3, 3, 3]),
				generateFlask(3, [4, 4, 4, 4]),
				generateFlask(4, [1, 1, 1, 1]),
				generateFlask(5, [5, 5, 5, 5]),
				generateFlask(6, [0, 0, 0, 0]),
				generateFlask(7, [0, 0, 0, 0]),
			];
			expect(isPuzzleSolved(simpleLayout)).toBeTrue();
		});
		it("false for simple unsolved puzzle", () => {
			const simpleLayout = [
				generateFlask(0, [1, 1, 1, 0]),
				generateFlask(1, [1, 0, 0, 0])
			];
			expect(isPuzzleSolved(simpleLayout)).toBeFalse();
		});
		it("false for complex unsolved puzzle", () => {
			const simpleLayout = [
				generateFlask(0, [1, 1, 1, 1]),
				generateFlask(1, [2, 2, 2, 2]),
				generateFlask(2, [3, 3, 3, 3]),
				generateFlask(3, [5, 4, 4, 4]),
				generateFlask(4, [1, 1, 1, 1]),
				generateFlask(5, [5, 4, 5, 5]),
				generateFlask(6, [0, 0, 0, 0]),
				generateFlask(7, [0, 0, 0, 0]),
			];
			expect(isPuzzleSolved(simpleLayout)).toBeFalse();
		});
	});
	describe("getFirstAvailableColorIndexForSourceFlask returns", () => {
		it("-1 for empty flask", () => {
			expect(getFirstAvailableColorIndexForSourceFlask(generateFlask(1, [0, 0, 0, 0])))
				.toBe(-1);
		});
		it("right value for full flask", () => {
			expect(getFirstAvailableColorIndexForSourceFlask(generateFlask(1, [4, 4, 4, 4])))
				.toBe(3);
		});
		it("right value for non-full flask", () => {
			expect(getFirstAvailableColorIndexForSourceFlask(generateFlask(1, [4, 4, 0, 0])))
				.toBe(1);
		});
	});
	describe("moveSingleSip moves single sip", () => {
		it("from full flask to empty flask", () => {
			const flaskSource = generateFlask(0, [1, 2, 3, 4]);
			const flaskTarget = generateFlask(1, [0, 0, 0, 0]);
			expect(moveSingleSip(flaskSource, flaskTarget))
				.toEqual(jasmine.objectContaining({
					newFlaskSource: { flaskIndex: 0, sips: [1, 2, 3, 0] },
					newFlaskTarget: { flaskIndex: 1, sips: [4, 0, 0, 0] }
				}));
		});
		it("from full flask to non-empty flask", () => {
			const flaskSource = generateFlask(0, [1, 2, 3, 4]);
			const flaskTarget = generateFlask(1, [2, 0, 0, 0]);
			expect(moveSingleSip(flaskSource, flaskTarget))
				.toEqual(jasmine.objectContaining({
					newFlaskSource: { flaskIndex: 0, sips: [1, 2, 3, 0] },
					newFlaskTarget: { flaskIndex: 1, sips: [2, 4, 0, 0] }
				}));
		});
		it("from non-empty flask to non-empty flask", () => {
			const flaskSource = generateFlask(0, [1, 2, 3, 0]);
			const flaskTarget = generateFlask(1, [2, 0, 0, 0]);
			expect(moveSingleSip(flaskSource, flaskTarget))
				.toEqual(jasmine.objectContaining({
					newFlaskSource: { flaskIndex: 0, sips: [1, 2, 0, 0] },
					newFlaskTarget: { flaskIndex: 1, sips: [2, 3, 0, 0] }
				}));
		});
	});
	describe("makeAMove makes right move", () => {
		it("from single element flask to empty flask", () => {
			const flaskSource = generateFlask(0, [1, 0, 0, 0]);
			const flaskTarget = generateFlask(1, [0, 0, 0, 0]);
			expect(makeAMove([flaskSource, flaskTarget], { from: 0, to: 1 }))
				.toEqual(jasmine.arrayContaining([
					{ flaskIndex: 0, sips: [0, 0, 0, 0] }
				]));
			expect(makeAMove([flaskSource, flaskTarget], { from: 0, to: 1 }))
				.toEqual(jasmine.arrayContaining([
					{ flaskIndex: 1, sips: [1, 0, 0, 0] }
				]));
		});
		it("from two non-same color element flask to empty flask", () => {
			const flaskSource = generateFlask(0, [1, 2, 0, 0]);
			const flaskTarget = generateFlask(1, [0, 0, 0, 0]);
			expect(makeAMove([flaskSource, flaskTarget], { from: 0, to: 1 }))
				.toEqual(jasmine.arrayContaining([
					{ flaskIndex: 0, sips: [1, 0, 0, 0] }
				]));
			expect(makeAMove([flaskSource, flaskTarget], { from: 0, to: 1 }))
				.toEqual(jasmine.arrayContaining([
					{ flaskIndex: 1, sips: [2, 0, 0, 0] }
				]));
		});
		it("from two non-same color element flask to non-empty flask", () => {
			const flaskSource = generateFlask(0, [1, 2, 0, 0]);
			const flaskTarget = generateFlask(1, [3, 2, 0, 0]);
			expect(makeAMove([flaskSource, flaskTarget], { from: 0, to: 1 }))
				.toEqual(jasmine.arrayContaining([
					{ flaskIndex: 0, sips: [1, 0, 0, 0] }
				]));
			expect(makeAMove([flaskSource, flaskTarget], { from: 0, to: 1 }))
				.toEqual(jasmine.arrayContaining([
					{ flaskIndex: 1, sips: [3, 2, 2, 0] }
				]));
		});
		it("from full non-same element flask to non-empty flask", () => {
			const flaskSource = generateFlask(0, [1, 2, 3, 4]);
			const flaskTarget = generateFlask(1, [3, 4, 0, 0]);
			expect(makeAMove([flaskSource, flaskTarget], { from: 0, to: 1 }))
				.toEqual(jasmine.arrayContaining([
					{ flaskIndex: 0, sips: [1, 2, 3, 0] }
				]));
			expect(makeAMove([flaskSource, flaskTarget], { from: 0, to: 1 }))
				.toEqual(jasmine.arrayContaining([
					{ flaskIndex: 1, sips: [3, 4, 4, 0] }
				]));
		});
		it("from full same element flask to non-empty flask", () => {
			const flaskSource = generateFlask(0, [3, 3, 3, 3]);
			const flaskTarget = generateFlask(1, [3, 0, 0, 0]);
			expect(makeAMove([flaskSource, flaskTarget], { from: 0, to: 1 }))
				.toEqual(jasmine.arrayContaining([
					{ flaskIndex: 0, sips: [3, 0, 0, 0] }
				]));
			expect(makeAMove([flaskSource, flaskTarget], { from: 0, to: 1 }))
				.toEqual(jasmine.arrayContaining([
					{ flaskIndex: 1, sips: [3, 3, 3, 3] }
				]));
		});
		it("from full same element flask to full same element flask", () => {
			const flaskSource = generateFlask(0, [3, 3, 3, 3]);
			const flaskTarget = generateFlask(1, [3, 3, 3, 3]);
			expect(makeAMove([flaskSource, flaskTarget], { from: 0, to: 1 }))
				.toEqual(jasmine.arrayContaining([
					{ flaskIndex: 0, sips: [3, 3, 3, 3] }
				]));
			expect(makeAMove([flaskSource, flaskTarget], { from: 0, to: 1 }))
				.toEqual(jasmine.arrayContaining([
					{ flaskIndex: 1, sips: [3, 3, 3, 3] }
				]));
		});
		it("and moves two same-color sips to other flask", () => {
			const flaskSource = generateFlask(0, [3, 2, 2, 0]);
			const flaskTarget = generateFlask(1, [2, 0, 0, 0]);
			expect(makeAMove([flaskSource, flaskTarget], { from: 0, to: 1 }))
				.toEqual(jasmine.arrayContaining([
					{ flaskIndex: 0, sips: [3, 0, 0, 0] }
				]));
			expect(makeAMove([flaskSource, flaskTarget], { from: 0, to: 1 }))
				.toEqual(jasmine.arrayContaining([
					{ flaskIndex: 1, sips: [2, 2, 2, 0] }
				]));
		});
		it("and moves only one sip to empty flask", () => {
			const flaskSource = generateFlask(0, [1, 2, 1, 2]);
			const flaskTarget = generateFlask(1, [0, 0, 0, 0]);
			const newLayout = makeAMove([flaskSource, flaskTarget], { from: 0, to: 1 });
			expect(newLayout).toEqual(jasmine.arrayContaining([
				{ flaskIndex: 0, sips: [1, 2, 1, 0] }
			]));
			expect(newLayout).toEqual(jasmine.arrayContaining([
				{ flaskIndex: 1, sips: [2, 0, 0, 0] }
			]));
		});
	});
});
