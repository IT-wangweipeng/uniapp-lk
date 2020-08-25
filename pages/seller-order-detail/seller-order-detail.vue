<template>
	<view class="page-container">
    <!-- header -->
		<view class="c-order-header">
      <view class="c-order-header__body">
        <view class="c-order-header__title">付款成功</view>
        <view class="c-order-header__label">订单金额（含运费）：¥{{orderInfo.price}}</view>
      </view>
      <view class="c-order-header__right">
        <image class="c-order-header__image" src="../../static/order-detail/ic_wait_to_pay@2x.png" mode="aspectFill"></image>
      </view>
    </view>
    
    <!-- 订单信息 -->
    <view class="c-section c-order-info">
      <view class="c-section__header">订单信息</view>
      <view class="c-order-status-tag">{{orderStatusTitle}}</view>
      <view class="c-info-cell">
        <view class="c-info-cell__title">订单编号：</view>
        <view class="c-info-cell__val">{{orderInfo.order_no}}</view>
      </view>
      <view class="c-info-cell">
        <view class="c-info-cell__title">订单来源：</view>
				<view class="c-info-cell__val" v-if="orderInfo.type == 1">联盟</view>
        <view class="c-info-cell__val" v-if="orderInfo.type == 2">寻货宝</view>
      </view>
      <view class="c-info-cell">
        <view class="c-info-cell__title">配送方式：</view>
        <view class="c-info-cell__val">快递</view>
      </view>
    </view>
    
    <!-- 地址 -->
    <view class="c-address">
      <image class="c-address__icon" src="../../static/common/ic_location@2x.png" mode="aspectFill"></image>
      <view class="c-address__content">
        <view class="c-address__title">{{orderInfo.name}} {{orderInfo.phone}}</view>
				<text class="c-address__label-text">{{ orderInfo.area }} {{ orderInfo.address }}</text>
        <!-- <view class="c-address__label">{{orderInfo.area}} {{orderInfo.address}}</view> -->
      </view>
      <!-- <image class="c-address__arrow" src="../../static/common/ic_arrow_right_orange@2x.png" mode="aspectFill"></image> -->
    </view>
    
    <!-- 商品 -->
    <view class="c-product-info">
	
				<view class="c-product" v-for="item in specs" :key="item.id">
				  <image class="c-product__image" :src="item.icon" mode="aspectFill"></image>
				  <view class="c-product__content">
				    <view class="c-product__title">{{item.name}}</view>
				    <view class="c-product__model">规格：{{item.p_size}}</view>
				    <!-- <view class="c-product__price">{{item.price}}</view> -->
				    <view class="c-product__count">
				      <view class="c-product__count-val">{{item.stock_num}}</view>
				    </view>
				  </view>
				</view>

      <!-- 小计 -->
      <view class="c-cell">
        <view class="c-cell__title">商品小计</view>
        <view class="c-cell__val">
					<view class="c-price">{{orderInfo.price}}</view>
				</view>
      </view>
      <!-- 运费 -->
      <view class="c-cell">
        <view class="c-cell__title">运费</view>
        <view class="c-cell__val">¥ {{orderInfo.freight}}</view>
      </view>
      <!-- 总计 -->
      <view class="c-cell">
        <view class="c-amount-label">
					<text space="nbsp">共{{productInfo.stock_num}}件商品   小计</text>
				</view>
        <view class="c-price">{{orderInfo.price}}</view>
      </view>
			
    </view>
   
    <view class="c-section">
      <view class="c-info-cell">
        <view class="c-info-cell__title">下单时间：</view>
        <view class="c-info-cell__val">{{orderInfo.create_time}}</view>
      </view>
      <view class="c-info-cell">
        <view class="c-info-cell__title">支付时间：</view>
        <view class="c-info-cell__val">{{orderInfo.pay_time}}</view>
      </view>
    </view>
    
    <!-- footer -->
    <view class="c-footer">
      <view class="c-footer__btn" v-if="orderInfo.status == 1" @tap="remarks()" >备注</view>
      <view class="c-footer__btn" v-if="orderInfo.status == 1" @tap="refusalQuotation(orderInfo.id)">拒绝报价</view>
      <view class="c-footer__btn c-footer__btn--active" v-if="orderInfo.status == 1" @tap="confirmOrder(orderInfo.id)">确认订单</view>
			<view class="c-footer__btn c-footer__btn--active" v-if="orderInfo.status == 2" @tap="gotoDeliverGoods(orderInfo.id)">去发货</view>
			<!-- 测试 -->
			<!-- <view class="c-footer__btn c-footer__btn--active" v-if="orderInfo.status == -2" @tap="confirmOrder(orderInfo.id)">确认订单</view> -->
			
			<view class="c-footer__btn" v-if="orderInfo.status == 5" @tap="refusalRefund(orderInfo.id)">拒绝退款</view>
			<view class="c-footer__btn c-footer__btn--active" v-if="orderInfo.status == 5" @tap="confirmRefund(orderInfo.id)">确认退款</view>
    </view>
    
		<!-- 移除成员提示 -->
		<sg-popup v-model="remarksPopupVisible" position="center">
			<view class="c-dialog">
				<view class="c-dialog__title">备注</view>
				<view class="c-remove-reason">
					<input
						v-if="remarksPopupVisible"
						class="c-remove-reason__input"
						v-model="remarks_reason"
						placeholder-class="c-remove-reason__placeholder"
						placeholder="请输入拒绝报价的原因描述"
					/>
				</view>
				<view class="c-dialog__btns">
					<view class="c-dialog__btn" @tap="remarksPopupVisible = false">取消</view>
					<view class="c-dialog__btn c-dialog__btn--active" @tap="remarkTextInput">确定</view>
				</view>
			</view>
		</sg-popup>
		
    
	</view>
