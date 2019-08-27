import axios from 'axios';
import setting from '@/setting';
import { isArray } from '@/utils';

export const transFormData = data => {
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

const instance = axios.create({
    baseURL: setting.server
})

instance.defaults.timeout = setting.timeout;


export default instance