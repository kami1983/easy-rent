"use strict";
const common_vendor = require("../../common/vendor.js");
const infoList = () => "../infoList/infoList.js";
const _sfc_main = {
  components: {
    infoList
  },
  data() {
    return {
      currentTab: "rent"
    };
  },
  methods: {
    switchTab(tab) {
      this.currentTab = tab;
    }
  }
};
if (!Array) {
  const _component_info_list = common_vendor.resolveComponent("info-list");
  _component_info_list();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.currentTab === "rent" ? 1 : "",
    b: common_vendor.o(($event) => $options.switchTab("rent")),
    c: $data.currentTab === "search" ? 1 : "",
    d: common_vendor.o(($event) => $options.switchTab("search")),
    e: $data.currentTab === "feedback" ? 1 : "",
    f: common_vendor.o(($event) => $options.switchTab("feedback")),
    g: $data.currentTab === "rent"
  }, $data.currentTab === "rent" ? {} : {}, {
    h: $data.currentTab === "search"
  }, $data.currentTab === "search" ? {} : {}, {
    i: $data.currentTab === "feedback"
  }, $data.currentTab === "feedback" ? {} : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/kami-m1/work-files/coding/git-files/kami-self/contact-us/easy-rent/components/myAssets/myAssets.vue"]]);
wx.createComponent(Component);
