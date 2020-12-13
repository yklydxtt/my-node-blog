const getList = (author, keyword) => {
  // 先返回假数据（格式是正确的）
  return [
    {
      id: 1,
      title: "标题A",
      content: "内容A",
      createTime: 1607824783126,
      author: "张三",
    },
    {
      id: 2,
      title: "标题B",
      content: "内容B",
      createTime: 1607824783127,
      author: "李四",
    },
  ];
};

const getDetail = id => {
  // 先返回假数据
  return {
    id: 1,
    title: "标题A",
    content: "内容A",
    createTime: 1607824783126,
    author: "张三",
  };
};

const newBlog = (blogData = {}) => {
  // blogData是一个博客对象包含title、content
  return {
    id: 3,
  };
};

const updateBlog = (id, blogData = {}) => {
  // blogData是一个博客对象包含title、content
  return true;
};

const delBlog = id => {
  return true;
};
module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
};
