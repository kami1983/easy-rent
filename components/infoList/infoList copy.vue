<template>
	<view class="container">
	  <view class="property-list">
	    <view class="property-item" v-for="(item, index) in properties" :key="index">
	      <view class="property-content">
	        <view class="property-details">
	          <view class="property-title">{{item.rent_area|parseInt}}平，{{ item.rent_address }}</view>
			  <view class="property-info">
			    权重：{{item.update_diff}},  租赁类型：{{ item.rent_type }}
			  </view>
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
			   properties: [],
			   page: 1,
			   limit: 10,
			 }
		},
		mounted() {
			this.fetchRentInfos();
		},
		methods: {
			
			async fetchRentInfos() {
				const app = getApp();
			    try {
			        // Assume callWithWxCloud is properly bound to Vue's global instance
			        const response = await app.globalData.callWithWxCloud({
			            path: '/user/rent-infos',
						data: {
							page: this.page,
							limit: this.limit
						},
			            method: 'GET'
			        });
			        if (response.status) {
						console.log('rent infos list, response - ', response)
						const backData = response.backData.map((item)=>{
							item.update_diff = 7 - this.calculateDateDifference(item.updated_at)
							return item
						})
			            this.properties = backData;
			        } else {
			            uni.showToast({
			                title: '获取数据失败',
			                icon: 'none'
			            });
			        }
			    } catch (error) {
			        console.error('请求错误:', error);
			        uni.showToast({
			            title: '网络或服务器错误',
			            icon: 'none'
			        });
			    }
			},
			calculateDateDifference(updatedAt) {
				console.log('updatedAt - ', updatedAt)
			    const now = new Date();
			    const updatedDate = new Date(updatedAt);
				console.log('updatedDate - ', updatedDate)
			    const diffTime = Math.abs(now - updatedDate);
			    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
			    return `${diffDays}`;
			}
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
  border-bottom: 1px solid #fff;
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