"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      properties: [
        { title: "李庄家园北区 - 98平南北通透", updateTime: "2024-06-02", weight: 10 },
        { title: "李庄家园北区 - 98平南北通透", updateTime: "2024-06-02", weight: 10 },
        { title: "李庄家园北区 - 98平南北通透", updateTime: "2024-06-02", weight: 10 },
        { title: "李庄家园北区 - 98平南北通透", updateTime: "2024-06-02", weight: 10 },
        { title: "李庄家园北区 - 98平南北通透", updateTime: "2024-06-02", weight: 10 },
        { title: "李庄家园北区 - 98平南北通透", updateTime: "2024-06-02", weight: 10 },
        { title: "李庄家园北区 - 98平南北通透", updateTime: "2024-06-02", weight: 10 },
        { title: "李庄家园北区 - 98平南北通透", updateTime: "2024-06-02", weight: 10 },
        { title: "李庄家园北区 - 98平南北通透", updateTime: "2024-06-02", weight: 10 },
        { title: "李庄家园北区 - 98平南北通透", updateTime: "2024-06-02", weight: 10 },
        { title: "李庄家园北区 - 98平南北通透", updateTime: "2024-06-02", weight: 10 }
      ]
    };
  },
  methods: {}
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.properties, (item, index, i0) => {
      return {
        a: common_vendor.t(item.title),
        b: common_vendor.t(item.updateTime),
        c: common_vendor.t(item.weight),
        d: index
      };
    }),
    b: $data.properties.length === 0
  }, $data.properties.length === 0 ? {} : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/kami-m1/work-files/coding/git-files/kami-self/contact-us/easy-rent/components/infoList/infoList.vue"]]);
wx.createComponent(Component);
