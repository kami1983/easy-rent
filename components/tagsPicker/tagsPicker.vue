<template>
  <view class="tags">
    <view v-for="(tag, index) in tags" :key="index" class="tag" :class="{ active: tag.active }" @tap="toggle(index)">
      {{ tag.name }}
    </view>
  </view>
</template>

<script>
export default {
  props: {
    tags: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    toggle(index) {
      this.$emit('toggle', index);
    }
  }
}
</script>

<style scoped>
.tags {
  display: flex;
  flex-wrap: wrap;
}
.tag {
  border: 1px solid #ccc;
  padding: 5px 10px;
  border-radius: 15px;
  margin-right: 10px;
  margin-bottom: 10px;
  background-color: #f5f5f5;
  font-size: 14px;
  cursor: pointer;
}
.tag.active {
  background-color: #007AFF;
  color: white;
  border-color: #007AFF;
}
</style>