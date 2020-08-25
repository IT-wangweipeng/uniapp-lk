<template>
	<view class="page-container">
		<!-- header -->
		<view id="c-header" class="c-header">
			<!-- 扫码 -->
			<image class="c-header-icon" src="../../static/index/scancode.png" mode="aspectFill" @tap="scanCode"></image>
			<!-- 搜索 -->
			<view class="c-search"><sg-search placeholder="输入商品名称搜索" @tap="goSearchFindGoodsPage"></sg-search></view>

			<!-- 切换 -->
			<image class="c-header-icon" src="../../static/index/change.png" mode="aspectFill" @tap="go('/pages/select-shop/select-shop')"></image>
			<!-- 消息 -->
			<image class="c-header-icon" src="../../static/index/message.png" mode="aspectFill" @tap="go('/pages/message-list/message-list')"></image>
		</view>
		<!-- 轮播图 -->
		<swiper class="c-banner" indicator-dots="true" autoplay>
			<swiper-item v-for="item in bannerSwiperList" :key="item.id"><image class="c-banner-item" :src="item.image" mode="aspectFill"></image></swiper-item>
		</swiper>

		<!-- 消息 -->
		<view v-if="newMessage.count >= 1" class="c-message-container">
			<view class="c-message">
				<image class="c-message__icon" :src="newMessage.msg.icon" mode="aspectFill"></image>
				<view class="c-message__value">{{ newMessage.msg.title }}</view>
			</view>
		</view>
		<!-- menu -->
		<view class="c-menu">
			
			<view class="c-menu-item" @tap="goFindGoodsPage">
				<image class="c-menu-item__icon" src="../../static/index/xunhuobao.png" mode="aspectFill"></image>
				<view class="c-menu-item__label">寻货宝</view>
			</view>
			
			<view class="c-menu-item" @tap="goAllianceTab">
				<image class="c-menu-item__icon" src="../../static/index/alliance_hall.png" mode="aspectFill"></image>
				<view class="c-menu-item__label">联盟大厅</view>
			</view>
			<!-- <view class="c-menu-item" @tap="go('/pages/create-alliance/create-alliance')">
				<image class="c-menu-item__icon" src="../../static/index/create_alliance.png" mode="aspectFill"></image>
				<view class="c-menu-item__label">新建联盟</view>
			</view> -->
			
			<!-- <view class="c-menu-item" @tap="goMePage">
				<image class="c-menu-item__icon" src="../../static/index/me.png" mode="aspectFill"></image>
				<view class="c-menu-item__label">我的</view>
			</view> -->
		</view>

		<!-- 最新商品 -->
		<view class="c-product-header">
			<view class="c-product-header__content">
				<image class="c-product-header__icon" src="../../static/index/diamond.png" mode="aspectFill"></image>
				<view class="c-product-header__label">最新商品</view>
			</view>
			<view class="c-product-header__line"></view>
		</view>
		<!-- 商品类别 -->
		<view class="c-product-tab-container">
			<view id="c-product-tab" class="c-product-tab" :class="{ 'c-product-tab--fixed': productTabFixed }">
				<view class="c-product-tab-item" :class="{ 'c-product-tab-item--active': activeProductTab === 0 }" @tap="handleProductTabTap(0)">
					<view class="c-product-tab-item__label">清货</view>
					<view class="c-product-tab-item__line"></view>
				</view>
				<view class="c-product-tab-item" :class="{ 'c-product-tab-item--active': activeProductTab === 1 }" @tap="handleProductTabTap(1)">
					<view class="c-product-tab-item__label">调货</view>
					<view class="c-product-tab-item__line"></view>
				</view>
			</view>
		</view>
		<view class="c-product-list">
			<view class="c-product-item" v-for="item in newProductList" :key="item" @tap="goProductDetailPage(item)">
				<view style="position: relative;">
					<image class="c-product-item__image" :src="item.img" mode="aspectFill"></image>
					<view class="c-product-outlet">
						<image class="c-product-outlet-img" :src="item.logo"></image>
						<view class="c-product-outlet-name">{{ item.name }}</view>
					</view>
					<view class="c-product_mask" v-if="activeProductTab == 0">清</view>
					<view class="f-product_mask" v-if="activeProductTab == 1">调</view>
				</view>

				<view class="c-product-item__title">{{ item.title }}</view>
				<view class="c-product-item-city-label">{{ item.area }}</view>
				
				
				
				<view class="c-product-item__price">
					<view class="c-product-item__price-label">价格：</view>
					<view class="c-product-item__price-value" v-if="activeProductTab === 0">￥{{ item.min_price }} ~ ￥{{ item.max_price }}</view>
					<view class="c-product-item__price-value" v-if="activeProductTab === 1">￥{{ item.min_price }}</view>
				</view>

				<view class="c-product-item-stalls">
					<view class="c-product-item-stalls-label">{{ item.stalls }}</view>
					<view class="c-product-item-stalls-model-l">型号</view>
					<view class="c-product-item-stalls-model">{{ item.model }}</view>
				</view>
			</view>
		</view>
		<view class="loading">{{ loadingText }}</view>
	</view>
