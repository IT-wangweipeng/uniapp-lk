<template>
	<view class="page-container">
		<!-- header -->
		<view class="c-header">
			<view class="c-filter-list">
				<view class="c-filter-item" :class="{ 'c-filter-item--active': typeFilterActive }" @tap="handeleTypeChoose">
					<view class="c-filter-item__label">筛选分类</view>
					<image class="c-filter-item__icon" src="../../static/common/arrow_dropdown@2x.png" mode="aspectFill"></image>
				</view>
			</view>
		</view>

		<!-- 列表 -->
		<view v-for="item in productList" :key="item.id">
			<view class="c-product">
				<image class="c-product__image" v-if="item.store_id != current_outlet_id" :src="item.logo" mode="aspectFill" @tap="goShopIntroPage(item)"></image>
				<view
					class="c-product__content "
					:class="{
						'c-product__content--left': item.store_id != current_outlet_id,
						'c-product__content--right': item.store_id == current_outlet_id
					}"
				>
					<view class="c-product__tag c-product__tag--store" v-if="item.type === 1">库存共享</view>
					<view class="c-product__tag c-product__tag--replenish" v-if="item.type === 2">补货共享</view>
					<view class="c-product__tag c-product__tag--new" v-if="item.type === 3">新品共享</view>

					<!-- <view class="c-product__enterlist" @tap="goInventoryShareProductListPage(item)">进入列表</view> -->
					<view class="c-product-image-list">
						<!-- <image class="c-product-image" :src="item.img" mode="aspectFill" v-for="item in 9" :key="item" @tap="goProductDetailPage(2)"></image> -->
						<image class="c-product-image" :src="item.img" mode="aspectFill" @tap="goProductDetailPage(item)"></image>
					</view>
					<view class="c-product__title">{{ item.title }}</view>
					<view class="c-product-price">
						<view class="c-product-price__label">价格：</view>
						<view class="c-product-price__val"  v-if="item.type === 1 || item.type === 3">
							￥{{ item.min_price }}
							<view class="c-product-price__range">~</view>
							￥{{ item.max_price }}
						</view>
						<view class="c-product-price__val" v-if="item.type === 2">￥{{ item.min_price }}</view>
					</view>
					<!-- <button class="sg-button c-product__btn" type="primary" @tap="goInventoryShareProductListPage(item)">立即查看</button> -->
				</view>
				<image class="c-product__image" v-if="item.store_id == current_outlet_id" :src="item.logo" mode="aspectFill" @tap="goShopIntroPage(item)"></image>
			</view>
		</view>

		<view class="loading">{{ loadingText }}</view>

		<!-- footer -->
		<view class="c-footer"><button class="sg-button sg-button--square c-footer-btn" type="primary" @tap="selectShareProduct">选择共享商品</button></view>

		<!-- 筛选分类-->
		<sg-popup v-model="selectTypeProductDialogVisible" z-index="90" custom-class="c-filter-popup" position="top">
			<view class="c-product-share-type" @tap="handleTypeTap(1)"></view>
			<view class="c-product-share-type" @tap="handleTypeTap(1)">库存共享</view>
			<view class="c-product-share-type" @tap="handleTypeTap(3)">新品共享</view>
			<view class="c-product-share-type" @tap="handleTypeTap(2)">补货共享</view>
		</sg-popup>

		<!-- 选择共享商品 -->
		<sg-popup v-model="selectShareProductDialogVisible" position="center">
			<view class="c-product-share-type" @tap="handleShareItemTap(1)">库存共享</view>
			<view class="c-product-share-type" @tap="handleShareItemTap(3)">新品共享</view>
			<view class="c-product-share-type" @tap="handleShareItemTap(2)">补货共享</view>
			<view class="c-product-share-type c-product-share-type--disabled">众筹共享</view>
		</sg-popup>

		<!-- 共享提示 -->
		<sg-popup v-model="shareDialogVisible" position="center">
			<view class="c-dialog">
				<view class="c-dialog__title">确定共享近七天新品数据？</view>
				<view class="c-dialog__btns">
					<view class="c-dialog__btn" @tap="shareDialogVisible = false">取消</view>
					<view class="c-dialog__btn c-dialog__btn--active" @tap="handleShareOkTap(3)">确定</view>
				</view>
			</view>
		</sg-popup>
	</view>
</template>

