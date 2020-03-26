import axios from 'axios'

const instance = axios.create({
    baseURL:'/',
    timeout: 60000,
    responseType: 'json',
    headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
    transformRequest: [
        function (data) {
            let ret = '';
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
        }
    ],
    transformResponse: [
        function (data) {
            if (typeof data === 'string') {
                try {
                    data = JSON.parse(data)
                } catch(e) {
                    console.log(data)
                    console.error('request error', e)
                }
            }
            return data
        }
    ],
});

instance.interceptors.request.use(config => {
  // const token = JSON.parse(sessionStorage.userInfo).access_token;
              // token && (config.headers.Authorization = 'Bearer '+token);
              return config;
      },
      error => {
          return Promise.reject(error);
});

instance.interceptors.response.use(
  // function(res){
  // //相应拦截器
  // return res.data;
// }
  response => {
      return response.data;
  },
  error => {
      sessionStorage.clear();
      window.location.href="/personal/login"
      return Promise.reject(error.response)  // 返回接口返回的错误信息
  }
);

export function get({url, data, config}: any) {
  const getConfig = {}
    if (data) {
      Object.assign(getConfig, {
        data
      })
    }
    if (config) Object.assign(getConfig, config)
  return instance.get(url, getConfig)
}

export function post({url, data, config}: any) {
  return instance.post(url, data, config)
}


export default service