</template>

<script>
import { UserNewMessageList, ProductSellListApi, FindProductListApi, RollBannerApi, GetUserInfoApi, UploadWXMPCodeApi } from '../../api/index.js';
import permision from "@/common/permission.js"
export default {
	data() {
		return {
			activeProductTab: 0,
			productTabFixed: false,
			productTabTopPosition: 0, // 产品类型距离最上面的距离
			headerHeight: 0, // header的高度
			newMessage: {},
			newProductList: [], //列表
			startPage: 1,
			loadingText: '加载中...',
			bannerSwiperList: [],
			setFocus: false
		};
	},
	onLoad() {
		const that = this;
		console.log('index 首页 onLoad 获取 uid =getApp().globalData.uid == ', getApp().globalData.uid);
		uni.getStorage({
			key: 'global_user_data',
			success: function(res) {
				getApp().globalData.uid = res.data.uid;
				
				that.getProductList();
				
				if (getApp().globalData.uid != '') {
					//已登录状态
					const uid = getApp().globalData.uid;
					console.log('index 首页获取 uid =：' + uid);
					// 获取最新消息
					// this.uid = getApp().globalData.uid
					UserNewMessageList(uid)
						.then(ret => {
							console.log('UserNewMessageList ret ==== ', ret);
							if (ret.data && ret.data.count >= 1) {
								that.newMessage = ret.data;
							}
						})
						.catch(err => {
							console.log('UserNewMessageList err ==== ', err);
						});

					//获取用户信息
					GetUserInfoApi(uid)
						.then(res => {
							console.log('GetUserInfoApi res ==== ', res);
							if (res.code == 1) {
								getApp().globalData.userInfo = res.data.userinfo;
							}
						})
						.catch(err => {
							console.log('GetUserInfoApi error', err);
						});
						
						
				} else {
					//未登录状态
					// uni.navigateTo({
					// 	url: '/pages/login/login'
					// });

					//登录
					uni.reLaunch({
						url: '/pages/login/login'
					});
				}
			},
			fail: function(err) {
				console.log('index 首页获取 uid err ' + err);
				//未登录状态
				// uni.navigateTo({
				// 	url: '/pages/login/login'
				// });

				uni.reLaunch({
					url: '/pages/login/login'
				});
			}
		});
	},

	onShow() {
		RollBannerApi(1)
			.then(res => {
				this.bannerSwiperList = res.data.data;
				console.log('首页滚动banner RollBannerApi res ==   this.bannerSwiperList ==', res.data, this.bannerSwiperList);
			})
			.catch(err => {
				console.log('首页滚动banner RollBannerApi error', err);
			});
		// this.refreashUI();
	},

	methods: {
		// scanCode() {
		// 	uni.scanCode({
		// 		success: function(res) {
		// 			console.log('条码类型：' + res.scanType);
		// 			console.log('条码内容：' + res.result);
		// 			uni.navigateTo({
		// 				url: `/pages/shop-intro/shop-intro?store_id=${res.result}`
		// 			});
		// 		}
		// 	});
		// },

		async scanCode() {
			// #ifdef APP-PLUS
			let status = await this.checkPermission();
			if (status !== 1) {
				return;
			}
			// #endif
			uni.scanCode({
				success: res => {
					
					console.log('条码类型：' + res.scanType);
					console.log('条码内容：' + res.result);
					uni.navigateTo({
						url: `/pages/shop-intro/shop-intro?store_id=${res.result}`
					});
					
				},
				fail: err => {
					// #ifdef MP
					// uni.getSetting({
					// 	success: res => {
					// 		let authStatus = res.authSetting['scope.camera'];
					// 		if (!authStatus) {
					// 			uni.showModal({
					// 				title: '授权失败',
					// 				content: '零酷需要使用您的相机，请在设置界面打开相关权限',
					// 				success: res => {
					// 					if (res.confirm) {
					// 						uni.openSetting();
					// 					}
					// 				}
					// 			});
					// 		}
					// 	}
					// });
					// #endif
				}
			});
		},
		// #ifdef APP-PLUS

		async checkPermission(code) {
			let status = permision.isIOS ? await permision.requestIOS('camera') : await permision.requestAndroid('android.permission.CAMERA');
			if (status === null || status === 1) {
				status = 1;
			} else {
				uni.showModal({
					content: '需要相机权限',
					confirmText: '设置',
					success: function(res) {
						if (res.confirm) {
							permision.gotoAppSetting();
						}
					}
				});
			}
			return status;
		},
		// #endif

		handleSearch(val) {
			console.log(val);
		},
		handleProductTabTap(val) {
			if (this.activeProductTab == val) {
				this.activeProductTab == val;
				return;
			} else {
				this.activeProductTab = val;
				this.newProductList = [];
				this.startPage = 1;
				this.loadingText = '加载中...';
				this.getProductList();
			}
		},
		go(url) {
			uni.navigateTo({
				url
			});
		},
		goAllianceTab() {
			uni.switchTab({
				url: '/pages/alliance/alliance'
			});
		},
		goSearchFindGoodsPage() {
			getApp().globalData.findSearch = true;
			uni.switchTab({
				url: '/pages/find-goods/find-goods'
			});
		},

		goFindGoodsPage() {
			getApp().globalData.findSearch = false;
			uni.switchTab({
				url: '/pages/find-goods/find-goods'
			});
		},

		goMePage() {
			uni.switchTab({
				url: '/pages/me/me'
			});
		},
		// 商品详情
		goProductDetailPage(item) {
			let type = 0;
			if (this.activeProductTab == 0) {
				type = 1; //清货
			} else {
				type = 2; //寻货
			}
			console.log('goProductDetailPage  item == =', item);
			uni.navigateTo({
				url: '/pages/product-detail/product-detail?id=' + item.id + '&type=' + type
			});
		},

		refreashUI() {
			//初始化数据
			this.newProductList = [];
			this.startPage = 1;
			this.loadingText = '加载中...';
			this.getProductList();
		},

		getProductList() {
			if (this.activeProductTab == 0) {
				//uid, area, main_sector, price, page, title
				//获取清货列表  //uid, group_id, area, main_sector, price, page
				ProductSellListApi(getApp().globalData.uid, '', '', '', this.startPage, '')
					.then(res => {
						this.newProductList = this.newProductList.concat(res.data.data);
						this.totalPage = res.data.last_page;
						console.log('get newProductList success 清货 == ', this.newProductList);
						if (Number(this.startPage) >= Number(this.totalPage)) {
							this.loadingText = '没有更多了~';
						}
						if (this.newProductList.length <= 0) {
							this.loadingText = '什么都没有发现哦';
						}
					})
					.catch(err => {
						console.log('get newProductList error', err);
					});
			} else {
				//获取寻货列表
				FindProductListApi(getApp().globalData.uid, '', '', '', this.startPage, '')
					.then(res => {
						this.newProductList = this.newProductList.concat(res.data.data);
						this.totalPage = res.data.last_page;
						console.log('get newProductList success  寻货 == ', this.newProductList);
						if (Number(this.startPage) >= Number(this.totalPage)) {
							this.loadingText = '没有更多了~';
						}
						if (this.newProductList.length <= 0) {
							this.loadingText = '什么都没有发现哦';
						}
					})
					.catch(err => {
						console.log('get newProductList error', err);
					});
			}
		}
	},

	onReachBottom() {
		if (Number(this.startPage) >= Number(this.totalPage)) {
			this.loadingText = '没有更多了~';
		} else {
			this.startPage += 1;
			this.getProductList();
		}
	},

	onPageScroll(e) {
		let scrollTop = this.productTabTopPosition - this.headerHeight;
		if (e.scrollTop >= scrollTop && !this.productTabFixed) {
			this.productTabFixed = true;
		} else if (e.scrollTop < scrollTop && this.productTabFixed) {
			this.productTabFixed = false;
		}
	},
	mounted() {
		const queryHeader = uni.createSelectorQuery().in(this);
		queryHeader
			.select('#c-header')
			.boundingClientRect(data => {
				this.headerHeight = data.height;
			})
			.exec();
		const query = uni.createSelectorQuery().in(this);
		query
			.select('#c-product-tab')
			.boundingClientRect(data => {
				this.productTabTopPosition = data.top;
			})
			.exec();
	}
};
</script>

