"use strict";
const common_vendor = require("../../common/vendor.js");
const libs_dataTools = require("../../libs/data-tools.js");
const TagsPicker = () => "../../components/tagsPicker/tagsPicker.js";
const MapPicker = () => "../../components/mapPicker/mapPicker.js";
const _sfc_main = {
  mixins: [libs_dataTools.rentMixin],
  components: {
    TagsPicker,
    MapPicker
  },
  data() {
    return {
      rentDetails: {
        id: 0,
        title: "",
        time: "",
        price: "",
        type: 0,
        description: ""
      },
      mapLocation: {
        markers: [],
        latitude: null,
        longitude: null
      },
      tags: [],
      imageList: []
    };
  },
  onLoad(options) {
    const rentid = options.rentid;
    if (rentid) {
      this.fetchData(rentid);
    } else {
      console.error("No rentid provided");
      common_vendor.index.showToast({
        title: "无效的房源信息",
        icon: "none"
      });
    }
  },
  methods: {
    convertRoomStructureToText(structure = "1,1,0") {
      const multiArray = [
        ["一室", "二室", "三室", "四室"],
        ["开间", "一厅", "两厅"],
        ["一卫", "双卫", "三卫"]
      ];
      const indices = structure.split(",").map((index) => parseInt(index));
      if (indices.length !== multiArray.length) {
        console.error("结构字符串格式不正确");
        return "结构字符串格式不正确";
      }
      const roomDescription = indices.map((index, i) => {
        if (index >= 0 && index < multiArray[i].length) {
          return multiArray[i][index];
        } else {
          console.error("索引超出范围");
          return "";
        }
      }).filter((desc) => desc !== "");
      return roomDescription.join(", ");
    },
    async fetchData(rentId) {
      const res = await this.fetchRentDetailById(rentId);
      console.log("detail res - ", res);
      if (res && res.status) {
        this.rentDetails = {
          id: rentId,
          title: res.backData.rent_address,
          type: res.backData.type,
          time: new Date(res.backData.updated_at).toLocaleString(),
          price: parseFloat(res.backData.month_rent_price).toFixed(2),
          description: res.backData.additional_details,
          roomStructure: this.convertRoomStructureToText(res.backData.room_structure),
          rentType: res.backData.rent_type,
          rentArea: res.backData.rent_area,
          contactInformation: res.backData.contact_information
        };
        this.mapLocation = {
          longitude: parseFloat(res.backData.location_longitude),
          latitude: parseFloat(res.backData.location_latitude),
          markers: [parseFloat(res.backData.location_latitude), parseFloat(res.backData.location_longitude)]
        };
        this.tags = res.backData.tags.split(",").map((tag) => ({ name: tag, active: true }));
        const rentList = await this.getCloudImagesListByRentId(rentId);
        this.imageList = rentList;
      } else {
        console.error("Failed to fetch rent details");
      }
    },
    isPhoneNumber(phoneNumber) {
      const phoneNumberRegex = /^\d{11}$/;
      return phoneNumberRegex.test(phoneNumber);
    },
    makePhoneCall() {
      common_vendor.index.makePhoneCall({
        phoneNumber: this.rentDetails.contactInformation,
        // 这里填写你要联系的电话号码
        success() {
          console.log("拨打电话成功！");
        },
        fail(err) {
          console.error("拨打电话失败：", err);
          common_vendor.index.showModal({
            title: "错误",
            content: "无法拨打电话，请稍后重试",
            showCancel: false
          });
        }
      });
    },
    addFavorite() {
      const rentId = this.rentDetails.id;
      const title = this.rentDetails.title;
      this.addFavoriteToDb(rentId, 1, 1, title);
    },
    navigateToLocation() {
      const latitude = this.mapLocation.latitude;
      const longitude = this.mapLocation.longitude;
      const name = this.rentDetails.title;
      const address = this.rentDetails.title;
      common_vendor.index.openLocation({
        latitude,
        longitude,
        name,
        address,
        scale: 18,
        success() {
          console.log("导航功能已启动");
        },
        fail(err) {
          console.log("导航功能启动失败", err);
          common_vendor.index.showModal({
            title: "错误",
            content: "无法启动导航功能，请检查权限设置",
            showCancel: false
          });
        }
      });
    }
  }
};
if (!Array) {
  const _component_TagsPicker = common_vendor.resolveComponent("TagsPicker");
  const _component_MapPicker = common_vendor.resolveComponent("MapPicker");
  (_component_TagsPicker + _component_MapPicker)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.rentDetails.title),
    b: common_vendor.t($data.rentDetails.time),
    c: $data.rentDetails.type == 1
  }, $data.rentDetails.type == 1 ? {
    d: common_vendor.t($data.rentDetails.price)
  } : {}, {
    e: $data.rentDetails.type == 2
  }, $data.rentDetails.type == 2 ? {
    f: common_vendor.t($data.rentDetails.price)
  } : {}, {
    g: common_vendor.p({
      tags: $data.tags
    }),
    h: $data.rentDetails.type == 1
  }, $data.rentDetails.type == 1 ? {
    i: common_vendor.t($data.rentDetails.roomStructure)
  } : {}, {
    j: $data.rentDetails.type == 1
  }, $data.rentDetails.type == 1 ? {
    k: common_vendor.t($data.rentDetails.rentType)
  } : {}, {
    l: $data.rentDetails.type == 1
  }, $data.rentDetails.type == 1 ? {
    m: common_vendor.t($data.rentDetails.rentArea)
  } : {}, {
    n: $data.rentDetails.contactInformation
  }, $data.rentDetails.contactInformation ? {
    o: common_vendor.t($data.rentDetails.contactInformation)
  } : {}, {
    p: $data.rentDetails.description
  }, $data.rentDetails.description ? {
    q: common_vendor.t($data.rentDetails.description)
  } : {}, {
    r: $data.mapLocation.longitude
  }, $data.mapLocation.longitude ? {
    s: common_vendor.p({
      longitude: $data.mapLocation.longitude,
      latitude: $data.mapLocation.latitude,
      markers: $data.mapLocation.markers,
      canUpdateMarkers: false,
      enableScroll: false,
      isLocationAuthorized: true
    })
  } : {}, {
    t: $data.mapLocation.longitude
  }, $data.mapLocation.longitude ? {
    v: common_vendor.o((...args) => $options.navigateToLocation && $options.navigateToLocation(...args))
  } : {}, {
    w: common_vendor.f($data.imageList, (image, index, i0) => {
      return {
        a: image.url,
        b: index
      };
    }),
    x: common_vendor.o((...args) => $options.addFavorite && $options.addFavorite(...args)),
    y: $options.isPhoneNumber($data.rentDetails.contactInformation)
  }, $options.isPhoneNumber($data.rentDetails.contactInformation) ? {
    z: common_vendor.o((...args) => $options.makePhoneCall && $options.makePhoneCall(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/kami-m1/work-files/coding/git-files/kami-self/contact-us/easy-rent/pages/rentDetail/index.vue"]]);
wx.createPage(MiniProgramPage);
