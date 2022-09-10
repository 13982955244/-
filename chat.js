(async function () {
  // 验证是否登陆
  const resp = await API.loginin();
  const user = resp.data;

  if (!user) {
    alert("未登陆或登陆已过期,请重新登陆");
    location.href = "./login.html";
    return;
  }

  const doms = {
    aside: {
      nickname: document.querySelector("#nickname"),
      loginId: document.querySelector("#loginId"),
    },
    close: {
      iconClose: document.querySelector(".icon-close"),
    },
    chat: {
      chatContainer: document.querySelector(".chat-container"),
    },
    txtMsg: document.querySelector("#txtMsg"),
    msgContainer: document.querySelector(".msg-container"),
  };

  //   显示用户信息函数
  function setUserInfo() {
    doms.aside.nickname.innerText = user.nickname;
    doms.aside.loginId.innerText = user.loginId;
  }
  setUserInfo();

  // 注销事件
  doms.close.iconClose.addEventListener("click", function () {
    API.romve();
    location.href = "./login.html";
  });

  //   显示信息

  function addition(additions) {
    const div = document.createElement("div");
    div.classList.add("chat-item");

    if (additions.from) {
      div.classList.add("me");
    }
    const img = document.createElement("img");
    img.className = "chat-avatar";
    img.src = additions.from
      ? "./asset/avatar.png"
      : "./asset/robot-avatar.jpg";

    const content = document.createElement("div");
    content.className = "chat-content";
    content.innerText = additions.content;

    const chatDate = document.createElement("div");
    chatDate.className = "chat-date";
    chatDate.innerText = conversionTime(additions.createdAt);

    div.appendChild(img);
    div.appendChild(content);
    div.appendChild(chatDate);

    doms.chat.chatContainer.appendChild(div);
  }

  //   转化时间戳
  function conversionTime(time) {
    const date = new Date(time);
    const year = date.getFullYear(); //年
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); //月:因为是0开始所以需要加1 ,在看是否为2位,不足2位前面添加0
    const day = date.getDay().toString().padStart(2, "0"); //日
    const hour = date.getHours().toString().padStart(2, "0"); //小时
    const minute = date.getMinutes().toString().padStart(2, "0"); //分钟
    const second = date.getSeconds().toString().padStart(2, "0"); //秒

    return `${year}-${month}-${day} ${hour}:${minute}-${second}`;
  }

  //    展示历史记录
  async function historicalRecord() {
    const resp = await API.obtain();

    for (const key of resp.data) {
      addition(key);
      //   console.log(key.from);
    }
    rolling();
  }
  historicalRecord(); //显示聊天记录

  //   提交发送信息事件
  doms.msgContainer.onsubmit = (e) => {
    e.preventDefault(); //阻止默认提交
    sends(); //发送信息
  };

  //   设置滚动
  function rolling() {
    doms.chat.chatContainer.scrollTop = doms.chat.chatContainer.scrollHeight;
  }

  //   发送信息
  async function sends() {
    const content = doms.txtMsg.value.trim(); //当前文本框的值去掉首尾空格

    // 判断有没有值,没有就是啥也不做
    if (!content) {
      return;
    }

    // 先把发送的信息展示给用户
    addition({
      from: user.loginId, //表示发送者是我
      to: null,
      createdAt: Date.now(), //使用当前时间戳
      content,
    });
    doms.txtMsg.value = "";
    // 发送信息给服务器
    const resp = await API.send(content);

    addition({
      from: null, //表示发送者是机器人
      to: user.loginId,
      ...resp.data,
    });
    rolling(); //滚动底部
  }
})();
