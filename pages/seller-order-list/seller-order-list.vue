<template>
	<view class="page-container">
		<view class="c-header">
			<view class="c-search"><sg-search placeholder="输入订单号搜索" @search="handleSearch"></sg-search></view>
			<scroll-view scroll-x="true" class="c-tabs">
				<!-- status 状态 -1待支付 -2已取消 1已支付 待确认 2待发货 3待收货 4已完成 5退款中 6退款完成 7已关闭 -->
				<view class="c-tab" :class="{ 'c-tab--active': status === '' }" @tap="handleTypeChange('')">全部</view>
				<view class="c-tab" :class="{ 'c-tab--active': status === 1 }" @tap="handleTypeChange(1)">待确认</view>
				<view class="c-tab" :class="{ 'c-tab--active': status === 2 }" @tap="handleTypeChange(2)">待发货</view>
				<view class="c-tab" :class="{ 'c-tab--active': status === 3 }" @tap="handleTypeChange(3)">待收货</view>
				<view class="c-tab" :class="{ 'c-tab--active': status === 4 }" @tap="handleTypeChange(4)">已完成</view>
				<view class="c-tab" :class="{ 'c-tab--active': status === 5 }" @tap="handleTypeChange(5)">退款中</view>
				<view class="c-tab" :class="{ 'c-tab--active': status === 6 }" @tap="handleTypeChange(6)">退款完成</view>
				<!-- <view class="c-tab" :class="{ 'c-tab--active': status === 7 }" @tap="handleTypeChange(7)">已关闭</view> -->
			</scroll-view>
		</view>

		<view class="c-list">
			<view v-for="item in orderList" :key="item.id">
				<!-- 待确认 1  测试暂写了2-->
				<view class="c-card" v-if="item.status === 1">
					<view class="c-product">
						<image class="c-product__image" :src="item.orderDetail.icon" mode="aspectFill"></image>
						<view class="c-product__content">
							<view class="c-product__title">{{ item.orderDetail.name }}</view>
							<view class="c-product__model">规格：{{ item.orderDetail.p_size }}</view>
							<view class="c-product__count">
								<view class="c-product__count-val">{{ item.product_count }}</view>
							</view>
							<view class="c-product__price">
								<view class="c-product__price__unit">￥</view>
								{{ item.pay_price }}
							</view>
						</view>
					</view>
					<view class="c-orderinfo">
						<view class="c-orderinfo-cell">
							<view class="c-orderinfo-cell__title">订单状态</view>
							<view class="c-orderinfo-cell__val c-orderinfo-status">待确认</view>
						</view>
						<view class="c-orderinfo-cell">
							<view class="c-orderinfo-cell__title">买家电话</view>
							<view class="c-orderinfo-cell__val">{{ item.phone }}</view>
						</view>
						<view class="c-orderinfo-cell">
							<view class="c-orderinfo-cell__title">运费</view>
							<view class="c-orderinfo-cell__val">
								<view class="c-orderinfo-unit">{{ item.freight }}</view>
							</view>
						</view>
						<view class="c-orderinfo-cell">
							<view class="c-orderinfo-cell__title">订单来源</view>
							<view class="c-orderinfo-cell__val" v-if="item.type == 1">联盟</view>
							<view class="c-orderinfo-cell__val" v-if="item.type == 2">寻货宝</view>
						</view>
						<view class="c-orderinfo-amount">
							<view class="c-amount-label">
								<text space="nbsp">共{{ item.product_count }}件商品 实付</text>
							</view>
							<view class="c-amount-price">{{ item.pay_price }}</view>
						</view>
					</view>
					<view class="c-order-footer">
						<view class="c-order-btn" @tap="refusalQuotation(item.id)">拒绝报价</view>
						<view class="c-order-btn" @tap="goOrderDetail(item.id)">查看详情</view>
						<view class="c-order-btn c-order-btn--active" @tap="confirmOrder(item.id)">确认订单</view>
					</view>
				</view>

				<!-- 待发货 -->
				<view class="c-card" v-if="item.status === 2">
					<view class="c-product">
						<image class="c-product__image" :src="item.orderDetail.icon" mode="aspectFill"></image>
						<view class="c-product__content">
							<view class="c-product__title">{{ item.orderDetail.name }}</view>
							<view class="c-product__model">规格：{{ item.orderDetail.p_size }}</view>
							<view class="c-product__count">
								<view class="c-product__count-val">{{ item.product_count }}</view>
							</view>
							<view class="c-product__price">
								<view class="c-product__price__unit">￥</view>
								{{ item.pay_price }}
							</view>
						</view>
					</view>
					<view class="c-orderinfo">
						<view class="c-orderinfo-cell">
							<view class="c-orderinfo-cell__title">订单状态</view>
							<view class="c-orderinfo-cell__val c-orderinfo-status">待发货</view>
						</view>
						<view class="c-orderinfo-cell">
							<view class="c-orderinfo-cell__title">买家电话</view>
							<view class="c-orderinfo-cell__val">{{ item.phone }}</view>
						</view>
						<view class="c-orderinfo-cell">
							<view class="c-orderinfo-cell__title">运费</view>
							<view class="c-orderinfo-cell__val">
								<view class="c-orderinfo-unit">{{ item.freight }}</view>
							</view>
						</view>
						<view class="c-orderinfo-cell">
							<view class="c-orderinfo-cell__title">订单来源</view>
							<view class="c-orderinfo-cell__val" v-if="item.type == 1">联盟</view>
							<view class="c-orderinfo-cell__val" v-if="item.type == 2">寻货宝</view>
						</view>
						<view class="c-orderinfo-amount">
							<view class="c-amount-label">
								<text space="nbsp">共{{ item.product_count }}件商品 实付</text>
							</view>
							<view class="c-amount-price">{{ item.pay_price }}</view>
						</view>
					</view>
					<view class="c-order-footer">
						<view class="c-order-btn" @tap="goOrderDetail(item.id)">查看详情</view>
						<view class="c-order-btn c-order-btn--active" @tap="directGoDeliverGoodsPage(item.id)">去发货</view>
					</view>
				</view>

				<!-- 待收货 -->
				<view class="c-card" v-if="item.status === 3">
					<view class="c-product">
						<image class="c-product__image" :src="item.orderDetail.icon" mode="aspectFill"></image>
						<view class="c-product__content">
							<view class="c-product__title">{{ item.orderDetail.name }}</view>
							<view class="c-product__model">规格：{{ item.orderDetail.p_size }}</view>
							<view class="c-product__count">
								<view class="c-product__count-val">{{ item.product_count }}</view>
							</view>
							<view class="c-product__price">
								<view class="c-product__price__unit">￥</view>
								{{ item.pay_price }}
							</view>
						</view>
					</view>
					<view class="c-orderinfo">
						<view class="c-orderinfo-cell">
							<view class="c-orderinfo-cell__title">订单状态</view>
							<view class="c-orderinfo-cell__val c-orderinfo-status">待收货</view>
						</view>
						<view class="c-orderinfo-cell">
							<view class="c-orderinfo-cell__title">买家电话</view>
							<view class="c-orderinfo-cell__val">{{ item.phone }}</view>
						</view>
						<view class="c-orderinfo-cell">
							<view class="c-orderinfo-cell__title">运费</view>
							<view class="c-orderinfo-cell__val">
								<view class="c-orderinfo-unit">{{ item.freight }}</view>
							</view>
						</view>
						<view class="c-orderinfo-cell">
							<view class="c-orderinfo-cell__title">订单来源</view>
							<view class="c-orderinfo-cell__val" v-if="item.type == 1">联盟</view>
							<view class="c-orderinfo-cell__val" v-if="item.type == 2">寻货宝</view>
						</view>
						<view class="c-orderinfo-amount">
							<view class="c-amount-label">
								<text space="nbsp">共{{ item.product_count }}件商品 实付</text>
							</view>
							<view class="c-amount-price">{{ item.pay_price }}</view>
						</view>
					</view>
					<view class="c-order-footer"><view class="c-order-btn" @tap="goOrderDetail(item.id)">查看详情</view></view>
				</view>

				<!-- 订单完成 -->
				<view class="c-card" v-if="item.status === 4">
					<view class="c-product">
						<image class="c-product__image" :src="item.orderDetail.icon" mode="aspectFill"></image>
						<view class="c-product__content">
							<view class="c-product__title">{{ item.orderDetail.name }}</view>
							<view class="c-product__model">规格：{{ item.orderDetail.p_size }}</view>
							<view class="c-product__count">
								<view class="c-product__count-val">{{ item.product_count }}</view>
							</view>
							<view class="c-product__price">
								<view class="c-product__price__unit">￥</view>
								{{ item.pay_price }}
							</view>
						</view>
					</view>
					<view class="c-orderinfo">
						<view class="c-orderinfo-cell">
							<view class="c-orderinfo-cell__title">订单状态</view>
							<view class="c-orderinfo-cell__val c-orderinfo-status c-orderinfo-status--grey">订单完成</view>
						</view>
						<view class="c-orderinfo-cell">
							<view class="c-orderinfo-cell__title">买家电话</view>
							<view class="c-orderinfo-cell__val">{{ item.phone }}</view>
						</view>
						<view class="c-orderinfo-cell">
							<view class="c-orderinfo-cell__title">运费</view>
							<view class="c-orderinfo-cell__val">
								<view class="c-orderinfo-unit">{{ item.freight }}</view>
							</view>
						</view>
						<view class="c-orderinfo-cell">
							<view class="c-orderinfo-cell__title">订单来源</view>
							<view class="c-orderinfo-cell__val" v-if="item.type == 1">联盟</view>
							<view class="c-orderinfo-cell__val" v-if="item.type == 2">寻货宝</view>
						</view>
						<view class="c-orderinfo-amount">
							<view class="c-amount-label">
								<text space="nbsp">共{{ item.product_count }}件商品 实付</text>
							</view>
							<view class="c-amount-price">{{ item.pay_price }}</view>
						</view>
					</view>
				</view>

				<!-- 退款中 -->
				<view class="c-card" v-if="item.status === 5">
					<view class="c-product">
						<image class="c-product__image" :src="item.orderDetail.icon" mode="aspectFill"></image>
						<view class="c-product__content">
							<view class="c-product__title">{{ item.orderDetail.name }}</view>
							<view class="c-product__model">规格：{{ item.orderDetail.p_size }}</view>
							<view class="c-product__count">
								<view class="c-product__count-val">{{ item.product_count }}</view>
							</view>
							<view class="c-product__price">
								<view class="c-product__price__unit">￥</view>
								{{ item.pay_price }}
							</view>
						</view>
					</view>
					<view class="c-orderinfo">
						<view class="c-orderinfo-cell">
							<view class="c-orderinfo-cell__title">订单状态</view>
							<view class="c-orderinfo-cell__val c-orderinfo-status">退款中</view>
						</view>
						<view class="c-orderinfo-cell">
							<view class="c-orderinfo-cell__title">买家电话</view>
							<view class="c-orderinfo-cell__val">{{ item.phone }}</view>
						</view>
						<view class="c-orderinfo-cell">
							<view class="c-orderinfo-cell__title">运费</view>
							<view class="c-orderinfo-cell__val">
								<view class="c-orderinfo-unit">{{ item.freight }}</view>
							</view>
						</view>
						<view class="c-orderinfo-cell">
							<view class="c-orderinfo-cell__title">订单来源</view>
							<view class="c-orderinfo-cell__val" v-if="item.type == 1">联盟</view>
							<view class="c-orderinfo-cell__val" v-if="item.type == 2">寻货宝</view>
						</view>
						<view class="c-orderinfo-amount">
							<view class="c-amount-label">
								<text space="nbsp">共{{ item.product_count }}件商品 实付</text>
							</view>
							<view class="c-amount-price">{{ item.pay_price }}</view>
						</view>
					</view>
					<view class="c-order-footer">
						<view class="c-order-btn" @tap="refusalRefund(item.id)">拒绝退款</view>
						<view class="c-order-btn" @tap="goOrderDetail(item.id)">查看详情</view>
						<view class="c-order-btn c-order-btn--active" @tap="agreeRefund(item.id)">确认退款</view>
					</view>
				</view>

				<!-- 退款完成 -->
				<view class="c-card" v-if="item.status === 6">
					<view class="c-product">
						<image class="c-product__image" :src="item.orderDetail.icon" mode="aspectFill"></image>
						<view class="c-product__content">
							<view class="c-product__title">{{ item.orderDetail.name }}</view>
							<view class="c-product__model">规格：{{ item.orderDetail.p_size }}</view>
							<view class="c-product__count">
								<view class="c-product__count-val">{{ item.product_count }}</view>
							</view>
							<view class="c-product__price">
								<view class="c-product__price__unit">￥</view>
								{{ item.pay_price }}
							</view>
						</view>
					</view>
					<view class="c-orderinfo">
						<view class="c-orderinfo-cell">
							<view class="c-orderinfo-cell__title">订单状态</view>
							<view class="c-orderinfo-cell__val c-orderinfo-status c-orderinfo-status--grey">退款完成</view>
						</view>
						<view class="c-orderinfo-cell">
							<view class="c-orderinfo-cell__title">买家电话</view>
							<view class="c-orderinfo-cell__val">{{ item.phone }}</view>
						</view>
						<view class="c-orderinfo-cell">
							<view class="c-orderinfo-cell__title">运费</view>
							<view class="c-orderinfo-cell__val">
								<view class="c-orderinfo-unit">{{ item.freight }}</view>
							</view>
						</view>
						<view class="c-orderinfo-cell">
							<view class="c-orderinfo-cell__title">订单来源</view>
							<view class="c-orderinfo-cell__val" v-if="item.type == 1">联盟</view>
							<view class="c-orderinfo-cell__val" v-if="item.type == 2">寻货宝</view>
						</view>
						<view class="c-orderinfo-amount">
							<view class="c-amount-label">
								<text space="nbsp">共{{ item.product_count }}件商品 实付</text>
							</view>
							<view class="c-amount-price">{{ item.pay_price }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="loading">{{ loadingText }}</view>
		<!-- 确认订单弹框 -->
		<sg-dialog ref="confirmOrderDialog" @confirm="goDeliverGoodsPage(isGotoConfirmId)"></sg-dialog>
	</view>
</template>

<script>
import { GetOrderListApi, CancelOrderApi, ConfirmReceiptApi, ApplyforFefundApi, AgreeRefundApi, RefusalRefundApi, ConfirmOrdereRefundApi } from '../../api/index.js';
export default {
	data() {
		return {
			status: 2,
			orderList: [], // 订单列表
			startPage: 1,
			totalPage: 1,
			searchTitle: '',
			loadingText: '加载中...',
			myStoreId: '',
			isGotoConfirmId: ''
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
		
		this.loadingText = '加载中...';
		this.startPage = 1;
		this.orderList = [];
		this.getOrderListData();
		
		
		console.log('refresh');
		setTimeout(function() {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	
	
	onLoad() {
		this.myStoreId = this.userInfo.current_outlet_id;
	},
	onShow() {
		this.loadingText = '加载中...';
		this.startPage = 1;
		this.orderList = [];
		this.getOrderListData();
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
		refreashOrderList() {
			this.loadingText = '加载中...';
			this.startPage = 1;
			this.orderList = [];
			this.getOrderListData();
		},

		getOrderListData() {
			/*
				type 订单类型 1:联盟,2:寻货宝
				order_no 订单编号
				page 第几页
				status 状态 -1待支付 -2已取消 1已支付 待确认 2待发货 3待收货 4已完成 5退款中 6退款完成 7已关闭（不传为全部，多个状态用逗号隔开）
				1：卖货订单   2:买    这里要用 1-> 卖
				uid 
				*/
			GetOrderListApi('', this.searchTitle, this.startPage, this.status, 1, this.uid)
				.then(res => {
					this.orderList = this.orderList.concat(res.data.data);
					this.totalPage = res.data.last_page;
					console.log('get seller GetOrderListApi success', res);
					if (this.startPage >= res.data.last_page) {
						this.loadingText = '没有更多了~';
					}
					if(this.orderList.length <= 0){
						this.loadingText = '什么都没有发现哦';
					}
					if (this.searchTitle.length > 0) {
						this.loadingText = '未查到相关订单';
					}
					
					
				})
				.catch(err => {
					console.log('get seller GetOrderListApi error', err);
				});
		},

		refusalRefund(order_id) {
			//拒绝退款
			RefusalRefundApi(order_id, this.uid)
				.then(res => {
					
					if(res.code == 0){
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
						return;
					}
					
					
					uni.showToast({
						title: '拒绝退款成功',
						icon: 'none'
					});
					console.log('get  RefusalRefundApi success', res);
					this.refreashOrderList();
				})
				.catch(err => {
					uni.showToast({
						title: '拒绝退款失败' + err,
						icon: 'none'
					});
					console.log('get RefusalRefundApi error', err);
				});
		},

		agreeRefund(order_id) {
			//同意退款status = 5
			AgreeRefundApi(order_id,'',5, this.uid)
				.then(res => {
					
					if(res.code == 0){
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
						return;
					}
					
					uni.showToast({
						title: '同意退款成功',
						icon: 'none'
					});
					this.refreashOrderList();
					console.log('get  AgreeRefundApi success', res);
				})
				.catch(err => {
					uni.showToast({
						title: '退款失败' + err,
						icon: 'none'
					});
					this.refreashOrderList();
					console.log('get AgreeRefundApi error', err);
				});
		},

		refusalQuotation(order_id) {
			const self = this;
			uni.showModal({
				title: '提示',
				content: '拒绝该笔订单报价？',
				success: function(res) {
					if (res.confirm) {
						console.log('用户点击确定');
						self.refusalQuotationAgreeRefund(order_id);
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},

		refusalQuotationAgreeRefund(order_id) {
			//拒绝报价 status = 1
			AgreeRefundApi(order_id, '',1, this.uid)
				.then(res => {
					console.log('get  AgreeRefundApi success', res);
					uni.showToast({
						title: '拒绝报价成功',
						icon: 'none'
					});
					this.refreashOrderList();
				})
				.catch(err => {
					uni.showToast({
						title: '拒绝报价失败' + err,
						icon: 'none'
					});
					console.log('get AgreeRefundApi error', err);
				});
		},

		goOrderDetail(id) {
			uni.navigateTo({
				url: '/pages/seller-order-detail/seller-order-detail?orderid=' + id
			});
		},

		handleSearch(val) {
			console.log(val);
			this.searchTitle = val;
			this.searchForConditions();
		},

		searchForConditions() {
			this.loadingText = '加载中...';
			this.startPage = 1;
			this.orderList = [];
			this.getOrderListData();
		},

		// tab status变更
		handleTypeChange(status) {
			this.status = status;
			this.searchForConditions();
		},

		// 确认订单
		confirmOrder(order_id) {
			this.isGotoConfirmId = order_id;
			this.$refs.confirmOrderDialog.show({
				title: '确认该笔订单成交？',
				content: null,
				showCancel: true,
				cancelText: '取消',
				confirmText: '确定'
			});
		},

		
		// 前往发货页面
		directGoDeliverGoodsPage(order_id) {
			uni.navigateTo({
				url: '/pages/deliver-goods/deliver-goods?orderId=' + order_id
			});
		},
		goDeliverGoodsPage(order_id) {
			//确认订单并前往发货
			console.log('isgotoconfirmid == ', order_id);
			ConfirmOrdereRefundApi(order_id, this.uid)
				.then(res => {
					console.log('get  ConfirmOrdereRefundApi success', res);
					if (res.code == 1) {
						uni.navigateTo({
							url: '/pages/deliver-goods/deliver-goods?orderId=' + order_id
						});
					}
				})
				.catch(err => {
					uni.showToast({
						title: '确认订单失败' + err,
						icon: 'none'
					});
					console.log('get AgreeRefundApi error', err);
				});
		},

		gotoDeliverGoodsPage() {
			uni.navigateTo({
				url: '/pages/deliver-goods/deliver-goods?orderId=' + order_id
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
	padding-top: 216rpx;
	padding-bottom: 24rpx;
}

// header
.c-header {
	position: fixed;
	z-index: 100;
	left: 0;
	right: 0;
	top: 0;
	width: 100%;
	background: #f8f8f8;
}
.c-search {
	padding: 24rpx 24rpx 0 24rpx;
}

.c-tabs {
	white-space: nowrap;
}
.c-tab {
	display: inline-block;
	position: relative;
	height: 96rpx;
	font-size: 28rpx;
	font-weight: 400;
	color: #666666;
	line-height: 84rpx;
	padding: 0 24rpx;
}
.c-tab + .c-tab {
	margin-left: 12rpx;
}
.c-tab--active {
	font-weight: bold;
	color: #262626;
}
.c-tab--active:after {
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

// 订单列表
.c-list {
	padding: 0 24rpx;
	margin-bottom: 24rpx;
}
.c-card {
	background: #fff;
	border-radius: 10rpx 10rpx 0rpx 0rpx;
	margin-bottom: 24rpx;
}
// 产品信息
.c-product {
	display: flex;
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
	display: flex;
	position: absolute;
	right: 0rpx;
	top: 140rpx;
	z-index: 1;
	height: 48rpx;
	font-size: 34rpx;
	font-weight: 400;
	color: rgba(38, 38, 38, 1);
	line-height: 48rpx;
}
.c-product__price__unit {
	font-size: 22rpx;
	height: 48rpx;
	line-height: 60rpx;
	color: #262626;
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
.c-orderinfo {
	padding: 24rpx;
}
.c-orderinfo-cell {
	display: flex;
	align-items: center;
}
.c-orderinfo-cell + .c-orderinfo-cell {
	margin-top: 8rpx;
}
.c-orderinfo-cell__title {
	height: 46rpx;
	font-size: 30rpx;
	font-weight: 400;
	color: rgba(102, 102, 102, 1);
	line-height: 46rpx;
}
.c-orderinfo-cell__val {
	position: relative;
	flex: 1;
	text-align: right;
	height: 42rpx;
	font-size: 30rpx;
	font-weight: 400;
	color: rgba(102, 102, 102, 1);
	line-height: 42rpx;
}
.c-orderinfo-status {
	color: #ef4345;
}
.c-orderinfo-status--grey {
	color: #bdbdbd;
}
.c-orderinfo-unit {
	display: inline-block;
	position: relative;
	padding-left: 22rpx;
}
.c-orderinfo-unit:before {
	content: '￥';
	position: absolute;
	left: 0;
	top: 0;
	z-index: 1;
	height: 42rpx;
	font-size: 22rpx;
	font-weight: 400;
	color: rgba(102, 102, 102, 1);
	line-height: 48rpx;
}

// 总数量和价格
.c-orderinfo-amount {
	margin-top: 20rpx;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
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
	color: #262626;
	line-height: 48rpx;
}
.c-amount-price {
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
	color: #262626;
	line-height: 53rpx;
}
.c-order-footer {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	padding: 0 24rpx;
	height: 98rpx;
	@include thin_line_top(#e7ebea, 0, 0);
}
.c-order-btn {
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
.c-order-btn:active {
	opacity: 0.6;
}
.c-order-btn--active {
	color: #fa6400;
	border: 1px solid #fa6400;
}
.c-order-btn + .c-order-btn {
	margin-left: 18rpx;
}
</style>
