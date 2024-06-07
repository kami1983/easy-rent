"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  props: {
    userInfo: {
      type: Object,
      default() {
        return {
          nickName: "*",
          avatarUrl: "@/static/notloginpic.png"
        };
      }
    }
  },
  methods: {
    navigateTo(page) {
      common_vendor.index.navigateTo({
        url: page
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.userInfo.avatarUrl,
    b: common_vendor.t($props.userInfo.nickName),
    c: common_vendor.o(($event) => $options.navigateTo("/pages/operLinks/index"))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/kami-m1/work-files/coding/git-files/kami-self/contact-us/easy-rent/components/loginRegister/loginRegister.vue"]]);
wx.createComponent(Component);
