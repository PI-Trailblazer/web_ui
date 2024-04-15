let HOST, BASE_URL, WS_SCHEME;

const scheme = {
    HTTP: 'http://',
    HTTPS: 'https://',
};

if (import.meta.env.PROD) {
    HOST = 'www.google.com';
    BASE_URL = `${scheme.HTTPS}${HOST}`;
} else {
    HOST = 'localhost';
    BASE_URL = `${scheme.HTTP}${HOST}`;
}

const config = {
    PRODUCTION: import.meta.env.PROD,
    HOST,
    BASE_URL,
    API_USER_URL: `${BASE_URL}/api/user`,
    API_OFFER_URL: `${BASE_URL}/api/offer`,
    API_RECOMMENDER_URL: `${BASE_URL}/api/recommender`,
};

export default config;
