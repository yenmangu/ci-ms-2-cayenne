import CayenneEventEmitter from './eventEmitter.js';
import { createStateStore } from './stateStore.js';

const stateEmitter = new CayenneEventEmitter();

const stateStore = createStateStore();

export { stateEmitter };
