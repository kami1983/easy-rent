<template>
  <view class="container">
	  
	<!-- 图片上传 -->
	<view class="form-item img-container">
		<ImagePicker :initial-image-list="imageList" @update:imageList="handleImageListUpdate"/>
	</view>
	
	<view class="form-item">
	  <text class="label">物品标题：</text>
	  <input type="text" placeholder="一句话描述物品" v-model="rentForm.rent_form_address" />
	</view>
	
	<view class="form-item">
		<checkbox-group @change="toggleNeedPrice">
		  <label class="checkbox-label">
			<checkbox value="checked" :checked="needPrice.isChecked" />
		    价码：（金额，可选）
		  </label>
		</checkbox-group>
	   <NumberInput v-if="this.needPrice.isChecked" @onChange="onRentFormMonthRentPriceChanged" placeholder="请输入价格" class-name="number-input" />
	</view>

	<view class="form-item">
		<view class="label">其他描述:</view>
		<TagsPicker :tags="tags" @toggle="toggleTag" />
	</view>

	<view class="form-item">
	   <text class="label">联系方式：</text>
		<!-- <NumberInput v-if="this.contactInformation.isChecked" @onChange="onContactInformationChanged" placeholder="电话或者微信" class-name="number-input" /> -->
		<input type="text" placeholder="电话或者微信" v-model="contactInformation.inputData" />
	</view>

	<view class="form-item">
	  <text class="label">物品描述：</text>
	  <textarea v-model="this.additionalDetails.inputData" placeholder="请输入更多详细描述" />
	</view>
	
    <button @click="submitForm" class="submit-button">提交信息</button>
  </view>
</template>

<script>
import NumberInput from '@/components/numberInput/numberInput.vue';
import HouseSpecPicker from '@/components/selectPicker/selectPicker.vue';
import RentTypePicker from '@/components/radioPicker/radioPicker.vue';
import TagsPicker from '@/components/tagsPicker/tagsPicker.vue';
import MapPicker from '@/components/mapPicker/mapPicker.vue';
import ImagePicker from '@/components/imagePicker/imagePicker.vue';
import rentMixin from '@/libs/data-tools.js';

