<template>
  <view class="container">
      <view class="text-section">
        <text class="title">{{title}}</text>
        <text class="subtitle">{{subtitle}}</text>
        <text class="description">{{description}}</text>
      </view>
    </view> 
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			required: true
		},
		subtitle: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			
		}
	},
	methods: {
		
	}
}
</script>

<style>
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 20px;
}

.text-section {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #000;
}

.subtitle {
  font-size: 20px;
  color: #ff0000;
  margin: 10px 0;
}

.description {
  font-size: 16px;
  color: #555;
}

.badge-section {
  margin-top: 20px;
}

.badge {
  display: inline-block;
  background-color: #ff5722;
  color: #fff;
  padding: 5px 10px;
  border-radius: 15px;
  margin-right: 10px;
  font-size: 14px;
}

.image-section {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.person-image {
  width: 150px;
  height: auto;
  border-radius: 10px;
  display: block;
}
</style>