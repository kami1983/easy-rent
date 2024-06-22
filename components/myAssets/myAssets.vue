<template>
	<view class="container">
		<view class="tabs">
			<view 
				class="tab" 
				:class="{ active: currentTab === 'rent' }" 
				@click="switchTab('rent')">我的出租</view>
			<view 
				class="tab" 
				:class="{ active: currentTab === 'search' }" 
				@click="switchTab('search')">我的公告</view>
			<view
				class="tab" 
				:class="{ active: currentTab === 'feedback' }" 
				@click="switchTab('feedback')">工单反馈</view>
		</view>
		
		<view class="content">
			<view v-if="currentTab === 'rent'">
				<info-list></info-list>
			</view>
			<view v-if="currentTab === 'search'">
				B
			</view>
			<view v-if="currentTab === 'feedback'">
				C
			</view>
		</view>
		
	</view>
</template>

<script>
	import infoList from '@/components/infoList/infoList.vue';

	export default {
		props: {
			initialTab: {
			    type: String,
			    default: 'rent'
			}
		},
		components: {
		    infoList
		},
		data() {
			return {
			    currentTab: this.initialTab
			};
		},
		created() {
			console.log('DEBUG- My assets created with initial tab:', this.currentTab)
		},
		methods: {
			switchTab(tab) {
			  this.currentTab = tab;
			}
		}
	}
</script>

<style>
.container {
  background-color: #fff;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
}

.tabs {
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #eee;
}

.tab {
  flex: 1;
  padding: 10px 0;
  text-align: center;
  cursor: pointer;
  font-weight: bold;
  color: #000;
}

.tab.active {
  background-color: #f0f0f0;
  /* border-bottom: 2px solid #1e88e5; */
}

.content {
  padding: 10px;
  background-color: #f0f0f0;
}

</style>