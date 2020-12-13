const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require("../controller/blog");
const { SuccessModel, ErrorModel } = require("../model/resModel");
const handleBlogRouter = (req, res) => {
  const { method, url } = req;
  const path = url.split("?")[0];
  const id = req.query.id || "";

  // 获取博客列表
  if (method === "GET" && path === "/api/blog/list") {
    const author = req.query.author || "";
    const keyword = req.query.keyword || "";
    const listData = getList(author, keyword);
    return new SuccessModel(listData);
  }

  // 获取博客详情
  if (method === "GET" && path === "/api/blog/detail") {
    const detailData = getDetail(id);
    return new SuccessModel(detailData);
  }

  // 新建一篇博客
  if (method === "POST" && path === "/api/blog/new") {
    const blogData = req.body;
    const data = newBlog(blogData);
    return new SuccessModel(data);
  }

  // 更新一篇博客
  if (method === "POST" && path === "/api/blog/update") {
    const blogData = req.body;
    const result = updateBlog(id, blogData);
    if (result) {
      return new SuccessModel(result);
    }
    return ErrorModel("更新博客失败");
  }

  // 删除一篇博客
  if (method === "POST" && path === "/api/blog/delete") {
    const blogData = req.body;
    const result = delBlog(id);
    if (result) {
      return new SuccessModel(result);
    }
    return ErrorModel("删除博客失败");
  }
};
module.exports = handleBlogRouter;
