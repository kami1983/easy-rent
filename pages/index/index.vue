<template>
	<scroll-view>
		<promo-banner 
		title="优势信息通"
		subtitle="免费社区信息交换平台"
		description="福利信息 ｜ 二手交换 ｜ 社区信息"
		 />
			
		<house-item
		        v-for="(item, index) in properties"
		        :key="index"
		        :imageSrc="item.cover_image || '/static/default-placeholder.png'"
		        :title="item.rent_address"
		        :details="`${item.rent_type} | ${item.rent_area} 平米 `"
				:price="item.month_rent_price"
		        :tags="item.tags"
				:rentid="item.id"
		      />
	  
		<view v-if="properties.length === 0" class="no-data">
		  <house-item
		  	imageSrc=""
		  	title=""
		  	details=""
		  	address="" />
			
		</view>
		<button v-if="!noMoreData" @click="loadMore" class="button load-more-button">加载更多</button>
		<button v-if="noMoreData" @click="navigateTo('/pages/operLinks/index')" class="button add-button">添加</button>
		<!-- <button @click="showUserInfos()" class="button add-button">Show User</button>
		<textarea v-model="this.debugInfos" placeholder="请输入更多详细描述" ></textarea>
		<button open-type="chooseAvatar" @chooseavatar="onChooseAvatar" class="button add-button">获取用户信息</button> -->
		
	</scroll-view>
	
</template>

<script>
	
	import promoBanner from '@/components/promoBanner/promoBanner.vue';
	import houseItem from '@/components/houseItem/houseItem.vue';
	import rentMixin from '@/libs/data-tools.js';
	
	export default {
		mixins: [rentMixin],
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
			  debugInfos: ''
			}
		},
		onLoad() {
			console.log('onLoad: start.')
			
		},
		mounted() {
			this.fetchData()
		},
		onShareAppMessage(){

			return {
			    title: '优势信息通 - 免费社区服务消息',
			    path: '/page/index?share_id=123&share_type=1'  // 假设你要分享的页面路径
			};
		},
		onShareTimeline() {
			return {
			    title: '优势信息通 - 免费社区服务消息',
			    path: '/page/index?share_id=123&share_type=1'  // 假设你要分享的页面路径
			};
		},
		methods: {
			loadMore() {
			  if (!this.noMoreData) {
			    this.fetchRentInfos();
			  }
			},
			async fetchData() {
			    console.log('Fetching data and attaching images.');
			    await this.fetchRentInfos();
			    // await this.attachPropertiesWithTmpImage();
			},
			navigateTo(page) {
			  uni.navigateTo({
			    url: page
			  });
			},
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
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
	
	.number-input {
		width: 100%;
		padding-bottom: 10px;
		padding-top: 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		color: RED;
	}
	
	/* General button styling */
	.button {
	  padding: 10px 10px;
	  margin: 10px;
	  border: none;
	  border-radius: 5px;
	  color: white;
	  font-size: 16px;
	  cursor: pointer;
	  outline: none;
	  transition: background-color 0.3s ease;
	}
	
	/* Styling for the '添加' button */
	.add-button {
	  background-color: #4CAF50; /* Green background */
	}
	
	.add-button:hover {
	  background-color: #45a049; /* Darker green on hover */
	}
	
	/* Styling for the '加载更多' button */
	.load-more-button {
	  background-color: #2196F3; /* Blue background */
	}
	
	.load-more-button:hover {
	  background-color: #0b7dda; /* Darker blue on hover */
	}
	
</style>
