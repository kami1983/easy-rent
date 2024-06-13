"use strict";
const common_vendor = require("../../common/vendor.js");
const NumberInput = () => "../../components/numberInput/numberInput.js";
const HouseSpecPicker = () => "../../components/selectPicker/selectPicker.js";
const _sfc_main = {
  components: {
    NumberInput,
    HouseSpecPicker
  },
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
        ["一室A", "二室B", "三室", "四室"],
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
      const formattedMonth = month < 10 ? `0${month}` : `${month}`;
      const formattedDay = day < 10 ? `0${day}` : `${day}`;
      const app = getApp();
      const cloudApi = await app.globalData.getCloudApi;
      console.log("cloudApi = ", cloudApi);
      try {
        const res = await new Promise((resolve, reject) => {
          cloudApi.uploadFile({
            cloudPath: `mini/easy-rent/${year}-${formattedMonth}-${formattedDay}/${filename}`,
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
    onSpecChange(newIndex) {
      console.log("Selected indices:", newIndex);
      this.multiIndex = newIndex;
    },
    handleInput(event) {
      console.log("HandleInput runing.");
      const value = event.detail.value;
      const filteredValue = value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
      console.log({ value, filteredValue });
      if (value !== filteredValue) {
        return filteredValue;
      }
      this.cashDiscount.inputData = value;
      return value;
    },
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 9 - this.imageList.length,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: async (res) => {
          console.log("tmp file path: ", res.tempFilePaths);
          this.imageList = this.imageList.concat(res.tempFilePaths);
        }
      });
    },
    onRentFormMonthRentPriceChanged(e) {
      this.rentForm.rent_form_month_rent_price = e;
    },
    onRentFormRentAreaChanged(e) {
      this.rentForm.rent_form_rent_area = e;
    },
    onCashDiscountChanged(e) {
      this.cashDiscount.inputData = e;
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
    async updateImageList() {
      let formCloudImageIds = [];
      for (const idx in this.imageList) {
        const tmpImg = this.imageList[idx];
        const processId = parseInt(idx) + 1;
        common_vendor.index.showLoading({
          title: `上传中 ${processId}/${this.imageList.length}`,
          // 显示当前进度
          mask: true
          // 防止用户触摸屏幕
        });
        try {
          const cloudImageId = await this.updateImageToCloud(tmpImg);
          formCloudImageIds.push(cloudImageId);
        } catch (error) {
          common_vendor.index.showToast({
            title: "上传失败",
            icon: "none"
          });
          formCloudImageIds = [];
          console.error("上传失败:", error);
        } finally {
          common_vendor.index.hideLoading();
        }
      }
      return formCloudImageIds;
    },
    async submitForm() {
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
      if (!this.imageList.length) {
        common_vendor.index.showToast({
          title: "请至少上传一张图片",
          icon: "none"
        });
        return;
      }
      if (!formMonthRentPrice || isNaN(Number(formMonthRentPrice)) || Number(formMonthRentPrice) <= 0) {
        common_vendor.index.showToast({
          title: "请输入有效的月租价格",
          icon: "none"
        });
        return;
      }
      if (!formRentType) {
        common_vendor.index.showToast({
          title: "请选择租赁类型",
          icon: "none"
        });
        return;
      }
      if (!formRentArea || isNaN(Number(formRentArea)) || Number(formRentArea) <= 0) {
        common_vendor.index.showToast({
          title: "请输入有效的租赁面积",
          icon: "none"
        });
        return;
      }
      if (!(formRentAddress == null ? void 0 : formRentAddress.trim())) {
        common_vendor.index.showToast({
          title: "租赁地址不能为空",
          icon: "none"
        });
        return;
      }
      const formCloudImageIds = await this.updateImageList();
      console.log("已经上传的图片 - ", formCloudImageIds);
      if (formCloudImageIds.length > 0) {
        const post_data = {
          month_rent_price: formMonthRentPrice,
          rent_type: formRentType,
          rent_area: formRentArea,
          rent_address: formRentAddress,
          room_structure: formHouseStruct,
          location_longitude: formLocationPoint[0],
          location_latitude: formLocationPoint[1],
          contact_information: formContractInformation,
          cash_discount: formCashDiscount,
          additional_details: formAdditionalDetails,
          tags: formActiveTags,
          image_urls: formCloudImageIds
        };
        console.log("Debug form infos:", post_data);
        const app = getApp();
        common_vendor.index.showLoading({
          title: `提交中`,
          // 显示当前进度
          mask: true
          // 防止用户触摸屏幕
        });
        app.globalData.callWithWxCloud({
          path: "/insertRentInfos",
          method: "POST",
          data: post_data
        }).then((res) => {
          console.log("Debug res", res);
          if (res && res.status) {
            common_vendor.index.showToast({
              title: "成功等待审核",
              icon: "success",
              duration: 2e3,
              complete: () => {
                setTimeout(() => {
                  common_vendor.index.switchTab({
                    url: "/pages/profile/index"
                  });
                  common_vendor.index.hideLoading();
                }, 2e3);
              }
            });
          } else {
            common_vendor.index.showToast({
              title: `数据提交失败: ${res.status}`,
              icon: "none"
            });
            common_vendor.index.hideLoading();
          }
        }).catch((err) => {
          console.log("请求错误", err);
          common_vendor.index.showToast({
            title: "网络或服务器错误",
            icon: "none"
          });
          common_vendor.index.hideLoading();
        });
      }
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
      console.log("onMapTap -- debug , old ", [latitude, longitude]);
      console.log("onMapTap - -- debug chage latitude & longitude.", [this.mapLocation.latitude, this.mapLocation.longitude]);
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
if (!Array) {
  const _component_NumberInput = common_vendor.resolveComponent("NumberInput");
  const _component_HouseSpecPicker = common_vendor.resolveComponent("HouseSpecPicker");
  (_component_NumberInput + _component_HouseSpecPicker)();
}
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
    d: common_vendor.o($options.onRentFormMonthRentPriceChanged),
    e: common_vendor.p({
      placeholder: "请输入月租价格",
      ["class-name"]: "number-input"
    }),
    f: common_vendor.f($data.rentTypes, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: item,
        c: $data.rentForm.rent_form_rent_type === item,
        d: index
      };
    }),
    g: common_vendor.o((...args) => $options.onRentTypeChange && $options.onRentTypeChange(...args)),
    h: common_vendor.o($options.onRentFormRentAreaChanged),
    i: common_vendor.p({
      placeholder: "请输入租赁面积",
      ["class-name"]: "number-input"
    }),
    j: $data.rentForm.rent_form_address,
    k: common_vendor.o(($event) => $data.rentForm.rent_form_address = $event.detail.value),
    l: common_vendor.t($data.multiArray[0][$data.multiIndex[0]]),
    m: common_vendor.t($data.multiArray[1][$data.multiIndex[1]]),
    n: common_vendor.t($data.multiArray[2][$data.multiIndex[2]]),
    o: common_vendor.o((...args) => $options.bindMultiPickerColumnChange && $options.bindMultiPickerColumnChange(...args)),
    p: $data.multiIndex,
    q: $data.multiArray,
    r: common_vendor.o($options.onSpecChange),
    s: common_vendor.p({
      label: "Test",
      ["multi-array"]: $data.multiArray
    }),
    t: common_vendor.f($data.tags, (tag, index, i0) => {
      return {
        a: common_vendor.t(tag.name),
        b: index,
        c: tag.active ? 1 : "",
        d: common_vendor.o(($event) => $options.toggleTag(index), index)
      };
    }),
    v: $data.mapLocation.longitude,
    w: $data.mapLocation.latitude,
    x: common_vendor.o((...args) => $options.onMapTap && $options.onMapTap(...args)),
    y: $data.mapLocation.markers,
    z: !$data.isLocationAuthorized
  }, !$data.isLocationAuthorized ? {
    A: common_vendor.o((...args) => $options.requestLocationPermission && $options.requestLocationPermission(...args))
  } : {}, {
    B: $data.contactInformation.isChecked,
    C: common_vendor.o((...args) => $options.toggleContactInformation && $options.toggleContactInformation(...args)),
    D: this.contactInformation.isChecked
  }, this.contactInformation.isChecked ? {
    E: this.contactInformation.inputData,
    F: common_vendor.o(($event) => this.contactInformation.inputData = $event.detail.value)
  } : {}, {
    G: $data.cashDiscount.isChecked,
    H: common_vendor.o((...args) => $options.toggleCashDiscount && $options.toggleCashDiscount(...args)),
    I: this.cashDiscount.isChecked
  }, this.cashDiscount.isChecked ? {
    J: common_vendor.o($options.onCashDiscountChanged),
    K: common_vendor.p({
      placeholder: "优惠金额(数值)",
      ["class-name"]: "number-input"
    })
  } : {}, {
    L: $data.additionalDetails.isChecked,
    M: common_vendor.o((...args) => $options.toggleAdditionalDetails && $options.toggleAdditionalDetails(...args)),
    N: this.additionalDetails.isChecked
  }, this.additionalDetails.isChecked ? {
    O: this.additionalDetails.inputData,
    P: common_vendor.o(($event) => this.additionalDetails.inputData = $event.detail.value)
  } : {}, {
    Q: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-097448e0"], ["__file", "/Users/kami-m1/work-files/coding/git-files/kami-self/contact-us/easy-rent/pages/inputRentInfos/index.vue"]]);
wx.createPage(MiniProgramPage);
