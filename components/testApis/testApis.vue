<template>
  <!-- #ifdef APP -->
  <scroll-view class="page-scroll-view">
  <!-- #endif -->
    <view class="page">
      <page-head :title="title"></page-head>
      <view class="service-item" v-for="(item, index) in serviceList" :key="index">
        <text class="service-name">{{item.name}}:</text>
        <view class="provider-list">
          <text class="provider-item" v-for="(item2, index2) in item.provider" :key="index2">{{item2}}</text>
        </view>
      </view>
      <button class="btn-get-provider" type="primary" @click="getProvider">getProvider</button>
    </view>
  <!-- #ifdef APP -->
  </scroll-view>
  <!-- #endif -->
</template>

<script>
  type ProviderItem = {
    service : string,
    name : string,
    provider : string[]
  }

  export default {
    data() {
      return {
        title: 'provider',
        serviceList: [
          { service: "oauth", name: "登陆", provider: [] },
          { service: "share", name: "分享", provider: [] },
          { service: "payment", name: "支付", provider: [] },
          { service: "push", name: "推送", provider: [] },
          { service: "location", name: "定位", provider: [] }
        ] as ProviderItem[]
      };
    },
    methods: {
      getProvider() {
        // this.serviceList.forEach((item : ProviderItem) => {
        //   uni.getProvider({
        //     service: item.service,
        //     success: (e) => {
        //       this.updateProvider(e.service, e.provider);
        //     }
        //   });
        // });
      },
      updateProvider(service : string, provider : string[]) {
        // const item : ProviderItem | null = this.serviceList.find((item : ProviderItem) : boolean => {
        //   return item.service == service;
        // });
        // if (item != null) {
        //   item.provider = provider;
        // }
      }
    }
  }
</script>

<style>
  .page {
    padding: 15px;
  }

  .service-item {
    margin-top: 10px;
  }

  .service-name {
    font-weight: bold;
  }

  .provider-list {
    margin-left: 32px;
  }

  .provider-item {
    line-height: 1.5;
  }

  .btn-get-provider {
    margin-top: 30px;
  }
</style>

