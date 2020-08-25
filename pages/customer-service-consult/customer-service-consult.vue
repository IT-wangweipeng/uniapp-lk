<template>
	<view class="page-container">
		<view class="c-msg">
		  <image class="c-msg__image" src="../../static/demo/shop.jpeg" mode="aspectFill" @tap="goShopIntroPage"></image>
		  <view class="c-msg__content">
        <view class="c-msg__label">欢迎光临，请问有什么需要咨询吗？</view>
        <view v-for="(item, index) in questions" class="c-question" @tap="goProblemDetail(item)">
          <view class="c-question__number">{{index + 1}}、</view>
          <view class="c-question__label">{{item.question}}</view>
        </view>
		  </view>
      <!-- <view class="c-msg__time">2018-09-11 15:30:56</view> -->
		</view>
	</view>
</template>

<script>
	import {QuestionListApi} from '../../api/index.js'
	export default {
		data() {
			return {
				uid: getApp().globalData.uid,
				questions: [],
			};
		},
		onLoad() {
			this.loadQuestionList()
		},
    methods: {
			loadQuestionList() {
				QuestionListApi(this.uid).then(ret => {
					console.log('QuestionListApi ret = ', ret);
					const result = ret.data;
					this.questions = result;
				})
				.catch(err => {
					console.log('QuestionListApi err = ', err);
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					});
				})
			},
      goProblemDetail(item) {
        uni.navigateTo({
          url: `/pages/problem-detail/problem-detail?qa=${JSON.stringify(item)}`
        });
      }
    }
	}
</script>

<style lang="scss">
  @import '@/common/scss/mixin.scss';
  .page-container {
    padding: 40rpx 0;
  }
  .c-msg {
    position: relative;
    display: flex;
    background: transparent;
    padding: 0 40rpx 40rpx;
    margin-bottom: 24rpx;
  }
  .c-msg__image {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
  }
  .c-msg__content {
    position: relative;
    background: #fff;
    border-radius: 10rpx;
    padding: 18rpx;
    flex: 1;
    margin-left: 40rpx;
  }
  .c-msg__content:before {
    content: '';
    position: absolute;
    z-index: 1;
    left: -14rpx;
    top: 28rpx;
    width:0;
    height:0;
    border-top: 14rpx solid transparent;
    border-bottom: 14rpx solid transparent;
    border-right: 19rpx solid #fff;
  }
  .c-msg__label {
    font-size: 32rpx;
    font-weight: 400;
    color: rgba(0,0,0,1);
    line-height: 44rpx;
  }
  .c-question {
    display: flex;
    margin-top: 16rpx;
  }
  .c-question:active {
    opacity: 0.6;
  }
  .c-question__number,
  .c-question__label {
    font-size: 32rpx;
    color: rgba(38,129,255,1);
    line-height: 44rpx;
  }
  .c-question__label {
    flex: 1;
  }
  .c-msg__time {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    height: 30rpx;
    font-size: 22rpx;
    font-weight: 400;
    color: rgba(181,181,181,1);
    line-height: 30rpx;
    padding-left: 182rpx;
  }
</style>
