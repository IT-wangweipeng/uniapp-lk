<template>
	<view class="page-container">
		<!-- 店铺名称 -->
		<view class="c-shop-container">
			<view class="c-share" @tap="sharePopupVisible = true">
				<image class="c-share__icon" src="../../static/common/ic_share@2x.png" mode="aspectFill"></image>
				<view class="c-share__label">分享</view>
			</view>
			<image class="c-shop-image" :src="shopInfo.logo" mode="aspectFill"></image>
			<view class="c-cshop-title">{{ shopInfo.name }}</view>
		</view>

		<!-- 店铺信息 -->
		<view class="c-shop-info">
			<view class="c-shop-cell">
				<view class="c-shop-cell__label">店铺类别</view>
				<view class="c-shop-cell__val">{{ shopInfo.main_sector }}</view>
			</view>
			<view class="c-shop-cell">
				<view class="c-shop-cell__label">所在地区</view>
				<view class="c-shop-cell__val">{{ shopInfo.area }}</view>
			</view>
			<view class="c-shop-cell">
				<view class="c-shop-cell__label">店铺地址</view>
				<view class="c-shop-cell__val">{{ shopInfo.address }}</view>
			</view>
			<view class="c-shop-cell">
				<view class="c-shop-cell__label">经营类别</view>
				<view class="c-shop-cell__val">{{ shopInfo.main_sector }}</view>
			</view>
			<view class="c-shop-cell">
				<view class="c-shop-cell__label">店铺星级</view>

				<view class="c-shop-cell__val">
					<image
						class="c-shop-cell__star"
						v-for="(star, starIndex) in 5"
						:key="star"
						:src="starIndex < starLevel ? '/static/common/ic_star_active@2x.png' : '/static/common/ic_star_inactive@2x.png'"
						mode="aspectFill"
					></image>

					<!-- <image class="c-shop-cell__star" src="../../static/common/ic_star_active@2x.png" mode="aspectFill"></image>
          <image class="c-shop-cell__star" src="../../static/common/ic_star_active@2x.png" mode="aspectFill"></image>
          <image class="c-shop-cell__star" src="../../static/common/ic_star_active@2x.png" mode="aspectFill"></image>
          <image class="c-shop-cell__star" src="../../static/common/ic_star_active@2x.png" mode="aspectFill"></image>
          <image class="c-shop-cell__star" src="../../static/common/ic_star_inactive@2x.png" mode="aspectFill"></image> -->
				</view>
			</view>
			<view class="c-shop-cell">
				<view class="c-shop-cell__label">手机号码</view>
				<view class="c-shop-cell__val">{{ shopInfo.phone }}</view>
			</view>
		</view>

		<!-- 店铺二维码 -->
		<view class="c-section">
			<view class="c-section__title">店铺二维码</view>
			<view class="c-shop-qrcode">
				<image class="c-shop-qrcode__img" :src="shopInfo.qr" mode="aspectFill"></image>
				<view class="c-shop-qrcode__label">扫码查看店铺</view>
			</view>
		</view>

		<!-- 店铺简介 -->
		<view class="c-section">
			<view class="c-section__title">店铺简介</view>
			<view class="c-shop-intro">{{ shopInfo.reminder }}</view>
		</view>

		<!-- 分享 -->
		<sg-popup v-model="sharePopupVisible" position="bottom">
			<view class="c-share-dialog">
				<view class="c-share-dialog__title">分享至：</view>
				<view class="c-share-dialog__content">
					<image class="c-share-app" src="../../static/common/wechat@2x.png" mode="aspectFit" @tap="share"></image>
					<!-- <image class="c-share-app" src="../../static/common/wechat_friend_circle@2x.png" mode="aspectFit" @tap="share"></image>
					<image class="c-share-app" src="../../static/common/qq@2x.png" mode="aspectFit" @tap="share"></image> -->
				</view>
			</view>
		</sg-popup>
	</view>
</template>