<script>
import { GroupProductListApi } from '../../api/index.js';
export default {
	data() {
		return {
			typeFilterActive: false,
			shareDialogVisible: false, // 确定共享商品提示
			selectShareProductDialogVisible: false, // 选择共享类型
			selectTypeProductDialogVisible:false,//筛选分类
			allianceID: '',
			startPage: 1,
			totalPage: 1,
			productList: [],
			type: '', //1:库存共享,2:补货共享,3:新品共享    类型|1:库存共享,2:补货共享,3:新品共享
			current_outlet_id: '',
			loadingText: '加载中...'
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

	onShow() {
		this.startPage = 1;
		this.productList = [];
		this.loadingText = '加载中...'
		this.getGroupProductList();
	},

	onLoad(opt) {
		this.current_outlet_id = this.userInfo.current_outlet_id;
		console.log('userInfo == ', this.userInfo, this.current_outlet_id);
		this.allianceID = opt.allianceID;
		console.log('联盟详情页联盟 onload == ', this.allianceID);
		// this.getGroupProductList();
		uni.setNavigationBarTitle({
		　　title:opt.allianceText
		})
	},

	onReachBottom() {
		if (Number(this.startPage) >= Number(this.totalPage)) {
			this.loadingText = '没有更多了~';
		} else {
			this.startPage += 1;
			this.getGroupProductList();
		}
	},

	methods: {
		getGroupProductList() {
			GroupProductListApi(this.allianceID, this.startPage, this.type,'',this.uid) //getApp().globalData.uid
				.then(res => {
					this.productList = this.productList.concat(res.data.data);
					this.totalPage = res.data.last_page;
					console.log('get GroupProductListApi success', res);
					if (this.startPage >= res.data.last_page) {
						this.loadingText = '没有更多了~';
					}
					if(this.productList.length <= 0){
						this.loadingText = '什么都没有发现哦';
					}
				})
				.catch(err => {
					console.log('get GroupProductListApi error', err);
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					});
				});
		},
		
		handeleTypeChoose(){
			this.selectTypeProductDialogVisible = !this.selectTypeProductDialogVisible;
			this.typeFilterActive = !this.typeFilterActive;
		},
		handleTypeTap(type){
			this.selectTypeProductDialogVisible = false
			 // 类型|1:库存共享,2:补货共享,3:新品共享
			this.type = type;
			this.startPage = 1,
			this.productList = [],
			this.loadingText = '加载中...'
			this.getGroupProductList();
		},

		handleShareOkTap(type) {
			this.shareDialogVisible = false;
			uni.navigateTo({
				url: '/pages/alliance-select-inventory/alliance-select-inventory?type=' + type + '&allianceID=' + this.allianceID
			});
		},

		selectShareProduct() {
			this.selectShareProductDialogVisible = true;
		},

		handleShareItemTap(type) {
			this.selectShareProductDialogVisible = false;
			if (type === 3) {
				// 新品共享
				this.shareDialogVisible = true;
			} else if (type === 1 || type === 2) {
				//1:库存 2:补货
				uni.navigateTo({
					url: '/pages/alliance-select-inventory/alliance-select-inventory?type=' + type + '&allianceID=' + this.allianceID
				});
			}
		},

		// 店铺介绍
		goShopIntroPage(item) {
			console.log('店铺item=== ', item);
			uni.navigateTo({
				url: '/pages/shop-intro/shop-intro?store_id=' + item.store_id
			});
		},

		//-> 联盟成员库存共享商品列表
		goInventoryShareProductListPage(item) {
			let jStr = JSON.stringify(item);
			uni.navigateTo({
				url: '/pages/inventory-shared-products/inventory-shared-products?props=' + jStr
			});
		},
		// 商品详情
		goProductDetailPage(item) {
			console.log('item=== ', item);
			let type = 0;
			if (item.type == 1) {
				type = 0;
			}
			
			if (item.type == 3) {
				type = 5; //联盟新品共享
			}
			
			if (item.type == 2) {
				type = 3;
			}
			uni.navigateTo({
				url: '/pages/product-detail/product-detail?id=' + item.id + '&type=' + type
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
	padding-top: 110rpx;
	padding-bottom: 122rpx;
}
.c-header {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 200;
	height: 110rpx;
	background: #fff;
}

// filter
.c-filter-list {
	background: #fff;
	height: 110rpx;
	display: flex;
	align-items: center;
}
.c-filter-item {
	height: 110rpx;
	line-height: 110rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 32rpx;
}
.c-filter-item--active .c-filter-item__icon {
	transform: rotate3d(0, 0, 1, -180deg);
}
.c-filter-item__label {
	color: rgba(15, 3, 20, 0.85);
	font-size: 30rpx;
	line-height: 1;
	font-weight: bold;
}
.c-filter-item__icon {
	width: 36rpx;
	height: 36rpx;
	transition: all 0.3s;
}
// 列表
.c-product {
	display: flex;
	background: transparent;
	padding: 0 24rpx;
	margin-top: 24rpx;
}
.c-product__image {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
}
.c-product__content {
	position: relative;
	background: #fff;
	border-radius: 10rpx;
	padding: 32rpx;
	flex: 1;
}
.c-product__content--left {
	margin-left: 26rpx;
}
.c-product__content--left:before {
	content: '';
	position: absolute;
	z-index: 1;
	left: -14rpx;
	top: 28rpx;
	width: 0;
	height: 0;
	border-top: 14rpx solid transparent;
	border-bottom: 14rpx solid transparent;
	border-right: 19rpx solid #fff;
}
.c-product__content--right {
	margin-right: 26rpx;
}
.c-product__content--right:before {
	content: '';
	position: absolute;
	z-index: 1;
	right: -14rpx;
	top: 28rpx;
	width: 0;
	height: 0;
	border-top: 14rpx solid transparent;
	border-bottom: 14rpx solid transparent;
	border-left: 19rpx solid #fff;
}

.c-product__tag {
	height: 56rpx;
	padding: 0 13rpx;
	line-height: 56rpx;
	text-align: center;
	font-size: 32rpx;
	font-weight: 400;
	line-height: 56rpx;
	display: inline-block;
	border-radius: 10rpx;
}
.c-product__tag--store {
	background: rgba(250, 100, 0, 0.2);
	color: rgba(250, 100, 0, 1);
}
.c-product__tag--replenish {
	color: #2681ff;
	background: rgba(38, 129, 255, 0.2);
}
.c-product__tag--new {
	background: rgba(68, 215, 182, 0.2);
	color: rgba(45, 174, 145, 1);
}
.c-product__enterlist {
	position: absolute;
	right: 32rpx;
	top: 42rpx;
	color: #2681ff;
	font-size: 26rpx;
	height: 37rpx;
	line-height: 37rpx;
	z-index: 1;
}
.c-product__enterlist:active {
	opacity: 0.6;
}
.c-product-image-list {
	padding: 24rpx 0;
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	margin-bottom: -17rpx;
}
.c-product-image {
	width: 166rpx;
	height: 166rpx;
	border-radius: 5rpx;
	margin-bottom: 17rpx;
}
.c-product__title {
	font-size: 30rpx;
	font-weight: 400;
	color: rgba(15, 3, 20, 0.65);
	line-height: 42rpx;
}
.c-product-price {
	margin-top: 27rpx;
	display: flex;
	align-items: center;
}
.c-product-price__label {
	font-size: 24rpx;
	font-weight: 400;
	color: rgba(0, 0, 0, 0.65);
	line-height: 34rpx;
}
.c-product-price__val {
	font-size: 28rpx;
	font-weight: 400;
	color: rgba(250, 100, 0, 1);
	line-height: 34rpx;
	display: flex;
}
.c-product-price__range {
	font-size: 28rpx;
	color: #ffb132;
	padding: 0 11rpx;
}
.c-product__btn {
	position: absolute;
	right: 32rpx;
	bottom: 24rpx;
	z-index: 1;
	height: 54rpx;
	line-height: 54rpx;
	border-radius: 4rpx;
	color: #fff;
	font-size: 26rpx;
	font-weight: bold;
	display: inline-block;
	padding: 0 17rpx;
}

// footer
.c-footer {
	position: fixed;
	left: 0;
	bottom: 0;
	right: 0;
	z-index: 100;
	height: 98rpx;
}
.c-footer-btn {
	width: 100%;
	height: 98rpx;
	line-height: 98rpx;
	color: #fff;
	font-weight: bold;
	font-size: 34rpx;
}

// 共享提示
.c-dialog {
	background: #fff;
}
.c-dialog__title {
	height: 216rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #1e2229;
	font-size: 36rpx;
	line-height: 1.2;
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

// 选择共享类型
.c-product-share-type {
	height: 100rpx;
	line-height: 100rpx;
	text-align: center;
	font-size: 36rpx;
	font-weight: 400;
	color: rgba(38, 38, 38, 1);
}
.c-product-share-type:not(:last-child) {
	@include thin-line-bottom(#dddddd, 24rpx, 24rpx);
}
.c-product-share-type:not(.c-product-share-type--disabled):active {
	opacity: 0.6;
}
.c-product-share-type--disabled {
	color: #bdbdbd;
}
.c-filter-popup {
	top: 500upx;
}
</style>
