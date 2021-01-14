const { exec, escape } = require("../db/mysql");

const getList = (author, keyword) => {
  let sql = `SELECT * FROM blogs WHERE 1=1 `;
  if (author) {
    author = escape(author);
    sql += `and author=${author} `;
  }
  if (keyword) {
    keyword = escape(keyword);
    sql += `and title like '%${keyword}%' `;
  }
  sql += `ORDER BY createtime desc;`;
  console.log(sql);
  // 返回 promise
  return exec(sql);
};
const getDetail = id => {
  id = escape(id);
  const sql = `select * from blogs where id=${id}`;
  return exec(sql);
};

const newBlog = (blogData = {}) => {
  // blogData是一个博客对象包含 title、content、author 属性
  let { title, content, author } = blogData;
  const createTime = Date.now();
  title = escape(title);
  content = escape(content);
  author = escape(author);
  let sql = `insert into blogs (title,content,createTime,author)
  values (${title},${content},'${createTime}',${author})
  `;
  console.log(sql);
  return exec(sql).then(insertData => {
    console.log(insertData, "insertData");
    return {
      id: insertData.insertId,
    };
  }).catch(() => false);
};

const updateBlog = (id, blogData = {}) => {
  // blogData是一个博客对象包含 title、content 属性
  let { title, content } = blogData;
  title = escape(title);
  content = escape(content);
  let sql = `update blogs set title=${title},content=${content} where id=${id}`;
  return exec(sql).then(updateData => {
    console.log("updateData is", updateData);
    if (updateData.affectedRows > 0) {
      return true;
    }
    return false;
  }).catch(() => false);
};

const delBlog = (id, author) => {
  author = escape(author);
  const sql = `delete from blogs where id=${id} and author=${author}`;
  return exec(sql).then(deleteData => {
    console.log("deleteData is", deleteData);
    if (deleteData.affectedRows > 0) {
      return true;
    }
    return false;
  }).catch(() => false);
};
module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog,
};
