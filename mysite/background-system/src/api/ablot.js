import request from '@/utils/request'

export function getAblot(){
    return request.get('/api/about');
}


export function setAblot(data){
   return request({
    url : '/api/about',
    method : 'post',
    data,
   })
}