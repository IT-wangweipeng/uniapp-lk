<template>
	<view class="page-container">
		<view class="c-field">
			<view class="c-field__title">收件人</view>
			<input class="c-field__input" placeholder-class="c-field__placeholder" :value="order_info.name" />
		</view>
		<view class="c-field">
			<view class="c-field__title">联系电话</view>
			<input class="c-field__input" placeholder-class="c-field__placeholder" :value="order_info.phone" />
		</view>
		<view class="c-field">
			<view class="c-field__title">收货地址</view>
			<input class="c-field__input" placeholder-class="c-field__placeholder" :value="order_info.area" />
		</view>
		<view class="c-field">
			<view class="c-field__title">详细地址</view>
			<input class="c-field__input" placeholder-class="c-field__placeholder" :value="order_info.address" />
		</view>
		<view class="c-field">
			<view class="c-field__title">快递公司</view>
			<button class="c-field__input_button" @tap="chooseExpresscom">{{ expresscom }}</button>
		</view>
		<view class="c-field">
			<view class="c-field__title">快递单号</view>
			<input class="c-field__input" placeholder-class="c-field__placeholder" type="text" v-model="expresssn" placeholder="请输入快递单号" />
		</view>

		<view class="c-footer">
			<button class="sg-button sg-button--square c-cancel-btn" type="default" @tap="handleCancelBtnTap">取消</button>
			<button class="sg-button sg-button--square c-submit-btn" type="primary" @tap="handleSubmitBtnTap">确定</button>
		</view>

		<!-- <view class="express-list" v-if="showExpress">
			<view v-for="(item, index) in expressList" :key="index">
				<view class="express-list-item" @tap="chooseExpresscom(item)">{{ item.express_name }}</view>
			</view>
		</view> -->

		<!-- 物流公司 -->
		<sg-popup v-model="showExpress" position="bottom">
			<scroll-view class="c-product-spec-content" scroll-y="true" show-scrollbar="true">
				<view class="c-product-spec-model" v-for="item in expressList" :key="item.id">
					<view class="c-product-spec-model__label" @tap="chooseExpresscomItem(item)">{{ item.express_name }}</view>
				</view>
			</scroll-view>
		</sg-popup>
	</view>
</template>

<script>
import { GetOrderDetailInfoApi, GetExpressListApi, DeliverGoodsApi } from '../../api/index.js';
export default {
	data() {
		return {
			order_info: {},
			order_id: '',
			expresscom: '选择快递公司', //快递公司
			expresssn: '', //快递单号
			showExpress: false, //选择快递公司
			expressList: [] //物流公司列表
		};
	},

	onLoad(opt) {
		this.order_id = opt.orderId;
		console.log('get GetOrderDetailInfoApi order_id', opt,this.order_id);
		this.getOrderDetailData();
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
		getOrderDetailData() {
			GetOrderDetailInfoApi(this.order_id, this.uid)
				.then(res => {
					console.log('get fahuo GetOrderDetailInfoApi res', res);
					this.order_info = res.data;
				})
				.catch(err => {
					console.log('get fahuo GetOrderDetailInfoApi error', err);
				});
		},

		// 取消
		handleCancelBtnTap() {
			uni.navigateBack();
		},

		chooseExpresscom() {
			GetExpressListApi(this.uid)
				.then(res => {
					console.log('get  GetExpressListApi res', res);
					this.expressList = res.data;
					this.showExpress = true;
				})
				.catch(err => {
					console.log('get GetExpressListApi error', err);
				});

			console.log('我要去选择快递公司了 哈哈哈');
		},
		chooseExpresscomItem(item) {
			this.showExpress = false;
			this.expresscom = item.express_name;
		},

		// 确认发货
		handleSubmitBtnTap() {
			console.log('快递公司  +  快递单号 === ', this.expresscom, this.expresssn);

			DeliverGoodsApi(this.order_id, this.expresscom, this.expresssn, this.uid)
				.then(res => {
					console.log('get  DeliverGoodsApi res', res);
					uni.showToast({
						title: '发货成功'
					});
					setTimeout(() => {
						uni.navigateBack();
					}, 1500);
				})
				.catch(err => {
					console.log('get DeliverGoodsApi error', err);
					uni.showToast({
						title: '发货失败--' + err
					});
				});
		}
	}
};
</script>

<style lang="scss">
@import '@/common/scss/mixin.scss';
.express-list {
	position: absolute;
	padding-top: 300rpx;
	padding-bottom: 0rpx;
	width: 100%;
	height: 100%;
}
.express-list-item {
	width: 100%;
	height: 34rpx;
	font-size: 30rpx;
	font-weight: 400;
	color: rgba(102, 102, 102, 1);
	line-height: 34rpx;
	@include ellipsis(1);
}
.c-product-spec-content {
	padding: 26rpx 24rpx;
	height: 700rpx;
	@include thin-line-bottom(#f4f5f6, 24rpx, 24rpx);
}

.c-product-spec-model__label {
	height: 70rpx;
	font-size: 40rpx;
	font-weight: 400;
	color: rgba(38, 38, 38, 1);
	line-height: 60rpx;
	flex: 1;
}

.page-container {
	padding-bottom: 98rpx;
}
.c-field {
	display: flex;
	align-items: center;
	height: 100rpx;
	background: #fff;
	padding: 0 24rpx;
	@include thin_line_top(#e7ebea, 0, 0);
}
.c-field__title {
	height: 46rpx;
	font-size: 30rpx;
	font-weight: 400;
	color: rgba(102, 102, 102, 1);
	line-height: 46rpx;
}
.c-field__input {
	padding-left: 32rpx;
	flex: 1;
	text-align: right;
	height: 56rpx;
	min-height: 56rpx;
	font-size: 30rpx;
	font-weight: 400;
	color: rgba(38, 38, 38, 1);
	line-height: 56rpx;
}
.c-field__input_button {
	padding-left: 132rpx;
	flex: 1;
	text-align: right;
	height: 56rpx;
	min-height: 56rpx;
	font-size: 30rpx;
	font-weight: 400;
	color: rgba(38, 38, 38, 1);
	line-height: 56rpx;
}
.c-field__placeholder {
	color: #bdbdbd;
}

// footer
.c-footer {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 100;
	height: 98rpx;
	display: flex;
	align-items: center;
}
.c-cancel-btn,
.c-submit-btn {
	width: 50%;
	height: 98rpx;
	line-height: 98rpx;
	font-size: 34rpx;
	font-weight: bold;
}
.c-cancel-btn {
	color: #666666;
}
.c-submit-btn {
	color: #fff;
}
</style>
