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
    baseItem: {
      type: Object,
      required: true
    },
    tags: {
      type: String,
      required: true
    },
    price: {
      type: String,
      required: false
    },
    rentid: {
      // 新增 prop
      type: [String, Number],
      // 可以是字符串或数字
      required: true
    }
  },
  computed: {
    effectiveImageSrc() {
      return this.imageSrc || "/static/default-placeholder.png";
    }
  },
  methods: {
    navigateTo(page) {
      if (this.rentid) {
        common_vendor.index.navigateTo({
          url: page
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.baseItem != void 0
  }, $props.baseItem != void 0 ? common_vendor.e({
    b: $options.effectiveImageSrc,
    c: common_vendor.o(($event) => $options.navigateTo("/pages/rentDetail/index?rentid=" + $props.rentid)),
    d: $props.baseItem.type == 1
  }, $props.baseItem.type == 1 ? {} : {}, {
    e: $props.baseItem.type == 2
  }, $props.baseItem.type == 2 ? {} : {}, {
    f: common_vendor.t($props.title),
    g: $props.baseItem.type == 1
  }, $props.baseItem.type == 1 ? common_vendor.e({
    h: common_vendor.t($props.baseItem.rent_type),
    i: common_vendor.t($props.baseItem.rent_area),
    j: $props.price
  }, $props.price ? {
    k: common_vendor.t($props.price)
  } : {}) : {}, {
    l: $props.baseItem.type == 2
  }, $props.baseItem.type == 2 ? common_vendor.e({
    m: $props.price
  }, $props.price ? {
    n: common_vendor.t($props.price)
  } : {}, {
    o: common_vendor.t($props.tags)
  }) : {}) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5f916c82"], ["__file", "/Users/kami-m1/work-files/coding/git-files/kami-self/contact-us/easy-rent/components/houseItem/houseItem.vue"]]);
wx.createComponent(Component);
