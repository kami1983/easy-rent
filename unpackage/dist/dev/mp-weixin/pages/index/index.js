"use strict";
const common_vendor = require("../../common/vendor.js");
const promoBanner = () => "../../components/promoBanner/promoBanner.js";
const houseItem = () => "../../components/houseItem/houseItem.js";
const _sfc_main = {
  components: {
    promoBanner,
    houseItem
  },
  data() {
    return {
      title: "Hello",
      inputData: "*"
    };
  },
  onLoad() {
  },
  methods: {
    onChange(e) {
      console.log("Good ");
      console.log("value ", e);
      this.inputData = e;
    }
  }
};
if (!Array) {
  const _component_promo_banner = common_vendor.resolveComponent("promo-banner");
  const _component_house_item = common_vendor.resolveComponent("house-item");
  (_component_promo_banner + _component_house_item)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      title: "出租公告",
      subtitle: "免费社区信息交换平台",
      description: "无中介 ｜ 换房需求 ｜ 租房信息"
    }),
    b: common_vendor.p({
      imageSrc: "/static/rent-background.png",
      title: "开饭群岛旺铺招租",
      details: "整租 2室1厅1卫",
      address: "北京市通州区嘉创路10号"
    }),
    c: common_vendor.p({
      imageSrc: "/static/rent-background.png",
      title: "开饭群岛旺铺招租",
      details: "整租 2室1厅1卫",
      address: "北京市通州区嘉创路10号"
    }),
    d: common_vendor.p({
      imageSrc: "/static/rent-background.png",
      title: "开饭群岛旺铺招租",
      details: "整租 2室1厅1卫",
      address: "北京市通州区嘉创路10号"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/kami-m1/work-files/coding/git-files/kami-self/contact-us/easy-rent/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
