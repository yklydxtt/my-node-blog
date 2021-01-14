const redis = require("redis");
const { REDIS_CONF } = require("../config/db");

// 创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);
redisClient.on("error", err => {
  console.log(err);
});
function set(key, val) {
  if (typeof val === "object") {
    val = JSON.stringify(val);
  }
  redisClient.set(key, val, redis.print);
}
function get(key) {
  const promise = new Promise((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      if (err) {
        reject(err);
      }
      if (key === null) {
        resolve(null);
      }
      try {
        resolve(JSON.parse(val));
      } catch (ex) {
        reject(ex);
      }
    });
  });
  return promise;
}

module.exports = {
  set,
  get,
};
