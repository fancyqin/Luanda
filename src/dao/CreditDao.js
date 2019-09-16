import axios from './axios';
import setting from '@/setting';
import message from '@/components/message';
import qs from 'qs';
const getAxios = axios.create({
    baseURL: setting.server
});

const postAxios = axios.create({
    baseURL:setting.server
})

//get请求，判断10002时身份不符，返回403
getAxios.interceptors.response.use(function(res){
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
        return getAxios({
            method:'get',
            url: '/applyCredit'
        })
    },
    postApplyCredit: data=>{
        return postAxios({
            method:'post',
            url:'/submitApplyCredit',
            headers: {'X-Requested-With': 'XMLHttpRequest',
            'Content-Type':'application/x-www-form-urlencoded'},
            data:qs.stringify(data)
        })
    },
    getCreditInfo: ()=>{
        return getAxios({
            method:"get",
            url:"/getUserCreditInfo"
        })
    },
    getBillList: ()=>{
        return getAxios({
            method:'get',
            url:'/getBillList'
        })
    },
    getHistoryList: ()=>{
        return getAxios({
            method:'get',
            url:'/getHistoryBills'
        })
    }
}