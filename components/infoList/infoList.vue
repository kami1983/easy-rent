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
                            <view class="property-info">权重：{{ item.update_diff }}, 租赁类型：{{ item.rent_type }}</view>
                        </view>
                        <view class="action-section">
							<button class="action-button" @click="refreshRent(item.id)">顶3</button>

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
    data() {
        return {
			lastTapTime: 0, // 存储上次点击时间
            properties: [],
            page: 1,
            limit: 10,
            noMoreData: false,
        }
    },
    mounted() {
        this.fetchRentInfosOnMine();
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
		    const app = getApp();
		    try {
		        const response = await app.globalData.callWithWxCloud({
		            path: '/user/refresh-rent',
		            data: { rentid: rentId },
		            method: 'GET'
		        });
				
				console.log('DEBU /user/refresh-rent ', {rentId, response })
		        if (response.status) {
		            uni.showToast({
		                title: '权重提升',
		                icon: 'success'
		            });
		
		            // Find the index of the property to update
		            const index = this.properties.findIndex(item => item.id === rentId);
		            if (index !== -1) {
		                // Update the property in the array
		                this.$set(this.properties, index, {
		                    ...this.properties[index],
		                    ...response.backData,
		                    update_diff: 7 - this.calculateDateDifference(response.backData.updated_at) // Assuming the backend sends the updated_at field
		                });
		            }
		        } else {
		            uni.showToast({
		                title: '更新失败',
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
		confirmDeletion(item) {
			console.log('confirmDeletion --- ')
		    uni.showModal({
		        title: '确认删除',
		        content: `ID[${item.id}] | ${parseInt(item.rent_area)}平，${item.rent_address}`,
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
		async deleteImageFromCloud(fileID) {
		    const app = getApp();
		    const cloudApi = await app.globalData.getCloudApi;
		
		    try {
		        const res = await new Promise((resolve, reject) => {
		            cloudApi.deleteFile({
		                fileList: [fileID], // Array of file IDs
		                success: res => {
							console.log(' deleteFile - res -- ', res)
		                    if (res.fileList[0].status === 0) {
		                        resolve(res.fileList[0]); // Resolve promise if delete succeeds
		                    } else {
		                        reject(`Deletion failed: ${res.fileList[0].errMsg}`);
		                    }
		                },
		                fail: err => {
		                    reject(err); // Reject promise if API call fails
		                }
		            });
		        });
		        console.log('Delete ok', res);
		        return res; // Return the delete operation result
		    } catch (err) {
		        console.error('Delete failed', err);
		        return null; // Return null in case of an error
		    }
		},
		
		async deleteProperty(rentId) {
			// 获取某个 rentId 对应的图片
			
		    console.log('Deleting property with ID:', rentId);
			
			const rentList = await this.getCloudImagesListByRentId(rentId)
			console.log('rentList 2 - ', rentList)
			
			//
			if(rentList.length > 0) {
				// Delete all images associated with this rentId
				const deletePromises = rentList.map(item => {
					console.log('Will delete image: ', item)
					uni.showToast({
						title: `删除图片${item.id}`,
					    icon: 'success'
					});
				    return this.deleteImageFromCloud(item.url);
				});
					
				// Wait for all images to be deleted
				await Promise.all(deletePromises);
				console.log('All images deleted successfully.');
			}
			
			const app = getApp();
			try {
			    const response = await app.globalData.callWithWxCloud({
			        path: '/user/delete-rent',
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
    background-color: #1e88e5;
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
</style>
