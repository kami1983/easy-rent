<template>
	<view class="container">
	    <view class="icon-section">
	      <image :src="userInfo.avatarUrl" class="icon-image" />
	    </view>
	    <view class="text-section">
	      <text class="main-text">{{userInfo.nickName}}</text>
	    </view>
		<view class="text-section button-section" @click="navigateTo('/pages/operLinks/index')">
		  <text class="main-button">+</text>
		</view>
	  </view>
</template>

<script>
export default {
  props: {
      userInfo: {
		  type: Object,
          default() {
			return {
				nickName: '*',
				avatarUrl: '@/static/notloginpic.png'
			}
		}
      }
  },
  methods: {
	navigateTo(page) {
	  uni.navigateTo({
	    url: page
	  });
	}
  }
}
</script>

<style>
.container {
  display: flex;
  align-items: center; 
  background-color: #f8f8f8;
  padding: 20px;
  border-radius: 10px;
}

.icon-section {
  flex: 0 0 auto;
  margin-right: 10px;
}

.icon-image {
  width: 60px;
  height: 60px;
  border-radius: 30px;
}

.text-section {
  flex: 1;
}

/* .main-text {
  font-size: 20px;
  font-weight: bold;
  color: #000;
}

.main-text:active {
  color: #555; 
  box-shadow: 0 0 8px rgba(0,0,0,0.6); 
 }*/

.main-text {
  font-size: 14px;
  font-weight: bold;
  color: #000;
  background-color: #f2f2f2; 
  padding: 10px 20px;
  border-radius: 5px;
  border: 2px solid transparent;
  transition: all 0.3s ease; 
  cursor: pointer; 
  outline: none; 
}


.main-button:hover {
  background-color: #e8e8e8;
}

.button-section {
  display: flex;
  justify-content: flex-end; /* 使内容靠右 */
}

.main-button:active {
  color: #fff; 
  background-color: #1e88e5; 
  border-color: #1e88e5; 
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); 
}


.main-button {
	font-size: 16px;
	font-weight: bold;
	color: #000;
	background-color: #f2f2f2; 
	padding: 10px 20px;
	border-radius: 5px;
	border: 2px solid transparent;
	transition: all 0.3s ease; 
	cursor: pointer; 
	outline: none; 
}

.sub-text {
  font-size: 16px;
  color: #777;
  margin-top: 5px;
}
</style>