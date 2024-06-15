"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  props: {
    initialImageList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      imageList: this.initialImageList
    };
  },
  methods: {
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 9 - this.imageList.length,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          this.imageList = this.imageList.concat(res.tempFilePaths);
          this.$emit("update:imageList", this.imageList);
        }
      });
    },
    handleDelete(index) {
      this.imageList.splice(index, 1);
      this.$emit("update:imageList", this.imageList);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.imageList, (img, index, i0) => {
      return {
        a: img,
        b: common_vendor.o(($event) => $options.handleDelete(index), index),
        c: index
      };
    }),
    b: $data.imageList.length < 9
  }, $data.imageList.length < 9 ? {
    c: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args))
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-59c8ae0e"], ["__file", "/Users/kami-m1/work-files/coding/git-files/kami-self/contact-us/easy-rent/components/imagePicker/imagePicker.vue"]]);
wx.createComponent(Component);
