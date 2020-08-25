<template>
	<view class="page-container">
		<view class="c-header">
		  <view class="c-search">
        <sg-search v-model="title" placeholder="输入商品名称搜索" @search="handleSearch"></sg-search>
      </view>
      <!-- 类别 -->
      <view class="c-tabs">
        <view class="c-tab" :class="{'c-tab--active': tabIndex === 1}" @tap="handleTabTap(1)">联盟记录</view>
        <view class="c-tab" :class="{'c-tab--active': tabIndex === 2}" @tap="handleTabTap(2)">寻货宝记录</view>
      </view>
		</view>
		
		
    <scroll-view class="c-product-list">
      <!-- 产品 -->
      <view v-for="(item, index) in products" class="c-product">
        <view @tap="goDetail(item, index)" class="c-product__inner">
          <image class="c-product__image" :src="item.img" mode="aspectFill"></image>
          <view class="c-product__content">
            <view class="c-product__title">{{item.title}}</view>
            <view class="c-product__views">浏览量：{{item.view}}</view>
            <view class="c-product__stock">库存数量：{{item.buy_num}}</view>
						
						<view v-if="item.status === 0" class="c-product__status c-product__status--offline">已下架</view>
						<view v-else-if ="item.status === 1" class="c-product__status c-product__status--online">
							已发布
						</view>
						<view v-else-if ="item.status === 2" class="c-product__status c-product__status--verifying">
							审核中
						</view>
						
          </view>
        </view>
        <view class="c-product__footer">
					<view @tap="publicGoods(item, index)" v-if="item.status === 0" class="c-product__btn">再次寻货</view>
					<view @tap="offlineGoods(item, index)" v-else-if="item.status === 1" class="c-product__btn">下线</view>
          <view @tap="deleteGoods(item, index)" class="c-product__btn">删除</view>
          <view @tap="goSupplyList(item)" class="c-product__btn">查看供货</view>
          <view @tap="goEditPage(item, index)" class="c-product__btn c-product__btn--primary">编辑</view>
        </view>
      </view>
      
    </scroll-view>
    
    
    
	</view>
</template>

