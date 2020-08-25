<template>
	<view class="page-container">
		<!-- 地址 -->
		<view class="c-address" @tap="setAddress">
			<image class="c-address__icon" src="../../static/common/ic_location@2x.png" mode="aspectFill"></image>
			
			<view class="c-address__content">
				<view class="c-address__title" v-if="getAddressSuccess == true">{{ addressInfo.realname }} {{ addressInfo.mobile }}</view>
				<text class="c-address__label-text" v-if="getAddressSuccess == true">{{ addressInfo.province }}{{ addressInfo.city }}{{ addressInfo.area }}{{ addressInfo.address }}</text>
				<!-- <view class="c-address__label" v-if="getAddressSuccess == true">{{ addressInfo.province }}{{ addressInfo.city }}{{ addressInfo.area }}{{ addressInfo.address }}</view> -->
				<view class="c-address__title" v-if="getAddressSuccess == false">请设置收货地址</view>
			</view>
			
			<image class="c-address__arrow" src="../../static/common/ic_arrow_right_orange@2x.png" mode="aspectFill"></image>
		</view>

		<!-- 商品 -->
		<view class="c-product">
			<image class="c-product__image" :src="product_info.product_info.img" mode="aspectFill"></image>
			<view class="c-product__content">
				<view class="c-product__title">{{ product_info.product_info.title }}</view>
				<!-- <view class="c-product__model">规格：XL</view> -->
				<view class="c-product__price">{{ product_info.product_s_price }}</view>
				<view class="c-product__count">
					<view class="c-product__count-val">{{ product_nums }}</view>
				</view>
			</view>
		</view>

		<!-- 商品型号 -->
		<view class="c-product-spec-list">
			<view class="c-product-spec" v-for="item in specs" :key="item.id">
				<view class="c-product-spec__label">购买{{ item.p_color }} {{ item.p_size }} 数量</view>
				<view class="c-step">
					<image class="c-step__img" src="../../static/common/ic_minus@2x.png" mode="aspectFill" @tap="handleSpecMinus(item)"></image>
					<!-- <view class="c-step__val">{{ item.choosedNum }}</view> -->
					
					<input
					class="c-field__input" 
					confirm-type="done" 
					type="number" 
					v-model="item.choosedNum"  
					@input="chooseNumInput($event,item)"
					/>
					
					<image class="c-step__img" src="../../static/common/ic_plus@2x.png" mode="aspectFill" @tap="handleSpecPlus(item)"></image>
				</view>
			</view>
		</view>

		<view class="c-section">
			<!-- 运费 -->
			<view class="c-cell">
				<view class="c-cell__title">运费</view>
				<view class="c-cell__val">快递 ¥ 0.00</view>
			</view>
			<!-- 总计 -->
			<view class="c-cell">
				<view class="c-amount-label">
					<text space="nbsp">共{{ product_nums }}件商品 小计</text>
				</view>
				<view class="c-amount-price">
					{{ all_product_price }}
					<view class="c-amount-price__decimal"></view>
				</view>
			</view>
		</view>

		<!-- footer -->
		<view class="c-footer">
			<view class="c-footer__inner">
				<view class="c-footer-total">
					<view class="c-footer-total__label">合计</view>
					<view class="c-footer-total__price">￥{{ all_product_price }}</view>
				</view>
				<button class="sg-button sg-button--square c-footer-submit" v-if="isSubmiting === 0" type="primary" @tap="submitOrder">提交订单</button>
				<button class="sg-button sg-button--square c-footer-submit" v-if="isSubmiting === 1" type="primary">提交中...</button>
			</view>
		</view>

		<!-- 支付 -->
		<sg-popup v-model="paymentPopupVisible" custom-class="c-payment-popup" position="bottom">
			<image class="c-payment-popup__close" src="../../static/common/ic_cancel@2x.png" mode="aspectFill" @tap="closePaymentPopup"></image>
			<view class="c-payment">
				<view class="c-payment__title">选择支付方式</view>
				<view class="c-payment__subtitle">待支付</view>
				<view class="c-payment__price">¥ {{ all_product_price }}</view>

				<!-- #ifdef MP-WEIXIN -->
				<view class="c-payway" @tap="weixinMPPay">
					<image class="c-payway__image" src="../../static/common/ic_wechatpay@2x.png" mode="aspectFill"></image>
					<view class="c-payway__content">
						<view class="c-payway__title">微信支付</view>
						<view class="c-payway__label">微信安全支付</view>
					</view>
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

		<!-- 测试 -->
		<!-- <template v-if="providerList.length > 0">
			<button v-for="(item, index) in providerList" :key="index" @click="requestPayment(item, index)" :loading="item.loading">{{ item.name }}支付</button>
		</template> -->
	</view>
