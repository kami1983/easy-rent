// mixins/rentMixin.js
export default {
    methods: {
        async fetchRentInfos() {
            const app = getApp();
            try {
                const response = await app.globalData.callWithWxCloud({
                    path: '/user/rent-infos',
                    data: {
                        page: this.page,
                        limit: this.limit
                    },
                    method: 'GET'
                });
                if (response.status) {
                    const newProperties = response.backData.map(item => ({
                        ...item,
                        update_diff: 7 - this.calculateDateDifference(item.updated_at)
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
        }
    }
};
