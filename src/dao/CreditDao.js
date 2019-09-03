import axios from './axios';

export default {
    getApplyCredit: ()=>{
        return axios({
            method:'get',
            url: '/applyCredit'
        })
    },
    getCreditInfo: ()=>{
        return axios({
            method:"get",
            url:"/getUserCreditInfo"
        })
    },
    getBillList: ()=>{
        return axios({
            method:'get',
            url:'/getBillList'
        })
    }
}