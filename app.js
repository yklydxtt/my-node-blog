const querystring = require("querystring");
const handleBlogRouter = require("./src/router/blog");
const handleUserRouter = require("./src/router/user");
const { set, get } = require("./src/db/redis");
const { access } = require('./src/util/log');

// 获取cookie过期时间
const getCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
  console.log("d.toGMTString() is", d.toGMTString());
  return d.toGMTString();
};

// 用于处理post data
const getPostData = req => {
  const promise = new Promise((resolve, reject) => {
    if (req.method !== "POST") {
      resolve({});
      return;
    }
    if (req.headers["content-type"].indexOf("application/json") === -1) {
      resolve({});
      return;
    }
    let postData = "";
    req.on("data", chunk => {
      postData += chunk.toString();
    });
    req.on("end", () => {
      if (!postData) {
        resolve({});
        return;
      }
      resolve(JSON.parse(postData));
      return;
    });
  });
  return promise;
};
const serverHandle = (req, res) => {
  // 记录access log
  access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`);

  // 设置返回格式json
  res.setHeader("Content-type", "application/json");

  //获取path
  const url = req.url;
  req.path = url.split("?")[0];

  // 解析cookie
  req.cookie = {};
  const cookieStr = req.headers.cookie || "";
  cookieStr.split(";").forEach(item => {
    if (!item) {
      return;
    }
    const arr = item.split("=");
    const key = arr[0].trim();
    const val = arr[1];
    console.log(key, val);
    req.cookie[key] = val;
  });
  console.log("cookie is", req.cookie);

  // 解析session
  let needSetCookie = false;
  let userId = req.cookie.userId;
  if (!userId) {
    needSetCookie = true;
    userId = `${Date.now()}_${Math.random()}`;
    set(userId, {});
  }
  req.sessionId = userId;
  get(req.sessionId)
    .then(sessionData => {
      if (sessionData == null) {
        // 初始化redis中的值
        set(req.sessionId, {});
        // 设置session
        req.session = {};
      } else {
        // 设置session
        req.session = sessionData;
      }
      return getPostData(req);
    })
    .then(postData => {
      // 处理 post data
      req.body = postData;

      // 处理 blog 路由
      const blogResult = handleBlogRouter(req, res);
      if (blogResult) {
        blogResult.then(blogData => {
          if (needSetCookie) {
            res.setHeader(
              "Set-Cookie",
              `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`
            );
          }
          res.end(JSON.stringify(blogData));
        });
        return;
      }

      // 处理user路由
      const userResult = handleUserRouter(req, res);
      if (userResult) {
        if (needSetCookie) {
          res.setHeader(
            "Set-Cookie",
            `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`
          );
        }
        userResult.then(userData => {
          res.end(JSON.stringify(userData));
        });
        return;
      }

      // 未命中路由返回404
      res.writeHead(404, { "Content-type": "text/plain" });
      res.write("404 not found");
      res.end();
    });

  // 解析query
  req.query = querystring.parse(url.split("?")[1]);
};
module.exports = serverHandle;
