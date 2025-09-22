import CayenneEventEmitter from './eventEmitter.js';
import { createStateStore } from './store.js';

const stateEmitter = new CayenneEventEmitter();

const stateStore = createStateStore();

export { stateEmitter };
