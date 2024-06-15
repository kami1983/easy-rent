<template>
    <view class="uni-list">
      <view class="uni-list-cell">
        <view class="uni-list-cell-db">
          <picker mode="multiSelector" @columnchange="bindMultiPickerColumnChange" :value="multiIndex" :range="multiArray">
            <view class="uni-input">{{ multiArray[0][multiIndex[0]] }}, {{ multiArray[1][multiIndex[1]] }}, {{ multiArray[2][multiIndex[2]] }}</view>
          </picker>
        </view>
      </view>
    </view>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: '房屋规格：'
    },
    multiArray: {
      type: Array,
      default: () => [
        ['一室', '二室', '三室', '四室'],
        ['开间', '一厅', '两厅'],
        ['一卫', '双卫', '三卫']
      ]
    }
  },
  data() {
    return {
      multiIndex: [0, 0, 0]  // 默认选择数组的第一项
    };
  },
  methods: {
    bindMultiPickerColumnChange(e) {
      const column = e.detail.column;
      const value = e.detail.value;
      this.multiIndex[column] = value;
      this.$emit('change', this.multiIndex);
    }
  }
}
</script>

<style scoped>
/* .form-item {
  margin-bottom: 15px;
}
.label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
} */
.uni-list {
  width: 100%;
}
.uni-input {
  padding: 10px;
  background-color: #f8f8f8;
}
</style>
