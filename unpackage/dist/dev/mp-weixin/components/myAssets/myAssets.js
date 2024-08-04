"use strict";
const common_vendor = require("../../common/vendor.js");
const infoList = () => "../infoList/infoList.js";
const favoriteList = () => "../favoriteList/favoriteList.js";
const _sfc_main = {
  props: {
    initialTab: {
      type: String,
      default: "rent"
    },
    refreshTrigger: Number
  },
  watch: {
    refreshTrigger(newVal, oldVal) {
      if (newVal !== oldVal) {
        console.log("On my assets refreshTrigger: ", { newVal, oldVal });
        this.refreshCounter = newVal;
      }
    }
  },
  components: {
    infoList,
    favoriteList
  },
  data() {
    return {
      currentTab: this.initialTab,
      refreshCounter: 0
    };
  },
  created() {
    console.log("DEBUG- My assets created with initial tab:", this.currentTab);
  },
  methods: {
    switchTab(tab) {
      this.currentTab = tab;
    }
  }
};
if (!Array) {
  const _component_info_list = common_vendor.resolveComponent("info-list");
  const _component_favorite_list = common_vendor.resolveComponent("favorite-list");
  (_component_info_list + _component_favorite_list)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.currentTab === "rent" ? 1 : "",
    b: common_vendor.o(($event) => $options.switchTab("rent")),
    c: $data.currentTab === "favorite" ? 1 : "",
    d: common_vendor.o(($event) => $options.switchTab("favorite")),
    e: $data.currentTab === "rent"
  }, $data.currentTab === "rent" ? {
    f: common_vendor.p({
      ["refresh-trigger"]: $data.refreshCounter
    })
  } : {}, {
    g: $data.currentTab === "favorite"
  }, $data.currentTab === "favorite" ? {
    h: common_vendor.p({
      ["refresh-trigger"]: $data.refreshCounter
    })
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/kami-m1/work-files/coding/git-files/kami-self/contact-us/easy-rent/components/myAssets/myAssets.vue"]]);
wx.createComponent(Component);