</template>

<script>
import { PlaceOrderApi, GetOrderInfoApi, GetDefaultAddressApi, WithdrawalInfoApi } from '../../api/index.js';

export default {
	data() {
		return {
			product_info: {},
			product_price: 0,
			all_product_price: 0,
			specs: [],
			payWay: 1, // 1:微信 2：支付宝 3：余额
			paymentPopupVisible: false, // 是否显示支付popup
			order_id: '',
			order_no: '',
			providerList: [], //支付方式列表
			addressInfo: {},
			balance: 0,
			getAddressSuccess:false,
			product_nums:0,
			isSubmiting:0,
		};
	},

	onLoad(opt) {
		let jsonObj = JSON.parse(opt.orderinfo);
		this.product_info = jsonObj;
		console.log('商品订单信息对象 === ', this.product_info);

		this.specs = [].concat(this.product_info.specs);
		this.all_product_price = this.product_info.product_a_price;
		this.product_price = this.product_info.product_s_price;
		this.product_nums = this.product_info.product_nums;
		this.getDefaultAddress();
	},
	

	onShow() {
		this.getDefaultAddress(); //用户设置地址后回退
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

	methods: {
		//获取用户默认地址
		getDefaultAddress() {
			GetDefaultAddressApi(this.uid) //this.uid
				.then(res => {
					console.log('GetDefaultAddressApi res == ', res.data);
					if (res.code == 1) {
						
						this.addressInfo = res.data;
						if (res.data && res.data.realname) {
							this.getAddressSuccess = true;
						} else {
							this.getAddressSuccess = false;
						}
					}
				})
				.catch(err => {
					this.getAddressSuccess = false;
					console.log('GetOrderInfoApi error', err);
				});
		},
		//设置地址
		setAddress() {
			uni.navigateTo({
				url: '/pages/address-list/address-list?canSelected=1'
			});
		},

		// 减少规格型号购买数量
		handleSpecMinus(item) {
			if (item.selectedCount <= 0) {
				return;
			}
			console.log(item);
			console.log(this.specs);
			if (item.choosedNum == 0) {
				return;
			}
			item.choosedNum--;

			let nums = 0;
			for (let i = 0; i < this.specs.length; i++) {
				nums += this.specs[i].choosedNum;
			}
			this.product_nums = nums;
			this.all_product_price = Number(nums) * Number(this.product_price);
			this.all_product_price = parseFloat(this.all_product_price.toFixed(2)); 
		},
		// 增加规格型号购买数量
		handleSpecPlus(item) {
			if (item.choosedNum >= item.maxNum) {
				return;
			}
			item.choosedNum++;

			let nums = 0;
			for (let i = 0; i < this.specs.length; i++) {
				nums += this.specs[i].choosedNum;
			}
			this.product_nums = nums;
			this.all_product_price = Number(nums) * Number(this.product_price);
			this.all_product_price = parseFloat(this.all_product_price.toFixed(2)); 
		},
		
		chooseNumInput(e,item){
			console.log('inputVal ====', e );
			console.log('item ====',item );
			
			const slef = this;
			
			let input = (e.detail || {}).value;
			
			if(typeof input == "undefined" || input == null || input == ""){
				input = 0;
				console.log('空的赋值后0的input ===', input );
			}
			
			if(input.length >=2){
				input = input.replace(/^(0+)|[^\d]+/g,'');
				console.log('正则后的input ===', input );
			}
			
				item.choosedNum = input;
				console.log('item.choosedNum ===',item.choosedNum );
				
				let nums = 0;
				for (let i = 0; i < this.specs.length; i++) {
					nums += Number(this.specs[i].choosedNum);
				}
				this.product_nums = nums;
				this.all_product_price = Number(nums) * Number(this.product_price);
				this.all_product_price = parseFloat(this.all_product_price.toFixed(2));
				console.log('总价 == ', this.all_product_price);
		
		},

		// 提交订单
		submitOrder() {
			
			if(this.getAddressSuccess == false){
				
				uni.showToast({
					title: '未选择收货地址',
					icon:'none'
				});
				
				return;
			}
			
			let specs = JSON.stringify(this.specs);
			let goods_type = 1; // productType 0/5/6  联盟商品1
			let supply_type = 0;
			if (this.product_info.productType == 1 || this.product_info.productType == 4) {
				goods_type = 2;///寻货宝商品2
			}
			if (this.product_info.productType ==6  || this.product_info.productType == 4) {
				supply_type = 1;///供货商品下单 送1
			}
			
			
			this.isSubmiting = 1;//提交中
			PlaceOrderApi(this.addressInfo.id, goods_type, this.product_info.product_info.id, this.all_product_price, specs, this.uid,supply_type) //this.all_product_price  替换测试0.01
				.then(res => {
					console.log('下单 返回 === ',res);
					
					
					if(res.code == 0){
						this.isSubmiting = 0;
						uni.showToast({
							title: res.msg,
							icon:'none'
						});
						return;
					}
					
					console.log('PlaceOrderApi res == ', res);
					this.order_id = res.data.order_id;
					this.order_no = res.data.order_no;

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
							console.log('支付方式providerList  === ', JSON.stringify(this.providerList));
						},
						fail: e => {
							console.log('获取支付通道失败：', e);
						}
					});
					// #endif

					//下单成功调取支付方式
					this.paymentPopupVisible = true;
					this.isSubmiting = 0;//
				})
				.catch(err => {
					uni.showToast({
						title: '下单失败',
						icon:'none'
					});
					console.log('PlaceOrderApi error', err);
				});
		},
		// 关闭支付popup
		closePaymentPopup() {
			this.paymentPopupVisible = false;
			uni.navigateTo({
				url: '/pages/buyer-order-detail/buyer-order-detail?orderid=' + this.order_id +'&jType=' + 'payend'
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
			console.log('pay type e ==== ', e);
			
			// this.providerList[0].loading = true;
			console.log('得到订单信息', orderInfo);
      
			const self = this;
			
			if (e.id == 'alipay') {
				uni.requestPayment({
					provider: e.id,
					orderInfo: orderInfo,
					success: e => {
						self.paymentPopupVisible = false;
						console.log('success', e);
						self.goToOrderDetailPage();
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
				
			} else if(e.id == 'wxpay') {
				
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
						self.paymentPopupVisible = false;
						self.goToOrderDetailPage();
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
						self.paymentPopupVisible = false;
						self.goToOrderDetailPage();
						
						
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
		
		goToOrderDetailPage(){
			
			uni.navigateTo({
				url: '/pages/buyer-order-detail/buyer-order-detail?orderid=' + this.order_id +'&jType=' + 'payend'
			});
			uni.showToast({
				title: '支付成功'
			});
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
			GetOrderInfoApi(this.order_no, payType, channel, getApp().globalData.uid)
				.then(res => {
					console.log('GetOrderInfoApi res ------ == ', res);

					if (res.code == 1) {
						
						if (payType == 'balance') {
							
							if(res.data.pay_info.code == 1){
								console.log('小程序余额支付成功  res ------ == ', res);
								self.paymentPopupVisible = false;
								//余额 支付成功  到订单详情页面
								self.goToOrderDetailPage();
								
								
								
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
					uni.showModal({
						content: '获得订单信息失败',
						showCancel: false
					});
					console.log('GetOrderInfoApi error', err);
					console.log('GetOrderInfoApi error:' + JSON.stringify(err));
				});
		},

		//微信小程序支付
		weixinMPPay() {
			const self = this;
			GetOrderInfoApi(this.order_no, 'wechat', 'miniapp', getApp().globalData.uid)
				.then(res => {
					console.log('GetOrderInfoApi res == ', res);
					if (res.code == 1) {
						let e = { id: 'wxmp' }
						self.requestPayment(e, res.data.pay_info);
					} else {
						console.log('获得订单信息失败 === ', orderInfo);
						uni.showModal({
							content: '小程序获得订单信息失败',
							showCancel: false
						});
						return;
					}
				})
				.catch(err => {
					console.log('GetOrderInfoApi error', err);
					uni.showModal({
						content: '小程序获得订单信息失败',
						showCancel: false
					});
				});
		},
		//小程序余额支付
		balanceMPPay() {
			let e = { id: 'balance' };
			this.getOrderInfo(e);
		}
	}
};
</script>

<style lang="scss">
@import '@/common/scss/mixin.scss';
.page-container {
	background: #fff;
	padding-bottom: 98rpx;
}
// 地址
.c-address {
	position: relative;
	padding: 24rpx;
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
.c-address__label-text{

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
.c-address__label {
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
.c-field__input{
	width: 120rpx;
	height: 60rpx;
	background: rgba(245, 245, 245, 1);
	margin: 0 2rpx;
	line-height: 60rpx;
	text-align: center;
	font-size: 30rpx;
	font-weight: bold;
	color: rgba(38, 38, 38, 1);
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

// 型号
.c-product-spec-list {
	background: #fff;
}
.c-product-spec {
	padding: 0 24rpx;
	height: 100rpx;
	display: flex;
	align-items: center;
	@include thin_line_bottom(#e7ebea, 0, 0);
}
.c-product-spec + .c-product-spec {
	margin-top: 26rpx;
}
.c-product-spec__label {
	flex: 1;
	padding-right: 20rpx;
	height: 46rpx;
	font-size: 30rpx;
	font-weight: 400;
	color: rgba(13, 19, 13, 1);
	line-height: 46rpx;
}
.c-step {
	height: 60rpx;
	display: flex;
}
.c-step__img {
	display: block;
	width: 60rpx;
	height: 60rpx;
}
.c-step__img:active {
	opacity: 0.6;
}
.c-step__val {
	width: 76rpx;
	height: 60rpx;
	margin: 0 2rpx;
	line-height: 60rpx;
	text-align: center;
	font-size: 30rpx;
	font-weight: bold;
	color: rgba(38, 38, 38, 1);
}

.c-section {
	background: #f4f5f6;
	padding-top: 24rpx;
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
.c-amount-price {
	margin-left: 20rpx;
	height: 48rpx;
	font-size: 34rpx;
	font-weight: 400;
	color: rgba(250, 100, 0, 1);
	line-height: 48rpx;
	display: flex;
	padding-left: 22rpx;
	position: relative;
}
.c-amount-price:before {
	content: '￥';
	position: absolute;
	left: 0;
	top: 0;
	font-size: 22rpx;
	height: 46rpx;
	line-height: 57rpx;
}
.c-amount-price__decimal {
	height: 48rpx;
	font-size: 28rpx;
	font-weight: 400;
	color: rgba(250, 100, 0, 1);
	line-height: 53rpx;
}
// footer
.c-footer {
	position: fixed;
	left: 0;
	bottom: 0;
	right: 0;
	height: 98rpx;
	z-index: 100;
	background: #fff;
}
.c-footer__inner {
	height: 100%;
	display: flex;
	@include thin_line_top(#e7ebea, 0, 0);
}
.c-footer-total {
	flex: 1;
	display: flex;
	align-items: center;
	padding: 0 24rpx;
	justify-content: flex-end;
}
.c-footer-total__label {
	height: 30rpx;
	font-size: 22rpx;
	font-weight: 400;
	color: rgba(13, 19, 13, 1);
	line-height: 30rpx;
}
.c-footer-total__price {
	padding-left: 16rpx;
	height: 34rpx;
	font-size: 28rpx;
	font-weight: bold;
	color: rgba(245, 93, 35, 1);
	line-height: 34rpx;
}
.c-footer-submit {
	height: 98rpx;
	line-height: 98rpx;
	font-weight: bold;
	color: rgba(255, 255, 255, 1);
	font-size: 34rpx;
	width: 408rpx;
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
