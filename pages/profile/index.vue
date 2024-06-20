<template>
	<scroll-view class="container">
		<view>
		<login-register :user-info="userInfo"></login-register>
		</view>
		<view>
		<my-assets></my-assets>
		</view>
	</scroll-view>
</template>

<script>
	
	import loginRegister from '@/components/loginRegister/loginRegister.vue';
	import myAssets from '../../components/myAssets/myAssets.vue';
	
	
	export default {
		components: {
			loginRegister,
			myAssets
		},
		onPullDownRefresh() {
			console.log('onPullDownRefresh -- RUN == DEBUG 1 ')
			// this.getGoodsList(() => uni.stopPullDownRefresh())
		},
		// 触底的事件
		onReachBottom() {
		  console.log('onReachBottom -- RUN == DEBUG 2 ')
		},
		onLoad() {
		  const app = getApp();
		  this.userInfo = app.globalData.userInfo;
		  // console.log(this.userInfo)
		},
		data() {
			return {
				userInfo: {}
			}
		}
	}
</script>

<style>
	
</style>