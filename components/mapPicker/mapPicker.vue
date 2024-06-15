<template>
  <view class="map-container">
    <map class="map"
        :longitude="longitude"
        :latitude="latitude"
        :scale="scale"
        show-location="true"
        @tap="updateMarker"
        :markers="markers">
    </map>
    <button v-if="!isLocationAuthorized" class="map-center-button" @tap="requestLocationPermission">
      点击授权位置
    </button>
  </view>
</template>

<script>
export default {
  props: {
    longitude: {
      type: Number,
      default: 113.324520
    },
    latitude: {
      type: Number,
      default: 23.099994
    },
    scale: {
      type: Number,
      default: 14
    },
    isLocationAuthorized: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      markers: [] // Now markers are managed internally
    };
  },
  methods: {
    updateMarker(event) {
      const newMarker = {
        id: 0,
        latitude: event.detail.latitude,
        longitude: event.detail.longitude,
        width: 20,
        height: 30
      };
      this.markers = [newMarker]; // Update the internal markers array
      this.centerMapOnMarker(newMarker.latitude, newMarker.longitude);
    },
    centerMapOnMarker(latitude, longitude) {
      this.$emit('center-map', {latitude, longitude});
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
.img-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background-color: #f5f5f5;
  justify-content: space-around;
}
.map-container {
  position: relative;
  height: 200px;
  margin-bottom: 20px;
}
.map-center-button {
  position: absolute;
  top: 50%; /* Center vertically */
  left: 50%; /* Center horizontally */
  transform: translate(-50%, -50%); /* Offset the width/height */
  padding: 10px;
  background-color: #007AFF;
  color: #fff;
  border: none;
  border-radius: 5px;
}
.map {
  width: 100%;
  height: 100%;
}
</style>
