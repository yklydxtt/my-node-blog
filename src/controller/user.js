const { exec, escape } = require("../db/mysql");
const { genPassword } = require('../util/cryp');

const login = (username, password) => {
  // 密码加密
  password = genPassword(password);
  username = escape(username);
  password = escape(password);
  const sql = `select username, realname from users where username=${username} and password=${password}`;
  return exec(sql).then(rows => {
    console.log(rows, 'rows');
    return rows[0] || {};
  }).catch(() => false);
};
module.exports = { login };
