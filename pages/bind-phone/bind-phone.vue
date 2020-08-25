<template>
	<view class="page-container">
		<!-- 手机号 -->
		<view class="c-field">
			<view class="c-field__label">手机号</view>
			<input class="c-field__input" type="number" placeholder-class="c-field__placeholder" placeholder="输入11位手机号" maxlength="11" v-model="phone" />
		</view>
		<!-- 验证码 -->
		<view class="c-field">
			<input class="c-field__input c-authcode-input" type="number" placeholder-class="c-field__placeholder" placeholder="输入4位验证码" maxlength="4" v-model="authcode" />
			<button class="sg-button sg-button--square c-field__btn" type="primary" @tap="getSmsCode()">发送验证码</button>
		</view>

		<!-- 确定 -->
		<view class="c-submit-container"><button class="sg-button c-submit-btn" type="primary" :disabled="submitBtnDisabled" @tap="submit">确定</button></view>
	</view>
</template>

<script>
import {BindPhoneApi,GetSmsCodeApi} from '../../api/index.js';
export default {
	data() {
		return {
			phone: '',
			authcode: ''
		};
	},
	computed: {
		submitBtnDisabled() {
			return this.phone.length !== 11 || this.authcode.length !== 4;
		}
	},
	methods: {
		submit() {
			
			BindPhoneApi(this.phone,this.authcode)
				.then(res => {
					console.log('bindPhoneApi success', res);
					uni.showToast({
					  title: '绑定成功',
					  icon: 'success',
					  mask: true
					});
					setTimeout(() => {
					  uni.navigateBack()
					}, 1500);
				})
				.catch(err => {
					uni.showToast({
						title: '绑定失败' + err,
						icon: 'none'
					});
					console.log('bindPhoneApi error', err);
				});
		},

		//获取验证码
		getSmsCode() {
			GetSmsCodeApi(this.phone,'bind')
				.then(res => {
					uni.showToast({
					  title: '短信发送成功',
					  icon: 'success',
					  mask: true
					});
					console.log('bind phone get code success', res);
				})
				.catch(err => {
					uni.showToast({
						title: '短信发送失败',
						icon: 'none'
					});
					console.log('bind phone get code error', err);
				});
		},
	}
};
</script>

<style lang="scss">
@import '@/common/scss/mixin.scss';
.page-container {
	padding: 48rpx 24rpx;
}

.c-field {
	width: 100%;
	display: flex;
	height: 100rpx;
	border-radius: 10rpx;
	overflow: hidden;
}
.c-field + .c-field {
	margin-top: 32rpx;
}
.c-field__label {
	min-width: 152rpx;
	height: 100%;
	line-height: 100rpx;
	padding: 0 32upx;
	color: #353535;
	font-size: 28rpx;
	background: #fff;
	@include thin-line-right(#f2f2f2, 0, 0);
}
.c-field__input {
	flex: 1;
	height: 100rpx;
	min-height: 100rpx;
	line-height: 100rpx;
	font-size: 32rpx;
	color: #262626;
	padding: 0 24rpx;
	font-weight: bold;
	background: #fff;
}
.c-field__placeholder {
	color: #bdbdbd;
	font-size: 32rpx;
	font-weight: normal;
}
.c-field__btn {
	width: 228rpx;
	height: 100rpx;
	line-height: 100rpx;
	font-size: 30rpx;
}
.c-authcode-input {
	padding-left: 32rpx;
}
// 登录
.c-submit-container {
	padding: 0 40rpx;
	margin-top: 300rpx;
}
.c-submit-btn {
	height: 88rpx;
	line-height: 88rpx;
	font-size: 34rpx;
	font-weight: bold;
}
</style>
