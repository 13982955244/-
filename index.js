const API = (function () {
  //网址

  const URL = "https://study.duyiedu.com"; //网址
  const TOKEN = "token"; //保持到本地浏览器的名字

  function get(url) {
    const headers = {}; //先给头部设置空对象
    const token = localStorage.getItem(TOKEN); //去浏览器本地拿保持的令牌
    // 判断是否有令牌如果有就给头部的authorization设置令牌
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    //返回接口
    return fetch(URL + url, { headers });
  }

  function post(url, bodyObj) {
    const headers = {
      "Content-Type": "application/json",
    };
    const token = localStorage.getItem(TOKEN); //获取浏览器本地存储令牌
    // 判断本地是否有令牌
    if (token) {
      // 如果有令牌,则将令牌放入头部中
      headers.authorization = `Bearer ${token}`;
    }
    // 返回接口
    return fetch(URL + url, {
      headers,
      method: "POST",
      body: JSON.stringify(bodyObj),
    });
  }

  // 注册
  async function registered(bodyObj) {
    const test = await post("/api/user/reg,bodyObj"); //调用post传入地址和请求体
    return await test.json(); //将结果返回
  }

  // 登录
  async function regist(login) {
    const test = await post("/api/user/login", login);

    const result = await test.json();
    if (result.code === 0) {
      const token = test.headers.get("authorization");
      localStorage.setItem(TOKEN, token);
    }
    return result;
  }

  // 登录信息
  async function loginin() {
    const test = await get("/api/user/profile");
    return await test.json();
  }

  //验证账户是否存在
  async function ontExist(on) {
    const test = await get("/api/user/exists?loginId=" + on);
    return await test.json();
  }

  // 获取聊天信息
  async function obtain() {
    const test = await get("/api/chat/history");
    return await test.json();
  }
  // 发送聊天信息
  async function send(content) {
    const test = await post("/api/chat", {
      content,
    });
    return await test.json();
  }

  // 删除令牌
  function romve() {
    localStorage.removeItem(TOKEN);
  }

  return {
    registered,
    regist,
    loginin,
    ontExist,
    obtain,
    send,
    romve,
  };
})();
