"use strict";
const common_vendor = require("../../common/vendor.js");
const libs_dataTools = require("../../libs/data-tools.js");
const _sfc_main = {
  mixins: [libs_dataTools.rentMixin],
  props: {
    refreshTrigger: Number
  },
  data() {
    return {
      lastTapTime: 0,
      // 存储上次点击时间
      properties: [],
      page: 1,
      limit: 10,
      isLoading: false,
      noMoreData: false
    };
  },
  mounted() {
    this.fetchFavoritesOnMine();
  },
  watch: {
    refreshTrigger(newVal, oldVal) {
      if (newVal !== oldVal) {
        console.log("HELLO trigger： ", { newVal, oldVal });
        this.page = 1;
        this.limit = 10;
        this.properties = [];
        this.fetchFavoritesOnMine();
      }
    }
  },
  methods: {
    handleTap(item) {
      const currentTime = (/* @__PURE__ */ new Date()).getTime();
      const tapGap = currentTime - this.lastTapTime;
      this.lastTapTime = currentTime;
      if (tapGap < 300 && tapGap > 0) {
        this.confirmDeletion(item);
      }
    },
    async refreshRent(rentId) {
      console.log("ding ---- ");
    },
    confirmDeletion(item) {
      console.log("confirmDeletion --- ");
      common_vendor.index.showModal({
        title: "移除收藏？",
        content: `${parseInt(item.rent_area)}平，${item.rent_address}`,
        success: (res) => {
          if (res.confirm) {
            console.log("用户点击确定");
            this.deleteProperty(item.id);
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    navigateTo(page) {
      common_vendor.index.navigateTo({
        url: page
      });
    },
    async deleteProperty(rentId) {
      console.log("Deleting property with ID:", rentId);
      const app = getApp();
      try {
        const response = await app.globalData.callWithWxCloud({
          path: "/user/favorite/del",
          data: { rentid: rentId },
          method: "GET"
        });
        if (response.status) {
          common_vendor.index.showToast({
            title: "移除成功",
            icon: "success"
          });
          const index = this.properties.findIndex((item) => item.id === rentId);
          if (index !== -1) {
            this.properties.splice(index, 1);
          }
        } else {
          common_vendor.index.showToast({
            title: response.message || "移除失败",
            icon: "none"
          });
        }
      } catch (error) {
        console.error("请求错误:", error);
        common_vendor.index.showToast({
          title: "网络或服务器错误",
          icon: "none"
        });
      }
    },
    loadMore() {
      this.fetchRentInfosOnMine();
    },
    statusText(status) {
      switch (status) {
        case 0:
          return "审核中";
        case 1:
          return "上线中";
        default:
          return "其他";
      }
    },
    statusClass(status) {
      switch (status) {
        case 0:
          return "status-pending";
        case 1:
          return "status-active";
        default:
          return "status-unknown";
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.properties, (item, index, i0) => {
      return {
        a: common_vendor.t(item.rent_area | parseInt),
        b: common_vendor.t(item.rent_address),
        c: common_vendor.t(item.rent_type),
        d: common_vendor.t($options.statusText(item.status)),
        e: common_vendor.n($options.statusClass(item.status)),
        f: common_vendor.o(($event) => $options.navigateTo("/pages/rentDetail/index?rentid=" + item.id), index),
        g: common_vendor.o(($event) => $options.handleTap(item), index),
        h: index
      };
    }),
    b: $data.properties.length === 0
  }, $data.properties.length === 0 ? {} : {}, {
    c: !$data.noMoreData
  }, !$data.noMoreData ? {
    d: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-da5f49ca"], ["__file", "/Users/kami-m1/work-files/coding/git-files/kami-self/contact-us/easy-rent/components/favoriteList/favoriteList.vue"]]);
wx.createComponent(Component);
