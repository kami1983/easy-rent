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
		<button  v-if="!noMoreData" @click="loadMore" class="button load-more-button">加载更多</button>
		<button  v-if="noMoreData" @click="navigateTo('/pages/operLinks/index')" class="button add-button">添加</button>
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
			}
		},
		onLoad() {
			console.log('onLoad: start.')
			
		},
		mounted() {
			this.fetchData()
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
			}
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
