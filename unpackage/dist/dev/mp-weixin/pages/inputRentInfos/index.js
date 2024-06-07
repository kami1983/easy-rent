"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      mapLocation: {
        markers: [],
        latitude: 23.099994,
        longitude: 113.32452
      },
      imageList: [],
      isLocationAuthorized: false,
      tags: [
        { name: "非中介", active: false },
        { name: "电梯房", active: false },
        { name: "南北通透", active: false },
        { name: "明厨明卫", active: false },
        { name: "不临街", active: false },
        { name: "精装修", active: false },
        { name: "带家电", active: false },
        { name: "高楼层", active: false },
        { name: "带露台", active: false },
        { name: "学区房", active: false },
        { name: "商住两用", active: false }
      ],
      rentForm: {
        rent_form_rent_type: "",
        rent_form_payment_method: "",
        rent_form_month_rent_price: "",
        rent_form_pictures: []
      },
      rentTypes: ["整租", "合租", "转租"],
      paymentMethods: ["月付", "季付", "半年付", "年付"],
      multiArray: [
        ["一室", "二室", "三室", "四室"],
        ["开间", "一厅", "两厅"],
        ["一卫", "双卫", "三卫"]
      ],
      multiIndex: [0, 0, 0],
      cashDiscount: {
        isChecked: false,
        inputData: ""
      },
      contactInformation: {
        isChecked: false,
        inputData: ""
      },
      additionalDetails: {
        isChecked: false,
        inputData: ""
      }
    };
  },
  mounted() {
    this.checkLocationAuthorization();
    this.getUserLocation();
  },
  methods: {
    async updateImageToCloud(tmpFile) {
      const parts = tmpFile.split("/");
      const filename = parts[parts.length - 1];
      const now = /* @__PURE__ */ new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const formattedMonth = month < 10 ? `0${month}` : month;
      const formattedDay = day < 10 ? `0${day}` : day;
      const app = getApp();
      const cloudApi = await app.globalData.getCloudApi;
      console.log("cloudApi = ", cloudApi);
      cloudApi.uploadFile({
        cloudPath: `mini/easy-rent/${year}-${formattedMonth}-${formattedDay}/${filename}`,
        // 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
        filePath: tmpFile,
        // 微信本地文件，通过选择图片，聊天文件等接口获取
        config: {
          env: "prod-4g3usz1465b5625e"
          // 微信云托管环境ID
        },
        success: (res) => {
          console.log("Update ok ", res);
          return res.fileID;
        },
        fail: (err) => {
          console.log("Update failed ", err);
          return null;
        }
      });
    },
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 9 - this.imageList.length,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: async (res) => {
          console.log("tmp file path: ", res.tempFilePaths);
          this.imageList = this.imageList.concat(res.tempFilePaths);
          const tmpUrl = res.tempFilePaths[0];
          const cloudFileId = await this.updateImageToCloud(tmpUrl);
          console.log("cloudFileId - ", cloudFileId);
        }
      });
    },
    deleteImage(index) {
      this.imageList.splice(index, 1);
    },
    checkLocationAuthorization() {
      common_vendor.index.getSetting({
        success: (res) => {
          if (res.authSetting["scope.userLocation"]) {
            this.isLocationAuthorized = true;
          } else {
            this.isLocationAuthorized = false;
          }
        }
      });
    },
    bindChange(e) {
      const val = e.detail.value;
      this.selectedRoom = this.roomStruct.rooms[val[0]];
      this.selectedHall = this.roomStruct.halls[val[1]];
      this.selectedBathroom = this.roomStruct.bathrooms[val[2]];
    },
    onRentTypeChange(event) {
      this.rentForm.rent_form_rent_type = event.detail.value;
    },
    onPaymentMethodChange(event) {
      const index = event.detail.value;
      this.rentForm.rent_form_payment_method = this.paymentMethods[index];
    },
    submitForm() {
      console.log("提交的表单数据:", this.imageList);
      const formCloudImageIds = this.imageList.map((id) => {
        return id;
      });
      const formMonthRentPrice = this.rentForm.rent_form_month_rent_price;
      const formRentType = this.rentForm.rent_form_rent_type;
      const formRentArea = this.rentForm.rent_form_rent_area;
      const formRentAddress = this.rentForm.rent_form_address;
      const formHouseStruct = this.multiIndex.map((struct) => {
        return struct;
      });
      const activeTags = this.tags.filter((tag) => tag.active);
      const formActiveTags = activeTags.map((tag) => tag.name);
      const formLocationPoint = [this.mapLocation.longitude, this.mapLocation.latitude];
      const formContractInformation = this.contactInformation.inputData;
      const formCashDiscount = this.cashDiscount.inputData;
      const formAdditionalDetails = this.additionalDetails.inputData;
      console.log("Debug form infos:", {
        formCloudImageIds,
        formCloudImageIds,
        formMonthRentPrice,
        formRentType,
        formRentArea,
        formRentAddress,
        formHouseStruct,
        formActiveTags,
        formLocationPoint,
        formContractInformation,
        formCashDiscount,
        formAdditionalDetails
      });
    },
    toggleContactInformation(event) {
      console.log("Debug. toggleCashDiscount --  ", this.contactInformation.isChecked);
      this.contactInformation.isChecked = event.detail.value.includes("checked");
    },
    toggleCashDiscount(event) {
      console.log("Debug. toggleCashDiscount --  ", this.cashDiscount.isChecked);
      this.cashDiscount.isChecked = event.detail.value.includes("checked");
    },
    toggleAdditionalDetails(event) {
      console.log("Debug. additionalDetails --  ", this.additionalDetails.isChecked);
      this.additionalDetails.isChecked = event.detail.value.includes("checked");
    },
    toggleTag(index) {
      this.tags[index].active = !this.tags[index].active;
    },
    getUserLocation() {
      console.log("---- 请求用户的地理位置权限");
      common_vendor.index.authorize({
        scope: "scope.userLocation",
        success: () => {
          console.log("---- 权限授予后，获取当前位置");
          common_vendor.index.getLocation({
            type: "wgs84",
            success: (res) => {
              this.mapLocation.latitude = res.latitude;
              this.mapLocation.longitude = res.longitude;
              console.log("DEBUG  --- 获取位置成功", res);
              console.log("OLD this.mapLocation = ", this.mapLocation);
              this.mapLocation.markers = [{
                id: 0,
                latitude: res.latitude,
                longitude: res.longitude,
                width: 20,
                height: 30
              }];
              this.mapLocation.latitude = res.latitude;
              this.mapLocation.longitude = res.longitude;
              console.log("NEW this.mapLocation = ", this.mapLocation);
            },
            fail: () => {
              console.log("DEBUG  --- 位置获取失败");
              common_vendor.index.showToast({
                title: "获取位置失败",
                icon: "none"
              });
            }
          });
        },
        fail: () => {
          common_vendor.index.showModal({
            title: "位置权限未授权",
            content: "请在设置中打开位置权限",
            showCancel: false
          });
        }
      });
    },
    onMapTap(e) {
      console.log("onMapTap - -- debug.");
      const latitude = e.detail.latitude;
      const longitude = e.detail.longitude;
      this.mapLocation.markers = [{
        // iconPath: "/static/logo.png",
        id: 0,
        latitude,
        longitude,
        width: 20,
        height: 30
      }];
      this.mapLocation.latitude = latitude;
      this.mapLocation.longitude = longitude;
    },
    requestLocationPermission() {
      common_vendor.index.authorize({
        scope: "scope.userLocation",
        success: () => {
          console.log("位置授权成功A");
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
    },
    bindMultiPickerColumnChange: function(e) {
      console.log("修改的列为：" + e.detail.column + "，值为：" + e.detail.value);
      this.multiIndex[e.detail.column] = e.detail.value;
      this.$forceUpdate();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.imageList, (img, index, i0) => {
      return {
        a: img,
        b: common_vendor.o(($event) => $options.deleteImage(index), index),
        c: index
      };
    }),
    b: $data.imageList.length < 9
  }, $data.imageList.length < 9 ? {
    c: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args))
  } : {}, {
    d: $data.rentForm.rent_form_month_rent_price,
    e: common_vendor.o(($event) => $data.rentForm.rent_form_month_rent_price = $event.detail.value),
    f: common_vendor.f($data.rentTypes, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: item,
        c: $data.rentForm.rent_form_rent_type === item,
        d: index
      };
    }),
    g: common_vendor.o((...args) => $options.onRentTypeChange && $options.onRentTypeChange(...args)),
    h: $data.rentForm.rent_form_rent_area,
    i: common_vendor.o(($event) => $data.rentForm.rent_form_rent_area = $event.detail.value),
    j: $data.rentForm.rent_form_address,
    k: common_vendor.o(($event) => $data.rentForm.rent_form_address = $event.detail.value),
    l: common_vendor.t($data.multiArray[0][$data.multiIndex[0]]),
    m: common_vendor.t($data.multiArray[1][$data.multiIndex[1]]),
    n: common_vendor.t($data.multiArray[2][$data.multiIndex[2]]),
    o: common_vendor.o((...args) => $options.bindMultiPickerColumnChange && $options.bindMultiPickerColumnChange(...args)),
    p: $data.multiIndex,
    q: $data.multiArray,
    r: common_vendor.f($data.tags, (tag, index, i0) => {
      return {
        a: common_vendor.t(tag.name),
        b: index,
        c: tag.active ? 1 : "",
        d: common_vendor.o(($event) => $options.toggleTag(index), index)
      };
    }),
    s: $data.mapLocation.longitude,
    t: $data.mapLocation.latitude,
    v: common_vendor.o((...args) => $options.onMapTap && $options.onMapTap(...args)),
    w: $data.mapLocation.markers,
    x: !$data.isLocationAuthorized
  }, !$data.isLocationAuthorized ? {
    y: common_vendor.o((...args) => $options.requestLocationPermission && $options.requestLocationPermission(...args))
  } : {}, {
    z: $data.contactInformation.isChecked,
    A: common_vendor.o((...args) => $options.toggleContactInformation && $options.toggleContactInformation(...args)),
    B: this.contactInformation.isChecked
  }, this.contactInformation.isChecked ? {
    C: this.contactInformation.inputData,
    D: common_vendor.o(($event) => this.contactInformation.inputData = $event.detail.value)
  } : {}, {
    E: $data.cashDiscount.isChecked,
    F: common_vendor.o((...args) => $options.toggleCashDiscount && $options.toggleCashDiscount(...args)),
    G: this.cashDiscount.isChecked
  }, this.cashDiscount.isChecked ? {
    H: this.cashDiscount.inputData,
    I: common_vendor.o(($event) => this.cashDiscount.inputData = $event.detail.value)
  } : {}, {
    J: $data.additionalDetails.isChecked,
    K: common_vendor.o((...args) => $options.toggleAdditionalDetails && $options.toggleAdditionalDetails(...args)),
    L: this.additionalDetails.isChecked
  }, this.additionalDetails.isChecked ? {
    M: this.additionalDetails.inputData,
    N: common_vendor.o(($event) => this.additionalDetails.inputData = $event.detail.value)
  } : {}, {
    O: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-097448e0"], ["__file", "/Users/kami-m1/work-files/coding/git-files/kami-self/contact-us/easy-rent/pages/inputRentInfos/index.vue"]]);
wx.createPage(MiniProgramPage);
