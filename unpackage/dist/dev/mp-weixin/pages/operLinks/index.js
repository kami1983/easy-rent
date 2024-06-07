"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      isChecked: false,
      items: [
        { text: "添加出租公告", page: "/pages/inputRentInfos/index" }
        // { text: '添加社区公告', page: '/otherPagePath' },
        // { text: '添加工单反馈', page: '/anotherPagePath' }
      ]
    };
  },
  methods: {
    checkboxChange(event) {
      this.isChecked = event.detail.value.includes("agree");
    },
    viewTerms() {
      console.log("查看条款被点击");
      common_vendor.index.showModal({
        title: "社区公告条款",
        content: "请仔细阅读以下条款概要:\n1. 尊重和礼貌\n2. 真实性和准确性\n3. 遵守法律法规\n4. 个人信息和隐私\n5. 知识产权及免责条款\n详细条款信息，请点击“详细阅读”。",
        showCancel: true,
        cancelText: "关闭",
        confirmText: "详细阅读",
        success: function(res) {
          if (res.confirm) {
            common_vendor.index.navigateTo({
              url: "/pages/fullTerms/index"
            });
          }
        }
      });
    },
    navigateTo(page) {
      common_vendor.index.navigateTo({ url: page });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.viewTerms && $options.viewTerms(...args)),
    b: $data.isChecked,
    c: common_vendor.o((...args) => $options.checkboxChange && $options.checkboxChange(...args)),
    d: common_vendor.f($data.items, (item, index, i0) => {
      return {
        a: common_vendor.t(item.text),
        b: index,
        c: common_vendor.o(($event) => $options.navigateTo(item.page), index)
      };
    }),
    e: !$data.isChecked
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d1cb3572"], ["__file", "/Users/kami-m1/work-files/coding/git-files/kami-self/contact-us/easy-rent/pages/operLinks/index.vue"]]);
wx.createPage(MiniProgramPage);
