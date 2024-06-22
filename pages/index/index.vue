<template>
	<scroll-view>
		<promo-banner 
		title="出租公告"
		subtitle="免费社区信息交换平台"
		description="无中介 ｜ 换房需求 ｜ 租房信息"
		 />
		
		  
		<!-- <house-item
			imageSrc="/static/rent-background.png"
			title="开饭群岛旺铺招租"
			details="整租 2室1厅1卫"
			address="北京市通州区嘉创路10号" />
			
		<house-item
			imageSrc="/static/rent-background.png"
			title="开饭群岛旺铺招租"
			details="整租 2室1厅1卫"
			address="北京市通州区嘉创路10号" /> -->
			
		<house-item
		        v-for="(item, index) in properties"
		        :key="index"
		        :imageSrc="item.tmp_image_url || '/static/default-placeholder.png'"
		        :title="item.rent_address"
		        :details="item.rent_type"
		        :address="item.tags"
		      />
	  
		<view v-if="properties.length === 0" class="no-data">
		  <house-item
		  	imageSrc=""
		  	title=""
		  	details=""
		  	address="" />
		</view>
			
	</scroll-view>
	<button v-if="!noMoreData" @click="loadMore" class="load-more-button">加载更多</button>
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
			  noMoreData: false,
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
			    await this.attachPropertiesWithTmpImage();
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
</style>
