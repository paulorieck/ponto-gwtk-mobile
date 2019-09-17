import axios from 'axios';
const axiosCookieJarSupport = require('@3846masa/axios-cookiejar-support');
const {CookieJar} = require('tough-cookie');

let instance = axios.create({
    baseURL: `https://ponto.gwtk.com.br/server/`,
    withCredentials: true
});

axiosCookieJarSupport(instance);
instance.defaults.jar = new CookieJar();

export default instance;