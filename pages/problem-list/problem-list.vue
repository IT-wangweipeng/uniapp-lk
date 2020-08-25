<template>
	<view class="page-container">
		<view v-for="(item, index) in questions" :key="item.id">
			<view class="c-problem" @tap="goQuestionDetail(item, index)">
			  <view class="c-problem__title">{{item.question}}</view>
			  <image class="c-problem__edit" src="../../static/problem/ic_ic_edit@2x.png" mode="aspectFill"></image>
			</view>
		</view>
    
    <!-- <view class="c-problem" @tap="go('/pages/problem-edit/problem-edit')">
      <view class="c-problem__title">问题二详情</view>
      <image class="c-problem__edit" src="../../static/problem/ic_ic_edit@2x.png" mode="aspectFill"></image>
    </view>
    <view class="c-problem" @tap="go('/pages/problem-edit/problem-edit')">
      <view class="c-problem__title">问题三详情问题三详情问题三详情问题三详情问题三详情问题三详情问题三</view>
      <image class="c-problem__edit" src="../../static/problem/ic_ic_edit@2x.png" mode="aspectFill"></image>
    </view> -->
    
    <view class="c-footer">
      <button class="sg-button sg-button--square c-footer-btn" type="primary" @tap="addNewQuestion()">新增问题</button>
    </view>
	</view>
</template>

<script>
	import {
		QuestionListApi,
	} from '../../api/index.js'
	export default {
		data() {
			return {
				questions: [],
			};
		},
		computed: {
			uid: {
				get() {
					return getApp().globalData.uid
				}
			}
		},
		onLoad() {
			this.loadQuestionList()
			
			uni.$on('refreshQuestionList', () => {
				this.loadQuestionList();
			})
		},
		destroyed() {
			uni.$off('refreshQuestionList')
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
			goQuestionDetail(item, index) {
			  uni.navigateTo({
			    url: `/pages/problem-edit/problem-edit?isEdit=0&question=${JSON.stringify(item)}`,
			  })
			},
			addNewQuestion() {
				uni.navigateTo({
					url: '/pages/problem-edit/problem-edit?isEdit=1',
				});
			}
    }
	}
</script>

<style lang="scss">
  @import '@/common/scss/mixin.scss';
  .page-container {
    padding-bottom: 98rpx;
  }
  .c-problem {
    background: #fff;
    min-height: 100rpx;
    padding: 27rpx 24rpx 27rpx 32rpx;
    display: flex;
    align-items: center;
    @include thin_line_bottom(#F4F5F6, 0, 0);
  }
  .c-problem__title {
    flex: 1;
    min-height: 46rpx;
    font-size: 32rpx;
    font-weight: 400;
    color: rgba(38,38,38,1);
    line-height: 46rpx;
    padding-right: 18rpx;
  }
  .c-problem__edit {
    width: 64rpx;
    height: 64rpx;
  }
  .c-problem__edit:active {
    opacity: 0.6;
  }
  
  // footer
  .c-footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 98rpx;
    z-index: 100;
  }
  .c-footer-btn {
    height: 98rpx;
    line-height: 98rpx;
    color: #fff;
    font-weight: bold;
    font-size: 34rpx;
  }
</style>
