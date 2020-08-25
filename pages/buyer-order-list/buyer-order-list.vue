<template>
	<view class="page-container">
		<view class="c-header">
			<view class="c-search"><sg-search placeholder="输入商品名称搜索" @search="handleSearch"></sg-search></view>
			<!-- 类别 -->
			<view class="c-tabs">
				<view class="c-tab" :class="{ 'c-tab--active': type === 1 }" @tap="handleTabTap(1)">联盟订单</view>
				<view class="c-tab" :class="{ 'c-tab--active': type === 2 }" @tap="handleTabTap(2)">寻货宝订单</view>
			</view>
			<scroll-view scroll-x="true" class="c-category-list">
				<view class="c-category" :class="{ 'c-category--active': status === '' }" @tap="handleStatusChange('')">全部</view>
				<view class="c-category" :class="{ 'c-category--active': status === -1 }" @tap="handleStatusChange(-1)">待付款</view>
				<view class="c-category" :class="{ 'c-category--active': status === 1 }" @tap="handleStatusChange(1)">待确认</view>
				<view class="c-category" :class="{ 'c-category--active': status === 2 }" @tap="handleStatusChange(2)">待发货</view>
				<view class="c-category" :class="{ 'c-category--active': status === 3 }" @tap="handleStatusChange(3)">待收货</view>
				<view class="c-category" :class="{ 'c-category--active': status === 4 }" @tap="handleStatusChange(4)">已完成</view>
				<view class="c-category" :class="{ 'c-category--active': status === 5 }" @tap="handleStatusChange(5)">退款中</view>
				<view class="c-category" :class="{ 'c-category--active': status === 6 }" @tap="handleStatusChange(6)">退款完成</view>
				<!-- <view class="c-category" :class="{ 'c-category--active': status === -2 }" @tap="handleStatusChange(-2)">已取消</view>
				<view class="c-category" :class="{ 'c-category--active': status === 7 }" @tap="handleStatusChange(7)">已关闭</view> -->
			</scroll-view>
		</view>

		<view class="c-order-list">
			<view v-for="item in orderList" :key="item.id">
				<!-- -1待支付 -2已取消 1已支付 待确认 2待发货 3待收货 4已完成 5退款中 6退款完成 7已关闭 -->
				<view class="c-order" v-if="item.status == -1">
					<view class="c-order__inner" @tap="goOrderDetail(item)">
						<image class="c-order__image" :src="item.orderDetail.icon" mode="aspectFill"></image>
						<view class="c-order__content">
							<view class="c-order__title">{{ item.orderDetail.name }}</view>
							<view class="c-order__label">
								<text space="ensp">共{{ item.product_count }}件商品 实付￥{{ item.price }}</text>
							</view>
							<view class="c-order__timeout">
								订单还有
								<view class="c-order__time">29</view>
								分钟超时
							</view>
							<view class="c-order__status">待付款</view>
						</view>
					</view>
					<view class="c-order__footer">
						<view class="c-order__btn" @tap="cancellationOrder(item.id)">取消订单</view>
						<view class="c-order__btn c-order__btn--primary" @tap="goTopayOrder(item)">立即支付</view>
					</view>
				</view>

				<view class="c-order" v-if="item.status == 1">
					<view class="c-order__inner" @tap="goOrderDetail(item)">
						<image class="c-order__image" :src="item.orderDetail.icon" mode="aspectFill"></image>
						<view class="c-order__content">
							<view class="c-order__title">{{ item.orderDetail.name }}</view>
							<view class="c-order__label">
								<text space="ensp">共{{ item.product_count }}件商品 实付￥{{ item.price }}</text>
							</view>
							<view class="c-order__status">待确认</view>
						</view>
					</view>
					<view class="c-order__footer"><view class="c-order__btn" @tap="applyforFefund(item.id)">申请退款</view></view>
				</view>

				<view class="c-order" v-if="item.status == 2">
					<view class="c-order__inner" @tap="goOrderDetail(item)">
						<image class="c-order__image" :src="item.orderDetail.icon" mode="aspectFill"></image>
						<view class="c-order__content">
							<view class="c-order__title">{{ item.orderDetail.name }}</view>
							<view class="c-order__label">
								<text space="ensp">共{{ item.product_count }}件商品 实付￥{{ item.price }}</text>
							</view>
							<view class="c-order__status">待发货</view>
						</view>
					</view>
					<view class="c-order__footer"><view class="c-order__btn" @tap="applyforFefund(item.id)">申请退款</view></view>
				</view>

				<view class="c-order" v-if="item.status == 3">
					<view class="c-order__inner" @tap="goOrderDetail(item)">
						<image class="c-order__image" :src="item.orderDetail.icon" mode="aspectFill"></image>
						<view class="c-order__content">
							<view class="c-order__title">{{ item.orderDetail.name }}</view>
							<view class="c-order__label">
								<text space="ensp">共{{ item.product_count }}件商品 实付￥{{ item.price }}</text>
							</view>
							<view class="c-order__status">待收货</view>
						</view>
					</view>
					<view class="c-order__footer">
						<!-- <view class="c-order__btn" @tap="applyforFefund(item.id)">申请退款</view> -->
						<view class="c-order__btn c-order__btn--primary" @tap="confirmReceipt(item.id)">确认收货</view>
					</view>
				</view>

				<view class="c-order" v-if="item.status == 4">
					<view class="c-order__inner" @tap="goOrderDetail(item)">
						<image class="c-order__image" :src="item.orderDetail.icon" mode="aspectFill"></image>
						<view class="c-order__content">
							<view class="c-order__title">{{ item.orderDetail.name }}</view>
							<view class="c-order__label">
								<text space="ensp">共{{ item.product_count }}件商品 实付￥{{ item.price }}</text>
							</view>
							<view class="c-order__status c-order__status--gray">已完成</view>
						</view>
					</view>
				</view>

				<view class="c-order" v-if="item.status == 5">
					<view class="c-order__inner" @tap="goOrderDetail(item)">
						<image class="c-order__image" :src="item.orderDetail.icon" mode="aspectFill"></image>
						<view class="c-order__content">
							<view class="c-order__title">{{ item.orderDetail.name }}</view>
							<view class="c-order__label">
								<text space="ensp">共{{ item.product_count }}件商品 实付￥{{ item.price }}</text>
							</view>
							<view class="c-order__status c-order__status--parimary">退款中</view>
						</view>
					</view>
					<view class="c-order__footer"><view class="c-order__btn" @tap="cancellationOfRefund(item.id)">取消退款</view></view>
				</view>

				<view class="c-order" v-if="item.status == 6">
					<view class="c-order__inner" @tap="goOrderDetail(item)">
						<image class="c-order__image" :src="item.orderDetail.icon" mode="aspectFill"></image>
						<view class="c-order__content">
							<view class="c-order__title">{{ item.orderDetail.name }}</view>
							<view class="c-order__label">
								<text space="ensp">共{{ item.product_count }}件商品 实付￥{{ item.price }}</text>
							</view>
							<view class="c-order__status c-order__status--gray">退款完成</view>
						</view>
					</view>
				</view>

				<view class="c-order" v-if="item.status == 7">
					<view class="c-order__inner" @tap="goOrderDetail(item)">
						<image class="c-order__image" :src="item.orderDetail.icon" mode="aspectFill"></image>
						<view class="c-order__content">
							<view class="c-order__title">{{ item.orderDetail.name }}</view>
							<view class="c-order__label">
								<text space="ensp">共{{ item.product_count }}件商品 实付￥{{ item.price }}</text>
							</view>
							<view class="c-order__status c-order__status--gray">已关闭</view>
						</view>
					</view>
				</view>

				<view class="c-order" v-if="item.status == -2">
					<view class="c-order__inner" @tap="goOrderDetail(item)">
						<image class="c-order__image" :src="item.orderDetail.icon" mode="aspectFill"></image>
						<view class="c-order__content">
							<view class="c-order__title">{{ item.orderDetail.name }}</view>
							<view class="c-order__label">
								<text space="ensp">共{{ item.product_count }}件商品 实付￥{{ item.price }}</text>
							</view>
							<view class="c-order__status c-order__status--gray">已取消</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="loading">{{ loadingText }}</view>

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
import { GetOrderListApi, CancelOrderApi, CancelforFefundApi, ConfirmReceiptApi, ApplyforFefundApi, GetOrderInfoApi, WithdrawalInfoApi } from '../../api/index.js';
export default {
	data() {
		return {
			type: 1, // 类型 1:联盟,2:寻货宝
			status: '', // 分类 全部‘’
			startPage: 1,
			totalPage: 1,
			orderList: [],
			searchTitle: '',
			loadingText: '加载中...',
			myStoreId: '',
			paymentPopupVisible: false, // 是否显示支付popup
			pay_amount: 0,
			gotoPayOrderNo: '',
			gotoPayOrderId: '',
			payWay: 1, // 1:微信 2：支付宝 3：余额
			providerList: [], //支付方式列表
			balance: 0
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
	
	onPullDownRefresh() {
		
		this.searchForConditions();
		
		console.log('refresh');
		setTimeout(function() {
			uni.stopPullDownRefresh();
		}, 1000);
	},

	onLoad() {
		this.myStoreId = this.userInfo.current_outlet_id;
	},
	onShow() {
		this.searchForConditions();
	},

	onReachBottom() {
		if (Number(this.startPage) >= Number(this.totalPage)) {
			this.loadingText = '没有更多了~';
		} else {
			this.startPage += 1;
			this.getOrderListData();
		}
	},

	methods: {
		getOrderListData() {
			/*
				type 订单类型 1:联盟,2:寻货宝
				order_no 订单编号
				page 第几页
				status 状态 -1待支付 -2已取消 1已支付 待确认 2待发货 3待收货 4已完成 5退款中 6退款完成 7已关闭（不传为全部，多个状态用逗号隔开）
				2：买货订单 
				uid 
				*/
			GetOrderListApi(this.type, this.searchTitle, this.startPage, this.status, 2, this.uid)
				.then(res => {
					this.orderList = this.orderList.concat(res.data.data);
					this.totalPage = res.data.last_page;
					console.log('get GetOrderListApi success', res);
					if (this.startPage >= res.data.last_page) {
						this.loadingText = '没有更多了~';
					}
					if(this.orderList.length <= 0){
						console.log('this.orderList ==== ', this.orderList);
						this.loadingText = '什么都没有发现哦';
					}
				})
				.catch(err => {
					console.log('get GetOrderListApi error', err);
				});
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
						self.closePaymentPopup();
						console.log('success', e);
						uni.navigateTo({
							url: '/pages/buyer-order-detail/buyer-order-detail?orderid=' + this.gotoPayOrderId
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
						uni.navigateTo({
							url: '/pages/buyer-order-detail/buyer-order-detail?orderid=' + this.gotoPayOrderId
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

		goTopayOrder(item) {
			console.log('将要去支付的item == ', item);
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
			//支付

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
			this.pay_amount = item.price;
			console.log('立即支付订单信息 --- ', item);
			this.gotoPayOrderNo = item.order_no;
			this.gotoPayOrderId = item.id;
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
			GetOrderInfoApi(self.gotoPayOrderNo, payType, channel, self.uid)
				.then(res => {
					console.log('GetOrderInfoApi res == ', res);

					if (res.code == 1) {
						if (payType == 'balance') {
							
							if(res.data.pay_info.code == 1){
								uni.showToast({
									title:'支付成功',
									icon:'success'
								})
								
								self.closePaymentPopup();
								//余额 支付成功  到订单详情页面
								uni.navigateTo({
									url: '/pages/buyer-order-detail/buyer-order-detail?orderid=' + self.gotoPayOrderId
								});
								
							} else {
								uni.showToast({
									title:'支付失败' + res.data.pay_info.msg,
									icon:'none'
								})
								
								return;
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
			GetOrderInfoApi(this.gotoPayOrderNo, 'wechat', 'miniapp', self.uid)
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
		// 关闭支付popup
		closePaymentPopup() {
			this.paymentPopupVisible = false;
		},
		balanceMPPay() {
			let e = { id: 'balance' };
			this.getOrderInfo(e);
		},

		cancellationOrder(orderId) {
			//取消订单
			CancelOrderApi(orderId, this.uid)
				.then(res => {
					uni.showToast({
						title: '取消成功',
						icon: 'success',
						mask: true
					});
					console.log('get CancelOrderApi success', res);
					if (res.code == 1) {
						this.searchForConditions();
					}
				})
				.catch(err => {
					uni.showToast({
						title: '取消失败' + err,
						icon: 'none'
					});
					console.log('get CancelOrderApi error', err);
				});
		},

		applyforFefund(orderId) {
			//申请退款
			console.log('申请退款 orderId', orderId);
			ApplyforFefundApi(orderId, this.uid)
				.then(res => {
					uni.showToast({
						title: '申请成功',
						icon: 'success',
						mask: true
					});

					console.log('get ApplyforFefundApi success', res);
					if (res.code == 1) {
						this.searchForConditions();
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

		cancellationOfRefund(orderId) {
			//取消退款
			CancelforFefundApi(orderId, this.uid)
				.then(res => {
					console.log('get CancelforFefundApi success', res);
					if (res.code == 1) {
						uni.showToast({
							title: '取消退款成功',
							icon: 'success',
							mask: true
						});
						this.searchForConditions();
					}
				})
				.catch(err => {
					uni.showToast({
						title: '取消失败' + err,
						icon: 'none'
					});
					console.log('get CancelforFefundApi error', err);
				});
		},

		confirmReceipt(orderId) {
			//确认收货
			ConfirmReceiptApi(orderId, this.uid)
				.then(res => {
					uni.showToast({
						title: '确认成功',
						icon: 'success',
						mask: true
					});
					console.log('get ConfirmReceiptApi success', res);
					if (res.code == 1) {
						this.searchForConditions();
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

		handleSearch(text) {
			console.log(text);
			this.searchTitle = text;
			this.searchForConditions();
		},
		handleTabTap(type) {
			this.type = type;
			this.searchForConditions();
		},
		handleStatusChange(val) {
			console.log('handleStatusChange', val);
			this.status = val;
			this.searchForConditions();
		},
		searchForConditions() {
			this.loadingText = '加载中...';
			this.startPage = 1;
			this.orderList = [];
			this.getOrderListData();
		},

		goOrderDetail(item) {
			uni.navigateTo({
				url: '/pages/buyer-order-detail/buyer-order-detail?orderid=' + item.id
			});
		}
	}
};
</script>

<style lang="scss">
@import '@/common/scss/mixin.scss';
.loading {
	text-align: center;
	line-height: 60px;
}
.page-container {
	padding-top: 294rpx;
	background: #fff;
}
.c-header {
	position: fixed;
	z-index: 100;
	left: 0;
	right: 0;
	top: 0;
	width: 100%;
	background: #f4f5f6;
}
.c-search {
	padding: 24rpx 24rpx 0 24rpx;
}

// tabs
.c-tabs {
	height: 102rpx;
	display: flex;
	align-items: center;
	background: #f4f5f6;
}
.c-tab {
	position: relative;
	flex: 1;
	height: 102rpx;
	font-size: 32rpx;
	font-weight: 400;
	color: #666666;
	line-height: 102rpx;
	text-align: center;
}
.c-tab--active {
	color: #262626;
	font-weight: bold;
}
.c-tab--active:after {
	content: '';
	position: absolute;
	z-index: 1;
	left: 50%;
	top: 76rpx;
	transform: translateX(-50%);
	width: 72rpx;
	height: 8rpx;
	border-radius: 4rpx;
	background: #ef4345;
}

.c-category-list {
	white-space: nowrap;
	border-radius: 20rpx 20rpx 0 0;
	background: #fff;
	box-shadow: 0rpx -5rpx 10rpx -5rpx rgba(15, 3, 20, 0.1);
}
.c-category {
	display: inline-block;
	position: relative;
	height: 96rpx;
	font-size: 28rpx;
	font-weight: 400;
	color: #666666;
	line-height: 84rpx;
	padding: 0 24rpx;
}
.c-category + .c-category {
	margin-left: 12rpx;
}
.c-category--active {
	font-weight: bold;
	color: #262626;
}
.c-category--active:after {
	position: absolute;
	content: '';
	left: 26rpx;
	right: 26rpx;
	bottom: 20rpx;
	z-index: 1;
	height: 6rpx;
	border-radius: 3rpx;
	background: #fa6400;
}

// 产品
.c-order-list {
	padding: 24rpx;
	background: #fff;
	min-height: calc(100vh - 120rpx);
}
.c-order {
	background: #fff;
	@include thin_line_bottom(#f4f5f6, 0, 0);
}
.c-order__inner {
	display: flex;
	padding: 24rpx;
}
.c-order__image {
	width: 180rpx;
	height: 180rpx;
	border-radius: 6rpx 6rpx 0 0;
}
.c-order__content {
	flex: 1;
	position: relative;
	padding-left: 24rpx;
}
.c-order__title {
	height: 90rpx;
	font-size: 32rpx;
	font-weight: 400;
	color: rgba(102, 102, 102, 1);
	line-height: 45rpx;
	@include ellipsis(2);
}
.c-order__label,
.c-order__timeout {
	height: 44rpx;
	font-size: 30rpx;
	font-weight: 400;
	color: rgba(102, 102, 102, 1);
	line-height: 44rpx;
	margin-top: 10rpx;
}
.c-order__timeout {
	margin-top: 4rpx;
	display: flex;
	align-items: center;
}
.c-order__time {
	margin-top: 4rpx;
	height: 44rpx;
	font-size: 30rpx;
	font-weight: 400;
	color: rgba(102, 102, 102, 1);
	line-height: 44rpx;
	color: #ef4345;
}

.c-order__status {
	position: absolute;
	bottom: 0;
	right: 0;
	height: 45rpx;
	font-size: 32rpx;
	font-weight: 400;
	line-height: 45rpx;
	color: #ef4345;
}
.c-order__status--gray {
	color: #bdbdbd;
}
.c-order__status--primary {
	color: #fa6400;
}
.c-order__footer {
	display: flex;
	justify-content: flex-end;
	padding-top: 24rpx;
	height: 122rpx;
	align-items: center;
	padding: 0 24rpx;
}
.c-order__btn {
	height: 56rpx;
	color: #fff;
	line-height: 52rpx;
	width: 150rpx;
	padding: 0;
	border-radius: 28rpx;
	border: 1px solid rgba(153, 153, 153, 1);
	font-size: 26rpx;
	color: #999999;
	text-align: center;
}
.c-order__btn + .c-order__btn {
	margin-left: 18rpx;
}
.c-order__btn--primary {
	color: #fa6400;
	border: 1px solid #fa6400;
}
.c-order__btn:active {
	opacity: 0.6;
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
