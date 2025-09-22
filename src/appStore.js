import { createStateStore } from './event/store.js';

const cayenneStateStore = createStateStore({
	measureSystem: 'metric'
});

export { cayenneStateStore as appStore };
