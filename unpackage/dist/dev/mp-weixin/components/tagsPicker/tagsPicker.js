"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  props: {
    tags: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    toggle(index) {
      this.$emit("toggle", index);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($props.tags, (tag, index, i0) => {
      return {
        a: common_vendor.t(tag.name),
        b: index,
        c: tag.active ? 1 : "",
        d: common_vendor.o(($event) => $options.toggle(index), index)
      };
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-104dc142"], ["__file", "/Users/kami-m1/work-files/coding/git-files/kami-self/contact-us/easy-rent/components/tagsPicker/tagsPicker.vue"]]);
wx.createComponent(Component);
