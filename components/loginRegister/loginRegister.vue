<template>
	<view class="container">
	    <button class="icon-section" open-type="chooseAvatar"  @chooseavatar="onChooseAvatar">
	      <image :src="userInfo.avatarUrl" class="icon-image" />
	    </button>
	    <view class="text-section">
	      <button class="nickname-button" @click="promptForNewNickname"><text class="main-text">{{userInfo.nickName}}</text></button>
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
				id: 0,
				open_id: '',
				nickName: '*',
				avatarUrl: '@/static/notloginpic.png'
			}
		}
      }
  },
  // data() {
  //     return {
  //       userInfo: {
  //         nickName: '微信',  // 默认昵称
  //         avatarUrl: '@/static/notloginpic.png'  // 默认头像
  //       }
  //     };
  //   },
  methods: {
	navigateTo(page) {
	  uni.navigateTo({
	    url: page
	  });
	},
	promptForNewNickname() {
		uni.showModal({
			title: '修改昵称',
			content: '',
			editable: true,
			success: (res) => {
				if (res.confirm) {
					const illegalChars = /[^a-zA-Z0-9_\u4e00-\u9fa5]/;  // 示例中只允许字母、数字和汉字
					let cleanedNickname = res.content.trim();

					if (illegalChars.test(cleanedNickname)) {
						uni.showToast({
							title: '昵称字符非法，提交失败',
							icon: 'none',
							duration: 2000
						});
					} else {
						cleanedNickname = cleanedNickname.replace(/\s+/g, ' '); // 替换多个空白为一个空白
						
						this.userInfo.nickName = cleanedNickname;
					
						const app = getApp();
						app.globalData.callWithWxCloud({
							path: '/updateUser',
							method: 'POST',
							data: this.userInfo
						}).then(res => {
							console.log('============ Debug res with Nickname', res)
						});
						
					}
				}
			}
		});
	},
	onChooseAvatar(event) {
		console.log('Event . ', event)
		this.userInfo.avatarUrl = event.detail.avatarUrl
		
		const app = getApp();
		app.globalData.callWithWxCloud({
			path: '/updateUser',
			method: 'POST',
			data: this.userInfo
		}).then(res => {
			console.log('============ Debug res with avatar', res)
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

/* .icon-section {
  flex: 0 0 auto;
  margin-right: 10px;
  border: 0px;
} */

/* .icon-section {
  margin-right: 10px;
  border: none; 
  background-color: transparent; 
  padding: 0; 
  box-shadow: none; 
} */

.icon-section {
  flex: 0 0 auto;
  margin-right: 10px;
  border: none; 
  background: none; 
  padding: 0; 
  display: flex;
  align-items: center; 
  justify-content: center; 
}

.icon-section::after{
  border: none;
}

.icon-image {
  width: 60px;
  height: 60px;
  border-radius: 30px;
}

.text-section {
  flex: 1;
}

.nickname-button {
	background-color: #f2f2f2;
	display: inline-block;
	border: none;
}

.nickname-button::after{
  border: none;
}

.nickname-button:active {
    background-color: #e8e8e8;  
    color: #333;               
    border-color: #aaa;
}

.main-text {
  font-size: 14px;
  font-weight: bold;
  color: #000;
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