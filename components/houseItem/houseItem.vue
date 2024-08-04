<template>
    <view class="card">
        <image class="card-image" :src="effectiveImageSrc" mode="aspectFill" @click="navigateTo('/pages/rentDetail/index?rentid=' + rentid)" />
        <view class="card-content">
          <text class="card-title">{{ title }}</text>
          <text class="card-details">{{ details }}
            <text v-if="price" class="price">{{ price }}¥/月</text>  <!-- Apply specific styles to the price -->
          </text>
          <text class="card-address">{{ tags }}</text>
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
        tags: {
          type: String,
          required: true
        },
		price: {
          type: String,
          required: false
        },
		rentid: {  // 新增 prop
		  type: [String, Number],  // 可以是字符串或数字
		  required: true
		}
    },
    computed: {
        effectiveImageSrc() {
            // Assuming 'default-placeholder.png' is located in the static directory
            return this.imageSrc || '/static/default-placeholder.png';
        }
    },
	methods: {
		navigateTo(page) {
			if(this.rentid){
				uni.navigateTo({
				  url: page
				});
			}
		}
	}
}
</script>

<style scoped>
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

.price { /* New style for price */
  font-weight: bold;
  color: red;
}
</style>