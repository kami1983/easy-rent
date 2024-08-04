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
      noMoreData: true
    };
  },
  onLoad() {
    console.log("onLoad: start.");
  },
  mounted() {
    this.fetchData();
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
      description: "福利信息 ｜ 二手交换 ｜ 社区信息"
    }),
    b: common_vendor.f($data.properties, (item, index, i0) => {
      return {
        a: index,
        b: "3464396f-1-" + i0,
        c: common_vendor.p({
          imageSrc: item.cover_image || "/static/default-placeholder.png",
          title: item.rent_address,
          details: `${item.rent_type} | ${item.rent_area} 平米 `,
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
wx.createPage(MiniProgramPage);
