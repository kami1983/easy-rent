"use strict";
const common_vendor = require("../common/vendor.js");
const rentMixin = {
  methods: {
    async fetchRentInfos() {
      return await this.fetchRentInfosListWithApi("/rent-infos", {
        page: this.page,
        limit: this.limit,
        type: 0,
        status: 1
      });
    },
    async fetchRentDetailById(rentid) {
      return await this.callCloudApi("/rent-detail", "GET", { rentid });
    },
    // async fetchRentInfosOnMine(){
    // 	return await this.fetchRentInfosListWithApi('/user/rent-infos', {
    // 		page: this.page,
    // 		limit: this.limit,
    // 		type: 1
    // 	});
    // },
    async fetchRentInfosOnMine() {
      if (this.isLoading)
        return;
      this.isLoading = true;
      try {
        const result = await this.fetchRentInfosListWithApi("/user/rent-infos", {
          page: this.page,
          limit: this.limit
        });
      } catch (error) {
        console.error("请求错误:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchFavoritesOnMine() {
      return await this.fetchRentInfosListWithApi("/user/favorites/list", {
        page: this.page,
        limit: this.limit
      });
    },
    async fetchRentInfosListWithApi(api_path, data_param = {}) {
      const app = getApp();
      try {
        const response = await app.globalData.callWithWxCloud({
          path: api_path,
          data: data_param,
          method: "GET"
        });
        console.log("DEBUG- response data:", response.backData);
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
    async callCloudApi(api_path, method = "GET", data_param = {}) {
      const app = getApp();
      try {
        const response = await app.globalData.callWithWxCloud({
          path: api_path,
          data: data_param,
          method
        });
        return response;
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
    async updateImageToCloud(tmpFile, subDir = "") {
      const parts = tmpFile.split("/");
      const filename = parts[parts.length - 1];
      const now = /* @__PURE__ */ new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const formattedMonth = month < 10 ? `0${month}` : `${month}`;
      const formattedDay = day < 10 ? `0${day}` : `${day}`;
      const app = getApp();
      const cloudApi = await app.globalData.getCloudApi;
      try {
        const res = await new Promise((resolve, reject) => {
          cloudApi.uploadFile({
            cloudPath: `mini/easy-rent/${subDir}${year}-${formattedMonth}-${formattedDay}/${filename}`,
            // Storage path in the cloud
            filePath: tmpFile,
            // Local file path obtained from file selection or chat interfaces
            config: {
              env: "prod-4g3usz1465b5625e"
              // Cloud environment ID
            },
            success: (res2) => {
              resolve(res2.fileID);
            },
            fail: (err) => {
              reject(err);
            }
          });
        });
        console.log("Update ok", res);
        return res;
      } catch (err) {
        console.error("Update failed", err);
        return null;
      }
    },
    addFavoriteToDb(rentId, type = 1, status = 1, title = "Default Title") {
      const app = getApp();
      const data = {
        rentid: rentId,
        type,
        status,
        title
      };
      console.log("addFavoriteToDb - data:", data);
      app.globalData.callWithWxCloud({
        path: "/user/favorite/add",
        data,
        method: "POST"
      }).then((response) => {
        if (response.status) {
          common_vendor.index.showToast({
            title: "收藏成功",
            icon: "success"
          });
        } else {
          common_vendor.index.showToast({
            title: response.error || "已存在",
            icon: "none"
          });
        }
      }).catch((error) => {
        console.error("添加收藏失败:", error);
        common_vendor.index.showToast({
          title: "网络或服务器错误",
          icon: "none"
        });
      });
    },
    updateShareCounter(shareObj) {
      const news_id = shareObj.news_id;
      const share_id = shareObj.share_id;
      console.log("updateShareCounter - ", { news_id, share_id });
      if (!news_id || !share_id) {
        return null;
      }
      console.log("Try to update the database.");
      const chain_type = "";
      const chain_hash = "";
      const type = 1;
      const status = 1;
      const app = getApp();
      const data = {
        news_id,
        share_id,
        chain_type,
        chain_hash,
        type,
        status
      };
      app.globalData.callWithWxCloud({
        path: "/share_counter/insert",
        data,
        method: "POST"
      }).then((response) => {
        console.log("记录分享数据", response);
      }).catch((error) => {
        console.error("记录分享数据失败:", error);
      });
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
