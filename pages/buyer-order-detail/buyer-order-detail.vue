<template>
	<view class="page-container">
		<!-- header -->
		<view class="c-order-header">
			<view class="c-order-header__body">
				<view class="c-order-header__title">{{ orderStatusTitle }}</view>
				<view class="c-order-header__label">订单金额：¥{{ orderInfo.price }}</view>
			</view>
			<view class="c-order-header__right">
				<image class="c-order-header__image" v-if="orderStatus === 2" src="../../static/order-detail/ic_pay_ed@2x.png" mode="aspectFill"></image>
				<image class="c-order-header__image" v-if="orderStatus === -1 || orderStatus === 1" src="../../static/order-detail/ic_wait_to_pay@2x.png" mode="aspectFill"></image>
				<image class="c-order-header__image" v-if="orderStatus === 3" src="../../static/order-detail/ic_deliver@2x.png" mode="aspectFill"></image>
				<image class="c-order-header__image" v-if="orderStatus === 5 || orderStatus === 6" src="../../static/order-detail/ic_refunding@2x.png" mode="aspectFill"></image>
				<image class="c-order-header__image" v-if="orderStatus === 4 || orderStatus === 7" src="../../static/order-detail/ic_complete@2x.png" mode="aspectFill"></image>
			</view>
		</view>

		<!-- 地址 -->
		<view class="c-address">
			<image class="c-address__icon" src="../../static/common/ic_location@2x.png" mode="aspectFill"></image>
			<view class="c-address__content">
				<view class="c-address__title">{{ orderInfo.name }} {{ orderInfo.phone }}</view>
				<text class="c-address__label-text">{{ orderInfo.area }} {{ orderInfo.address }}</text>
				<!-- <view class="c-address__label">{{ orderInfo.area }} {{ orderInfo.address }}</view> -->
			</view>
			<!-- <image class="c-address__arrow" src="../../static/common/ic_arrow_right_orange@2x.png" mode="aspectFill"></image> -->
		</view>

		<!-- 商品 -->
		<view class="c-product-info">
			<view class="c-product" v-for="item in specs" :key="item.id">
				<image class="c-product__image" :src="item.icon" mode="aspectFill"></image>
				<view class="c-product__content">
					<view class="c-product__title">{{ item.name }}</view>
					<view class="c-product__model">规格：{{ item.p_size }}</view>
					<!-- <view class="c-product__price">{{ item.price }}</view> -->
					<view class="c-product__count">
						<view class="c-product__count-val">{{ item.stock_num }}</view>
					</view>
				</view>
			</view>

			<!-- 小计 -->
			<view class="c-cell">
				<view class="c-cell__title">商品小计</view>
				<view class="c-cell__val">
					<view class="c-price">{{ orderInfo.price }}</view>
				</view>
			</view>
			<!-- 运费 -->
			<view class="c-cell">
				<view class="c-cell__title">运费</view>
				<view class="c-cell__val">快递 ¥{{ orderInfo.freight }}</view>
			</view>
			<!-- 总计 -->
			<view class="c-cell">
				<view class="c-amount-label">
					<text space="nbsp">共{{ productInfo.stock_num }}件商品 小计</text>
				</view>
				<view class="c-price">{{ orderInfo.price }}</view>
			</view>
		</view>

		<!-- 订单信息 -->
		<view class="c-section">
			<view class="c-section__header">订单信息</view>
			<view class="c-info-cell">
				<view class="c-info-cell__title">订单编号：</view>
				<view class="c-info-cell__val">{{ orderInfo.order_no }}</view>
			</view>
			<view class="c-info-cell">
				<view class="c-info-cell__title">创建时间：</view>
				<view class="c-info-cell__val">{{ orderInfo.create_time }}</view>
			</view>
		</view>

		<!-- 发货单号 & 退款进度   v-if="orderStatus === 3 || orderStatus === 4"-->
		<view class="c-section" v-if="orderStatus === 3 || orderStatus === 4">
			<view class="c-section__header">
				发货单号
				<!-- <view class="c-section__detailbtn">详情</view> -->
			</view>
			<view class="c-info-cell">
				<view class="c-info-cell__title">{{ orderInfo.expresscom }}</view>
				<view class="c-info-cell__val">{{ orderInfo.expresssn }}</view>
			</view>

			<view class="c-section__header c-express-progress-title">
				快递进度
				<!-- <view class="c-section__detailbtn">详情</view> -->
			</view>

			<view class="c-section-express-list" v-for="item in expressList" :key="item.time">
				<view class="c-express-progress">{{ item.status }}</view>
				<view class="c-express-progress-detail">{{ item.context }}</view>
			</view>
		</view>

		<!-- footer  根据不同业务确定不同 按钮及功能-->
		<view class="c-footer">
			<view class="c-footer__btn" v-if="orderStatus === -1" @tap="cancellationOrder()">取消订单</view>
			<view class="c-footer__btn c-footer__btn--active" v-if="orderStatus === -1" @tap="goTopayOrder()">支付订单</view>
			<view class="c-footer__btn" v-if="orderStatus === 1 || orderStatus === 2" @tap="applyforFefund()">申请退款</view>
			<view class="c-footer__btn c-footer__btn--active" v-if="orderStatus === 5" @tap="cancellationOfRefund()">取消退款</view>
			<view class="c-footer__btn" v-if="orderStatus === 4 || orderStatus === 6 || orderStatus === -2 || orderStatus === 7" @tap="cancellationOrder()">{{ orderStatusTitle }}</view>
			<view class="c-footer__btn c-footer__btn--active" v-if="orderStatus === 3" @tap="confirmOrder()">确认收货</view>
		</view>

		<!-- 支付 -->
		<sg-popup v-model="paymentPopupVisible" custom-class="c-payment-popup" position="bottom">
			<image class="c-payment-popup__close" src="../../static/common/ic_cancel@2x.png" mode="aspectFill" @tap="closePaymentPopup"></image>
			<view class="c-payment">
				<view class="c-payment__title">选择支付方式</view>
				<view class="c-payment__subtitle">待支付</view>
				<view class="c-payment__price">¥ {{ pay_amount }}</view>

				<!-- #ifdef MP-WEIXIN -->
				<view class="c-payway" @tap="weixinMPPay">
					<image class="c-payway__image" src="../../static/common/ic_wechatpay@2x.png" mode="aspectFill"></image>
					<view class="c-payway__content">
						<view class="c-payway__title">微信支付</view>
						<view class="c-payway__label">微信安全支付</view>
					</view>
					<!-- <image v-if="payWay === 1" class="c-payway__check" src="../../static/common/circle_checked@2x.png" mode="aspectFill"></image>
					<image v-else class="c-payway__check" src="../../static/common/circle_unchecked@2x.png" mode="aspectFill"></image> -->
				</view>
				<view class="c-payway" @tap="balanceMPPay">
					<image class="c-payway__image" src="../../static/common/ic_wallet_pay@2x.png" mode="aspectFill"></image>
					<view class="c-payway__content">
						<view class="c-payway__title">钱包余额支付</view>
						<view class="c-payway__label">余额：￥{{ balance }}</view>
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
					<view class="c-payway" @tap="payWay = 3">
						<image class="c-payway__image" src="../../static/common/ic_wallet_pay@2x.png" mode="aspectFill"></image>
						<view class="c-payway__content">
							<view class="c-payway__title">钱包余额支付</view>
							<view class="c-payway__label">余额：￥{{ balance }}</view>
						</view>
						<image v-if="payWay === 3" class="c-payway__check" src="../../static/common/circle_checked@2x.png" mode="aspectFill"></image>
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
import { GetOrderDetailInfoApi, GetOrderInfoApi, CancelOrderApi, WithdrawalInfoApi, CancelforFefundApi, ApplyforFefundApi, ConfirmReceiptApi } from '../../api/index.js';
export default {
	data() {
		return {
			order_id: '',
			order_no: '',
			orderStatus: 1,
			orderInfo: {},
			orderStatusTitle: '付款成功',
			productInfo: {},
			lastLogistics: {}, //最新物流状态
			specs: [],
			paymentPopupVisible: false, // 是否显示支付popup
			pay_amount: 0,
			providerList: [], //支付方式列表
			payWay: 1, // 1:微信 2：支付宝 3：余额
			balance: 0,
			expressList: [],
			jType: ''
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

	onLoad(opt) {
		this.order_id = opt.orderid;
		this.jType = opt.jType;
		console.log('get GetOrderDetailInfoApi order_id', this.order_id, opt.orderid, opt.jType);
		this.getOrderDetailData();
	},

	onBackPress(e) {
		console.log('onBackPress');
		if (e.from === 'navigateBack') {
			return false;
		}
		if (this.jType != 'payend') {
			return false;
		}
		console.log('onBackPress  =====');
		this.back();
		return true;
	},
	
	onUnload() {
		console.log('#ifdef MP-WEIXIN  onBackPress  =====');
	// #ifdef MP-WEIXIN
		if(this.jType === 'payend'){
			wx.navigateBack({
			  delta: 1
			})
		}
	// #endif
	},

	methods: {
		back() {
			uni.navigateBack({
				delta: 2
			});
		},
		getOrderDetailData() {
			GetOrderDetailInfoApi(this.order_id, this.uid)
				.then(res => {
					console.log('get GetOrderDetailInfoApi res', res);
					this.orderInfo = res.data;
					this.order_id = this.orderInfo.id;
					this.order_no = this.orderInfo.order_no;
					this.pay_amount = this.orderInfo.pay_price;
					this.productInfo = res.data.product;
					this.lastLogistics = res.data.express[0];
					this.orderStatus = res.data.status;
					this.specs = res.data.product.specs;
					this.expressList = res.data.product.express;
					this.handelOrderInfo();
				})
				.catch(err => {
					console.log('get GetOrderDetailInfoApi error', err);
				});
		},

		handelOrderInfo() {
			switch (this.orderStatus) {
				case -1:
					this.orderStatusTitle = '待付款';
					break;
				case -2:
					this.orderStatusTitle = '已取消';
					break;
				case 1:
					this.orderStatusTitle = '待确认';
					break;
				case 2:
					this.orderStatusTitle = '待发货';
					break;
				case 3:
					this.orderStatusTitle = '待收货';
					break;
				case 4:
					this.orderStatusTitle = '已完成';
					break;
				case 5:
					this.orderStatusTitle = '退款中';
					break;
				case 6:
					this.orderStatusTitle = '退款完成';
					break;
				case 7:
					this.orderStatusTitle = '已关闭';
					break;
				default:
					break;
			}
		},

		async requestPayment(e, orderInfo) {
			const self = this;
			console.log('pay type e ==== ', e);
			// this.providerList[0].loading = true;
			console.log('得到订单信息', orderInfo);
			if (e.id == 'alipay') {
				uni.requestPayment({
					provider: e.id,
					orderInfo: orderInfo,
					success: e => {
						console.log('success', e);
						self.closePaymentPopup();
						this.getOrderDetailData();
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
						this.providerList[index].loading = false;
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
						self.closePaymentPopup();
						this.getOrderDetailData();
						uni.showToast({
							title: '支付成功'
						});
					},
					fail: e => {
						console.log('fail', e);
						uni.showModal({
							content: '支付失败,原因为: ' + e.errMsg,
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
						self.closePaymentPopup();
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
							content: '小程序支付失败,原因为: ' + e.errMsg,
							showCancel: false
						});
					},
					complete: () => {
						// this.providerList[index].loading = false;
					}
				});
			}
		},

		// 支付订单
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

			if (this.payWay == 3) {
				//余额
				let e = { id: 'balance' };
				this.getOrderInfo(e);
			}
		},

		goTopayOrder(item) {
			//支付
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

					this.paywaychoose(item);
				},
				fail: e => {
					console.log('获取支付通道失败：', e);
				}
			});
			// #endif

			// #ifdef MP-WEIXIN
			this.paywaychoose(item);
			// #endif
		},

		paywaychoose(item) {
			this.paymentPopupVisible = true;
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

					if (res.code == 1) {
						if (payType == 'balance') {
							if (res.data.pay_info.code == 1) {
								//刷新订单信息
								uni.showToast({
									title: '支付成功',
									icon: 'success',
									mask: true
								});
								this.getOrderDetailData();
							} else {
								uni.showToast({
									title: '支付失败' + res.data.pay_info.msg,
									icon: 'none'
								});
							}
						} else {
							self.requestPayment(e, res.data.pay_info);
						}
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
				});
		},

		//微信小程序支付
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
		},
		balanceMPPay() {
			let e = { id: 'balance' };
			this.getOrderInfo(e);
		},
		// 关闭支付popup
		closePaymentPopup() {
			this.paymentPopupVisible = false;
		},

		cancellationOrder(orderId) {
			//取消订单
			CancelOrderApi(this.order_id, this.uid)
				.then(res => {
					console.log('get CancelOrderApi success', res);
					if (res.code == 1) {
						uni.showToast({
							title: '取消成功',
							icon: 'success',
							mask: true
						});
						this.getOrderDetailData();
					}
				})
				.catch(err => {
					uni.showToast({
						title: '取消失败',
						icon: 'none'
					});
					console.log('get CancelOrderApi error', err);
				});
		},

		applyforFefund() {
			//申请退款
			ApplyforFefundApi(this.order_id, this.uid)
				.then(res => {
					uni.showToast({
						title: '申请成功',
						icon: 'success',
						mask: true
					});

					console.log('get ApplyforFefundApi success', res);
					if (res.code == 1) {
						this.getOrderDetailData();
					}
				})
				.catch(err => {
					uni.showToast({
						title: '申请失败' + err,
						icon: 'none'
					});
					console.log('get ApplyforFefundApi error', err);
				});
		},

		confirmOrder() {
			//确认收货
			ConfirmReceiptApi(this.order_id, this.uid)
				.then(res => {
					uni.showToast({
						title: '确认成功',
						icon: 'success',
						mask: true
					});
					console.log('get ConfirmReceiptApi success', res);
					if (res.code == 1) {
						this.getOrderDetailData();
					}
				})
				.catch(err => {
					uni.showToast({
						title: '确认失败',
						icon: 'none'
					});
					console.log('get ConfirmReceiptApi error', err);
				});
		},

		cancellationOfRefund() {
			//取消退款 this.order_id, this.uid

			CancelforFefundApi(this.order_id, this.uid)
				.then(res => {
					console.log('get CancelforFefundApi success', res);
					if (res.code == 1) {
						uni.showToast({
							title: '取消退款成功',
							icon: 'success',
							mask: true
						});
						this.getOrderDetailData();
					}
				})
				.catch(err => {
					uni.showToast({
						title: '取消失败',
						icon: 'none'
					});
					console.log('get CancelforFefundApi error', err);
				});
		}
	} //method end
};
</script>

