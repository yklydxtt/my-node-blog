const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog,
} = require("../controller/blog");
const { SuccessModel, ErrorModel } = require("../model/resModel");

// 登录验证
const loginCheck = req => {
  if (!req.session.username) {
    return Promise.resolve(new ErrorModel("not login"));
  }
};

const handleBlogRouter = (req, res) => {
  const { method, url } = req;
  const path = url.split("?")[0];
  const id = req.query.id || "";

  // 获取博客列表
  if (method === "GET" && path === "/api/blog/list") {
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      // 未登录
      return loginCheckResult;
    }
    const author = req.query.author || "";
    const keyword = req.query.keyword || "";
    const result = getList(author, keyword);
    return result.then(listData => {
      return new SuccessModel(listData);
    });
  }

  // 获取博客详情
  if (method === "GET" && path === "/api/blog/detail") {
    const result = getDetail(id);
    return result.then(detailData => {
      return new SuccessModel(detailData);
    });
  }

  // 新建一篇博客
  if (method === "POST" && path === "/api/blog/new") {
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      // 未登录
      return loginCheckResult;
    }
    req.body.author = req.session.username;
    const result = newBlog(req.body);
    return result.then(data => {
      return new SuccessModel(data);
    });
  }

  // 更新一篇博客
  if (method === "POST" && path === "/api/blog/update") {
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      // 未登录
      return loginCheckResult;
    }
    const blogData = req.body;
    const result = updateBlog(id, blogData);
    return result.then(val => {
      if (val) {
        return new SuccessModel(result);
      }
      return new ErrorModel("更新博客失败");
    });
  }

  // 删除一篇博客
  if (method === "POST" && path === "/api/blog/delete") {
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      // 未登录
      return loginCheckResult;
    }
    req.body.author = req.session.username;
    const result = delBlog(id, req.body.author);
    return result.then(val => {
      if (val) {
        return new SuccessModel(result);
      }
      return new ErrorModel("删除博客失败");
    });
  }
};
module.exports = handleBlogRouter;