</template>

<script>
	import { GetOrderDetailInfoApi ,CancelOrderApi ,AgreeRefundApi ,RefusalRefundApi ,ConfirmOrdereRefundApi} from '../../api/index.js';
	export default {
		data() {
			return {
				order_id: '',
				orderStatus: 1,
				orderInfo: {},
				orderStatusTitle: '付款成功',
				productInfo: {},
				lastLogistics: {} ,//最新物流状态
				specs:[],
				remarksPopupVisible:false,
				remarks_reason:'',
			};
		},
		
		onLoad(opt) {
			this.order_id = opt.orderid;
			console.log('get GetOrderDetailInfoApi order_id', this.order_id, opt.orderid);
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
		
		onShow() {
			this.getOrderDetailData();
		},
		methods:{
			getOrderDetailData() {
				GetOrderDetailInfoApi(this.order_id, this.uid)
					.then(res => {
						console.log('get seller GetOrderDetailInfoApi res', res);
						this.orderInfo = res.data;
						this.order_id = this.orderInfo.id;
						this.productInfo = res.data.product;
						this.lastLogistics = res.data.express[0];
						this.orderStatus = res.data.status;
						this.specs = res.data.product.specs
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
			
			
			refusalQuotation(order_id) {
				
				const self = this;
				uni.showModal({
				    title: '提示',
				    content: '拒绝该笔订单报价？',
				    success: function (res) {
				        if (res.confirm) {
				            console.log('用户点击确定');
										self.refusalQuotationAgreeRefund(order_id);
										
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});

			},
			
			remarks(){
				//备注
				this.remarksPopupVisible = true;
			},
			
			remarkTextInput(){
				//备注输入的文字
				this.remarksPopupVisible = false;
				console.log('get  remarkTextInput success', this.remarks_reason);
			},
			
			refusalQuotationAgreeRefund(order_id){
				//拒绝报价 status=1
				AgreeRefundApi(order_id, this.remarks_reason,1,this.uid)
					.then(res => {
						uni.showToast({
							title: '拒绝报价成功',
							icon: 'none'
						});
						this.getOrderDetailData();
						console.log('get  AgreeRefundApi success', res);
					})
					.catch(err => {
						uni.showToast({
							title: '拒绝报价失败' + err,
							icon: 'none'
						});
						console.log('get AgreeRefundApi error', err);
					});
			},
			
			
			// 确认订单
			confirmOrder(order_id) {
				
				// uni.navigateTo({
				// 	url: '/pages/deliver-goods/deliver-goods?orderId=' + order_id
				// });
				// return;
				
				ConfirmOrdereRefundApi(this.order_id, this.uid)
					.then(res => {
						console.log('get  ConfirmOrdereRefundApi success', res);
						if(res.code == 1){
							uni.navigateTo({
								url: '/pages/deliver-goods/deliver-goods?orderId=' + this.order_id
							});
						}
					})
					.catch(err => {
						console.log('get AgreeRefundApi error', err);
					});
			},
			
			gotoDeliverGoods(order_id){
				uni.navigateTo({
					url: '/pages/deliver-goods/deliver-goods?orderId=' + this.order_id
				});
			},
			
			refusalRefund(order_id){
				//拒绝退款
				RefusalRefundApi(order_id, this.uid)
					.then(res => {
						console.log('get  RefusalRefundApi success', res);
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
						this.getOrderDetailData();
					})
					.catch(err => {
						uni.showToast({
							title: '拒绝退款失败' + err,
							icon: 'none'
						});
						console.log('get RefusalRefundApi error', err);
					});
			},
			
			confirmRefund(order_id){
				//确认退款
				//同意退款status = 5
				AgreeRefundApi(order_id,'' ,5,this.uid)
					.then(res => {
						
						if(res.code == 0){
							uni.showToast({
								title: res.msg,
								icon: 'none'
							});
							return;
						}
						
						console.log('get  AgreeRefundApi success', res);
						uni.showToast({
							title: '同意退款成功',
							icon: 'none'
						});
						this.getOrderDetailData();

					})
					.catch(err => {
						uni.showToast({
							title:'退款失败' + err,
							icon: 'none'
						});
						console.log('get AgreeRefundApi error', err);
					});
			},
			
			
		},
		
	}
</script>

<style lang="scss">
  @import '@/common/scss/mixin.scss';
  .page-container {
    padding-bottom: 122rpx;
  }
  .c-order-header {
    height: 213rpx;
    background: #EF4345;
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
    color: rgba(255,255,255,1);
    line-height: 48rpx;
  }
  .c-order-header__label {
    margin-top: 14rpx;
    height: 33rpx;
    font-size: 24rpx;
    font-weight: 400;
    color: rgba(255,255,255,0.8);
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
    margin-top: 24rpx;
    position: relative;
    padding: 24rpx 38rpx 24rpx 24rpx;
    display: flex;
    background: #fff;
    align-items: center;
  }
  .c-address:active {
    background: #F4F5F6;
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
    color: rgba(13,19,13,1);
    line-height: 42rpx;
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
  .c-address__label {
    margin-top: 16rpx;
    height: 36rpx;
    font-size: 26rpx;
    font-weight: 400;
    color: rgba(13,19,13,1);
    line-height: 36rpx;
  }
  .c-address__arrow {
    width: 8rpx;
    height: 16rpx;
  }
  // 产品信息
  .c-product {
    display: flex;
    background: #F4F5F6;
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
    color: rgba(102,102,102,1);
    line-height: 45rpx;
    @include ellipsis(2);
  }
  .c-product__model {
    margin-top: 10rpx;
    height: 45rpx;
    font-size: 32rpx;
    font-weight: 400;
    color: rgba(102,102,102,1);
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
    color: rgba(250,100,0,1);
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
    color: #FA6400;
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
    color: rgba(38,38,38,1);
    line-height:45rpx;
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
    @include thin_line_bottom(#E7EBEA, 0, 0);
  }
  .c-cell__title {
    height: 46rpx;
    font-size: 30rpx;
    font-weight: 400;
    color: rgba(13,19,13,1);
    line-height: 46rpx;
  }
  .c-cell__val {
    flex: 1;
    text-align: right;
    height:42rpx;
    font-size: 30rpx;
    font-weight: 400;
    color: rgba(38,38,38,1);
    line-height: 42rpx;
  }
  // 总数量和价格
  .c-amount-label {
    flex: 1;
    height: 40rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: rgba(102,102,102,1);
    line-height: 40rpx;
    text-align: right;
  }
  .c-price {
    display: inline-flex;
    margin-left: 20rpx;
    height: 48rpx;
    font-size: 34rpx;
    font-weight: 400;
    color: rgba(250,100,0,1);
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
    color: rgba(250,100,0,1);
    line-height: 53rpx;
  }
  
  // section
  .c-section {
    position: relative;
    margin-top: 24rpx;
    background: #fff;
    padding: 24rpx 0;
  }
  .c-section__header {
    position: relative;
    padding: 0 24rpx;
    height: 74rpx;
    font-size: 30rpx;
    font-weight: 400;
    color: rgba(13,19,13,1);
    line-height: 50rpx; 
    padding-bottom: 24rpx;
  }
  .c-order-status-tag {
    position: absolute;
    z-index: 1;
    top: 27rpx;
    right: 29rpx;
    padding: 0 36rpx;
    height: 56rpx;
    line-height: 56rpx;
    background: rgba(250,100,0,0.2);
    border-radius: 10rpx;
    font-size: 26rpx;
    font-weight: 400;
    color: rgba(250,100,0,1);
    text-align: center;
  }

  .c-order-info {
    margin-top: 0;
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
    color: rgba(102,102,102,1);
    line-height: 46rpx;
  }
  .c-info-cell__title {
    min-width: 154rpx;
  }
  .c-info-cell__val {
    flex: 1;
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
    box-shadow: 0rpx -1px 0rpx 0rpx rgba(213,213,213,1);
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
    border: 1px solid rgba(153,153,153,1);
    border-radius: 28rpx;
  }
  .c-footer__btn:active {
    opacity: 0.6;
  }
  .c-footer__btn--active {
    color: #FA6400;
    border: 1px solid #FA6400;
  }
  .c-footer__btn + .c-footer__btn {
    margin-left: 18rpx;
  }
	
	// 删除成员提示
	.c-dialog {
		background: #fff;
	}
	.c-dialog__title {
		height: 118rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #1e2229;
		font-size: 36rpx;
		line-height: 1.2;
	}
	.c-dialog__content {
		padding: 0 32rpx;
		font-size: 30rpx;
		font-weight: 400;
		color: rgba(158, 164, 171, 1);
		line-height: 45rpx;
		text-align: center;
	}
	.c-dialog__btns {
		display: flex;
		@include thin-line-top(#dddddd, 0, 0);
	}
	.c-dialog__btn {
		flex: 1;
		height: 100rpx;
		color: #666666;
		font-size: 36rpx;
		line-height: 100rpx;
		text-align: center;
		@include thin-line-right(#dddddd, 0, 0);
	}
	.c-dialog__btn:active {
		opacity: 0.6;
	}
	.c-dialog__btn--active {
		color: #fa6400;
	}
	.c-remove-reason {
		padding: 32rpx;
		height: 148rpx;
	}
	.c-remove-reason__input {
		border: 1px solid #d5d5d5;
		border-radius: 10rpx;
		width: 100%;
		height: 84rpx;
		min-height: 84rpx;
		font-size: 32rpx;
		color: #000;
		line-height: 84rpx;
		padding: 0 20rpx;
	}
	.c-remove-reason__placeholder {
		color: #bdbdbd;
	}
  
</style>
