const stateValToUserText = {
	metric: 'Metric',
	us: 'US / Imperial',
	unitLong: 'Full',
	unitShort: 'Short'
};

function createNewMap() {
	const newMap = {};
	for (const [key, val] of Object.entries(stateValToUserText)) {
		newMap[val] = key;
	}
	return newMap;
}

const newMap = createNewMap();
export { stateValToUserText as config, newMap as configReverse };
