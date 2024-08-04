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
    markers: {
      // Accept markers as a prop
      type: Array,
      default: () => []
    },
    isLocationAuthorized: {
      type: Boolean,
      default: false
    },
    canUpdateMarkers: {
      // New prop to control marker updates
      type: Boolean,
      default: true
    },
    enableScroll: {
      // New prop for enabling or disabling map scroll
      type: Boolean,
      default: true
    }
  },
  mounted() {
    const newMarker = {
      id: 0,
      latitude: this.markers[0],
      longitude: this.markers[1],
      width: 20,
      height: 30
    };
    console.log("newMarker A -- ", newMarker);
    this.updateLocalMarkers(newMarker);
  },
  data() {
    return {
      localMarkers: []
      // Now markers are managed internally
    };
  },
  watch: {
    markers: {
      handler(markersDataArr) {
        const newMarker = {
          id: 0,
          latitude: markersDataArr[0],
          longitude: markersDataArr[1],
          width: 20,
          height: 30
        };
        console.log("newMarker B -- ", newMarker);
        this.updateLocalMarkers(newMarker);
      },
      deep: true
      // This ensures even nested data changes are detected
    }
  },
  methods: {
    updateMarker(event) {
      console.log("Update marker : ", this.canUpdateMarkers);
      if (this.canUpdateMarkers) {
        console.log("Will update markers.");
        const newMarker = {
          id: 0,
          latitude: event.detail.latitude,
          longitude: event.detail.longitude,
          width: 20,
          height: 30
        };
        this.localMarkers = [newMarker];
        this.centerMapOnMarker(newMarker.latitude, newMarker.longitude);
      }
    },
    centerMapOnMarker(latitude, longitude) {
      this.$emit("center-map", { latitude, longitude });
    },
    updateLocalMarkers(markers) {
      this.localMarkers = [markers];
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
    d: $props.enableScroll,
    e: common_vendor.o((...args) => $options.updateMarker && $options.updateMarker(...args)),
    f: $data.localMarkers,
    g: !$props.isLocationAuthorized
  }, !$props.isLocationAuthorized ? {
    h: common_vendor.o((...args) => $options.requestLocationPermission && $options.requestLocationPermission(...args))
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9c869d3d"], ["__file", "/Users/kami-m1/work-files/coding/git-files/kami-self/contact-us/easy-rent/components/mapPicker/mapPicker.vue"]]);
wx.createComponent(Component);
