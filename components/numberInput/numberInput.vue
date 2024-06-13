<template>
  <input :class="className" type="text" :placeholder="placeholder" :value="value" @input="handleInput" />
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    className: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleInput(event) {
      // 获取输入的内容
      const value = event.detail.value;
      // 移除非数字字符
      const filteredValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
      // 更新数据
      if (value !== filteredValue) {
        // 此处设置数据需要根据实际数据路径设置
        return filteredValue;
      }
	  
	  this.$emit('onChange', filteredValue);
      return value;
    }
  }
}
</script>
<style>
</style>