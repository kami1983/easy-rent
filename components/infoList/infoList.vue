<template>
	<view class="container">
	  <view class="property-list">
	    <view class="property-item" v-for="(item, index) in properties" :key="index">
	      <view class="property-content">
	        <view class="property-details">
	          <view class="property-title">{{ item.title }}</view>
	          <view class="property-info">更新时间：{{ item.updateTime }} 权重：{{ item.weight }}</view>
	        </view>
	        <view class="action-section">
	          <button class="action-button">顶起</button>
	        </view>
	      </view>
	    </view>
		<view v-if="properties.length === 0" class="no-data">
		    <text>没有数据</text>
		</view>
	  </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			   properties: [
			     { title: '李庄家园北区 - 98平南北通透', updateTime: '2024-06-02', weight: 10 },
			     { title: '李庄家园北区 - 98平南北通透', updateTime: '2024-06-02', weight: 10 },
				 { title: '李庄家园北区 - 98平南北通透', updateTime: '2024-06-02', weight: 10 },
				 { title: '李庄家园北区 - 98平南北通透', updateTime: '2024-06-02', weight: 10 },
				 { title: '李庄家园北区 - 98平南北通透', updateTime: '2024-06-02', weight: 10 },
				 { title: '李庄家园北区 - 98平南北通透', updateTime: '2024-06-02', weight: 10 },
				 { title: '李庄家园北区 - 98平南北通透', updateTime: '2024-06-02', weight: 10 },
				 { title: '李庄家园北区 - 98平南北通透', updateTime: '2024-06-02', weight: 10 },
				 { title: '李庄家园北区 - 98平南北通透', updateTime: '2024-06-02', weight: 10 },
				 { title: '李庄家园北区 - 98平南北通透', updateTime: '2024-06-02', weight: 10 },
			     { title: '李庄家园北区 - 98平南北通透', updateTime: '2024-06-02', weight: 10 }
			   ]
			 }
		},
		methods: {
			
		}
	}
</script>

<style>


.property-list {
  display: flex;
  flex-direction: column;
}

.no-data {
  text-align: center;
  padding: 20px;
}

.property-item {
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}

.property-content {
  display: flex;
  flex-direction: row;
}

.property-details {
  flex: 1;
  justify-content: center;
}

.property-title {
  font-size: 16px;
  font-weight: bold;
}

.property-info {
  font-size: 14px;
  color: #666;
}

.action-section {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.action-button {
  background-color: #1e88e5;
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  border: none;
}
</style>