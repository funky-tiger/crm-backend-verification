const configs = {
  // 测试环境
  test: {
    API_SERVER: 'http://172.30.0.14:8080',
  },

  // 开发环境
  development: {
    API_SERVER: 'http://129.28.149.200:8080',
    // API_SERVER: 'http://172.30.0.10:8080',
  },

  // 本地
  local: {
    API_SERVER: 'http://129.28.149.200:8080',
  },
};

console.log(process.env.API_ENV);

export default configs;