<style lang="scss">
@import '@/common/scss/mixin.scss';
.c-msg-scroll {
	height: calc(100vh - 198rpx);
	background: #fff;
}
.page-container {
	padding-bottom: 122rpx;
}
.c-order-header {
	height: 213rpx;
	background: #ef4345;
	display: flex;
	align-items: center;
}
.c-order-header__body {
	padding-left: 70rpx;
	height: 100%;
	padding-top: 54rpx;
	flex: 1;
}
.c-order-header__title {
	height: 48rpx;
	font-size: 34rpx;
	font-weight: 400;
	color: rgba(255, 255, 255, 1);
	line-height: 48rpx;
}
.c-order-header__label {
	margin-top: 14rpx;
	height: 33rpx;
	font-size: 24rpx;
	font-weight: 400;
	color: rgba(255, 255, 255, 0.8);
	line-height: 33rpx;
}
.c-order-header__right {
	display: flex;
	padding-right: 116rpx;
	height: 100%;
	align-items: center;
}
.c-order-header__image {
	width: 80rpx;
	height: 80rpx;
}

// 地址
.c-address {
	position: relative;
	padding: 24rpx 38rpx 24rpx 24rpx;
	display: flex;
	background: #fff;
	align-items: center;
}
.c-address:active {
	background: #f4f5f6;
}
.c-address__icon {
	position: absolute;
	width: 40rpx;
	height: 40rpx;
	left: 24rpx;
	top: 24rpx;
	z-index: 1;
}
.c-address__content {
	flex: 1;
	padding-left: 60rpx;
	padding-right: 20rpx;
}
.c-address__title {
	height: 42rpx;
	font-size: 30rpx;
	font-weight: 400;
	color: rgba(13, 19, 13, 1);
	line-height: 42rpx;
}
.c-address__label {
	margin-top: 16rpx;
	height: 36rpx;
	font-size: 26rpx;
	font-weight: 400;
	color: rgba(13, 19, 13, 1);
	line-height: 36rpx;
}
.c-address__arrow {
	width: 8rpx;
	height: 16rpx;
}
// 产品信息
.c-product {
	display: flex;
	background: #f4f5f6;
	padding: 24rpx;
}
.c-product__image {
	width: 180rpx;
	height: 180rpx;
	border-radius: 6rpx 6rpx 0 0;
}
.c-product__content {
	flex: 1;
	position: relative;
	padding-left: 24rpx;
}
.c-product__title {
	height: 90rpx;
	font-size: 32rpx;
	font-weight: 400;
	color: rgba(102, 102, 102, 1);
	line-height: 45rpx;
	@include ellipsis(2);
}
.c-product__model {
	margin-top: 10rpx;
	height: 45rpx;
	font-size: 32rpx;
	font-weight: 400;
	color: rgba(102, 102, 102, 1);
	line-height: 45rpx;
	padding-right: 60rpx;
	@include ellipsis(1);
}
.c-product__price {
	position: relative;
	padding-left: 26rpx;
	height: 48rpx;
	font-size: 34rpx;
	font-weight: 400;
	color: rgba(250, 100, 0, 1);
	line-height: 48rpx;
}
.c-product__price:before {
	content: '￥';
	position: absolute;
	font-size: 22rpx;
	top: 0;
	left: 0;
	line-height: 57rpx;
	z-index: 1;
	color: #fa6400;
}
.c-product__count {
	position: absolute;
	top: 94rpx;
	right: 0;
}
.c-product__count-val {
	position: relative;
	height: 45rpx;
	font-size: 32rpx;
	font-weight: 400;
	color: rgba(38, 38, 38, 1);
	line-height: 45rpx;
	padding-left: 24rpx;
}
.c-product__count-val:before {
	content: 'X';
	position: absolute;
	left: 4rpx;
	top: 0;
	font-size: 24rpx;
	line-height: 51rpx;
	z-index: 1;
}

