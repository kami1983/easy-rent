<template>
	<scroll-view class="container">
		<view>
		<login-register :user-info="userInfo"></login-register>
		</view>
		<view>
		<my-assets :initial-tab="'rent'" :refresh-trigger="refreshCounter"></my-assets>
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
		},
		// 触底的事件
		onReachBottom() {
			console.log('onReachBottom -- RUN == DEBUG 2 ')
		},
		onShow() {
			console.log('On profile onShow')
			this.refreshCounter++;
		},
		onLoad() {
			const app = getApp();
			this.userInfo = app.globalData.userInfo;
		},
		data() {
			return {
				userInfo: {},
				refreshCounter: 0
			}
		}
	}
</script>

<style>
	
</style>