<template>
	<view class="page-container">
		
		<!-- <view class="c-cell__input"> -->
			<input class="c-cell__input" type="text" v-model="nickname" placeholder="请输入昵称" />
		<!-- </view> -->
		
		 <button class="sg-button c-footer__btn" type="primary" @tap="saveNickname">确定</button>
		
	</view>
</template>

<script>
	import {
		SaveUserInfoApi
	} from '../../api/index.js'
	export default {
		data() {
			return {
				nickname: '',
				
			}
		},
		computed: {
			uid: {
				get() {
					return getApp().globalData.uid;
				}
			}
		},
		onLoad(opt) {
			
		},
		methods: {
			saveNickname() {
				console.log('nic ----- ', this.nickname)
				if (this.nickname.length === 0) {
					uni.showToast({
						title: '请输入昵称',
						icon: 'none'
					});
					return;
				}
				SaveUserInfoApi(this.uid, this.nickname).then(ret => {
					console.log('SaveUserInfoApi ret ==== ', ret);
					uni.showToast({
						title: '更新成功',
						icon: 'success',
					});
					uni.$emit('updateUserInfo');
					setTimeout(() => {
						uni.navigateBack();
					}, 1000);
				})
				.catch(err => {
					console.log('SaveUserInfoApi err ==== ', err);
					uni.showToast({
						title: '失败' + err,
						icon: 'none',
					});
				})
			}
		}
	}
</script>

<style>
	.page-container {
	  padding-bottom: 24rpx;
	}
	.c-cell__input {
		flex: 1;
		height: 100rpx;
		line-height: 56rpx;
		font-size: 30rpx;
		color: #0D130D;
	 /* flex: 1;
	  height: 56rpx;
		line-height: 60rpx;
	  font-size: 23rpx;
	  color: #262626; */
		background-color: #FFFFFF;
		padding-left: 30rpx;
		padding-right: 30rpx;
	}
	.c-footer__btn {
	  margin-left: 32rpx;
		margin-right: 32rpx;
	  height: 88rpx;
	  line-height: 88rpx;
	  font-size: 34rpx;
	  font-weight: bold;
		margin-top: 74rpx;
	  color: rgba(255,255,255,1);
	}
</style>
