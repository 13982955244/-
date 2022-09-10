// 用户登陆和注册的通用代码
class FieldValidator {
  // textId文本框Id,validetorFunc:验证规则函数,当需要验证时调用函数,函数的参数为当前文本的值,
  constructor(textId, validetorFunc) {
    this.input = document.querySelector("#" + textId);
    this.p = this.input.nextElementSibling;
    this.validetorFunc = validetorFunc;
    // 失去焦点验证
    this.input.onblur = () => {
      this.validate();
    };
    /**
     * 验证:成功true,失败返回false
     */
  }
  async validate() {
    const err = await this.validetorFunc(this.input.value);
    if (err) {
      this.p.innerText = err;
      return false;
    } else {
      this.p.innerText = "";
      return true;
    }
  }
  //静态方法:进行统一验证,一个没通过就为false
  static async validate(...validators) {
    const proms = validators.map((v) => v.validate());
    const results = await Promise.all(proms);
    return results.every((s) => s);
  }
}

// 表单提交 验证
// 账户
const id = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "请填写账号";
  }
});

// 密码
const txtLoginPwd = new FieldValidator("txtLoginPwd", async function (val) {
  if (!val) {
    return "请输入密码";
  }
});

//给提交设置提交事件
const form = document.querySelector(".user-form");

form.onsubmit = async function (e) {
  e.preventDefault();
  const result = await FieldValidator.validate(id, txtLoginPwd);
  if (!result) {
    return;
  }
  const resp = await API.regist({
    loginId: id.input.value,
    loginPwd: txtLoginPwd.input.value,
  });
  if (resp.code === 0) {
    alert("登陆成功");
    location.href = "./index.html";
  } else {
    alert("登陆失败");
    txtLoginPwd.input.value = "";
  }
};
