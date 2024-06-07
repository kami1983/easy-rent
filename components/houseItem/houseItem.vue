<template>
	<view class="card">
	    <image class="card-image" :src="imageSrc" mode="aspectFill" />
	    <view class="card-content">
	      <text class="card-title">{{ title }}</text>
	      <text class="card-details">{{ details }}</text>
	      <text class="card-address">{{ address }}</text>
	    </view>
	  </view>
</template>

<script>
	export default {
		props: {
		    imageSrc: {
		      type: String,
		      required: true
		    },
		    title: {
		      type: String,
		      required: true
		    },
		    details: {
		      type: String,
		      required: true
		    },
		    address: {
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
.card {
  border-radius: 10px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 10px;
}

.card-image {
  width: 100%;
  height: 200px;
}

.card-content {
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.card-details, .card-address {
  font-size: 14px;
  color: #666;
}
</style>