<script>
	import {
		GroupProductBuyListApi, 
		MineProductBuyApi, 
		ProductBuyShelveApi, 
		ProductBuyDeleteApi, 
		ProductBuyUnshelveApi,
		GroupProductBuyDeleteApi,
		GroupProductBuyUnshelveApi,
		GroupProductBuyShelveApi
	} from '../../api/index.js'
	
	export default {
		data() {
			return {
				tabIndex:1, // 类型
				title: '',
				page: 1,
				products: [],
				total: 0,
			};
		},
		computed: {
			uid: {
				get() {
					return getApp().globalData.uid
				}
			},
		},
		onLoad(opt) {
			this.tabIndex = parseInt(opt.tabIndex);
			console.log('load this.tabIndex ==== ',this.tabIndex);
			this.loadGoods();
			uni.$on('refreshRecord', () => {
				console.log('logggg ====== ')
				this.page = 1;
				this.products = [];
				this.loadGoods();
			})
		},
		onUnload() {
			uni.$off('refreshRecord')
		},
		onReachBottom() {
			console.log('load ==== ');
			if (this.products.length < this.total) {
				this.page++;
				this.loadGoods()
			}
		},
    methods: {
      handleSearch(text) {
        console.log('s ==== ', text, this.title)
				this.page = 1;
				this.products = [];
				this.loadGoods()
      },
      handleTabTap(index) {
        this.tabIndex = index;
				this.products = [];
				this.page = 1;
				this.loadGoods();
      },
			loadGoods() {
				if (this.tabIndex === 1) {
					this.loadGroupBuyList()
				} else {
					this.loadFindGoodsList()
				}
			},
			loadFindGoodsList() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				MineProductBuyApi(this.uid, this.title, this.page).then(ret => {
					console.log('MineProductBuyApi ret == ', ret)
					const result = ret.data;
					if (result && result.data && result.data.length > 0) {
						this.products = this.products.concat(result.data);
						this.total = result.total;
					}
					uni.hideLoading()
				})
				.catch(err => {
					console.log('MineProductBuyApi err == ', err)
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					})
					uni.hideLoading()
				})
			},
			loadGroupBuyList() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				GroupProductBuyListApi(this.uid, this.title, this.page).then(ret => {
					console.log('GroupProductBuyListApi ret == ', ret)
					const result = ret.data;
					if (result && result.data && result.data.length > 0) {
						this.products = this.products.concat(result.data);
						this.total = result.total;
					}
					uni.hideLoading()
				})
				.catch(err => {
					console.log('GroupProductBuyListApi err == ', err)
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					})
					uni.hideLoading()
				})
			},
			deleteGoods(item, index) {
				const that = this;
				uni.showModal({
					title: '确认删除？',
					content: '确认删除后，将删除此件商品！',
					confirmColor: '#FA6400',
					confirmText: '删除',
					success: (e) => {
						if (e.confirm) {
							that.deleteProduct(item, index)
						}
					}
				})
			},
			// 删除商品
			deleteProduct(item, index) {
				if (this.tabIndex === 1) {
					GroupProductBuyDeleteApi(this.uid, item.id).then(ret => {
						console.log('GroupProductBuyDeleteApi ret == ', ret);
						this.products.splice(index, 1);
						this.total -= 1;
					})
					.catch(err => {
						console.log('GroupProductBuyDeleteApi err == ', err);
						uni.showToast({
							title: '失败' + err,
							icon: 'none'
						})
					})
				} else {
					ProductBuyDeleteApi(this.uid, item.id).then(ret => {
						console.log('ProductBuyDeleteApi ret == ', ret);
						this.products.splice(index, 1);
					})
					.catch(err => {
						console.log('ProductBuyDeleteApi err == ', err);
						uni.showToast({
							title: '失败' + err,
							icon: 'none'
						})
					})
				}
			},
			// 再次寻货
			publicGoods(item, index) {
				console.log('sss === ', item)
				if (this.tabIndex === 1) {
					GroupProductBuyShelveApi(this.uid, item.id).then(ret => {
						console.log('GroupProductBuyShelveApi ret == ', ret);
						this.products = [];
						this.page = 1;
						this.loadGoods();
					})
					.catch(err => {
						console.log('GroupProductBuyShelveApi err == ', err);
						uni.showToast({
							title: '失败' + err,
							icon: 'none'
						})
					})
				} else {
					ProductBuyShelveApi(this.uid, item.id).then(ret => {
						console.log('ProductBuyShelveApi ret == ', ret);
						this.products = [];
						this.page = 1;
						this.loadGoods();
					})
					.catch(err => {
						console.log('ProductBuyShelveApi err == ', err);
						uni.showToast({
							title: '失败' + err,
							icon: 'none'
						})
					})
				}
			},
			offlineGoods(item, index) {
				if (this.tabIndex === 1) {
					GroupProductBuyUnshelveApi(this.uid, item.id).then(ret => {
						console.log('GroupProductBuyUnshelveApi ret == ', ret);
						this.products = [];
						this.page = 1;
						this.loadGoods();
						uni.showToast({
							title: '下线成功',
							icon: 'success'
						})
					})
					.catch(err => {
						console.log('GroupProductBuyUnshelveApi err == ', err);
						uni.showToast({
							title: '失败' + err,
							icon: 'none'
						})
					})
				} else {
					ProductBuyUnshelveApi(this.uid, item.id).then(ret => {
						console.log('ProductBuyUnshelveApi ret == ', ret);
						this.products = [];
						this.page = 1;
						this.loadGoods();
						uni.showToast({
							title: '下线成功',
							icon: 'success'
						})
					})
					.catch(err => {
						console.log('ProductBuyUnshelveApi err == ', err);
						uni.showToast({
							title: '失败' + err,
							icon: 'none'
						})
					})
				}
			},
			goSupplyList(item) {
				uni.navigateTo({
					url: `../supply-list/supply-list?tabIndex=${this.tabIndex}&productId=${item.id}`
				})
			},
			goEditPage(item) {
				uni.navigateTo({
					url: `../edit-find-goods-product/edit-find-goods-product?type=2&canEdit=1&product=${JSON.stringify(item)}&isFindGoods=1`
				})
			},
			goDetail(item, index) {
				uni.navigateTo({
					url: `../edit-find-goods-product/edit-find-goods-product?type=2&canEdit=0&product=${JSON.stringify(item)}&isFindGoods=1`
				})
			}
    },

		
	}
