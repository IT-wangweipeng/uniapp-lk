<template>
	<view class="page-container">
		<view class="c-cell">
			<view class="c-cell__title">当前余额</view>
			<view class="c-cell__val">{{ balance }}</view>
		</view>
		<view class="c-field">
			<view class="c-field__title">充值金额</view>
			<input class="c-field__input" type="number" v-model="inputValue" @input="bindInput"></input>
			<view class="c-field__unit">元</view>
		</view>

		<view class="c-recharge-btn-container"><button class="sg-button c-recharge-btn" type="primary" @tap="recharge">确定</button></view>

		<!-- 支付 -->
		<sg-popup v-model="paymentPopupVisible" custom-class="c-payment-popup" position="bottom">
			<image class="c-payment-popup__close" src="../../static/common/ic_cancel@2x.png" mode="aspectFill" @tap="closePaymentPopup"></image>
			<view class="c-payment">
				<view class="c-payment__title">选择支付方式</view>
				<view class="c-payment__subtitle">待支付</view>
				<view class="c-payment__price">¥ {{ inputValue }}</view>

				<!-- #ifdef MP-WEIXIN -->
				<view class="c-payway" @tap="weixinMPPay">
					<image class="c-payway__image" src="../../static/common/ic_wechatpay@2x.png" mode="aspectFill"></image>
					<view class="c-payway__content">
						<view class="c-payway__title">微信支付</view>
						<view class="c-payway__label">微信安全支付</view>
					</view>
				</view>

				<!-- #endif -->

				<!-- #ifdef APP-PLUS -->
				<view class="c-payway-list">
					<view class="c-payway" @tap="payWay = 1">
						<image class="c-payway__image" src="../../static/common/ic_wechatpay@2x.png" mode="aspectFill"></image>
						<view class="c-payway__content">
							<view class="c-payway__title">微信支付</view>
							<view class="c-payway__label">微信安全支付</view>
						</view>
						<image v-if="payWay === 1" class="c-payway__check" src="../../static/common/circle_checked@2x.png" mode="aspectFill"></image>
						<image v-else class="c-payway__check" src="../../static/common/circle_unchecked@2x.png" mode="aspectFill"></image>
					</view>
					<view class="c-payway" @tap="payWay = 2">
						<image class="c-payway__image" src="../../static/common/ic_alipay@2x.png" mode="aspectFill"></image>
						<view class="c-payway__content">
							<view class="c-payway__title">支付宝支付</view>
							<view class="c-payway__label">支付宝安全支付</view>
						</view>
						<image v-if="payWay === 2" class="c-payway__check" src="../../static/common/circle_checked@2x.png" mode="aspectFill"></image>
						<image v-else class="c-payway__check" src="../../static/common/circle_unchecked@2x.png" mode="aspectFill"></image>
					</view>
				</view>

				<view class="c-payment__footer"><button class="sg-button c-payment__pay" type="primary" @tap="payOrder">支付</button></view>
				<!-- #endif -->
			</view>
		</sg-popup>
	</view>
</template>

<script>
import { RechargePlaceOrderApi, WithdrawalInfoApi, GetOrderInfoApi } from '../../api/index.js';

