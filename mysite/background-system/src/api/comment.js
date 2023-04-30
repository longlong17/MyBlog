import request from "@/utils/request";
//评论api
//获取评论
export function getComment(page = 1, limit = 10, blogid = -1) {
  return request({
    url: "/api/comment",
    method: "get",
    params: {
      page,
      limit,
      blogid,
    },
  });
}

// 删除评论

export function deltComment(id) {
  return request({
    url: "/api/comment/" + id,
    method: "delete",
  });
}
