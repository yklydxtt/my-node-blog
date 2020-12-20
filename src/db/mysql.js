const mysql = require("mysql");
const { MYSQL_CONF } = require("../config/db");
// 创建链接对象
const con = mysql.createConnection(MYSQL_CONF);

// 开始连接
con.connect();

// 统一执行sql的函数
function exec(sql) {
  const promise = new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) {
        console.error(err,'err');
        reject(err);
        return;
      }
      resolve(result);
      console.log(result);
    });
  });
  return promise;
}

// con.end();

module.exports = {
  exec,
};
