"use strict";
const common_vendor = require("../../common/vendor.js");
const libs_dataTools = require("../../libs/data-tools.js");
const _sfc_main = {
  mixins: [libs_dataTools.rentMixin],
  props: {
    userInfo: {
      type: Object,
      default() {
        return {
          id: 0,
          open_id: "",
          nickName: "*",
          avatarUrl: "@/static/notloginpic.png"
        };
      }
    }
  },
  // data() {
  //     return {
  //       userInfo: {
  //         nickName: '微信',  // 默认昵称
  //         avatarUrl: '@/static/notloginpic.png'  // 默认头像
  //       }
  //     };
  //   },
  methods: {
    navigateTo(page) {
      common_vendor.index.navigateTo({
        url: page
      });
    },
    promptForNewNickname() {
      common_vendor.index.showModal({
        title: "修改昵称",
        content: "",
        editable: true,
        success: (res) => {
          if (res.confirm) {
            const illegalChars = /[^a-zA-Z0-9_\u4e00-\u9fa5]/;
            let cleanedNickname = res.content.trim();
            if (illegalChars.test(cleanedNickname)) {
              common_vendor.index.showToast({
                title: "昵称字符非法，提交失败",
                icon: "none",
                duration: 2e3
              });
            } else {
              cleanedNickname = cleanedNickname.replace(/\s+/g, " ");
              this.userInfo.nickName = cleanedNickname;
              const app = getApp();
              app.globalData.callWithWxCloud({
                path: "/updateUser",
                method: "POST",
                data: this.userInfo
              }).then((res2) => {
                console.log("============ Debug res with Nickname", res2);
              });
            }
          }
        }
      });
    },
    async onChooseAvatar(event) {
      console.log("Event . ", event);
      const tmpImg = event.detail.avatarUrl;
      const cloudImageId = await this.updateImageToCloud(tmpImg);
      this.userInfo.avatarUrl = cloudImageId;
      const app = getApp();
      app.globalData.callWithWxCloud({
        path: "/updateUser",
        method: "POST",
        data: this.userInfo
      }).then((res) => {
        console.log("============ Debug res with avatar", res);
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.userInfo.avatarUrl,
    b: common_vendor.o((...args) => $options.onChooseAvatar && $options.onChooseAvatar(...args)),
    c: common_vendor.t($props.userInfo.nickName),
    d: common_vendor.o((...args) => $options.promptForNewNickname && $options.promptForNewNickname(...args)),
    e: common_vendor.o(($event) => $options.navigateTo("/pages/operLinks/index"))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/kami-m1/work-files/coding/git-files/kami-self/contact-us/easy-rent/components/loginRegister/loginRegister.vue"]]);
wx.createComponent(Component);
