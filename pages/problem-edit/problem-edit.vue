<template>
	<view class="page-container">
		<view class="c-edit">
      <view class="c-edit__label">问题</view>
      <textarea class="c-edit__textarea" v-model="question"/>
    </view>
    <view class="c-edit">
      <view class="c-edit__label">回答</view>
      <textarea class="c-edit__textarea c-edit__answer" v-model="answer"/>
    </view>
    
    
    <view class="c-footer">
      <button v-if="isEdit" class="sg-button sg-button--square c-delete-btn" type="default" @tap="deleteQuestion">删除问题</button>
      <button class="sg-button sg-button--square c-submit-btn" type="primary" @tap="submit">确认</button>
    </view>
    
	</view>
</template>

<script>
	import {
		DeleteQuestionApi,
		EditQuestionApi,
		AddQuestionApi
	} from '../../api/index.js'
	export default {
		data() {
			return {
				isEdit: false,
				question: '',
				questionId: 0,
				answer: '',
			};
		},
		computed: {
			uid: {
				get() {
					return getApp().globalData.uid
				}
			}
		},
		onLoad(opt) {
			const {isEdit, question} = opt;
			this.isEdit = (parseInt(isEdit) === 0)
			if (this.isEdit) {
				const data = JSON.parse(question);
				this.question = data.question;
				this.answer = data.answer;
				this.questionId = data.id;
			}
			console.log('isEdit === ', this.isEdit);
		},
		destroyed() {
			uni.$emit('refreshQuestionList');
		},
    methods: {
      submit() {
				if (this.isEdit) {
					this.editQuestion()
				} else {
					this.addQuestion()
				}
      },
			editQuestion() {
				EditQuestionApi(this.uid, this.question, this.answer, this.questionId).then(ret => {
					console.log('EditQuestionApi ret = ', ret);
					uni.showToast({
						title: '修改成功',
						icon: 'none'
					});
					uni.navigateBack();
				})
				.catch(err => {
					console.log('EditQuestionApi err = ', err);
					uni.showToast({
						title: err,
						icon: 'none'
					});
				})
			},
			addQuestion() {
				AddQuestionApi(this.uid, this.question, this.answer).then(ret => {
					console.log('AddQuestionApi ret = ', ret);
					uni.showToast({
						title: '添加成功',
						icon: 'none'
					});
					uni.navigateBack();
				})
				.catch(err => {
					console.log('AddQuestionApi err = ', err);
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					});
				})
			},
			deleteQuestion() {
				uni.showModal({
					title: '确认删除？',
					content: '确认删除后，将删除此问题！',
					confirmColor: '#FA6400',
					confirmText: '删除',
					success: (e) => {
						if (e.confirm) {
							DeleteQuestionApi(this.uid, this.questionId).then(ret => {
								console.log('DeleteQuestionApi ret = ', ret);
								uni.showToast({
									title: '删除成功',
									icon: 'none'
								});
								uni.navigateBack();
								// 刷新列表
							})
							.catch(err => {
								console.log('DeleteQuestionApi err = ', err);
								uni.showToast({
									title: '失败' + err,
									icon: 'none'
								});
							})
						}
					}
				})
			}
    }
	}
</script>

<style lang="scss">
  .page-container {
    padding-bottom: 98rpx;
  }
  .c-edit {
    display: flex;
    padding: 28rpx 40rpx;
    background: #fff;
    margin-bottom: 26rpx;
  }
  .c-edit__label {
    height: 46rpx;
    font-size: 32rpx;
    font-weight: 400;
    color: rgba(153,153,153,1);
    line-height: 46rpx;
  }
  .c-edit__textarea {
    flex: 1;
    height: 144rpx;
    font-size: 32rpx;
    font-weight: 400;
    color: rgba(38,38,38,1);
    line-height: 46rpx;
    padding-left: 32rpx;
  }
  .c-edit__answer {
    height: 344rpx;
  }
  
  // footer
  .c-footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 98rpx;
    z-index: 100;
    display: flex;
  }
  .c-submit-btn {
    flex: 1;
    height: 98rpx;
    line-height: 98rpx;
    color: #fff;
    font-weight: bold;
    font-size: 34rpx;
  }
  .c-delete-btn {
    height: 98rpx;
    line-height: 98rpx;
    width: 270rpx;
    color: #262626;
    font-weight: bold;
    font-size: 34rpx;
  }
</style>
