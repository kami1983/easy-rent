"use strict";
const common_vendor = require("../../common/vendor.js");
const NumberInput = () => "../../components/numberInput/numberInput.js";
const HouseSpecPicker = () => "../../components/selectPicker/selectPicker.js";
const RentTypePicker = () => "../../components/radioPicker/radioPicker.js";
const TagsPicker = () => "../../components/tagsPicker/tagsPicker.js";
const MapPicker = () => "../../components/mapPicker/mapPicker.js";
const ImagePicker = () => "../../components/imagePicker/imagePicker.js";
const _sfc_main = {
  components: {
    NumberInput,
    HouseSpecPicker,
    RentTypePicker,
    TagsPicker,
    MapPicker,
    ImagePicker
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
      const formattedMonth = month < 10 ? `0${month}` : `${month}`;
      const formattedDay = day < 10 ? `0${day}` : `${day}`;
      const app = getApp();
      const cloudApi = await app.globalData.getCloudApi;
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
    onRentTypeChange(newType) {
      this.rentForm.rent_form_rent_type = newType;
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
          image_urls: formCloudImageIds,
          status: 0,
          type: 0
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
    handleMapTap(e) {
      this.mapLocation.latitude = e.latitude;
      this.mapLocation.longitude = e.longitude;
      console.log("RUN e", e);
    },
    handleImageListUpdate(newImageList) {
      console.log("newImageList", newImageList);
      this.imageList = newImageList;
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
if (!Array) {
  const _component_ImagePicker = common_vendor.resolveComponent("ImagePicker");
  const _component_NumberInput = common_vendor.resolveComponent("NumberInput");
  const _component_RentTypePicker = common_vendor.resolveComponent("RentTypePicker");
  const _component_HouseSpecPicker = common_vendor.resolveComponent("HouseSpecPicker");
  const _component_TagsPicker = common_vendor.resolveComponent("TagsPicker");
  const _component_MapPicker = common_vendor.resolveComponent("MapPicker");
  (_component_ImagePicker + _component_NumberInput + _component_RentTypePicker + _component_HouseSpecPicker + _component_TagsPicker + _component_MapPicker)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.handleImageListUpdate),
    b: common_vendor.p({
      ["initial-image-list"]: $data.imageList
    }),
    c: common_vendor.o($options.onRentFormMonthRentPriceChanged),
    d: common_vendor.p({
      placeholder: "请输入月租价格",
      ["class-name"]: "number-input"
    }),
    e: common_vendor.o($options.onRentTypeChange),
    f: common_vendor.p({
      options: $data.rentTypes,
      selected: $data.rentForm.rent_form_rent_type
    }),
    g: common_vendor.o($options.onRentFormRentAreaChanged),
    h: common_vendor.p({
      placeholder: "请输入租赁面积",
      ["class-name"]: "number-input"
    }),
    i: $data.rentForm.rent_form_address,
    j: common_vendor.o(($event) => $data.rentForm.rent_form_address = $event.detail.value),
    k: common_vendor.o($options.onSpecChange),
    l: common_vendor.p({
      ["multi-array"]: $data.multiArray
    }),
    m: common_vendor.o($options.toggleTag),
    n: common_vendor.p({
      tags: $data.tags
    }),
    o: common_vendor.o($options.handleMapTap),
    p: common_vendor.p({
      longitude: $data.mapLocation.longitude,
      latitude: $data.mapLocation.latitude,
      markers: $data.mapLocation.markers,
      isLocationAuthorized: $data.isLocationAuthorized
    }),
    q: $data.contactInformation.isChecked,
    r: common_vendor.o((...args) => $options.toggleContactInformation && $options.toggleContactInformation(...args)),
    s: this.contactInformation.isChecked
  }, this.contactInformation.isChecked ? {
    t: this.contactInformation.inputData,
    v: common_vendor.o(($event) => this.contactInformation.inputData = $event.detail.value)
  } : {}, {
    w: $data.cashDiscount.isChecked,
    x: common_vendor.o((...args) => $options.toggleCashDiscount && $options.toggleCashDiscount(...args)),
    y: this.cashDiscount.isChecked
  }, this.cashDiscount.isChecked ? {
    z: common_vendor.o($options.onCashDiscountChanged),
    A: common_vendor.p({
      placeholder: "优惠金额(数值)",
      ["class-name"]: "number-input"
    })
  } : {}, {
    B: $data.additionalDetails.isChecked,
    C: common_vendor.o((...args) => $options.toggleAdditionalDetails && $options.toggleAdditionalDetails(...args)),
    D: this.additionalDetails.isChecked
  }, this.additionalDetails.isChecked ? {
    E: this.additionalDetails.inputData,
    F: common_vendor.o(($event) => this.additionalDetails.inputData = $event.detail.value)
  } : {}, {
    G: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-097448e0"], ["__file", "/Users/kami-m1/work-files/coding/git-files/kami-self/contact-us/easy-rent/pages/inputRentInfos/index.vue"]]);
wx.createPage(MiniProgramPage);
