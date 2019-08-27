import axios from './axios';

export default {
    getApplyCredit: ()=>{
        return axios({
            method:'get',
            url: '/applyCredit'
        })
    }
}