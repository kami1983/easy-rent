<template>
  <radio-group @change="onChange">
    <label class="radio-label" v-for="(item, index) in options" :key="index">
      <radio :value="item" :checked="selected === item">{{ item }}</radio>
    </label>
  </radio-group>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default: () => []
    },
    selected: {
      type: String,
      default: ''
    }
  },
  methods: {
    onChange(event) {
      this.$emit('update:selected', event.detail.value);
    }
  }
}
</script>

<style>
.radio-label {
  margin-right: 10px;
}
</style>