</script>

<style lang="scss">
  @import '@/common/scss/mixin.scss';
  .page-container {
    padding-top: 198rpx;
  }
  .c-header {
    position: fixed;
    z-index: 100;
    left: 0;
    right: 0;
    top: 0;
    width: 100%;
    background: #F4F5F6;
  }
  .c-search {
    padding: 24rpx 24rpx 0 24rpx;
  }
  
  // tabs
  .c-tabs {
    height: 102rpx;
    display: flex;
    align-items: center;
    background: #F4F5F6;
  }
  .c-tab {
    position: relative;
    flex: 1;
    height: 102rpx;
    font-size: 32rpx;
    font-weight: 400;
    color: #666666;
    line-height:102rpx;
    text-align: center;
  }
  .c-tab--active {
    color: #262626;
    font-weight: bold;
  }
  .c-tab--active:after {
    content: "";
    position: absolute;
    z-index: 1;
    left: 50%;
    top: 76rpx;
    transform: translateX(-50%);
    width: 72rpx;
    height: 8rpx;
    border-radius: 4rpx;
    background: #EF4345;
  }
  
  // 产品
  .c-product-list {
    padding: 24rpx;
    background: #fff;
    border-radius: 20rpx 20rpx 0 0;
    min-height: calc(100vh - 120rpx);
  }
  .c-product {
    background: #fff;
    @include thin_line_bottom(#F4F5F6, 0, 0)
  }
  .c-product__inner {
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
    font-weight:400;
    color:rgba(102,102,102,1);
    line-height: 45rpx;
    @include ellipsis(2);
  }
  .c-product__views {
    margin-top: 12rpx;
    height: 42rpx;
    font-size: 30rpx;
    font-weight:400;
    color:rgba(153,153,153,1);
    line-height:42rpx;
  }
  .c-product__stock {
    margin-top: 2rpx;
    height: 42rpx;
    font-size: 30rpx;
    font-weight:400;
    color:rgba(102,102,102,1);
    line-height:42rpx;
  }
  .c-product__status {
    position: absolute;
    bottom: 0;
    right: 0;
    height: 45rpx;
    font-size: 32rpx;
    font-weight:400;
    line-height:45rpx;
  }
  .c-product__status--verifying {
    color: #FA6400;
  }
  .c-product__status--offline {
    color: #999999;
  }
  .c-product__status--online {
    color: #2681FF;
  }
  .c-product__status--notpass {
    color: #EF4345;
  }
  .c-product__footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 24rpx;
    height: 122rpx;
    align-items: center;
    padding: 0 24rpx;
  }
  .c-product__btn {
    height: 56rpx;
    color: #fff;
    line-height: 54rpx;
    width: 150rpx;
    padding: 0;
    border-radius: 28rpx;
    border: 1px solid rgba(153,153,153,1);
    font-size: 26rpx;
    color: #999999;
    text-align: center;
  }
  .c-product__btn + .c-product__btn {
    margin-left: 18rpx;
  }
  .c-product__btn--primary {
    color: #FA6400;
    border: 1px solid #FA6400;
  }
  .c-product__btn:active {
    opacity: 0.6;
  }
  
</style>
