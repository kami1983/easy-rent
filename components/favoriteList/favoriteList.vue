<template>
    <view class="container">
        <scroll-view
            class="scroll-view"
            scroll-y
            :style="{ height: 'calc(100% - 40px)' }">
            <view class="property-list">
                <view class="property-item" v-for="(item, index) in properties" :key="index">
                    <view class="property-content" @click="handleTap(item)">
                        <view class="property-details">
                            <view class="property-title">{{ item.rent_area | parseInt }}平，{{ item.rent_address }}</view>
							<view class="property-info">
								租赁类型：{{ item.rent_type }} 
								<span :class="statusClass(item.status)">{{ statusText(item.status) }}</span>
							</view>
						</view>
                        <view class="action-section">
							<button class="action-button" @click="navigateTo('/pages/rentDetail/index?rentid=' + item.id)">&gt</button>
                        </view>
                    </view>
                </view>
                <view v-if="properties.length === 0" class="no-data">
                    <text>数据加载...</text>
                </view>
            </view>
        </scroll-view>
        <button v-if="!noMoreData" @click="loadMore" class="load-more-button">加载更多</button>
    </view>
</template>

<script>
	
import rentMixin from '@/libs/data-tools.js';

export default {
	mixins: [rentMixin],
	props: {
		refreshTrigger: Number
	},
    data() {
        return {
			lastTapTime: 0, // 存储上次点击时间
            properties: [],
            page: 1,
            limit: 10,
			isLoading: false,
            noMoreData: false
        }
    },
    mounted() {
        this.fetchFavoritesOnMine();
    },
	watch: {
	    refreshTrigger(newVal, oldVal) {
	        if (newVal !== oldVal) {
	            console.log('HELLO trigger： ', {newVal, oldVal})
				this.page = 1;
				this.limit = 10;
				this.properties = [];
				this.fetchFavoritesOnMine();
	        }
	    }
	},
    methods: {
		handleTap(item) {
		    const currentTime = new Date().getTime();
		    const tapGap = currentTime - this.lastTapTime;
		    this.lastTapTime = currentTime;
	
		    if (tapGap < 300 && tapGap > 0) { // 300毫秒内的点击认为是双击
		        this.confirmDeletion(item);
		    }
		},
		async refreshRent(rentId) {
		    console.log('ding ---- ')
		},
		confirmDeletion(item) {
			console.log('confirmDeletion --- ')
		    uni.showModal({
		        title: '确认删除',
		        content: `${parseInt(item.rent_area)}平，${item.rent_address}`,
		        success: (res) => {
		            if (res.confirm) {
		                console.log('用户点击确定');
		                this.deleteProperty(item.id);
		            } else if (res.cancel) {
		                console.log('用户点击取消');
		            }
		        }
		    });
		},
		navigateTo(page) {
		  uni.navigateTo({
		    url: page
		  });
		},
		async deleteProperty(rentId) {
			// 获取某个 rentId 对应的图片
			
		    console.log('Deleting property with ID:', rentId);
			
			const app = getApp();
			try {
			    const response = await app.globalData.callWithWxCloud({
			        path: '/user/favorite/del',
			        data: { rentid: rentId },
			        method: 'GET'
			    });
		
			    if (response.status) {
			        uni.showToast({
			            title: '删除成功',
			            icon: 'success'
			        });
		
			        // Remove the item from the properties list
			        const index = this.properties.findIndex(item => item.id === rentId);
			        if (index !== -1) {
			            this.properties.splice(index, 1);
			        }
			    } else {
			        uni.showToast({
			            title: response.message || '删除失败',
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
        loadMore() {
            this.fetchRentInfosOnMine();
        },
		statusText(status) {
		    switch (status) {
		        case 0: return '审核中';
		        case 1: return '上线中';
		        default: return '其他';
		    }
		},
		statusClass(status) {
		    switch (status) {
		        case 0: return 'status-pending';
		        case 1: return 'status-active';
		        default: return 'status-unknown';
		    }
		}
    }
}
</script>

<style scoped>
.scroll-view {
    width: 100%;
}
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
    background-color: #4CAF50;
    color: #fff;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 14px;
    border: none;
}
/* .load-more-button {
    width: 100%;
    background-color: #007AFF;
    color: white;
    padding: 10px;
    border-radius: 5px;
    font-size: 16px;
    margin-top: 10px;
} */
.load-more-button {
    width: auto;
    background-color: #007AFF;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 14px;
    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;
}


.status-pending {
	font-size: 12px;
    color: white;
    background-color: orange;
    border-radius: 5px;
    padding: 1px 6px;
    font-weight: bold;
}

.status-active {
	font-size: 12px;
    color: white;
    background-color: green;
    border-radius: 5px;
    padding: 1px 6px;
    font-weight: bold;
}

.status-unknown {
	font-size: 12px;
    color: white;
    background-color: gray;
    border-radius: 5px;
    padding: 1px 6px;
    font-weight: bold;
}

</style>
