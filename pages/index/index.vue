<template>
	<scroll-view>
		<promo-banner 
		title="出租公告"
		subtitle="免费社区信息交换平台"
		description="无中介 ｜ 换房需求 ｜ 租房信息"
		 />
		<!-- <testApis/> -->
		<house-item 
			imageSrc="/static/rent-background.png"
			title="开饭群岛旺铺招租"
			details="整租 2室1厅1卫"
			address="北京市通州区嘉创路10号" />
		  
		<house-item
			imageSrc="/static/rent-background.png"
			title="开饭群岛旺铺招租"
			details="整租 2室1厅1卫"
			address="北京市通州区嘉创路10号" />
			
		<house-item
			imageSrc="/static/rent-background.png"
			title="开饭群岛旺铺招租"
			details="整租 2室1厅1卫"
			address="北京市通州区嘉创路10号" />
			
		<!-- <button type="primary" @click="buttonClick_changeText">修改文字内容</button>
		<button @click="buttonClick_showHide">点击让文字组件显示或消失</button>
		<button @click="buttonClick_changeColor">修改文字颜色</button> -->
	</scroll-view>
	<label>{{inputData}}</label>
	<NumberInput @onChange="onChange" placeholder="NUMBER" class-name="number-input" />
</template>

<script>
	
	import promoBanner from '@/components/promoBanner/promoBanner.vue';
	import houseItem from '@/components/houseItem/houseItem.vue';
	// import pageHead from '@/components/pageHead/pageHead.vue';
	
	import NumberInput from '@/components/numberInput/numberInput.vue';
	
	export default {
		components: {
			NumberInput,
			promoBanner,
			houseItem
		},
		data() {
			return {
				title: 'Hello',
				inputData: '*',
			}
		},
		onLoad() {

		},
		methods: {
			onChange(e) {
				console.log('Good ')
				console.log('value ', e)
				this.inputData = e
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
