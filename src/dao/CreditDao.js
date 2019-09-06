import axios from './axios';
import setting from '@/setting';
import {message} from 'antd';
const creditAxios = axios.create({
    baseURL: setting.server
});

creditAxios.interceptors.response.use(function(res){
    const {code,data} = res.data;
    if(code==='10001'){
        return res.data
    }else if(code==='10002'){
        window.location.replace('/error/403');
    }else{
        message.error('Unknown Error.')
    }
});

export default {
    getApplyCredit: ()=>{
        return creditAxios({
            method:'get',
            url: '/applyCredit'
        })
    },
    postApplyCredit: data=>{
        return creditAxios({
            method:'post',
            url:'/submitApplyCredit',
            data
        })
    },
    getCreditInfo: ()=>{
        return creditAxios({
            method:"get",
            url:"/getUserCreditInfo"
        })
    },
    getBillList: ()=>{
        return creditAxios({
            method:'get',
            url:'/getBillList'
        })
    },
    getHistoryList: ()=>{
        return creditAxios({
            method:'get',
            url:'/getHistoryBills'
        })
    }
}