<template>
  <view class="container">
    <!-- Header with title and price -->
    <view class="header">
      <text class="title">{{ rentDetails.title }}</text>
      <text class="time">{{ rentDetails.time }}</text>
      <text class="price">¥ {{ rentDetails.price }}</text>
    </view>

	<view class="info-section">
	  <TagsPicker :tags="tags" />
	</view>
	
    <!-- Description -->	
	<view class="description">
	      <view class="description-text">房屋结构：{{ rentDetails.roomStructure }}</view>
	      <view class="description-text">租赁形式：{{ rentDetails.rentType }}</view>
	      <view class="description-text">租赁面积：{{ rentDetails.rentArea }}平米</view>
		  <view v-if="rentDetails.contactInformation" class="description-text">联系方式：{{ rentDetails.contactInformation }}</view>
		  <view v-if="rentDetails.description" class="description-text">
			  <view class="more-description">附加信息：</view>
			  <view>{{ rentDetails.description }}</view>
		  </view>
	</view>

    <!-- Map -->
    <MapPicker v-if="mapLocation.longitude" :longitude="mapLocation.longitude"
               :latitude="mapLocation.latitude"
               :markers="mapLocation.markers"
               :canUpdateMarkers="false"
			   :enableScroll="false"
               :isLocationAuthorized="true"	/>
			   	
    <button v-if="mapLocation.longitude" @tap="navigateToLocation" class="navigate-button">导航</button>
	
    <!-- Images -->
	<view class="img-section">
	  <view v-for="(image, index) in imageList" :key="index" class="image-item">
	    <image :src="image.url" mode="aspectFill" />
	  </view>
	</view>

    <!-- Action Buttons -->
    <view class="action-buttons">
      <button open-type="share">分享</button>
	  <button @tap="addFavorite">收藏</button>
      <button v-if="rentDetails.contactInformation" @tap="makePhoneCall">打电话</button>
    </view>
  </view>
</template>

<script>

import TagsPicker from '@/components/tagsPicker/tagsPicker.vue';
import MapPicker from '@/components/mapPicker/mapPicker.vue';
import rentMixin from '@/libs/data-tools.js';

export default {
  mixins: [rentMixin],
  components: {
    TagsPicker,
    MapPicker
  },
  data() {
    return {
      rentDetails: {
		id: 0,  
        title: '',
        time: '',
        price: '',
        description: ''
      },
      mapLocation: {
        markers: [],
        latitude: null,
        longitude: null
      },
      tags: [],
      imageList: []
    };
  },
  onLoad(options) {
    // 获取传递的 rentid 参数
    const rentid = options.rentid;
    if (rentid) {
      this.fetchData(rentid);
    } else {
      console.error('No rentid provided');
      uni.showToast({
        title: '无效的房源信息',
        icon: 'none'
      });
    }
  },
  methods: {
	convertRoomStructureToText(structure = "1,1,0") {
	    const multiArray = [
	        ['一室', '二室', '三室', '四室'],
	        ['开间', '一厅', '两厅'],
	        ['一卫', '双卫', '三卫']
	    ];
	    
	    // 将传入的结构字符串 "1,1,0" 分割成数组 [1, 1, 0]
	    const indices = structure.split(',').map(index => parseInt(index));
	    
	    // 验证索引数组长度与 multiArray 长度匹配
	    if (indices.length !== multiArray.length) {
	        console.error("结构字符串格式不正确");
	        return "结构字符串格式不正确";
	    }
	
	    // 映射索引到对应的描述文本
	    const roomDescription = indices.map((index, i) => {
	        if (index >= 0 && index < multiArray[i].length) {
	            return multiArray[i][index];
	        } else {
	            console.error("索引超出范围");
	            return ""; // 如果索引不正确，返回空字符串
	        }
	    }).filter(desc => desc !== ""); // 过滤掉空字符串
	
	    // 连接描述部分生成最终的字符串
	    return roomDescription.join(", ");
	}, 
    async fetchData(rentId) {
      const res = await this.fetchRentDetailById(rentId);
      if (res && res.status) {
        this.rentDetails = {
		  id: rentId,
          title: res.backData.rent_address,
          time: new Date(res.backData.updated_at).toLocaleString(),
          price: parseFloat(res.backData.month_rent_price).toFixed(2),
          description: res.backData.additional_details,
          roomStructure: this.convertRoomStructureToText(res.backData.room_structure),
          rentType: res.backData.rent_type,
          rentArea: res.backData.rent_area,
		  contactInformation: res.backData.contact_information
        };
        this.mapLocation = {
          longitude: parseFloat(res.backData.location_longitude),
          latitude: parseFloat(res.backData.location_latitude),
          markers: [parseFloat(res.backData.location_latitude), parseFloat(res.backData.location_longitude)]
        };
        this.tags = res.backData.tags.split(',').map(tag => ({ name: tag, active: true }));
		const rentList = await this.getCloudImagesListByRentId(rentId)
        this.imageList = rentList;
      } else {
        console.error('Failed to fetch rent details');
      }
    },
    makePhoneCall() {
      uni.makePhoneCall({
        phoneNumber: this.rentDetails.contactInformation, // 这里填写你要联系的电话号码
        success() {
          console.log('拨打电话成功！');
        },
        fail(err) {
          console.error('拨打电话失败：', err);
          uni.showModal({
            title: '错误',
            content: '无法拨打电话，请稍后重试',
            showCancel: false
          });
        }
      });
    },
    addFavorite() {
      // 调用 /user/favorite/add 
	  const rentId = this.rentDetails.id
	  const title = this.rentDetails.title
	  this.addFavoriteToDb(rentId, 1, 1, title)
    },
    navigateToLocation() {
      // 指定目的地的经纬度和名称
      const latitude = this.mapLocation.latitude; 
      const longitude = this.mapLocation.longitude; 
      const name = this.rentDetails.title; // 如商场、办公楼等
      const address = this.rentDetails.title; // 如街道或地区描述

      // 调用微信API
      uni.openLocation({
        latitude: latitude,
        longitude: longitude,
        name: name,
        address: address,
        scale: 18,
        success() {
          console.log('导航功能已启动');
        },
        fail(err) {
          console.log('导航功能启动失败', err);
          uni.showModal({
            title: '错误',
            content: '无法启动导航功能，请检查权限设置',
            showCancel: false
          });
        }
      });
    }
  }
};

