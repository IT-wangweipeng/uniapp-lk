<template>
	<view class="page-container">
		<!-- 手机号 -->
		<view class="c-field">
			<view class="c-field__label">手机号</view>
			<input class="c-field__input" type="text" placeholder-class="c-field__placeholder" placeholder="输入11位手机号" maxlength="11" v-model="userName" />
		</view>
		<!-- 验证码 -->
		<view class="c-field">
			<view class="c-field__label">验证码</view>
			<input class="c-field__input" type="text" placeholder-class="c-field__placeholder" placeholder="输入4位验证码" maxlength="4" v-model="authcode" />
			<button class="sg-button sg-button--square c-field__btn" type="primary" @tap="getSmsCode()">发送验证码</button>
		</view>
		<!-- 密码 -->
		<view class="c-field">
			<view class="c-field__label">密码</view>
			<input
				class="c-field__input"
				type="text"
				:password="!showPassword"
				placeholder-class="c-field__placeholder"
				placeholder="输入登录密码"
				maxlength="16"
				v-model="password"
			/>
			<view class="c-field__icon" @tap="showPassword = !showPassword">
				<image class="c-field__img" :src="showPassword ? '/static/common/ic_eye_open@2x.png' : '/static/common/ic_eye_close@2x.png'" mode="aspectFill"></image>
			</view>
		</view>
		<!-- 确认密码 -->
		<view class="c-field">
			<view class="c-field__label">确认密码</view>
			<input
				class="c-field__input"
				type="text"
				:password="!showConfirmPassword"
				placeholder-class="c-field__placeholder"
				placeholder="再次输入登录密码"
				maxlength="16"
				v-model="password2"
			/>
			<view class="c-field__icon" @tap="showConfirmPassword = !showConfirmPassword">
				<image class="c-field__img" :src="showConfirmPassword ? '/static/common/ic_eye_open@2x.png' : '/static/common/ic_eye_close@2x.png'" mode="aspectFill"></image>
			</view>
		</view>
		<!-- 注册 -->
		<view class="c-forgetpwd-container">
			<button v-if="type === '1'" class="sg-button c-forgetpwd-btn" type="primary" :disabled="forgetBtnDisabled" @tap="modifyPasswordAndLogin">确认并登录</button>
			<button v-if="type === '2'" class="sg-button c-forgetpwd-btn" type="primary" :disabled="forgetBtnDisabled" @tap="modifyPassword">确认</button>
		</view>

		<!-- 登录 -->
		<view class="c-login" v-if="type === '1'">
			<view class="c-login__label">已有账号？</view>
			<view class="c-login__btn" @tap="goBack">立即登录</view>
		</view>
	</view>
</template>

<script>
import { GetSmsCodeApi, ChangePasswordApi } from '../../api/index.js';
export default {
	data() {
		return {
			type: '1', // 1是忘记密码 2：修改密码
			userName: '', // 用户名
			authcode: '', // 验证码
			password: '', // 密码
			password2: '', // 确认密码
			showPassword: false, // 是否显示密码
			showConfirmPassword: false // 是否显示确认密码
		};
	},
	computed: {
		forgetBtnDisabled() {
			return this.userName.length !== 11 || this.authcode.length !== 4 || this.password.length < 6 || this.password2.length < 6;
		}
	},
	methods: {
		goBack() {
			uni.navigateBack();
		},

		//获取验证码
		getSmsCode() {
			let postData = {
				mobile: this.userName,
				type: 'editpwd'
			};
			console.log('get sms code post data', postData);
			GetSmsCodeApi(this.userName, 'editpwd')
				.then(res => {
					uni.showToast({
					  title: '短信发送成功',
					  icon: 'success',
					  mask: true
					});
					console.log('get code success', res);
				})
				.catch(err => {
					uni.showToast({
						title: '短信发送失败',
						icon: 'none'
					});
					console.log('get code error', err);
				});
		},

		// 确认修改并登录
		modifyPasswordAndLogin() {
			
			ChangePasswordApi(this.userName, this.authcode, this.password, this.password2)
				.then(res => {
					uni.showToast({
					  title: '修改成功',
					  icon: 'success',
					  mask: true
					});
					console.log('changePasswordApi success', res);
				})
				.catch(err => {
					uni.showToast({
						title: '修改失败',
						icon: 'none'
					});
					console.log('changePasswordApi error', err);
				});
		},
		// 确认修改
		modifyPassword() {
			ChangePasswordApi(this.userName, this.authcode, this.password, this.password2)
				.then(res => {
					uni.showToast({
					  title: '修改成功',
					  icon: 'success',
					  mask: true
					});
					console.log('changePasswordApi success', res);
				})
				.catch(err => {
					uni.showToast({
						title: '修改失败',
						icon: 'none'
					});
					console.log('changePasswordApi error', err);
				});
		}
	},
	/**
	 * @param {Object} options
	 * type: '1': 忘记密码， '2'：修改密码
	 */
	onLoad(options) {
		this.type = options.type || '1';
		if (this.type === '2') {
			uni.setNavigationBarTitle({
				title: '密码修改'
			});
		}
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
	background: #fff;
	border-radius: 10rpx;
	overflow: hidden;
	align-items: center;
}
.c-field + .c-field {
	margin-top: 32rpx;
}
.c-field__label {
	height: 100%;
	min-width: 176rpx;
	line-height: 100rpx;
	padding: 0 32rpx;
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
.c-field__icon {
	height: 100%;
	padding: 0 32rpx;
	display: flex;
	align-items: center;
}
.c-field__img {
	display: block;
	width: 44rpx;
	height: 44rpx;
}
.c-field__btn {
	width: 228rpx;
	height: 100rpx;
	line-height: 100rpx;
	font-size: 30rpx;
}
// 找回密码
.c-forgetpwd-container {
	padding: 0 64rpx;
	margin-top: 34rpx;
}
.c-forgetpwd-btn {
	height: 88rpx;
	line-height: 88rpx;
	font-size: 34rpx;
	font-weight: bold;
}

// 登录
.c-login {
	display: flex;
	align-items: center;
	line-height: 33rpx;
	justify-content: center;
	margin-top: 24rpx;
}
.c-login__label {
	font-size: 24rpx;
	color: #999999;
}
.c-login__btn {
	font-size: 24rpx;
	color: #0076ff;
}
.c-login__btn:active {
	opacity: 0.6;
}
</style>
