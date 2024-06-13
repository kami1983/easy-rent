"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  props: {
    value: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: "请输入"
    },
    className: {
      type: String,
      default: ""
    }
  },
  methods: {
    handleInput(event) {
      const value = event.detail.value;
      const filteredValue = value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
      if (value !== filteredValue) {
        return filteredValue;
      }
      this.$emit("onChange", filteredValue);
      return value;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.n($props.className),
    b: $props.placeholder,
    c: $props.value,
    d: common_vendor.o((...args) => $options.handleInput && $options.handleInput(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/kami-m1/work-files/coding/git-files/kami-self/contact-us/easy-rent/components/numberInput/numberInput.vue"]]);
wx.createComponent(Component);