export default {
	data() {
		return {
			payWay: 1, // 1:微信 2：支付宝
			paymentPopupVisible: false, // 是否显示支付popup
			order_id: '',
			order_no: '',
			providerList: [], //支付方式列表
			balance: 0,
			inputValue:10,
		};
	},

	computed: {
		uid: {
			get() {
				return getApp().globalData.uid;
			}
		},

		userInfo: {
			get() {
				return getApp().globalData.userInfo;
			}
		}
	},

	onLoad() {
		WithdrawalInfoApi(this.uid)
			.then(ret => {
				console.log('WithdrawalInfoApi ret ==== ', ret);
				this.balance = ret.data.balance;
			})
			.catch(err => {
				console.log('WithdrawalInfoApi err ==== ', err);
				uni.showToast({
					title: '失败' + err,
					icon: 'none'
				});
			});
	},

	methods: {
		bindInput(event) {
			// (event.detail || {}).value;
			console.log('inputVal =  ', (event.detail || {}).value);

			let input = (event.detail || {}).value;
			input = input.replace(/[^\d.]/g, ''); //清除“数字”和“.”以外的字符
			input = input.replace(/\.{2,}/g, '.'); //只保留第一个. 清除多余的
			input = input.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
			input = input.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
			
			const self = this;
			setTimeout(function(){
			　　self.inputValue = input;
			　　},100);　
			console.log('inputValue =  ', this.inputValue)
		},

		//RechargePlaceOrderApi  充值下单
		rechargePlaceOrder() {
			RechargePlaceOrderApi(this.inputValue, this.uid)
				.then(res => {
					// #ifdef APP-PLUS
					uni.getProvider({
						service: 'payment',
						success: e => {
							console.log('获取已配置的支付方式payment === :' + e);
							console.log('payment success:' + JSON.stringify(e));
							let providerList = [];
							e.provider.map(value => {
								switch (value) {
									case 'wxpay':
										providerList.push({
											name: '微信',
											id: value,
											loading: false
										});
										break;
									case 'alipay':
										providerList.push({
											name: '支付宝',
											id: value,
											loading: false
										});
										break;
									default:
										break;
								}
							});
							this.providerList = providerList;
						},
						fail: e => {
							console.log('获取支付通道失败：', e);
						}
					});
					// #endif

					console.log('RechargePlaceOrderApi res ==== ', res);
					this.order_no = res.data.order_no;
					this.paymentPopupVisible = true;
				})
				.catch(err => {
					console.log('RechargePlaceOrderApi err ==== ', err);
					uni.showModal({
						content: err,
						showCancel: false
					});
				});
		},

		payOrder() {
			// payWay: 1, // 1:微信 2：支付宝 3：余额

			//warn:  注意支付方式的顺序
			console.log('pay type == ', this.payWay);
			if (this.payWay == 1) {
				//微信
				let payE = this.providerList[1];
				for (let i = 0; i < this.providerList.length; i++) {
					if (this.providerList[i].id == 'wxpay') {
						payE = this.providerList[i];
					}
				}

				this.getOrderInfo(payE);
			}

			if (this.payWay == 2) {
				//支付宝
				let payE = this.providerList[0];
				for (let i = 0; i < this.providerList.length; i++) {
					if (this.providerList[i].id == 'alipay') {
						payE = this.providerList[i];
					}
				}

				this.getOrderInfo(payE);
			}
		},

		getOrderInfo(e) {
			console.log('获得订单 eeeee === ', e);
			let channel = '';
			// #ifdef APP-PLUS
			channel = 'app';
			// #endif

			// #ifdef MP-WEIXIN
			channel = 'miniapp';
			// #endif
			// wxpay    alipay   balance

			let payType = 'wechat';
			if (e.id == 'alipay') {
				payType = 'alipay';
			}
			if (e.id == 'balance') {
				payType = 'balance';
			}
			const self = this;
			GetOrderInfoApi(this.order_no, payType, channel, this.uid)
				.then(res => {
					console.log('GetOrderInfoApi res == ', res);

					self.requestPayment(e, res.data.pay_info);
				})
				.catch(err => {
					console.log('GetOrderInfoApi error', err);
				});
		},

		async requestPayment(e, orderInfo) {
			console.log('pay type e ==== ', e);
			// this.providerList[0].loading = true;
			console.log('得到订单信息', orderInfo);

			if (e.id == 'alipay') {
				uni.requestPayment({
					provider: e.id,
					orderInfo: orderInfo,
					success: e => {
						console.log('success', e);
						uni.showToast({
							title: '充值成功'
						});
						uni.navigateBack();
					},
					fail: e => {
						console.log('fail', e);
						uni.showModal({
							content: '支付失败',
							showCancel: false
						});
					},
					complete: () => {
						// this.providerList[index].loading = false;
					}
				});
			} else if (e.id == 'wxpay') {
				uni.requestPayment({
					provider: e.id,
					timeStamp: orderInfo.timestamp,
					nonceStr: orderInfo.noncestr,
					package: orderInfo.package,
					signType: 'MD5',
					paySign: orderInfo.sign,
					orderInfo: {
						appid: orderInfo.appid,
						partnerid: orderInfo.partnerid,
						prepayid: orderInfo.prepayid,
						timestamp: orderInfo.timestamp,
						noncestr: orderInfo.noncestr,
						package: orderInfo.package,
						sign: orderInfo.sign
					},

					success: e => {
						console.log('success', e);
						uni.showToast({
							title: '充值成功'
						});
						uni.navigateBack();
					},
					fail: e => {
						console.log('fail', e);
						uni.showModal({
							content: '支付失败',
							showCancel: false
						});
					},
					complete: () => {
						// this.providerList[index].loading = false;
					}
				});
			} else {
				//小程序支付
				//小程序支付
				uni.requestPayment({
					provider: 'wxpay',
					timeStamp: orderInfo.timeStamp,
					nonceStr: orderInfo.nonceStr,
					package: orderInfo.package,
					signType: orderInfo.signType,
					paySign: orderInfo.paySign,
					orderInfo: {
						appid: orderInfo.appid,
						timestamp: orderInfo.timeStamp,
						noncestr: orderInfo.noncestr,
						package: orderInfo.package,
						paySign: orderInfo.paySign
					},

					success: e => {
						console.log('success', e);
						uni.navigateTo({
							url: '/pages/buyer-order-detail/buyer-order-detail?orderid=' + this.order_id
						});
						uni.showToast({
							title: '支付成功'
						});
					},
					fail: e => {
						console.log('fail', e);
						uni.showModal({
							content: '支付失败',
							showCancel: false
						});
					},
					complete: () => {
						// this.providerList[index].loading = false;
					}
				});
			}
		},

		// 确定
		recharge() {
			this.rechargePlaceOrder();
		},
		closePaymentPopup() {
			this.paymentPopupVisible = false;
		},

		weixinMPPay() {
			const self = this;
			GetOrderInfoApi(this.order_no, 'wechat', 'miniapp', getApp().globalData.uid)
				.then(res => {
					console.log('GetOrderInfoApi res == ', res);
					if (res.code == 1) {
						let e = { id: 'wxmp' };
						self.requestPayment(e, res.data.pay_info);
					} else {
						console.log('获得订单信息失败 === ', orderInfo);
						uni.showModal({
							content: '获得订单信息失败',
							showCancel: false
						});
						return;
					}
				})
				.catch(err => {
					console.log('GetOrderInfoApi error', err);
					uni.showModal({
						content: '获得订单信息失败',
						showCancel: false
					});
				});
		}
	} //method end
};
</script>

