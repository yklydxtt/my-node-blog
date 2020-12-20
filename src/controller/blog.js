const { exec } = require("../db/mysql");

const getList = (author, keyword) => {
  let sql = `SELECT * FROM blogs WHERE 1=1 `;
  if (author) {
    sql += `and author='${author}' `;
  }
  if (keyword) {
    sql += `and title like '%${keyword}%' `;
  }
  sql += `ORDER BY createtime desc;`;

  // 返回 promise
  return exec(sql);
};

const getDetail = id => {
  const sql = `select * from blogs where id=${id}`;
  return exec(sql);
};

const newBlog = (blogData = {}) => {
  // blogData是一个博客对象包含 title、content、author 属性
  const { title, content, author } = blogData;
  const createTime = Date.now();
  let sql = `insert into blogs (title,content,createTime,author)
  values ('${title}','${content}','${createTime}','${author}')
  `;
  return exec(sql).then(insertData => {
    console.log(insertData, "insertData");
    return {
      id: insertData.insertId,
    };
  });
};

const updateBlog = (id, blogData = {}) => {
  // blogData是一个博客对象包含 title、content 属性
  const { title, content } = blogData;
  let sql = `update blogs set title='${title}',content='${content}' where id=${id}`;
  return exec(sql).then(updateData => {
    console.log("updateData is", updateData);
    if (updateData.affectedRows > 0) {
      return true;
    }
    return false;
  });
};

const delBlog = (id, author) => {
  const sql = `delete from blogs where id=${id} and author='${author}'`;
  return exec(sql).then(deleteData => {
    console.log("deleteData is", deleteData);
    if (deleteData.affectedRows > 0) {
      return true;
    }
    return false;
  });
};
module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog,
};
