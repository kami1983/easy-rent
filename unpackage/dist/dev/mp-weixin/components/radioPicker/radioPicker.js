"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  props: {
    options: {
      type: Array,
      default: () => []
    },
    selected: {
      type: String,
      default: ""
    }
  },
  methods: {
    onChange(event) {
      this.$emit("update:selected", event.detail.value);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($props.options, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: item,
        c: $props.selected === item,
        d: index
      };
    }),
    b: common_vendor.o((...args) => $options.onChange && $options.onChange(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/kami-m1/work-files/coding/git-files/kami-self/contact-us/easy-rent/components/radioPicker/radioPicker.vue"]]);
wx.createComponent(Component);
