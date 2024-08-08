<template>
  <view class="map-container">
    <map class="map"
        :longitude="longitude"
        :latitude="latitude"
        :scale="scale"
        :show-location=true
		:show-compass=true
		:enable-scroll="enableScroll"
        @tap="updateMarker"
        :markers="localMarkers">
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
	markers: { // Accept markers as a prop
	  type: Array,
	  default: () => []
	},
    // isLocationAuthorized: {
    //   type: Boolean,
    //   default: false
    // },
	canUpdateMarkers: {  // New prop to control marker updates
	  type: Boolean,
	  default: true
	},
	enableScroll: { // New prop for enabling or disabling map scroll
	  type: Boolean,
	  default: true
	}
  },
  mounted() {
	const newMarker = {
	  id: 0,
	  latitude: this.markers[0],
	  longitude: this.markers[1],
	  width: 20,
	  height: 30
	};
	console.log('newMarker A -- ', newMarker);
	this.updateLocalMarkers(newMarker); // Initialize localMarkers on component mount
  },
  data() {
    return {
       localMarkers: [] ,// Now markers are managed internally
	   isLocationAuthorized: false,
    };
  },
  watch: {
    markers: {
      handler(markersDataArr) {
		  const newMarker = {
		    id: 0,
		    latitude: markersDataArr[0],
		    longitude: markersDataArr[1],
		    width: 20,
		    height: 30
		  };
		  console.log('newMarker B -- ', newMarker);
        this.updateLocalMarkers(newMarker); // Update local markers when prop changes
      },
      deep: true // This ensures even nested data changes are detected
    }
  },
  mounted() {
    this.checkLocationAuthorization();
  },
  methods: {
    updateMarker(event) {
		console.log('Update marker : ', this.canUpdateMarkers)
		if (this.canUpdateMarkers) {
			console.log('Will update markers.')
			const newMarker = {
			  id: 0,
			  latitude: event.detail.latitude,
			  longitude: event.detail.longitude,
			  width: 20,
			  height: 30
			};
			this.localMarkers = [newMarker]; // Update the internal markers array
			this.centerMapOnMarker(newMarker.latitude, newMarker.longitude);
		}
    },
    centerMapOnMarker(latitude, longitude) {
      this.$emit('center-map', {latitude, longitude});
    },
	updateLocalMarkers(markers) {
	  this.localMarkers = [markers]; // Update local markers whenever the prop changes
	},
	checkLocationAuthorization() {
	  uni.getSetting({
	    success: (res) => {
	      if (res.authSetting['scope.userLocation']) {
	        this.isLocationAuthorized = true; // 已授权
	      } else {
	        this.isLocationAuthorized = false; // 未授权
	      }
	    }
	  });
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
