const { login } = require("../controller/user");
const { SuccessModel, ErrorModel } = require("../model/resModel");
const { set, get } = require("../db/redis");

const handleUserRouter = (req, res) => {
  const { method, url } = req;
  const path = url.split("?")[0];

  // 登录
  if (method === "POST" && path === "/api/user/login") {
    const { username, password } = req.body;
    // const { username, password } = req.query;
    const result = login(username, password);
    return result.then(data => {
      if (data.username) {
        // 设置session
        req.session={};
        req.session.username = data.username;
        req.session.realname = data.realname;
        // 同步到redis
        set(req.sessionId, req.session);
        return new SuccessModel();
      }
      return new ErrorModel("用户名或密码错误");
    });
  }
};
module.exports = handleUserRouter;
