<template>
  <view class="container">
	  
	<!-- 图片上传 -->
	<view class="form-item img-container">
		 <view class="image-list">
		   <view v-for="(img, index) in imageList" :key="index" class="image-item">
		     <image :src="img" class="image-preview"/>
		     <view class="delete-icon" @tap="deleteImage(index)">✖️</view>
		   </view>
		   <view v-if="imageList.length < 9" @tap="chooseImage" class="add-image">
		     <view class="icon">+</view>
		     <text>添加图片</text>
		   </view>
		 </view>
	</view>
	  
	<view class="form-item">
	   <text class="label">月租价格：（人民币）</text>
	   <input type="number" placeholder="请输入月租价格" v-model="rentForm.rent_form_month_rent_price" />
	</view>
			
    <!-- 租赁类型选择器 -->
    <view class="form-item">
      <radio-group @change="onRentTypeChange">
        <label class="radio-label" v-for="(item, index) in rentTypes" :key="index">
          <radio :value="item" :checked="rentForm.rent_form_rent_type === item">{{ item }}</radio>
        </label>
      </radio-group>
    </view>
	
	<view class="form-item">
	  <text class="label">租赁面积：（平米）</text>
	  <input type="number" placeholder="请输入租赁面积" v-model="rentForm.rent_form_rent_area" />
	</view>
	
	<view class="form-item">
	  <text class="label">租赁地址：</text>
	  <input type="text" placeholder="请输入租赁地址" v-model="rentForm.rent_form_address" />
	</view>
	
	<!-- #ifndef MP-ALIPAY -->
	<view class="form-item">
		<text class="label">房屋规格：</text>
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="uni-list-cell-db">
					<picker mode="multiSelector" @columnchange="bindMultiPickerColumnChange" :value="multiIndex" :range="multiArray">
						<view class="uni-input">{{multiArray[0][multiIndex[0]]}}，{{multiArray[1][multiIndex[1]]}}，{{multiArray[2][multiIndex[2]]}}</view>
					</picker>
				</view>
			</view>
		</view>
	</view>
	<!-- #endif -->
	

    <!-- 付款方式选择器 -->
    <!-- view class="form-item">
      <picker mode="selector" :range="paymentMethods" @change="onPaymentMethodChange">
        <view class="picker">{{ rentForm.rent_form_payment_method || '选择付款方式' }}</view>
      </picker>
    </view> -->

	<view class="form-item">
		<view class="label">其他描述:</view>
		<view class="tags">
		  <view v-for="(tag, index) in tags" :key="index" 
		    class="tag" :class="{ active: tag.active }"
		    @tap="toggleTag(index)">
		    {{ tag.name }}
		  </view>
		</view>
	</view>

    <!-- 地图展示 -->
    <view class="map-container">
		<map class="map"
			id="map"
			:longitude="mapLocation.longitude"
			:latitude="mapLocation.latitude"
			scale="14"
			show-location="true"
			@tap="onMapTap"
			:markers="mapLocation.markers">
			</map>
		<button v-if="!isLocationAuthorized" class="map-center-button" @tap="requestLocationPermission">点击授权位置</button>
    </view>
	
	<view class="form-item">
	  <checkbox-group @change="toggleContactInformation">
	    <label class="checkbox-label">
		  <checkbox value="checked" :checked="contactInformation.isChecked" />
	      联系方式（可选，电话或微信）
	    </label>
	  </checkbox-group>
	  <input v-if="this.contactInformation.isChecked" type="text" placeholder="请输入信息" v-model="this.contactInformation.inputData" />
	</view>
	
	<view class="form-item">
	  <checkbox-group @change="toggleCashDiscount">
	    <label class="checkbox-label">
		  <checkbox value="checked" :checked="cashDiscount.isChecked" />
	      返现优惠（给租户返现金，可选）
	    </label>
	  </checkbox-group>
	  <input v-if="this.cashDiscount.isChecked" type="text" placeholder="请输入信息" v-model="this.cashDiscount.inputData" />
	</view>

	<view class="form-item">
	  <checkbox-group @change="toggleAdditionalDetails">
	    <label class="checkbox-label">
		  <checkbox value="checked" :checked="additionalDetails.isChecked" />
	      补充信息（可选）
	    </label>
	  </checkbox-group>
	  <textarea v-if="this.additionalDetails.isChecked"  v-model="this.additionalDetails.inputData" placeholder="请输入更多详细描述" />
	</view>
	
    <button @click="submitForm" class="submit-button">提交信息</button>
  </view>
</template>