// cell
.c-cell {
	height: 100rpx;
	background: #fff;
	padding: 0 24rpx;
	display: flex;
	align-items: center;
	@include thin_line_bottom(#e7ebea, 0, 0);
}
.c-cell__title {
	height: 46rpx;
	font-size: 30rpx;
	font-weight: 400;
	color: rgba(13, 19, 13, 1);
	line-height: 46rpx;
}
.c-cell__val {
	flex: 1;
	text-align: right;
	height: 42rpx;
	font-size: 30rpx;
	font-weight: 400;
	color: rgba(38, 38, 38, 1);
	line-height: 42rpx;
}
// 总数量和价格
.c-amount-label {
	flex: 1;
	height: 40rpx;
	font-size: 28rpx;
	font-weight: 400;
	color: rgba(102, 102, 102, 1);
	line-height: 40rpx;
	text-align: right;
}
.c-price {
	display: inline-flex;
	margin-left: 20rpx;
	height: 48rpx;
	font-size: 34rpx;
	font-weight: 400;
	color: rgba(250, 100, 0, 1);
	line-height: 48rpx;
	padding-left: 22rpx;
	position: relative;
}
.c-price:before {
	content: '￥';
	position: absolute;
	left: 0;
	top: 0;
	font-size: 22rpx;
	height: 46rpx;
	line-height: 57rpx;
}
.c-price__decimal {
	height: 48rpx;
	font-size: 28rpx;
	font-weight: 400;
	color: rgba(250, 100, 0, 1);
	line-height: 53rpx;
}

// section
.c-section {
	margin-top: 24rpx;
	background: #fff;
	padding-bottom: 24rpx;
}
.c-section-express-list {
	margin-top: 24rpx;
	padding-bottom: 24rpx;
}
.c-section__header {
	position: relative;
	padding: 0 24rpx;
	height: 94rpx;
	font-size: 30rpx;
	font-weight: 400;
	color: rgba(13, 19, 13, 1);
	line-height: 94rpx;
}
.c-section__detailbtn {
	position: absolute;
	top: 24rpx;
	right: 24rpx;
	z-index: 1;
	height: 46rpx;
	font-size: 30rpx;
	font-weight: 400;
	color: rgba(38, 129, 255, 1);
	line-height: 46rpx;
}
.c-section__detailbtn:active {
	opacity: 0.6;
}

// 信息行
.c-info-cell {
	display: flex;
	align-items: center;
	height: 46rpx;
	padding: 0 24rpx;
}
.c-info-cell + .c-info-cell {
	margin-top: 16rpx;
}
.c-info-cell__title,
.c-info-cell__val {
	height: 46rpx;
	font-size: 30rpx;
	font-weight: 400;
	color: rgba(102, 102, 102, 1);
	line-height: 46rpx;
}
.c-info-cell__title {
	min-width: 154rpx;
}
.c-info-cell__val {
	flex: 1;
}

.c-express-progress-title {
	margin-top: 12rpx;
}

.c-express-progress {
	padding: 0 24rpx;
	height: 46rpx;
	font-size: 33rpx;
	font-weight: 400;
	color: rgba(102, 102, 102, 1);
	line-height: 46rpx;
}
.c-express-progress-detail {
	padding: 0 24rpx;
	height: 66rpx;
	font-size: 30rpx;
	font-weight: 300;
	color: rgba(102, 102, 102, 1);
	line-height: 46rpx;
}

.c-express-progress + .c-express-progress {
	margin-top: 16rpx;
}

// footer
.c-footer {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	height: 98rpx;
	z-index: 100;
	background: #fff;
	display: flex;
	align-items: center;
	padding: 0 24rpx;
	justify-content: flex-end;
	box-shadow: 0rpx -1px 0rpx 0rpx rgba(213, 213, 213, 1);
}
.c-footer__btn {
	height: 56rpx;
	line-height: 1;
	font-size: 26rpx;
	color: #999;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 23rpx;
	border: 1px solid rgba(153, 153, 153, 1);
	border-radius: 28rpx;
}
.c-footer__btn:active {
	opacity: 0.6;
}
.c-footer__btn--active {
	color: #fa6400;
	border: 1px solid #fa6400;
}
.c-footer__btn + .c-footer__btn {
	margin-left: 18rpx;
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

.c-address__label-text {
	margin-top: 16rpx;
	height: 36rpx;
	font-size: 26rpx;
	font-weight: 400;
	color: rgba(13, 19, 13, 1);
	line-height: 36rpx;
	lines: 2;
	// text-overflow: ellipsis;
	overflow: hidden;
}
</style>
