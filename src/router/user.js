const { login } = require("../controller/user");
const { SuccessModel, ErrorModel } = require("../model/resModel");
const handleUserRouter = (req, res) => {
  const { method, url } = req;
  const path = url.split("?")[0];

  // 登录
  if (method === "GET" && path === "/api/user/login") {
    // const { username, password } = req.body;
    const { username, password } = req.query;
    const result = login(username, password);
    return result.then(data => {
      console.log(data, "data");
      if (data.username) {
        // 操作cookie
        res.setHeader("Set-Cookie", `username=${data.username}; path=/; httpOnly`);
        return new SuccessModel();
      }
      return new ErrorModel("用户名或密码错误");
    });
  }

  // 登录的验证测试
  if (method === "GET" && req.path === "/api/user/login-test") {
    if (req.cookie.username) {
      return Promise.resolve(new SuccessModel(req.cookie.username));
    }
    return Promise.resolve(new ErrorModel("尚未登录"));
  }
};
module.exports = handleUserRouter;
