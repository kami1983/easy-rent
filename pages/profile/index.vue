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
		onLoad() {
		  const app = getApp();
		  this.userInfo = app.globalData.userInfo;
		  // console.log(this.userInfo)
		},
		data() {
			return {
				userInfo: {}
			}
		},
		methods: {

		}
	}
</script>

<style>
	
</style>