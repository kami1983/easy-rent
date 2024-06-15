"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  props: {
    longitude: {
      type: Number,
      default: 113.32452
    },
    latitude: {
      type: Number,
      default: 23.099994
    },
    scale: {
      type: Number,
      default: 14
    },
    isLocationAuthorized: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      markers: []
      // Now markers are managed internally
    };
  },
  methods: {
    updateMarker(event) {
      const newMarker = {
        id: 0,
        latitude: event.detail.latitude,
        longitude: event.detail.longitude,
        width: 20,
        height: 30
      };
      this.markers = [newMarker];
      this.centerMapOnMarker(newMarker.latitude, newMarker.longitude);
    },
    centerMapOnMarker(latitude, longitude) {
      this.$emit("center-map", { latitude, longitude });
    },
    requestLocationPermission() {
      common_vendor.index.authorize({
        scope: "scope.userLocation",
        success: () => {
          console.log("位置授权成功");
          this.isLocationAuthorized = true;
        },
        fail: () => {
          console.log("位置授权失败");
          common_vendor.index.showModal({
            title: "授权失败",
            content: "请在设置中打开位置权限",
            showCancel: false
          });
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.longitude,
    b: $props.latitude,
    c: $props.scale,
    d: common_vendor.o((...args) => $options.updateMarker && $options.updateMarker(...args)),
    e: $data.markers,
    f: !$props.isLocationAuthorized
  }, !$props.isLocationAuthorized ? {
    g: common_vendor.o((...args) => $options.requestLocationPermission && $options.requestLocationPermission(...args))
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9c869d3d"], ["__file", "/Users/kami-m1/work-files/coding/git-files/kami-self/contact-us/easy-rent/components/mapPicker/mapPicker.vue"]]);
wx.createComponent(Component);
