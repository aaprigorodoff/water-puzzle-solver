const derevo = [
	{ nodeId: 0, parentId: -1 },
	{ nodeId: 1, parentId: 0 },
	{ nodeId: 2, parentId: 0 },
	{ nodeId: 3, parentId: 1 },
	{ nodeId: 4, parentId: 1 },
	{ nodeId: 5, parentId: 2 },
	{ nodeId: 6, parentId: 2 },
	{ nodeId: 7, parentId: 2 },
	{ nodeId: 8, parentId: 6 },
];

// const getParent = node => node.parentId;

const getChildren = (currentNode, tree) => tree.filter(node => node.parentId === currentNode.nodeId);

const result = [];

const solve = (currentNode, tree) => {
	if (!result.some(res => res === currentNode.nodeId)) {
		result.push(currentNode.nodeId);
	}
	const goodChildren = getChildren(currentNode, tree)
		.filter(child => !isChildBad(child.nodeId));
	if (goodChildren && goodChildren.length > 0) {
		solve(goodChildren[0], tree);
	} else {
		badChildrenIds.push(currentNode.nodeId);
		if (currentNode.nodeId !== 0) { solve(tree.find(node => node.nodeId === currentNode.parentId), tree); }
	}
};

solve(derevo[0], derevo);

console.log(result.toString());
