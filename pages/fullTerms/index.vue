<template>
  <view class="container">
    <view class="content">
      <scroll-view class="terms-content" scroll-y="true">
        <!-- 尊重和礼貌 -->
        <view class="section">
          <text class="heading">尊重和礼貌：</text>
          <text class="paragraph">所有发布的内容必须尊重他人，不得包含任何歧视性、侮辱性或攻击性的言语。禁止发布任何种族、宗教、性别、性取向、民族、残疾或年龄的歧视内容。</text>
        </view>
        <!-- 真实性和准确性 -->
        <view class="section">
          <text class="heading">真实性和准确性：</text>
          <text class="paragraph">发布的信息应真实无误，不得故意发布虚假或误导性信息。鼓励发布者验证信息的准确性之后再进行发布。</text>
        </view>
        <!-- 遵守法律法规 -->
        <view class="section">
          <text class="heading">遵守法律法规：</text>
          <text class="paragraph">所有发布的内容必须遵守当地的法律和法规。禁止发布任何非法活动的宣传或引导，如非法交易、贩卖毒品等。</text>
        </view>
        <!-- 个人信息和隐私 -->
        <view class="section">
          <text class="heading">个人信息和隐私：</text>
          <text class="paragraph">严禁无授权发布他人的个人信息，如地址、电话号码、电子邮件地址等。尊重他人隐私，未经许可，不得擅自使用或泄露他人个人信息。</text>
        </view>
        <!-- 知识产权 -->
        <view class="section">
          <text class="heading">知识产权：</text>
          <text class="paragraph">尊重知识产权，发布的内容应为原创或确保已获得相关授权。禁止发布任何侵犯他人版权、商标权等知识产权的内容。</text>
        </view>
        <!-- 免责条款 -->
        <view class="section">
          <text class="heading">免责条款：</text>
          <text class="paragraph">社区公告板的运营方不对发布内容的准确性、完整性和可靠性承担责任。用户自行承担发布内容可能引起的一切后果，包括但不限于法律责任和第三方索赔。</text>
        </view>
		<view class="session">
			<text class="heading">版本信息：</text>
			<text class="paragraph">v{{version}}</text>
		</view>
      </scroll-view>
    </view>
  </view>
</template>


<script>
	export default {
		data() {
		  return {
		    version: '0.0.0'
		  };
		},
		onLoad() {
			const app = getApp();
			this.version = app.globalData.version;
		}
	}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #f8f9fa;
}
.content {
  padding: 20px;
  background-color: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  padding-bottom: 10px;
  border-bottom: 2px solid #eee;
  margin-bottom: 20px;
}
.terms-content {
  font-size: 16px;
}
.heading {
  font-weight: bold;
  color: #0056b3;
  margin-bottom: 5px;
}
.paragraph {
  text-indent: 2em;
  line-height: 1.6;
  color: #666;
  margin-bottom: 15px;
}
.section {
  margin-bottom: 20px;
}
</style>
