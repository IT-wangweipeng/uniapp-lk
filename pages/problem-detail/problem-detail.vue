<template>
	<view class="page-container">
		<view class="c-problem-title">{{detail.question}}</view>
    <view class="c-problem-content">
      <text space="nbsp">{{detail.answer}}</text>
    </view>
	</view>
</template>


<script>
	export default {
		onLoad(opt) {
			this.detail = JSON.parse(opt.qa);
		},
		data() {
			return {
				detail: {}
			};
		}
	}
</script>

<style lang="scss">
  .page-container {
    background: #fff;
  }
  .c-problem-title {
    height: 50rpx;
    font-size: 36rpx;
    font-weight: bold;
    color: rgba(15,3,20,0.85);
    line-height: 50rpx;
    padding: 0 40rpx;
    margin-top: 48rpx;
    text-align: center;
  }
  .c-problem-content {
    padding: 0 40rpx 48rpx;
    font-size: 30rpx;
    font-weight: 400;
    color: rgba(15,3,20,0.85);
    line-height: 46rpx;
    margin-top: 48rpx;
  }
</style>