<style lang="scss">
@import '@/common/scss/mixin.scss';
.page-container {
	background: #fff;
}

.c-cell {
	height: 110rpx;
	display: flex;
	padding: 0 24rpx;
	align-items: center;
	background: #f4f5f6;
}
.c-cell__title,
.c-cell__val {
	height: 46rpx;
	font-size: 32rpx;
	font-weight: 400;
	color: rgba(102, 102, 102, 1);
	line-height: 46rpx;
}
.c-cell__val {
	flex: 1;
	padding-left: 45rpx;
}
.c-field {
	padding: 0 24rpx;
	background: #fff;
	display: flex;
	height: 110rpx;
	align-items: center;
	@include thin_line_bottom(#e7ebea, 0, 0);
}
.c-field__title {
	height: 46rpx;
	font-size: 32rpx;
	font-weight: 400;
	color: rgba(102, 102, 102, 1);
	line-height: 46rpx;
}
.c-field__input {
	height: 56rpx;
	line-height: 56rpx;
	min-height: 56rpx;
	padding-left: 45rpx;
	width: 155rpx;
	font-size: 34rpx;
	color: #fa6400;
}
.c-field__unit {
	flex: 1;
	height: 46rpx;
	font-size: 32rpx;
	font-weight: 400;
	color: rgba(102, 102, 102, 1);
	line-height: 46rpx;
}
.c-recharge-btn-container {
	margin-top: 367rpx;
	padding: 0 64rpx;
}
.c-recharge-btn {
	width: 100%;
	height: 88rpx;
	line-height: 88rpx;
	background: rgba(250, 100, 0, 1);
	border-radius: 6rpx;
	color: #fff;
	font-size: 34rpx;
	font-weight: bold;
}

// 支付弹窗
.c-payment-popup .sg-popup--bottom {
	border-radius: 0;
}
.c-payment-popup__close {
	position: absolute;
	right: 0;
	top: 18rpx;
	right: 24rpx;
	z-index: 1;
	width: 54rpx;
	height: 54rpx;
}
.c-payment {
	padding: 32rpx 0;
}
.c-payment__title {
	height: 50rpx;
	font-size: 36rpx;
	font-weight: bold;
	color: rgba(0, 0, 0, 1);
	line-height: 50rpx;
	text-align: center;
}
.c-payment__subtitle {
	height: 46rpx;
	font-size: 30rpx;
	font-weight: 400;
	color: rgba(13, 19, 13, 1);
	line-height: 46rpx;
	margin-top: 30rpx;
	text-align: center;
	opacity: 0.5;
}
.c-payment__price {
	height: 66rpx;
	font-size: 46rpx;
	font-weight: bold;
	color: rgba(0, 0, 0, 1);
	line-height: 66rpx;
	text-align: center;
	margin-top: 10rpx;
}
.c-payway-list {
	margin-top: 40rpx;
}
.c-payway {
	display: flex;
	background: #fff;
	padding: 0 40rpx;
	align-items: center;
	height: 160rpx;
}
.c-payway:not(:last-child) {
	@include thin_line_bottom(#e7ebea, 30rpx, 30rpx);
}

.c-payway__image {
	width: 40rpx;
	height: 40rpx;
}
.c-payway__content {
	flex: 1;
	padding: 0 24rpx;
}
.c-payway__title {
	height: 42rpx;
	font-size: 30rpx;
	font-weight: bold;
	color: rgba(0, 0, 0, 1);
	line-height: 42rpx;
}
.c-payway__label {
	margin-top: 4rpx;
	height: 46rpx;
	font-size: 30rpx;
	font-weight: 400;
	color: rgba(13, 19, 13, 1);
	line-height: 46rpx;
	opacity: 0.5;
}
.c-payway__check {
	width: 42rpx;
	height: 42rpx;
}
.c-payment__footer {
	margin-top: 50rpx;
	padding: 0 64rpx;
}
.c-payment__pay {
	height: 88rpx;
	line-height: 88rpx;
	font-size: 34rpx;
	font-weight: bold;
	color: rgba(255, 255, 255, 1);
}
</style>
