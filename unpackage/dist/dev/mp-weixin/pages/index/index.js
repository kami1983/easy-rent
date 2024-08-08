"use strict";
const common_vendor = require("../../common/vendor.js");
const libs_dataTools = require("../../libs/data-tools.js");
const promoBanner = () => "../../components/promoBanner/promoBanner.js";
const houseItem = () => "../../components/houseItem/houseItem.js";
const _sfc_main = {
  mixins: [libs_dataTools.rentMixin],
  components: {
    promoBanner,
    houseItem
  },
  data() {
    return {
      properties: [],
      page: 1,
      limit: 10,
      noMoreData: true,
      debugInfos: ""
    };
  },
  onLoad() {
    console.log("onLoad: start.");
  },
  mounted() {
    this.fetchData();
  },
  onShareAppMessage() {
    const app = getApp();
    const openId = app.globalData.userInfo.open_id ? app.globalData.userInfo.open_id : "";
    return {
      title: "优势信息通 - 免费社区服务消息",
      path: `/pages/index/index?share_id=${openId}&share_type=1`
      // 假设你要分享的页面路径
    };
  },
  onShareTimeline() {
    const app = getApp();
    const openId = app.globalData.userInfo.open_id ? app.globalData.userInfo.open_id : "";
    return {
      title: "优势信息通 - 免费社区服务消息",
      path: `/pages/index/index?share_id=${openId}&share_type=1`
      // 假设你要分享的页面路径
    };
  },
  methods: {
    loadMore() {
      if (!this.noMoreData) {
        this.fetchRentInfos();
      }
    },
    async fetchData() {
      console.log("Fetching data and attaching images.");
      await this.fetchRentInfos();
    },
    navigateTo(page) {
      common_vendor.index.navigateTo({
        url: page
      });
    }
    // onChooseAvatar(event) {
    // 	// this.debugInfos='Hello'
    // 	// console.log('event = ', event)
    // 	const avatarUrl = event.detail.avatarUrl;
    // 	console.log('avatarUrl = ', avatarUrl)
    // },
    // showUserInfos(){
    // 	if(wx.cloud) {
    // 		uni.showToast({
    // 		    title: 'wx.cloud is true',
    // 		    icon: 'none'
    // 		});
    // 	 wx.getUserProfile({
    // 	      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途
    // 	      success: (res) => {
    // 	        console.log(res.userInfo);
    // 	        // 此处可以获取到用户信息并处理，如存储、展示等
    // 			this.debugInfos=`${res.userInfo.avatarUrl}#${res.userInfo.nickName} | Greet`
    // 	      },
    // 	      fail: (err) => {
    // 	        console.error('获取用户信息失败', err);
    // 	      }
    // 	    });
    // 		wx.getSetting({
    // 		  success: (res) => {
    // 		    console.log('res = ', res.authSetting);
    // 		  },
    // 		  fail: (err) => {
    // 		    console.error('获取设置失败', err);
    // 		  }
    // 		});
    // 	}
    // }
  }
};
if (!Array) {
  const _component_promo_banner = common_vendor.resolveComponent("promo-banner");
  const _component_house_item = common_vendor.resolveComponent("house-item");
  (_component_promo_banner + _component_house_item)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      title: "优势信息通",
      subtitle: "免费社区信息交换平台",
      description: "福利信息 ｜ 闲置物品 ｜ 求租寻租"
    }),
    b: common_vendor.f($data.properties, (item, index, i0) => {
      return {
        a: index,
        b: "3464396f-1-" + i0,
        c: common_vendor.p({
          imageSrc: item.cover_image || "/static/default-placeholder.png",
          title: item.rent_address,
          baseItem: item,
          price: item.month_rent_price,
          tags: item.tags,
          rentid: item.id
        })
      };
    }),
    c: $data.properties.length === 0
  }, $data.properties.length === 0 ? {
    d: common_vendor.p({
      imageSrc: "",
      title: "",
      details: "",
      address: ""
    })
  } : {}, {
    e: !$data.noMoreData
  }, !$data.noMoreData ? {
    f: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  } : {}, {
    g: $data.noMoreData
  }, $data.noMoreData ? {
    h: common_vendor.o(($event) => $options.navigateTo("/pages/operLinks/index"))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/kami-m1/work-files/coding/git-files/kami-self/contact-us/easy-rent/pages/index/index.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
