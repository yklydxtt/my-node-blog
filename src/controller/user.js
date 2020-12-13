const loginCheck = (username, password) => {
  if (username === "张三" && password === "123") {
    return true;
  }
  return false;
};
module.exports = { loginCheck };
