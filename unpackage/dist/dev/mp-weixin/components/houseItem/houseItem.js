"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  props: {
    imageSrc: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    details: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  data() {
    return {};
  },
  methods: {}
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.imageSrc,
    b: common_vendor.t($props.title),
    c: common_vendor.t($props.details),
    d: common_vendor.t($props.address)
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/kami-m1/work-files/coding/git-files/kami-self/contact-us/easy-rent/components/houseItem/houseItem.vue"]]);
wx.createComponent(Component);
