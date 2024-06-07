<template name="page-head">
	<view class="common-page-head">
		<view class="common-page-head-title">222{{title}}222</view>
	</view>
</template>
<script>
	export default {
		name: "page-head",
		props: {
			title: {
				type: String,
				default: ""
			}
		}
	}
</script>
