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
    a: $options.effectiveImageSrc,
    b: common_vendor.o(($event) => $options.navigateTo("/pages/rentDetail/index?rentid=" + $props.rentid)),
    c: $props.baseItem.type == 1
  }, $props.baseItem.type == 1 ? {} : {}, {
    d: $props.baseItem.type == 2
  }, $props.baseItem.type == 2 ? {} : {}, {
    e: common_vendor.t($props.title),
    f: $props.baseItem.type == 1
  }, $props.baseItem.type == 1 ? common_vendor.e({
    g: common_vendor.t($props.baseItem.rent_type),
    h: common_vendor.t($props.baseItem.rent_area),
    i: $props.price
  }, $props.price ? {
    j: common_vendor.t($props.price)
  } : {}) : {}, {
    k: $props.baseItem.type == 2
  }, $props.baseItem.type == 2 ? common_vendor.e({
    l: $props.price
  }, $props.price ? {
    m: common_vendor.t($props.price)
  } : {}, {
    n: common_vendor.t($props.tags)
  }) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5f916c82"], ["__file", "/Users/kami-m1/work-files/coding/git-files/kami-self/contact-us/easy-rent/components/houseItem/houseItem.vue"]]);
wx.createComponent(Component);
