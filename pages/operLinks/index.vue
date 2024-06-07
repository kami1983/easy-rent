<template>
  <view class="container">
	<view class="image-section">
		<image src="/static/comm-pic.png" mode="widthFix" />
		<button @click="viewTerms" class="terms-button button-text">查看条款</button>
	</view>
	<checkbox-group class='checkbox-group' @change="checkboxChange">
		<label class="checkbox-label">
		<checkbox value="agree" :checked="isChecked" />
		同意并遵守公告发布的行为条款
		</label>
	</checkbox-group>
	<view class="buttons">
	      <button :disabled="!isChecked" class="submit-button" 
		  v-for="(item, index) in items" :key="index" @click="navigateTo(item.page)">
		  {{ item.text }} <text class="button-icon">+</text>
		  </button>
	</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
		isChecked: false,
		items: [
		  { text: '添加出租公告', page: '/pages/inputRentInfos/index' }
		  // { text: '添加社区公告', page: '/otherPagePath' },
		  // { text: '添加工单反馈', page: '/anotherPagePath' }
		]
    };
  },
  methods: {
	checkboxChange(event) {
		// 检查是否勾选了复选框
		this.isChecked = event.detail.value.includes('agree');
	},
	viewTerms() {
	    // 实现查看条款的逻辑，可能是导航到一个页面或打开一个模态框
	    console.log("查看条款被点击");
		// 弹出条款信息窗口
		uni.showModal({
		  title: '社区公告条款',
		  content: '请仔细阅读以下条款概要:\n1. 尊重和礼貌\n2. 真实性和准确性\n3. 遵守法律法规\n4. 个人信息和隐私\n5. 知识产权及免责条款\n详细条款信息，请点击“详细阅读”。',
		  showCancel: true,
		  cancelText: '关闭',
		  confirmText: '详细阅读',
		  success: function (res) {
		    if (res.confirm) {
		      // 如果用户点击“详细阅读”，则跳转到包含完整条款的页面
		      uni.navigateTo({
		        url: '/pages/fullTerms/index' 
		      });
		    }
		  }
		}); 
	},
	navigateTo(page) {
	    // 导航逻辑
	    uni.navigateTo({ url: page });
	}
  }
}
</script>


<style scoped>
.container {
  display: flex;
  flex-direction: column;
  padding: 20px; 
}

.button {
  background-color: #007AFF; 
  margin-bottom: 10px; 
  padding: 10px 20px; 
  display: flex;
  justify-content: space-between; 
  align-items: center; 
  border-radius: 5px; 
}

.terms-button {
  background-color: #007AFF; /* 按钮背景色 */
}

.button-text {
  color: white; 
  font-size: 16px; 
}

.button-icon {
  color: white; 
  font-size: 24px; 
}

.image-section image {
  width: 100%;
}

.buttons button {
  width: 100%;
  margin-top: 10px;
  background-color: #007AFF;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
}

.submit-button[disabled] {
  background-color: #ccc;
}

.checkbox-group {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  width: 100%; /* 确保占满容器宽度 */
}

.checkbox-label {
  margin: 20px 0;
  display: flex;
  align-items: center; /* 确保复选框和文本垂直居中 */
}

</style>
