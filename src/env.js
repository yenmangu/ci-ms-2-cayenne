const PROD_HOSTNAMES = ['yenmangu.github.io'];

const env = {
	prod: {
		API_URL: 'https://ci-cayenne-proxy.vercel.app/api'
	},
	dev: {
		API_URL: 'http://127.0.0.1:3000/api'
	}
};

const isProd = PROD_HOSTNAMES.includes(window.location.hostname);
// export const ENV = isProd ? env.prod : env.dev;
export const ENV = env.prod;
export { isProd };
