import { appStore } from './appStore.js';

const PROD_HOSTNAMES = ['yenmangu.github.io'];

const env = {
	prod: {
		API_URL: 'https://ci-cayenne-proxy.vercel.app/api',
		HOME_URL: 'https://yenmangu.github.io/ci-ms-2-cayenne/'
	},
	dev: {
		API_URL: 'http://127.0.0.1:3000/api',
		// API_URL: 'https://ci-cayenne-proxy.vercel.app/api',
		HOME_URL: 'http://127.0.0.1:5500/',
		PROD_API: 'https://ci-cayenne-proxy.vercel.app/api'
	}
};

const isProd = PROD_HOSTNAMES.includes(window.location.hostname);
// export const ENV = isProd ? env.prod : env.dev;
// export const ENV = env.prod;
export const ENV = env.prod;
export const ENV_1 = isProd ? env.prod : env.dev;

const envConfig = {
	HOME_URL: '',
	API_URL: ''
};
/**
 *
 * @param {boolean} useRemoteApi
 * @returns
 */
export const setEnvConfig = useRemoteApi => {
	envConfig.HOME_URL = ENV_1.HOME_URL;
	envConfig.API_URL = useRemoteApi ? env.prod.API_URL : env.dev.API_URL;
};

export { isProd };

export const constants = {
	likedKey: 'LIKED_RECIPES'
};