<script>
import { ShopDetailsApi } from '../../api/index.js';
export default {
	data() {
		return {
			sharePopupVisible: false, // 显示分享popup
			shopInfo: {},
			starLevel:0,
		};
	},
	onLoad(opt) {
		ShopDetailsApi(opt.store_id, this.uid)
			.then(res => {
				if (res.code == 1) {
					this.shopInfo = res.data;
					this.starLevel = this.shopInfo.level;
				}
				console.log('get ShopDetail success ', res.data);
			})
			.catch(err => {
				console.log('get ShopDetail error', err);
			});
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

	methods: {}
};
</script>

<style lang="scss">
@import '@/common/scss/mixin.scss';
.page-container {
	padding-bottom: 20rpx;
}
.c-shop-container {
	position: relative;
	background: #fff;
	text-align: center;
	padding: 32rpx;
	@include thin-line-bottom(#f4f5f6, 24rpx, 24rpx);
}
.c-share {
	position: absolute;
	top: 37rpx;
	right: 0;
	z-index: 1;
	border-radius: 100rpx 0rpx 0rpx 100rpx;
	background: rgba(244, 245, 246, 0.8);
	height: 64rpx;
	padding-left: 16rpx;
	padding-right: 24rpx;
	display: flex;
	align-items: center;
}
.c-share:active {
	opacity: 0.6;
}
.c-share__icon {
	width: 54rpx;
	height: 54rpx;
}
.c-share__label {
	height: 42rpx;
	font-size: 30rpx;
	font-weight: 400;
	color: rgba(102, 102, 102, 1);
	line-height: 42rpx;
	margin-left: 12rpx;
}

.c-shop-image {
	width: 180rpx;
	height: 180rpx;
	margin-top: 32rpx;
	border-radius: 50%;
}
.c-cshop-title {
	font-size: 34rpx;
	font-weight: bold;
	color: rgba(0, 0, 0, 1);
	line-height: 46rpx;
	opacity: 0.85;
	margin-top: 32rpx;
	text-align: center;
}
.c-cshop-title__edit {
	width: 54rpx;
	height: 54rpx;
	display: inline-block;
	vertical-align: bottom;
}
.c-cshop-title__edit:active {
	opacity: 0.6;
}
.c-cshop-desc {
	text-align: left;
	margin-top: 32rpx;
	font-size: 32rpx;
	color: rgba(102, 102, 102, 1);
	line-height: 46rpx;
}

// 联盟信息
.c-shop-info {
	padding: 12rpx 24rpx;
	background: #fff;
}
.c-shop-cell {
	height: 64rpx;
	display: flex;
	align-items: center;
}
.c-shop-cell__label,
.c-shop-cell__val {
	white-space: nowrap;
	text-align: left;
	overflow: hidden;
	text-overflow: ellipsis;
	height: 64rpx;
	font-size: 32rpx;
	font-weight: 400;
	color: rgba(153, 153, 153, 1);
	line-height: 64rpx;
}
.c-shop-cell__val {
	flex: 1;
	padding-left: 32rpx;
	display: flex;
	align-items: center;
	color: #666666;
}

.c-shop-cell__star {
	width: 30rpx;
	height: 30rpx;
	margin-right: 5rpx;
}

// section
.c-section {
	margin-top: 24rpx;
	background: #fff;
	padding: 24rpx;
}
.c-section__title {
	height: 94rpx;
	line-height: 94rpx;
	font-size: 32rpx;
	color: rgba(102, 102, 102, 1);
}
// 二维码
.c-shop-qrcode {
	text-align: center;
}
.c-shop-qrcode__img {
	width: 256rpx;
	height: 256rpx;
}
.c-shop-qrcode__label {
	font-size: 32rpx;
	color: rgba(102, 102, 102, 1);
	line-height: 1;
	margin-top: 24rpx;
}
// 店铺简介
.c-shop-intro {
	font-size: 30rpx;
	color: rgba(102, 102, 102, 1);
	line-height: 42rpx;
}

// 分享
.c-share-dialog {
}
.c-share-dialog__title {
	height: 46rpx;
	font-size: 32rpx;
	font-weight: bold;
	color: rgba(15, 3, 20, 0.65);
	line-height: 46rpx;
	text-align: center;
	margin: 48rpx 0;
}
.c-share-dialog__content {
	display: flex;
	align-items: center;
	justify-content: space-around;
	margin-bottom: 64rpx;
}
.c-share-app {
	width: 122rpx;
	height: 124rpx;
}
.c-share-app:active {
	opacity: 0.6;
}
</style>
