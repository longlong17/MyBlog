import request from '@/utils/request';

//获取文章
export function findBlog(page=1,limit=10){
  return request({
    url:'/api/blog',
    method: "get",
    params : {
        page,
        limit,
    }
  })
}
//发送文章
export function addBlog(data) {
  return request({
      url: `/api/blog`,
      method: 'post',
      data,
  })
}

//删除文章

export function deleteBlog(id){
    return request({
      url:`/api/blog/${id}`,
      method: "delete",
    })
  }


  //编辑文章

  export function editBlog(blogInfo){
    return request({
      url:`/api/blog/${blogInfo.id}`,
      method: 'put',
      data : blogInfo.data,
    })
  }


  //根据id查找文章

  export function findOneBlog(id){
    return request({
       url:`api/blog/${id}`,
       method:"get",
    })
  }