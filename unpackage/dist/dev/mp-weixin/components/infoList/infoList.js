"use strict";
const common_vendor = require("../../common/vendor.js");
const libs_dataTools = require("../../libs/data-tools.js");
const _sfc_main = {
  mixins: [libs_dataTools.rentMixin],
  data() {
    return {
      lastTapTime: 0,
      // 存储上次点击时间
      properties: [],
      page: 1,
      limit: 10,
      noMoreData: false
    };
  },
  mounted() {
    this.fetchRentInfos();
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
    // async fetchRentInfos() {
    //     const app = getApp();
    //     try {
    //         const response = await app.globalData.callWithWxCloud({
    //             path: '/user/rent-infos',
    //             data: {
    //                 page: this.page,
    //                 limit: this.limit
    //             },
    //             method: 'GET'
    //         });
    //         if (response.status) {
    //             const newProperties = response.backData.map(item => ({
    //                 ...item,
    //                 update_diff: 7 - this.calculateDateDifference(item.updated_at)
    //             }));
    //             this.properties = [...this.properties, ...newProperties];
    //             if (newProperties.length < this.limit) {
    //                 this.noMoreData = true;
    //             } else {
    //                 this.page++;
    //             }
    //         } else {
    //             uni.showToast({
    //                 title: '获取数据失败',
    //                 icon: 'none'
    //             });
    //         }
    //     } catch (error) {
    //         console.error('请求错误:', error);
    //         uni.showToast({
    //             title: '网络或服务器错误',
    //             icon: 'none'
    //         });
    //     }
    // },
    calculateDateDifference(updatedAt) {
      const now = /* @__PURE__ */ new Date();
      const updatedDate = new Date(updatedAt);
      const diffTime = Math.abs(now - updatedDate);
      const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
      return diffDays;
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
    // async getCloudImagesListByRentId(rentId) {
    //     const app = getApp();
    //     try {
    //         // Making an API call to your server to get the list of images for a specific rent ID
    //         const response = await app.globalData.callWithWxCloud({
    //             path: '/user/rent-images',
    //             data: { rentid: rentId },
    //             method: 'GET'
    //         });
    //         console.log('DEBUG /user/rent-images', { rentId, response });
    //         // Check if the response was successful
    //         if (response.status) {
    //             // Assuming response.backData is the array of image objects
    //             const images = response.backData.map(image => ({
    //                 id: image.id,
    //                 url: image.image_url,
    //                 createdAt: image.created_at,
    //                 updatedAt: image.updated_at
    //             }));
    //             return images;  // Return the mapped array of images
    //         } else {
    //             uni.showToast({
    //                 title: '图片加载失败',
    //                 icon: 'none'
    //             });
    //             return [];  // Return an empty array or handle accordingly
    //         }
    //     } catch (error) {
    //         console.error('请求错误:', error);
    //         uni.showToast({
    //             title: '网络或服务器错误',
    //             icon: 'none'
    //         });
    //         return [];  // Return an empty array in case of an error
    //     }
    // },
    confirmDeletion(item) {
      console.log("confirmDeletion --- ");
      common_vendor.index.showModal({
        title: "确认删除",
        content: `ID[${item.id}] | ${parseInt(item.rent_area)}平，${item.rent_address}`,
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
      console.log("rentList 2 - ", rentList);
      if (rentList.length > 0) {
        const deletePromises = rentList.map((item) => {
          console.log("Will delete image: ", item);
          common_vendor.index.showToast({
            title: `删除图片${item.id}`,
            icon: "success"
          });
          return this.deleteImageFromCloud(item.url);
        });
        await Promise.all(deletePromises);
        console.log("All images deleted successfully.");
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
      this.fetchRentInfos();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.properties, (item, index, i0) => {
      return {
        a: common_vendor.t(item.rent_area | parseInt),
        b: common_vendor.t(item.rent_address),
        c: common_vendor.t(item.update_diff),
        d: common_vendor.t(item.rent_type),
        e: common_vendor.o(($event) => $options.refreshRent(item.id), index),
        f: common_vendor.o(($event) => $options.handleTap(item), index),
        g: index
      };
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
