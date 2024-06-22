"use strict";
const common_vendor = require("../common/vendor.js");
const rentMixin = {
  methods: {
    async fetchRentInfos() {
      return await this.fetchRentInfosWithApi("/rent-infos");
    },
    async fetchRentInfosOnMine() {
      return await this.fetchRentInfosWithApi("/user/rent-infos");
    },
    async fetchRentInfosWithApi(api_path) {
      const app = getApp();
      try {
        const response = await app.globalData.callWithWxCloud({
          path: api_path,
          data: {
            page: this.page,
            limit: this.limit
          },
          method: "GET"
        });
        console.log("DEBUG- response:", response);
        if (response.status) {
          const newProperties = response.backData.map((item) => ({
            ...item,
            update_diff: 7 - this.calculateDateDifference(item.updated_at)
          }));
          this.properties = [...this.properties, ...newProperties];
          if (newProperties.length < this.limit) {
            this.noMoreData = true;
          } else {
            this.page++;
          }
        } else {
          common_vendor.index.showToast({
            title: "获取数据失败",
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
    async attachPropertiesWithTmpImage() {
      console.log("attachPropertiesWithTmpImage 2 ", await this.properties);
      const imagePromises = this.properties.map(async (property) => {
        if (property.cover_image) {
          const tmpImageUrl = await this.convertCloudFileToTmpImage(property.cover_image);
          return {
            ...property,
            tmp_image_url: tmpImageUrl || ""
            // Use a default image if URL retrieval fails
          };
        } else {
          return {
            ...property,
            tmp_image_url: ""
            // Default image if no cloudFileId
          };
        }
      });
      this.properties = await Promise.all(imagePromises);
    },
    async convertCloudFileToTmpImage(cloudFileId) {
      const app = getApp();
      const cloudApi = await app.globalData.getCloudApi;
      console.log("cloudApi - on data-tools.js", cloudApi);
      try {
        const res = await cloudApi.getTempFileURL({
          fileList: [cloudFileId]
        });
        return res.fileList[0].tempFileURL;
      } catch (err) {
        console.error("Failed to get URL", err);
        return null;
      }
    },
    async getCloudImagesListByRentId(rentId) {
      const app = getApp();
      try {
        const response = await app.globalData.callWithWxCloud({
          path: "/user/rent-images",
          data: { rentid: rentId },
          method: "GET"
        });
        if (response.status) {
          return response.backData.map((image) => ({
            id: image.id,
            url: image.image_url,
            createdAt: image.created_at,
            updatedAt: image.updated_at
          }));
        } else {
          common_vendor.index.showToast({
            title: "图片加载失败",
            icon: "none"
          });
          return [];
        }
      } catch (error) {
        console.error("请求错误:", error);
        common_vendor.index.showToast({
          title: "网络或服务器错误",
          icon: "none"
        });
        return [];
      }
    },
    calculateDateDifference(updatedAt) {
      const now = /* @__PURE__ */ new Date();
      const updatedDate = new Date(updatedAt);
      const diffTime = Math.abs(now - updatedDate);
      const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
      return diffDays;
    }
  }
};
exports.rentMixin = rentMixin;