export default {
	mixins: [rentMixin],
	components: {
	    NumberInput,
		HouseSpecPicker,
		RentTypePicker,
		TagsPicker,
		MapPicker,
		ImagePicker
	},
	data() {
		return {
			mapLocation: {
				markers: [23.099994, 113.324520],
				latitude: 23.099994,
				longitude: 113.324520
			},
			imageList: [],
			isLocationAuthorized: false ,
			tags: [
				{ name: '良好可用', active: false },
				{ name: '免费赠送', active: false },
				{ name: '急需处理', active: false },
				{ name: '物品全新', active: false }
			],
		rentForm: {
			// rent_form_rent_type: '',
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
		needPrice: {
			isChecked: false,
			inputData: ''
		},
		contactInformation: {
			isChecked: true,
			inputData: ''
		},
		additionalDetails: {
			isChecked: false,
			inputData: ''
		}
		};
	},
 //  mounted() {
 //    this.checkLocationAuthorization();
	// // this.getUserLocation();
 //  },
  methods: {
	
	// async updateImageToCloud(tmpFile) {
	//   // Splitting URL by '/' to extract the file name
	//   const parts = tmpFile.split('/');
	//   const filename = parts[parts.length - 1]; // Getting the last part of the array, which is the filename
	
	//   // Getting current date information
	//   const now = new Date();
	//   const year = now.getFullYear(); // Current year
	//   const month = now.getMonth() + 1; // Current month, adjusted for zero index
	//   const day = now.getDate(); // Current day
	
	//   // Ensuring month and day are two digits
	//   const formattedMonth = month < 10 ? `0${month}` : `${month}`;
	//   const formattedDay = day < 10 ? `0${day}` : `${day}`;
	
	//   // Assuming getApp() and globalData.getCloudApi are correct references for your environment
	//   const app = getApp();
	//   const cloudApi = await app.globalData.getCloudApi;
	
	//   try {
	//     const res = await new Promise((resolve, reject) => {
	// 	  // Doc： https://developers.weixin.qq.com/minigame/dev/wxcloud/reference-sdk-api/storage/uploadFile/web.uploadFile.html
	//       cloudApi.uploadFile({
	//         cloudPath: `mini/easy-rent/${year}-${formattedMonth}-${formattedDay}/${filename}`, // Storage path in the cloud
	//         filePath: tmpFile, // Local file path obtained from file selection or chat interfaces
	//         config: {
	//           env: 'prod-4g3usz1465b5625e' // Cloud environment ID
	//         },
	//         success: res => {
	//           resolve(res.fileID); // Resolve promise with fileID if upload succeeds
	//         },
	//         fail: err => {
	//           reject(err); // Reject promise if upload fails
	//         }
	//       });
	//     });
	
	//     console.log('Update ok', res);
	//     return res; // Return the file ID or handle it as needed
	//   } catch (err) {
	//     console.error('Update failed', err);
	//     return null; // Return null in case of an error
	//   }
	// },
	onSpecChange(newIndex) {
		console.log('Selected indices:', newIndex);
		this.multiIndex = newIndex
	},
	chooseImage() {
	  uni.chooseImage({
	    count: 9 - this.imageList.length,
	    sizeType: ['original', 'compressed'],
	    sourceType: ['album', 'camera'],
	    success: async (res) => {
			console.log('tmp file path: ', res.tempFilePaths)
			this.imageList = this.imageList.concat(res.tempFilePaths);
	    }
	  });
	},
	onRentFormMonthRentPriceChanged(e){
		this.rentForm.rent_form_month_rent_price = e
	},
	// onRentFormRentAreaChanged(e) {
	// 	this.rentForm.rent_form_rent_area = e
	// },
	onCashDiscountChanged(e) {
		this.cashDiscount.inputData = e
	},
	deleteImage(index) {
	  this.imageList.splice(index, 1);
	},
	// checkLocationAuthorization() {
	//   uni.getSetting({
	//     success: (res) => {
	//       if (res.authSetting['scope.userLocation']) {
	//         this.isLocationAuthorized = true; // 已授权
	//       } else {
	//         this.isLocationAuthorized = false; // 未授权
	//       }
	//     }
	//   });
	// },
	bindChange(e) {
	    const val = e.detail.value;
	    this.selectedRoom = this.roomStruct.rooms[val[0]];
	    this.selectedHall = this.roomStruct.halls[val[1]];
	    this.selectedBathroom = this.roomStruct.bathrooms[val[2]];
	},
	// onRentTypeChange(newType) {
	//     this.rentForm.rent_form_rent_type = newType;
	// },
	onPaymentMethodChange(event) {
	  const index = event.detail.value;
	  this.rentForm.rent_form_payment_method = this.paymentMethods[index];
	},
	onContactInformationChanged(contractInfos) {
		this.contactInformation.inputData = contractInfos
	},
	async updateImageList() {
	  let formCloudImageIds = []
	  for (const idx in this.imageList) {
	    const tmpImg = this.imageList[idx];
		const processId = parseInt(idx) + 1
		uni.showLoading({
		    title: `上传中 ${processId}/${this.imageList.length}`, // 显示当前进度
		    mask: true // 防止用户触摸屏幕
		});
				
		try {
		    const cloudImageId = await this.updateImageToCloud(tmpImg);
		    formCloudImageIds.push(cloudImageId);
		} catch (error) {
		    uni.showToast({
		        title: '上传失败',
		        icon: 'none'
		    });
			formCloudImageIds = []
		    console.error('上传失败:', error);
		} finally {
		    uni.hideLoading();
		}
	  }
	  return formCloudImageIds
	},
	async submitForm() {
	  
	  // 获取月租价格（这里是物品价格）
	  const formMonthRentPrice = this.rentForm.rent_form_month_rent_price
	  // 获取租赁地址
	  const formRentAddress = this.rentForm.rent_form_address
	  // 使用 filter 方法找到 active 为 true 的标签
	  const activeTags = this.tags.filter(tag => tag.active);
	  
	  // 使用 map 方法获取这些标签的名字
	  const formActiveTags = activeTags.map(tag => tag.name);
	  
	  // 地图的经纬度
	  const formLocationPoint = [this.mapLocation.longitude, this.mapLocation.latitude]
	  
	  // 必选的联系信息
	  const formContractInformation = this.contactInformation.inputData
	  
	  // 补充信息
	  const formAdditionalDetails = this.additionalDetails.inputData
	  
	  // 验证图片列表
	  if (!this.imageList.length) {
	      uni.showToast({
	          title: '请至少上传一张图片',
	          icon: 'none'
	      });
	      return;
	  }
	  
	  // 数据验证
	  if(this.needPrice.isChecked){
		  if (!formMonthRentPrice || isNaN(Number(formMonthRentPrice)) || Number(formMonthRentPrice) <= 0) {
		  	  uni.showToast({
		  			  title: '请输入有效的价码',
		  			  icon: 'none'
		  	  });
		  	  return;
		  }
	  }
	  
	  if (!formRentAddress?.trim()) {
	      uni.showToast({
	          title: '物品标题不能为空',
	          icon: 'none'
	      });
	      return;
	  }
	  
	  console.log('DEBUG ', {formRentAddress, formContractInformation })
	  if(!formContractInformation?.trim()){
		  uni.showToast({
		      title: '联系方式不能为空',
		      icon: 'none'
		  });
		  return;
	  }
	  
	  // 上传图片
	  const formCloudImageIds = await this.updateImageList()
	  console.log('已经上传的图片 - ', formCloudImageIds)
	  
	  if(formCloudImageIds.length > 0) {
		  // 图片上传成功后开始提交基础数据信息
		  const post_data = {
		  		 month_rent_price: formMonthRentPrice,
		  		 rent_type: '',
		  		 rent_area: '',
		  		 rent_address: formRentAddress,
		  		 room_structure: [0,0,0],
		  		 location_longitude: 0,
		  		 location_latitude: 0,
		  		 contact_information: formContractInformation,
		  		 cash_discount: 0,
		  		 additional_details: formAdditionalDetails,
		  		 tags: formActiveTags,
		  		 image_urls: formCloudImageIds,
				 status: 0,
				 type: 2,
		  }
		  
		  console.log('Debug form infos:', post_data)
		  const app = getApp();

		  uni.showLoading({
		      title: `提交中`, // 显示当前进度
		      mask: true // 防止用户触摸屏幕
		  });
		  
		  app.globalData.callWithWxCloud({
		      path: '/insertRentInfos',
		      method: 'POST',
		      data: post_data
		  }).then(res => {
		      console.log('Debug res', res);
		      if (res && res.status) {  // 假设200是操作成功的状态码
		          uni.showToast({
		              title: '成功等待审核',
		              icon: 'success',
		              duration: 2000,
		              complete: () => {
		                  setTimeout(() => {
							  uni.switchTab({
							      url: '/pages/profile/index' 
							  });
							  uni.hideLoading();
		                  }, 2000); // 确保提示信息显示足够时间
		              }
		          });
		      } else {
		          // 如果返回的状态码不是200，认为是失败
		          uni.showToast({
		              title: `数据提交失败: ${res.status}`,
		              icon: 'none'
		          });
				  uni.hideLoading();
		      }
		  }).catch(err => {
		      console.log('请求错误', err);
		      uni.showToast({
		          title: '网络或服务器错误',
		          icon: 'none'
		      });
			  uni.hideLoading();
		  });
	  }
	},
	toggleContactInformation(event) {
		console.log('Debug. toggleCashDiscount --  ', this.contactInformation.isChecked)
		this.contactInformation.isChecked = event.detail.value.includes('checked');
	},
	toggleNeedPrice(event) {
		console.log('Debug. toggleNeedPrice --  ', this.needPrice.isChecked)
		this.needPrice.isChecked = event.detail.value.includes('checked');
	},
	toggleAdditionalDetails(event) {
		console.log('Debug. additionalDetails --  ', this.additionalDetails.isChecked)
		this.additionalDetails.isChecked = event.detail.value.includes('checked');
	},
	toggleTag(index) {
	  this.tags[index].active = !this.tags[index].active;
	},
	
	handleMapTap(e) {
		this.mapLocation.latitude = e.latitude;
		this.mapLocation.longitude = e.longitude;
		console.log('RUN e', e)
	},
	handleImageListUpdate(newImageList) {
		console.log('newImageList', newImageList)
	    this.imageList = newImageList;
	},
	requestLocationPermission() {
	  uni.authorize({
	    scope: 'scope.userLocation',
	    success: () => {
		  console.log('位置授权成功');
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
  background-color: #f5f5f5;
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
<style>
	.number-input {
		width: 100%;
		padding-bottom: 10px;
		padding-top: 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		color: darkred;
	}
</style>