import axios from 'axios'
import router from '@/router'
import storage from '@/utils/storage'
import { Message } from '@arco-design/web-vue'

const TOKEN_INVALID = 'Token认证失败,请重新登录';
const NETWORK_ERROR = '网络请求异常,请稍后重试';

// 生产环境直接使用完整URL
const BASE_URL = import.meta.env.PROD
    ? import.meta.env.VITE_API_BASE_URL 
    : '/api';
const service = axios.create({ baseURL: BASE_URL, timeout: 5000 })

service.interceptors.request.use((req) => {
    const token = storage.get('userToken');
    const headers = req.headers;
    if (!headers.Authorization) headers.Authorization = token;
    return req;
})

// 响应拦截器优化：统一错误处理和立即跳转
service.interceptors.response.use(
    (res) => {
        const { code, data, msg } = res.data;
        switch (code) {
            case 200:
                msg?.length && Message.success(msg);
                return data;
            case 204:
                msg?.length && Message.warning(msg);
                break;
            case 401:
                Message.error(msg || TOKEN_INVALID);
                storage.clear('userToken');
                setTimeout(() => {
                    router.push({ name: 'login' });
                }, 300);
                break;
            case 500:
                msg?.length && Message.error(msg);
                break;
            default:
                msg?.length && Message.error(msg);
        }

        return false
    },
    (err) => {
        Message.error(NETWORK_ERROR);
        return Promise.reject(err);
    }
)

function request(options) {
    options.method = options.method || 'get';
    if (options.method.toLowerCase() === 'get') {
        options.params = options.data;
    }
    return service(options);
}

['get', 'post', 'put', 'delete', 'patch'].forEach((item) => {
    request[item] = (url, data, options) => {
        return request({
            url,
            data,
            method: item,
            ...options,
        })
    }
})

export default request;

