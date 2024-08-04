"use strict";
const common_vendor = require("../../common/vendor.js");
const loginRegister = () => "../../components/loginRegister/loginRegister.js";
const myAssets = () => "../../components/myAssets/myAssets.js";
const _sfc_main = {
  components: {
    loginRegister,
    myAssets
  },
  onPullDownRefresh() {
    console.log("onPullDownRefresh -- RUN == DEBUG 1 ");
  },
  // 触底的事件
  onReachBottom() {
    console.log("onReachBottom -- RUN == DEBUG 2 ");
  },
  onShow() {
    console.log("On profile onShow");
    this.refreshCounter++;
  },
  onLoad() {
    const app = getApp();
    this.userInfo = app.globalData.userInfo;
  },
  data() {
    return {
      userInfo: {},
      refreshCounter: 0
    };
  }
};
if (!Array) {
  const _component_login_register = common_vendor.resolveComponent("login-register");
  const _component_my_assets = common_vendor.resolveComponent("my-assets");
  (_component_login_register + _component_my_assets)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      ["user-info"]: $data.userInfo
    }),
    b: common_vendor.p({
      ["initial-tab"]: "rent",
      ["refresh-trigger"]: $data.refreshCounter
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/kami-m1/work-files/coding/git-files/kami-self/contact-us/easy-rent/pages/profile/index.vue"]]);
wx.createPage(MiniProgramPage);
