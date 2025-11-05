const toggleValToUserText = {
	metric: 'Metric',
	unitLong: 'Full',
	unitShort: 'Short',
	us: 'US'
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