</script>

<style>
/* .container {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #fff;
} */

.container {
  display: flex;
  flex-direction: column;
  padding: 20px;
  padding-bottom: 60px; /* 增加足够的底部内边距，以容纳底部栏 */
  background-color: #fff;
}

.price {
  font-size: 24px;
  color: red;
  font-weight: bold;
}

.description {
  padding: 15px;
  background-color: #f8f8f8;
}
.description-text {
  font-size: 20px;
  color: #666;
}

.description-text .more-description {

}

.map {
  width: 100%;
  height: 200px;
  margin-bottom: 20px;
}

.image-gallery .swiper-container {
  height: 250px; /* Adjusted for better visibility */
  margin-bottom: 20px;
}

.slide-image {
  width: 100%;
  height: 100%;
}


.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.time {
  font-size: 20px;
  margin-bottom: 10px;
  color: #666;
}

.price {
  font-size: 24px;
  color: red;
  font-weight: bold;
}

.info-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}



.img-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
}

.label {
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
}

.info-buttons {
  display: flex;
  justify-content: space-around;
  width: 100%;
}

.info-button {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 15px;
  padding: 5px 20px;
  font-size: 14px;
  color: #333;
}


/* 
.image-item image {
  width: calc(100% - 40px); 
  height: auto; 
} */

/* 导航按钮的样式 */
.navigate-button {
  display: block;
  width: 80%; /* 按钮宽度 */
  margin: 0px auto; /* 上下边距为20px，水平居中 */
  padding: 0px 0; /* 上下填充12px，左右0 */
  background-color: #4CAF50; /* 按钮背景色 */
  color: #ffffff; /* 文字颜色 */
  text-align: center; /* 文本居中 */
  font-size: 16px; /* 文字大小 */
  border-radius: 5px; /* 边框圆角 */
  border: none; /* 无边框 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
  transition: background-color 0.3s; /* 背景颜色变化过渡效果 */
}

/* 导航按钮的悬停和点击效果 */
.navigate-button:hover,
.navigate-button:active {
  background-color: #45a049; /* 按钮悬停或点击时的背景色 */
}
	
/* .action-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
} */

.action-buttons button {
  flex-grow: 1;
  text-align: center;
  padding: 0px 0;
  font-size: 16px;
  color: #fff;
  background-color: #007AFF;
  border: none;
  border-radius: 5px;
  margin: 0 5px;
}

.action-buttons {
  display: flex;
  justify-content: space-around;
  position: fixed; /* 设置为固定位置 */
  bottom: 0; /* 锚定到视口的底部 */
  left: 0; /* 从左侧开始 */
  right: 0; /* 也从右侧开始 */
  background-color: #fff; /* 背景颜色，根据需要进行更改 */
  box-shadow: 0 -2px 5px rgba(0,0,0,0.1); /* 添加阴影 */
  padding: 10px 20px; /* 上下内边距10px，左右20px */
}

/* .action-buttons button {
  flex-grow: 1;
  text-align: center;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  background-color: #007AFF;
  border: none;
  border-radius: 5px;
  margin: 0 5px;
} */

</style>
