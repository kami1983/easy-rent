// mixins/rentMixin.js
// data() {
// 	return {
// 	  properties: [],
// 	  page: 1,
// 	  limit: 10,
// 	  noMoreData: false,
// 	}
// },
export default {
	
    methods: {
        async fetchRentInfos() {
			return await this.fetchRentInfosListWithApi('/rent-infos', {
				page: this.page,
				limit: this.limit,
				type: 1,
				status: 1
			});
        },
		async fetchRentDetailById(rentid) {
			return await this.callCloudApi('/rent-detail', 'GET', {rentid});
		},
		// async fetchRentInfosOnMine(){
		// 	return await this.fetchRentInfosListWithApi('/user/rent-infos', {
		// 		page: this.page,
		// 		limit: this.limit,
		// 		type: 1
		// 	});
		// },
		async fetchRentInfosOnMine() {
		    if (this.isLoading) return;
		    this.isLoading = true;
		    try {
		        const result = await this.fetchRentInfosListWithApi('/user/rent-infos', {
		            page: this.page,
		            limit: this.limit
		        });
		        // 处理 result
		    } catch (error) {
		        console.error('请求错误:', error);
		    } finally {
		        this.isLoading = false;
		    }
		},
		async fetchFavoritesOnMine(){
			return await this.fetchRentInfosListWithApi('/user/favorites/list', {
				page: this.page,
				limit: this.limit
			});
		},
		async fetchRentInfosListWithApi(api_path, data_param={}) {
			const app = getApp();
			
			try {
			    const response = await app.globalData.callWithWxCloud({
			        path: api_path,
			        data: data_param,
			        method: 'GET'
			    });
				console.log('DEBUG- response data:', response.backData)
			    if (response.status) {
					
			        const newProperties = response.backData.map(item => ({
			            ...item,
			            update_diff: 7 - this.calculateDateDifference(item.updated_at),
			        }));
					
			        this.properties = [...this.properties, ...newProperties];
			        if (newProperties.length < this.limit) {
			            this.noMoreData = true;
			        } else {
			            this.page++;
			        }
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
		async callCloudApi(api_path, method='GET', data_param={}) {
		    const app = getApp();
			
		    try {
		        const response = await app.globalData.callWithWxCloud({
		            path: api_path,
		            data: data_param,
		            method
		        });
				return response
		    } catch (error) {
		        console.error('请求错误:', error);
		        uni.showToast({
		            title: '网络或服务器错误',
		            icon: 'none'
		        });
		    }
		},
		async attachPropertiesWithTmpImage() {
			console.log('attachPropertiesWithTmpImage 2 ', await this.properties)
		    const imagePromises = this.properties.map(async property => {
		        if (property.cover_image) { // Assuming each property has a cloudFileId
		            const tmpImageUrl = await this.convertCloudFileToTmpImage(property.cover_image);
		            return {
		                ...property,
		                tmp_image_url: tmpImageUrl || '' // Use a default image if URL retrieval fails
		            };
		        } else {
		            return {
		                ...property,
		                tmp_image_url: '' // Default image if no cloudFileId
		            };
		        }
		    });

		    this.properties = await Promise.all(imagePromises); // Update properties with images
		},
		async convertCloudFileToTmpImage(cloudFileId){
			const app = getApp();
			const cloudApi = await app.globalData.getCloudApi;
			console.log('cloudApi - on data-tools.js', cloudApi)
		
			try {
			    const res = await cloudApi.getTempFileURL({
			        fileList: [cloudFileId]
			    });
			    return res.fileList[0].tempFileURL; // 返回URL
			} catch (err) {
			    console.error('Failed to get URL', err);
			    return null;
			}
		},
        async getCloudImagesListByRentId(rentId) {
            const app = getApp();
            try {
                const response = await app.globalData.callWithWxCloud({
                    path: '/user/rent-images',
                    data: { rentid: rentId },
                    method: 'GET'
                });
                if (response.status) {
                    return response.backData.map(image => ({
                        id: image.id,
                        url: image.image_url,
                        createdAt: image.created_at,
                        updatedAt: image.updated_at
                    }));
                } else {
                    uni.showToast({
                        title: '图片加载失败',
                        icon: 'none'
                    });
                    return [];
                }
            } catch (error) {
                console.error('请求错误:', error);
                uni.showToast({
                    title: '网络或服务器错误',
                    icon: 'none'
                });
                return [];
            }
        },
		addFavoriteToDb(rentId, type = 1, status = 1, title = "Default Title") {
		    const app = getApp();
		    const data = {
		        rentid: rentId,
		        type: type,
		        status: status,
		        title: title
		    };
			
			console.log('addFavoriteToDb - data:', data)
		
		    app.globalData.callWithWxCloud({
		        path: '/user/favorite/add',
		        data: data,
		        method: 'POST'
		    })
		    .then(response => {
		        if (response.status) {
		            uni.showToast({
		                title: '收藏成功',
		                icon: 'success'
		            });
		        } else {
		            uni.showToast({
		                title: response.error || '已存在',
		                icon: 'none'
		            });
		        }
		    })
		    .catch(error => {
		        console.error('添加收藏失败:', error);
		        uni.showToast({
		            title: '网络或服务器错误',
		            icon: 'none'
		        });
		    });
		},
		calculateDateDifference(updatedAt) {
		    const now = new Date();
		    const updatedDate = new Date(updatedAt);
		    const diffTime = Math.abs(now - updatedDate);
		    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		    return diffDays;
		}
    }
};
