<template>
    <view class="card">
        <image class="card-image" :src="effectiveImageSrc" mode="aspectFill" @click="navigateTo('/pages/rentDetail/index?rentid=' + rentid)" />
        <view class="card-content">
            <view class="card-title">
                <img v-if="baseItem.type == 1" class='show-icon' src="/static/rent-icon.png" />
				<img v-if="baseItem.type == 2" class='show-icon' src="/static/found-icon.png" />
                {{ title }}
            </view>
            <text v-if="baseItem.type == 1" class="card-details">
                {{ baseItem.rent_type }} | {{ baseItem.rent_area}} 平米 
                <text v-if="price" class="price">{{ price }}¥/月</text>  <!-- Apply specific styles to the price -->
            </text>
            <text v-if="baseItem.type == 2" class="card-details">
                <text v-if="price" class="price">价码：{{ price }}</text> ｜ 
                <text class="card-address">{{ tags }}</text> 
            </text>
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
        baseItem: {
            type: Object,
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
            if (this.rentid) {
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
    display: flex;
    align-items: center;
}

.card-details, .card-address {
    font-size: 14px;
    color: #666;
}

.price { 
    font-weight: bold;
    color: red;
}

.show-icon {
    width: 20px;
    height: 20px;
    margin-right: 5px; 
	border-radius: 3px;
}
</style>
