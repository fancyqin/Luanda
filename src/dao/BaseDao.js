// Copyright 2018 FOCUS Inc.All Rights Reserved.

import setting from '../setting';
const qs = require('qs');
import { isArray } from '../utils';

const ERROR_NET_STATUS = [404, 500, 502, 503];

export default class BaseDao {
    constructor() {
        this.baseURL = setting.server;
    }
    request(requestArgs) {
        let requestTime = new Date().getTime();
        let { url, method, headers, params, data, file, access_token, enctype, interfaceTag, silent } = requestArgs;

        url = this.baseURL + (interfaceTag || i18n.interfaceTag()) + url;

        if (params) {
            url = url + '?' + paramsSerializer(params);
        }
        if (i18n.isMas()) {
            this.headers.site = '22';
        }
        this.headers.deviceNo = global.DEVICE_ID;
        setting.isDebug && console.log('Request:' + url, {
            headers: {...this.headers, ...headers, ...{ Authorization:(access_token || global.AUTH_TOKEN) }},
            params,
            data,
            file
        });

        return new Promise(async (resolve, reject) => {
            try {
                let task = fetch(method, url, {
                    ...this.headers,
                    ...headers,
                    Authorization: (access_token || global.AUTH_TOKEN || ''),
                    'Content-Type': method === 'POST' ? (enctype ? enctype : 'multipart/form-data') :'application/json'
                }, transFormData(data, file));

                let timer = setTimeout(() => {
                    this.requestError(task, url, reject, null, silent);
                }, setting.fetchTimeOut);

                task.then((data) => {
                    // 网络异常直接触发超时流程
                    if (data && ERROR_NET_STATUS.indexOf(data.respInfo.status) !== -1) {
                        this.requestError(task, url, reject, data.respInfo.status, silent);
                        return;
                    }

                    timer && clearTimeout(timer);
                    try {
                        setting.isDebug && console.log('Response:'+ url, data.json());
                        actionGlobal(requestArgs, data.json(), this.navigation, resolve, reject);
                    } catch (err) {
                        reject(err);
                        Tips.netError(NET_ERROR_MSG.parse);
                    }
                }).catch(err => {
                    err = err + '';
                    NetInfo.getConnectionInfo().then((connectionInfo) => {
                        Tips.netError(connectionInfo.type === 'none'?NET_ERROR_MSG.offline:NET_ERROR_MSG.parse)
                        reject(err);
                    });
                    
                });
            } catch(err) {
                Tips.netError(NET_ERROR_MSG.parse)
                reject(err);
            }
        });
    }

    /**
     *
     * @param options
     * @returns {Promise<any> | Promise}
     */
    requestWithToken(options) {
        return new Promise((resolve, reject) => {
            tokenManager.token.then(accessToken=> {

                if(!("nextRedirect" in options)) {
                    options.nextRedirect = true;
                }

                let params;
                if(options.nextRedirect){
                    this.accessToken = accessToken;
                    params = { ...options, access_token: accessToken }
                }else{
                    params = !!accessToken? { ...options, access_token: accessToken }: {...options};
                }

                this.request(params).then(resolve).catch(reject);
            }).catch(err=> {
                reject('token get error:'+ err);
            });
        });
    }

    requestError(task, url, reject, netErrorStatus, silent) {
        task && task.cancel();
        let logInfo = 'Fetch uri over time:'+ url;

        if (netErrorStatus) {
            logInfo = 'Fetch server error '+ netErrorStatus +':'+ url;
            Tips.netError(NET_ERROR_MSG.service)
        }else if(!silent){
            Tips.netError(NET_ERROR_MSG.timeout);
        }
        setting.isDebug && console.log(logInfo);
        reject(logInfo);
    }
}

/**
 * 请求参数序列化
 * @param {Object} params - 请求参数
 * @returns {string}
 */
function paramsSerializer(params) {
    return qs.stringify(params, { arrayFormat: 'repeat' })
}

function transFormData(data, file) {
    let result = [];
    for (let key in data) {
        if (data[key] !== null && typeof data[key] !== 'undefined') {
            if (isArray(data[key])) {
                data[key].forEach((item)=> {
                    result.push({
                        name: key,
                        data: (typeof item === 'string' ? item.replace(/\u00a0/g, ' ') : item)
                    });
                })
            } else {
                result.push({
                    name: key,
                    data: (typeof data[key] === 'string' ? data[key].replace(/\u00a0/g, ' ') : data[key])
                });
            }
        }
    }


    if (result.length === 0) {
        return null;
    }

    return result;
}

