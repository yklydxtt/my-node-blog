const querystring = require("querystring");
const handleBlogRouter = require("./src/router/blog");
const handleUserRouter = require("./src/router/user");

// 用于处理post data
const getPostData = req => {
  const promise = new Promise((resolve, reject) => {
    if (req.method !== "POST") {
      resolve({});
      return;
    }
    if (req.headers["content-type"] !== "application/json") {
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
    console.log(key,val);
    req.cookie[key] = val;
  });
  console.log("cookie is", req.cookie);

  // 解析query
  req.query = querystring.parse(url.split("?")[1]);

  // 处理 post data
  getPostData(req).then(postData => {
    req.body = postData;

    // 处理 blog 路由
    const blogResult = handleBlogRouter(req, res);
    if (blogResult) {
      blogResult.then(blogData => {
        res.end(JSON.stringify(blogData));
      });
      return;
    }

    // 处理user路由
    const userResult = handleUserRouter(req, res);
    if (userResult) {
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
};
module.exports = serverHandle;
