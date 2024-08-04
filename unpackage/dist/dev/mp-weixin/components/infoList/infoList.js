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
    console.log("Mounted...");
    this.fetchRentInfosOnMine();
  },
  watch: {
    refreshTrigger(newVal, oldVal) {
      if (newVal !== oldVal) {
        console.log("HELLO trigger： ", { newVal, oldVal });
        this.page = 1;
        this.limit = 10;
        this.properties = [];
        this.fetchRentInfosOnMine();
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
      const app = getApp();
      try {
        const response = await app.globalData.callWithWxCloud({
          path: "/user/refresh-rent",
          data: { rentid: rentId },
          method: "GET"
        });
        console.log("DEBU /user/refresh-rent ", { rentId, response });
        if (response.status) {
          common_vendor.index.showToast({
            title: "权重提升",
            icon: "success"
          });
          const index = this.properties.findIndex((item) => item.id === rentId);
          if (index !== -1) {
            console.log("__update_diff", _update_diff);
            this.$set(this.properties, index, {
              ...this.properties[index],
              ...response.backData,
              update_diff: 7 - this.calculateDateDifference(response.backData.updated_at)
              // Assuming the backend sends the updated_at field
            });
          }
        } else {
          common_vendor.index.showToast({
            title: "更新失败",
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
    confirmDeletion(item) {
      console.log("confirmDeletion --- ");
      common_vendor.index.showModal({
        title: "确认删除",
        content: item.tip ? `${item.tip}` : `${parseInt(item.rent_area)}平，${item.rent_address}`,
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
    async deleteImageFromCloud(fileID) {
      const app = getApp();
      const cloudApi = await app.globalData.getCloudApi;
      try {
        const res = await new Promise((resolve, reject) => {
          cloudApi.deleteFile({
            fileList: [fileID],
            // Array of file IDs
            success: (res2) => {
              console.log(" deleteFile - res -- ", res2);
              if (res2.fileList[0].status === 0) {
                resolve(res2.fileList[0]);
              } else {
                reject(`Deletion failed: ${res2.fileList[0].errMsg}`);
              }
            },
            fail: (err) => {
              reject(err);
            }
          });
        });
        console.log("Delete ok", res);
        return res;
      } catch (err) {
        console.error("Delete failed", err);
        return null;
      }
    },
    async deleteProperty(rentId) {
      console.log("Deleting property with ID:", rentId);
      const rentList = await this.getCloudImagesListByRentId(rentId);
      if (rentList.length > 0) {
        const deletePromises = rentList.map((item) => {
          common_vendor.index.showToast({
            title: `删除图片${item.id}`,
            icon: "success"
          });
          return this.deleteImageFromCloud(item.url);
        });
        await Promise.all(deletePromises);
      }
      const app = getApp();
      try {
        const response = await app.globalData.callWithWxCloud({
          path: "/user/delete-rent",
          data: { rentid: rentId },
          method: "GET"
        });
        if (response.status) {
          common_vendor.index.showToast({
            title: "删除成功",
            icon: "success"
          });
          const index = this.properties.findIndex((item) => item.id === rentId);
          if (index !== -1) {
            this.properties.splice(index, 1);
          }
        } else {
          common_vendor.index.showToast({
            title: response.message || "删除失败",
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
        case 2:
          return "驳回";
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
      return common_vendor.e({
        a: item.type == 1
      }, item.type == 1 ? {
        b: common_vendor.t(item.rent_area | parseInt),
        c: common_vendor.t(item.rent_address)
      } : {}, {
        d: item.type == 2
      }, item.type == 2 ? {
        e: common_vendor.t(item.rent_address == "" ? "无标题" : item.rent_address)
      } : {}, {
        f: common_vendor.t(item.update_diff < 0 ? 0 : item.update_diff),
        g: common_vendor.t(item.type == 1 ? "租房" : "置物"),
        h: common_vendor.t($options.statusText(item.status)),
        i: common_vendor.n($options.statusClass(item.status)),
        j: item.status === 1 || item.status === 1
      }, item.status === 1 || item.status === 1 ? {
        k: common_vendor.t(item.status === 1 ? "顶" : "上"),
        l: common_vendor.o(($event) => $options.refreshRent(item.id), index)
      } : {}, {
        m: common_vendor.o(($event) => $options.handleTap(item), index),
        n: index
      });
    }),
    b: $data.properties.length === 0
  }, $data.properties.length === 0 ? {} : {}, {
    c: !$data.noMoreData
  }, !$data.noMoreData ? {
    d: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2f62ac17"], ["__file", "/Users/kami-m1/work-files/coding/git-files/kami-self/contact-us/easy-rent/components/infoList/infoList.vue"]]);
wx.createComponent(Component);
