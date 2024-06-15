"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  props: {
    label: {
      type: String,
      default: "房屋规格："
    },
    multiArray: {
      type: Array,
      default: () => [
        ["一室", "二室", "三室", "四室"],
        ["开间", "一厅", "两厅"],
        ["一卫", "双卫", "三卫"]
      ]
    }
  },
  data() {
    return {
      multiIndex: [0, 0, 0]
      // 默认选择数组的第一项
    };
  },
  methods: {
    bindMultiPickerColumnChange(e) {
      const column = e.detail.column;
      const value = e.detail.value;
      this.multiIndex[column] = value;
      this.$emit("change", this.multiIndex);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($props.multiArray[0][$data.multiIndex[0]]),
    b: common_vendor.t($props.multiArray[1][$data.multiIndex[1]]),
    c: common_vendor.t($props.multiArray[2][$data.multiIndex[2]]),
    d: common_vendor.o((...args) => $options.bindMultiPickerColumnChange && $options.bindMultiPickerColumnChange(...args)),
    e: $data.multiIndex,
    f: $props.multiArray
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e4edcda6"], ["__file", "/Users/kami-m1/work-files/coding/git-files/kami-self/contact-us/easy-rent/components/selectPicker/selectPicker.vue"]]);
wx.createComponent(Component);