<style lang="scss">
@import '@/common/scss/mixin.scss';

.c-product-item-stalls {
	display: flex;
	padding-top: 10rpx;
	// padding-bottom: 10rpx;
	// height: 30rpx;
	// justify-content: space-between;
}
.c-product-item-stalls-label {
	padding-left: 15rpx;
	font-size: 28rpx;
	color: #bdbdbd;
}
.c-product-item-stalls-model-l {
	padding-right: 5rpx;
	margin-left: auto;
	font-size: 28rpx;
	color: #bdbdbd;
}
.c-product-item-city-label {
	height: 35rpx;
	padding-left: 15rpx;
	font-size: 28rpx;
	color: #bdbdbd;
}

.c-product-item-stalls-model {
	margin-right: 15rpx;
	font-size: 28rpx;
	line-height: 28rpx;
	text-align: center;
	color: #666666;
	border-radius: 10rpx;
	// border-color: #000000;
	// border-width: 2rpx;
	border: 1px solid #eee;
}

.c-product-outlet-img {
	padding-top: 5rpx;
	width: 50rpx;
	height: 50rpx;
	border-radius: 50%;
	background: #ffffff;
}

.c-product-outlet-name {
	padding-left: 15rpx;
	color: #ffffff;
	font-size: 28rpx;
}

