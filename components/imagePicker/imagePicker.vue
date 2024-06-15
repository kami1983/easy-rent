<template>
	<view class="img-container">
		<view class="image-list">
		  <view v-for="(img, index) in imageList" :key="index" class="image-item">
		    <image :src="img" class="image-preview"/>
		    <view class="delete-icon" @tap="handleDelete(index)">✖️</view>
		  </view>
		  <view v-if="imageList.length < 9" @tap="chooseImage" class="add-image">
		    <view class="icon">+</view>
		    <text>添加图片</text>
		  </view>
		</view>
	</view>
</template>

<script>
export default {
  props: {
    initialImageList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      imageList: this.initialImageList
    };
  },
  methods: {
    chooseImage() {
      uni.chooseImage({
        count: 9 - this.imageList.length,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.imageList = this.imageList.concat(res.tempFilePaths);
          this.$emit('update:imageList', this.imageList);
        }
      });
    },
    handleDelete(index) {
      this.imageList.splice(index, 1);
      this.$emit('update:imageList', this.imageList);
    }
  }
}
</script>

<style scoped>
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
