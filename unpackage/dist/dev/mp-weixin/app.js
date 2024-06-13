"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/find/index.js";
  "./pages/profile/index.js";
  "./pages/operLinks/index.js";
  "./pages/fullTerms/index.js";
  "./pages/inputRentInfos/index.js";
}
let cloudApi = null;
async function getCloudApi() {
  if (cloudApi != null) {
    return cloudApi;
  }
  cloudApi = new common_vendor.wx$1.cloud.Cloud({
    resourceAppid: "wxf6e7dbe6198c7f06",
    // 微信云托管环境所属账号，服务商appid、公众号或小程序appid
    resourceEnv: "prod-4g3usz1465b5625e"
    // 微信云托管的环境ID
  });
  await cloudApi.init();
  return cloudApi;
}
async function callWithWxCloud(obj, number = 0) {
  const that = this;
  const cloudApi2 = await getCloudApi();
  console.log("cloudApi - DEBUG ", cloudApi2);
  try {
    const result = await cloudApi2.callContainer({
      path: obj.path,
      // 填入业务自定义路径和参数，根目录，就是 / 
      method: obj.method || "GET",
      // 按照自己的业务开发，选择对应的方法
      data: obj.data || {},
      // dataType:'text', // 如果返回的不是json格式，需要添加此项
      header: {
        "X-WX-SERVICE": "express-8zu8"
        // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
        // 其他header参数
      }
      // 其余参数同 wx.request
    });
    console.log(`微信云托管调用结果${result.errMsg} | callid:${result.callID}`);
    return result.data;
  } catch (e) {
    const error = e.toString();
    if (error.indexOf("Cloud API isn't enabled") != -1 && number < 3) {
      return new Promise((resolve) => {
        setTimeout(function() {
          resolve(that.call(obj, number + 1));
        }, 300);
      });
    } else {
      throw new Error(`微信云托管调用失败${error}`);
    }
  }
}
const _sfc_main = {
  globalData: {
    isWxEnv: false,
    userInfo: {
      nickName: "..",
      avatarUrl: "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132"
    },
    getCloudApi: getCloudApi(),
    callWithWxCloud
  },
  callWithWxCloud,
  onLaunch: function() {
    const that = this;
    console.log("App Launch", this.globalData);
    if (common_vendor.wx$1.cloud) {
      that.globalData.isWxEnv = true;
      common_vendor.wx$1.getUserInfo({
        success: function(res) {
          const userInfo = res.userInfo;
          console.log({ userInfo });
          that.globalData.userInfo = userInfo;
          callWithWxCloud({
            path: "/registerUser",
            method: "POST",
            data: userInfo
          }).then((res2) => {
            console.log("Debug res", res2);
          });
        },
        fail: function(err) {
          console.log("获取用户信息失败", err);
        }
      });
    }
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/kami-m1/work-files/coding/git-files/kami-self/contact-us/easy-rent/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