.c-product-outlet {
	position: absolute;
	left: 0;
	bottom: 0;
	z-index: 1;
	background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
	height: 60rpx;
	width: 340rpx;
	line-height: 50rpx;
	padding: 0 15rpx;
	display: flex;
}

.c-product_mask {
	position: absolute;
	right: 0;
	top: 0;
	z-index: 1;
	background: #fa6400;
	border-radius: 12rpx;
	height: 50rpx;
	min-width: 75rpx;
	text-align: center;
	line-height: 50rpx;
	padding: 0 15rpx;
	color: #ffffff;
	font-size: 35rpx;
}

.f-product_mask {
	position: absolute;
	right: 0;
	top: 0;
	z-index: 1;
	background: #44d7b6;
	border-radius: 12rpx;
	height: 50rpx;
	min-width: 75rpx;
	text-align: center;
	line-height: 50rpx;
	padding: 0 15rpx;
	color: #ffffff;
	font-size: 35rpx;
}

.loading {
	text-align: center;
	line-height: 80px;
}
.page-container {
	padding-top: 104rpx;
}
.c-header {
	position: fixed;
	z-index: 100;
	left: 0;
	right: 0;
	top: 0;
	height: 104rpx;
	width: 100%;
	background: #ef4345;
	display: flex;
	align-items: center;
	padding: 0 24rpx;
	justify-content: space-around;
}
.c-header-icon {
	width: 54rpx;
	height: 54rpx;
}
.c-header-icon:active {
	opacity: 0.6;
}
// 搜索
.c-search {
	width: 460rpx;
}
// banner
.c-banner {
	width: 750rpx;
	height: 300upx;
}
.c-banner-item {
	width: 750rpx;
	height: 300rpx;
}
// 消息
.c-message-container {
	height: 124rpx;
	padding: 24rpx 32rpx;
}
.c-message {
	background: #fff;
	display: flex;
	align-items: center;
	padding: 0 24rpx;
	height: 100%;
	opacity: 0.8;
	border-radius: 10rpx;
}
.c-message__icon {
	width: 54rpx;
	height: 54rpx;
}
.c-message__value {
	flex: 1;
	height: 48rpx;
	line-height: 48rpx;
	overflow: hidden;
	white-space: nowrap;
	margin-left: 26rpx;
	font-size: 32rpx;
}
// menu
.c-menu {
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: #fff;
	padding: 12rpx 0;
}
.c-menu-item {
	width: 50%;
	height: 144rpx;
	text-align: center;
}
.c-menu-item__icon {
	width: 88rpx;
	height: 88rpx;
	margin-top: 12rpx;
}
.c-menu-item__label {
	color: rgba(0, 0, 0, 0.7);
	font-size: 24rpx;
	height: 34rpx;
	line-height: 34rpx;
}
// 商品
.c-product-header {
	background: #fff;
	padding-top: 32rpx;
	position: relative;
	height: 104rpx;
	margin-top: 24rpx;
}
.c-product-header__line {
	position: absolute;
	z-index: 10;
	background: #e7ebea;
	height: 1px;
	left: 0;
	right: 0;
	top: 64rpx;
}
.c-product-header__content {
	position: absolute;
	z-index: 20;
	left: 50%;
	top: 32rpx;
	transform: translateX(-50%);
	padding: 0 32rpx;
	height: 64rpx;
	border-radius: 32rpx;
	background: #fff4f4;
	display: flex;
	align-items: center;
}
.c-product-header__icon {
	width: 30rpx;
	height: 30rpx;
}
.c-product-header__label {
	margin-left: 16rpx;
	flex: 1;
	font-size: 34rpx;
	color: #262626;
	line-height: 48rpx;
	font-weight: bold;
}
// 商品类别
.c-product-tab-container {
	height: 104rpx;
	background: #fff;
}
.c-product-tab {
	display: flex;
	padding: 24rpx;
	background: #fff;
}
.c-product-tab--fixed {
	position: fixed;
	top: 104rpx;
	left: 0;
	right: 0;
	z-index: 100;
}
.c-product-tab-item {
	position: relative;
	padding-bottom: 12rpx;
}
.c-product-tab-item + .c-product-tab-item {
	margin-left: 60rpx;
}
.c-product-tab-item__label {
	color: #666666;
	font-size: 30rpx;
	line-height: 54rpx;
}
.c-product-tab-item__line {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 1;
	width: 100%;
	height: 8rpx;
	border-radius: 4rpx;
	background: transparent;
}
.c-product-tab-item--active {
	.c-product-tab-item__label {
		color: #262626;
		font-size: 36rpx;
		font-weight: bold;
	}
	.c-product-tab-item__line {
		background: #fa6400;
	}
}
// 商品列表
.c-product-list {
	padding: 12rpx 24rpx 24rpx;
	background: #fff;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}
.c-product-item {
	width: 340rpx;
	border-radius: 12rpx;
	box-shadow: 0px 0px 6rpx 0px rgba(0, 0, 0, 0.2);
	margin-bottom: 24rpx;
	overflow: hidden;
	padding-bottom: 16rpx;
}
.c-product-item__image {
	width: 340rpx;
	height: 340rpx;
	border-top-left-radius: 12rpx;
	border-top-right-radius: 12rpx;
}
.c-product-item__title {
	margin-top: 14rpx;
	padding: 0 16rpx;
	color: rgba(15, 3, 20, 0.65);
	font-size: 30rpx;
	height: 62rpx;
	line-height: 31rpx;
	font-weight: normal;
	@include ellipsis(2);
}
.c-product-item__price {
	display: flex;
	margin-top: 14rpx;
	padding: 0 16rpx;
}
.c-product-item__price-label {
	height: 40rpx;
	line-height: 40rpx;
	// color: rgba(0, 0, 0, 0.65);
	color: #bdbdbd;
	font-size: 24rpx;
}
.c-product-item__price-value {
	height: 40rpx;
	line-height: 40rpx;
	flex: 1;
	color: #fa6400;
	font-weight: bold;
	font-size: 20rpx;
}
</style>
