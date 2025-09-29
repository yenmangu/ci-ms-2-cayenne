const toggleValToUserText = {
	metric: 'Metric',
	us: 'US',
	unitLong: 'Full',
	unitShort: 'Short'
};

function createNewMap() {
	const newMap = {};
	for (const [key, val] of Object.entries(toggleValToUserText)) {
		newMap[val] = key;
	}
	return newMap;
}

const newMap = createNewMap();
export { toggleValToUserText as config, newMap as configReverse };