<script>
export default {
  data() {
	  
	  
    return {
		mapLocation: {
			markers: [],
			latitude: 23.099994,
			longitude: 113.324520
		},
		imageList: [],
		isLocationAuthorized: false ,
		tags: [
		  { name: '非中介', active: false },
		  { name: '电梯房', active: false },
		  { name: '南北通透', active: false },
		  { name: '明厨明卫', active: false },
		  { name: '不临街', active: false },
		  { name: '精装修', active: false },
		  { name: '带家电', active: false },
		  { name: '高楼层', active: false },
		  { name: '带露台', active: false },
		  { name: '学区房', active: false },
		  { name: '商住两用', active: false }
		],
      rentForm: {
        rent_form_rent_type: '',
        rent_form_payment_method: '',
        rent_form_month_rent_price: '',
        rent_form_pictures: [],
      },
      rentTypes: ['整租', '合租', '转租'],
      paymentMethods: ['月付', '季付', '半年付', '年付'],
	  multiArray: [
	  	['一室', '二室', '三室', '四室'],
	  	['开间', '一厅', '两厅'],
	  	['一卫', '双卫', '三卫']
	  ],
	  multiIndex: [0, 0, 0],
	  cashDiscount: {
		isChecked: false,
		inputData: ''
	  },
	  contactInformation: {
		isChecked: false,
		inputData: ''
	  },
	  additionalDetails: {
		isChecked: false,
		inputData: ''
	  }
    };
  },
  mounted() {
    this.checkLocationAuthorization();
	this.getUserLocation();
  },
  methods: {
	
	async updateImageToCloud(tmpFile){
		// 使用 split() 方法按斜杠 '/' 分割 URL
		const parts = tmpFile.split('/');
		
		// 获取数组的最后一个元素，即文件名
		const filename = parts[parts.length - 1];
		
		// 获取当前日期
		const now = new Date();
		const year = now.getFullYear(); // 获取当前年份
		const month = now.getMonth() + 1; // 获取当前月份（月份从0开始计数，所以加1）
		const day = now.getDate(); // 获取当前日期
		
		// 格式化月份和日期，确保它们始终是两位数字
		const formattedMonth = month < 10 ? `0${month}` : month;
		const formattedDay = day < 10 ? `0${day}` : day;
		
		const app = getApp();
		const cloudApi = await app.globalData.getCloudApi;
		console.log('cloudApi = ', cloudApi)
		// cloudApi 替代：wx.cloud
		cloudApi.uploadFile({
		  cloudPath: `mini/easy-rent/${year}-${formattedMonth}-${formattedDay}/${filename}`, // 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
		  filePath: tmpFile, // 微信本地文件，通过选择图片，聊天文件等接口获取
		  config: {
			env: 'prod-4g3usz1465b5625e' // 微信云托管环境ID
		  },
		  success: (res) => {
			  console.log('Update ok ', res)
			  return res.fileID
			  // const fileID = res.fileID
			  // cloudApi.getTempFileURL({
			  //   fileList: [fileID], // 文件唯一标识符 cloudID, 可通过上传文件接口获取
			  //   success: console.log,
			  //   fail: console.error
			  // })
		  },
		  fail: (err)=>{
			  console.log('Update failed ', err)
			  return null
		  }
		})
	},
	chooseImage() {
	  uni.chooseImage({
	    count: 9 - this.imageList.length,
	    sizeType: ['original', 'compressed'],
	    sourceType: ['album', 'camera'],
	    success: async (res) => {
			console.log('tmp file path: ', res.tempFilePaths)
			this.imageList = this.imageList.concat(res.tempFilePaths);
			
			const tmpUrl = res.tempFilePaths[0];
			
			const cloudFileId = await this.updateImageToCloud(tmpUrl)
			console.log('cloudFileId - ', cloudFileId)
			
			// // 使用 split() 方法按斜杠 '/' 分割 URL
			// const parts = tmpUrl.split('/');
			
			// // 获取数组的最后一个元素，即文件名
			// const filename = parts[parts.length - 1];

			
			// // 获取当前日期
			// const now = new Date();
			// const year = now.getFullYear(); // 获取当前年份
			// const month = now.getMonth() + 1; // 获取当前月份（月份从0开始计数，所以加1）
			// const day = now.getDate(); // 获取当前日期
			
			// // 格式化月份和日期，确保它们始终是两位数字
			// const formattedMonth = month < 10 ? `0${month}` : month;
			// const formattedDay = day < 10 ? `0${day}` : day;
			
			// const app = getApp();
			// const cloudApi = await app.globalData.getCloudApi;
			// console.log('cloudApi = ', cloudApi)
			// // cloudApi 替代：wx.cloud
			// cloudApi.uploadFile({
			//   cloudPath: `mini/easy-rent/${year}-${formattedMonth}-${formattedDay}/${filename}`, // 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
			//   filePath: tmpUrl, // 微信本地文件，通过选择图片，聊天文件等接口获取
			//   config: {
			// 	env: 'prod-4g3usz1465b5625e' // 微信云托管环境ID
			//   },
			//   success: (res) => {
			// 	  console.log('Update ok ', res)
			// 	  const fileID = res.fileID
			// 	  cloudApi.getTempFileURL({
			// 	    fileList: [fileID], // 文件唯一标识符 cloudID, 可通过上传文件接口获取
			// 	    success: console.log,
			// 	    fail: console.error
			// 	  })
			//   },
			//   fail: console.error
			// })
			
	    }
	  });
	},
	deleteImage(index) {
	  this.imageList.splice(index, 1);
	},
	checkLocationAuthorization() {
	  uni.getSetting({
	    success: (res) => {
	      if (res.authSetting['scope.userLocation']) {
	        this.isLocationAuthorized = true; // 已授权
	      } else {
	        this.isLocationAuthorized = false; // 未授权
	      }
	    }
	  });
	},
	bindChange(e) {
	    const val = e.detail.value;
	    this.selectedRoom = this.roomStruct.rooms[val[0]];
	    this.selectedHall = this.roomStruct.halls[val[1]];
	    this.selectedBathroom = this.roomStruct.bathrooms[val[2]];
	},
	onRentTypeChange(event) {
	  this.rentForm.rent_form_rent_type = event.detail.value;
	},
	onPaymentMethodChange(event) {
	  const index = event.detail.value;
	  this.rentForm.rent_form_payment_method = this.paymentMethods[index];
	},
	submitForm() {
	  console.log('提交的表单数据:', this.imageList);
	  // 提交 imageList 到 cloud 对象存储
	  
	  // 获取 imageList 的 cloud 数据
	  const formCloudImageIds = this.imageList.map(id => {return id})
	  
	  // 获取月租价格
	  const formMonthRentPrice = this.rentForm.rent_form_month_rent_price
	  
	  // 获取是整租还是合租
	  const formRentType = this.rentForm.rent_form_rent_type
	  
	  // 获取租赁面积
	  const formRentArea = this.rentForm.rent_form_rent_area
	  
	  // 获取租赁地址
	  const formRentAddress = this.rentForm.rent_form_address
	  
	  // 获取房屋结构
	  const formHouseStruct = this.multiIndex.map(struct=>{
		  return struct
	  })
	  
	  // 使用 filter 方法找到 active 为 true 的标签
	  const activeTags = this.tags.filter(tag => tag.active);
	  
	  // 使用 map 方法获取这些标签的名字
	  const formActiveTags = activeTags.map(tag => tag.name);
	  
	  // 地图的经纬度
	  const formLocationPoint = [this.mapLocation.longitude, this.mapLocation.latitude]
	  
	  // 可选的联系信息
	  const formContractInformation = this.contactInformation.inputData
	  
	  // 折扣信息
	  const formCashDiscount = this.cashDiscount.inputData
	  
	  // 补充信息
	  const formAdditionalDetails = this.additionalDetails.inputData
	  
	  console.log('Debug form infos:', {
		  formCloudImageIds,
		  formCloudImageIds,
		  formMonthRentPrice, 
		  formRentType,
		  formRentArea,
		  formRentAddress,
		  formHouseStruct,
		  formActiveTags,
		  formLocationPoint,
		  formContractInformation,
		  formCashDiscount,
		  formAdditionalDetails,
	  })
	  
	  
	},
	toggleContactInformation(event) {
		console.log('Debug. toggleCashDiscount --  ', this.contactInformation.isChecked)
		this.contactInformation.isChecked = event.detail.value.includes('checked');
	},
	toggleCashDiscount(event) {
		console.log('Debug. toggleCashDiscount --  ', this.cashDiscount.isChecked)
		this.cashDiscount.isChecked = event.detail.value.includes('checked');
	},
	toggleAdditionalDetails(event) {
		console.log('Debug. additionalDetails --  ', this.additionalDetails.isChecked)
		this.additionalDetails.isChecked = event.detail.value.includes('checked');
	},
	toggleTag(index) {
	  this.tags[index].active = !this.tags[index].active;
	},
	getUserLocation() {
	  console.log('---- 请求用户的地理位置权限')
	  // 请求用户的地理位置权限
	  uni.authorize({
	    scope: 'scope.userLocation',
	    success: () => {
	      // 权限授予后，获取当前位置
		  console.log('---- 权限授予后，获取当前位置')
	      uni.getLocation({
	        type: 'wgs84',
	        success: (res) => {
	          this.mapLocation.latitude = res.latitude;
	          this.mapLocation.longitude = res.longitude;
			  console.log('DEBUG  --- 获取位置成功', res)
			  console.log('OLD this.mapLocation = ', this.mapLocation)
	          // 更新铆钉位置
	          this.mapLocation.markers = [{
				id: 0,
				latitude: res.latitude,
				longitude: res.longitude,
				width: 20,
				height: 30
	          }];
			  // 可以选择更新视图中心点为新标记点
			  this.mapLocation.latitude = res.latitude;
			  this.mapLocation.longitude = res.longitude;
			  
			  console.log('NEW this.mapLocation = ', this.mapLocation)
	        },
	        fail: () => {
				console.log('DEBUG  --- 位置获取失败')
	          uni.showToast({
	            title: '获取位置失败',
	            icon: 'none'
	          });
	        }
	      });
	    },
	    fail: () => {
	      uni.showModal({
	        title: '位置权限未授权',
	        content: '请在设置中打开位置权限',
	        showCancel: false
	      });
	    }
	  });
	},
	onMapTap(e) {
		console.log('onMapTap - -- debug.')
		// 获取点击位置的经纬度
		const latitude = e.detail.latitude;
		const longitude = e.detail.longitude;
		// 更新标记
		this.mapLocation.markers = [{
			// iconPath: "/static/logo.png",
			id: 0,
			latitude: latitude,
			longitude: longitude,
			width: 20,
			height: 30
		}];	
		// 可以选择更新视图中心点为新标记点
		this.mapLocation.latitude = latitude;
		this.mapLocation.longitude = longitude;
	},
	requestLocationPermission() {
	  uni.authorize({
	    scope: 'scope.userLocation',
	    success: () => {
		  console.log('位置授权成功A');
		  this.isLocationAuthorized = true;
	    },
	    fail: () => {
	      console.log('位置授权失败');
	      uni.showModal({
	        title: '授权失败',
	        content: '请在设置中打开位置权限',
	        showCancel: false
	      });
	    }
	  });
	},
	bindMultiPickerColumnChange: function(e) {
		console.log('修改的列为：' + e.detail.column + '，值为：' + e.detail.value)
		this.multiIndex[e.detail.column] = e.detail.value
		this.$forceUpdate()
	}
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
}
.upload-container {
  margin-bottom: 20px;
}
.form-item {
  margin-bottom: 15px;
}
.radio-label {
  margin-right: 10px;
}
.picker {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
}
.map-container {
  position: relative;
  height: 200px;
  margin-bottom: 20px;
}
.map-center-button {
  position: absolute;
  top: 50%;  /* 居中定位：垂直 */
  left: 50%; /* 居中定位：水平 */
  transform: translate(-50%, -50%); /* 精确居中 */
  padding: 10px 10px;
  background-color: #007AFF; /* 黑色背景 */
  color: #fff; /* 白色文字 */
  border: none;
  border-radius: 5px;
}
.map {
  width: 100%;
  height: 100%;
}
.label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
input, textarea, picker {
  width: 100%;
  padding-bottom: 10px;
  padding-top: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.submit-button {
  width: 100%;
  background-color: #007AFF;
  color: white;
  padding: 10px;
  border-radius: 5px;
}
.picker-view {
    width: 100%;
    height: 30px; /* 确保选择器有足够的高度 */
}
.item {
    line-height: 50px; /* 保证行高足够，内容居中显示 */
    text-align: center;
    font-size: 16px;
}
.checkbox-label {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.label {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.tag {
  border: 1px solid #ccc;
  padding: 5px 10px;
  border-radius: 15px;
  margin-right: 10px;
  margin-bottom: 10px;
  background-color: #f5f5f5;
  color: #333;
  font-size: 14px;
}

.tag.active {
  background-color: #007AFF;
  color: white;
  border-color: #007AFF;
}


.img-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background-color: #f5f5f5;
  justify-content: space-around;
}
.image-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 100%;
}
.image-item {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 5px;
}
.image-preview {
  width: 100%;
  height: 100%;
}
.delete-icon {
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: #fff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}
.add-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border: 2px dashed #ccc;
  margin: 5px;
}
.icon {
  font-size: 24px;
  color: #ccc;
}

</style>
