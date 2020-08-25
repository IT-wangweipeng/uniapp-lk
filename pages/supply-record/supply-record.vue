<template>
	<view class="page-container">
		<view class="c-header">
		  <view class="c-search">
		    <sg-search placeholder="输入商品名称搜索" @search="handleSearch"></sg-search>
		  </view>
		  <!-- 类别 -->
		  <view class="c-tabs">
		    <view class="c-tab" :class="{'c-tab--active': tabIndex === 1}" @tap="handleTabTap(1)">联盟历史</view>
		    <view class="c-tab" :class="{'c-tab--active': tabIndex === 2}" @tap="handleTabTap(2)">寻货宝历史</view>
		  </view>
		</view>
    
    <!-- 列表 -->
    <view class="c-product-list">
      <view class="c-product" v-for="(item, index) in products" :key="item.id">
        <view class="c-product__check" v-if="isEdit" :class="{'c-product__check--checked': item.checked}" @tap.stop="handleProductCheckboxTap(item)">
          <image v-if="item.checked" class="c-product__checkbox" src="../../static/common/ic_checked@2x.png" mode="aspectFill"></image>
        </view>
        <image class="c-product__image" :src="item.img" mode="aspectFill"></image>
        <view class="c-product__content">
          <view class="c-product__title">{{item.title}}</view>
          <view class="c-product__price">
            <view class="c-product__price-label">价格：</view>
            <view class="c-product__price-value">{{item.min_price}}</view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- footer -->
    <view class="c-footer">
      <button v-if="!isEdit" class="sg-button sg-button--square c-footer-btn" type="primary" @tap="handleEditBtnTap">编辑</button>
      <button v-if="isEdit" class="sg-button sg-button--square c-footer-btn" type="primary" @tap="handleCancelBtnTap">批量取消</button>
    </view>
    
		<view class="loading">{{ loadingText }}</view>
	</view>
</template>

<script>
	import {
		SellHistoryApi,
		CancelSellHistoryApi,
		GroupSellHistoryApi,
		CancelGroupSellHistoryApi,
	} from '../../api/index.js'
	import _ from 'lodash'
	export default {
		data() {
			return {
        products: [],
				isEdit: false,
				tabIndex: 1,
				searchTitle: '',
				page: 1,
				totalPage: 0,
				loadingText: "加载中..."
			};
		},
		computed: {
			uid: {
				get () {
					return getApp().globalData.uid;
				}
			}
		},
		onLoad() {
			this.loadHistory()
		},
		onReachBottom() {
			if (this.products.length < this.total) {
				this.page++;
				this.loadHistory()
			}
		},
    methods: {
			loadHistory() {
				if (this.tabIndex === 1) {
					this.loadGroupHistory()
				} else {
					this.loadFindGoodsHistory()
				}
			},
			deleteHistory(id) {
				if (this.tabIndex === 1) {
					this.deleteGroupHistory(id)
				} else {
					this.deleteFindGoodsHistory(id)
				}
			},
			deleteFindGoodsHistory(id) {
				CancelSellHistoryApi(this.uid, id).then(ret => {
					console.log('CancelSellHistoryApi ret === ', ret);
					uni.showToast({
					  title: '操作成功',
					  icon: 'success'
					});
					this.products = this.products.filter(x => {
						return !x.checked
					})
					this.isEdit = false;
				})
				.catch(err => {
					console.log('CancelSellHistoryApi err === ', err);
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					})
				})
			},
			deleteGroupHistory(id) {
				CancelGroupSellHistoryApi(this.uid, id).then(ret => {
					console.log('CancelGroupSellHistoryApi ret === ', ret);
					uni.showToast({
					  title: '操作成功',
					  icon: 'success'
					});
					this.products = this.products.filter(x => {
						return !x.checked
					})
					this.isEdit = false;
				})
				.catch(err => {
					console.log('CancelGroupSellHistoryApi err === ', err);
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					})
				})
			},
			loadFindGoodsHistory() {
				this.loadingText = "加载中..."
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				SellHistoryApi(this.uid, 1, this.searchTitle, this.page).then(ret => {
					console.log('SellHistoryApi result ==== ', ret)
					const result = ret.data;
					if (result && result.data && result.data.length > 0) {
						const products = result.data.map((item, index) => {
							return {
								...item,
								checked: false
							}
						})
						this.products = this.products.concat(products);
						this.totalPage = result.total;
					if (this.products.length == this.totalPage) {
							this.loadingText = '没有更多了'
						}
						if (this.products.length <= 0) {
								this.loadingText = '什么都没有发现哦'
							}
					} else {
						uni.showToast({
							title: '暂无供货',
							icon: 'none'
						})
						this.loadingText = "没有更多了"
						this.products = [];
					}
					uni.hideLoading();
				})
				.catch(err => {
					console.log('SellHistoryApi err ==== ', err);
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					})
					uni.hideLoading();
				})
			},
			loadGroupHistory() {
				this.loadingText = "加载中..."
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				GroupSellHistoryApi(this.uid, 1, this.searchTitle, this.page).then(ret => {
					console.log('GroupSellHistoryApi result ==== ', ret)
					const result = ret.data;
					if (result && result.data && result.data.length > 0) {
						const products = result.data.map((item, index) => {
							return {
								...item,
								checked: false
							}
						})
						this.products = this.products.concat(products);
						this.totalPage = result.total;
					if (this.products.length == this.totalPage) {
							this.loadingText = '没有更多了'
						}
						if (this.products.length <= 0) {
								this.loadingText = '什么都没有发现哦'
							}
					} else {
						uni.showToast({
							title: '暂无供货',
							icon: 'none'
						})
						this.loadingText = "没有更多了"
						this.products = [];
					}
					uni.hideLoading();
				})
				.catch(err => {
					console.log('GroupSellHistoryApi err ==== ', err);
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					})
					uni.hideLoading();
				})
			},
      handleSearch(val) {
        this.searchTitle = val;
				console.log('search ------- ', this.searchTitle);
				this.totalPage = 0;
				this.page = 1;
				this.products = [];
				this.loadHistory();
      },
      handleTabTap(index) {
        this.tabIndex = index;
				this.totalPage = 0;
				this.page = 1;
				this.products = [];
				this.loadHistory();
      },
      // 供货产品选中
      handleProductCheckboxTap(item) {
        item.checked = !item.checked;
      },
      // 编辑
      handleEditBtnTap() {
        this.isEdit = true;
      },
      handleCancelBtnTap() {
				const ret = _.filter(this.products, x => {
					return x.checked;
				})
				if (ret.length === 0) {
					return;
				}
				const ids = _.map(ret, 'id');
				const id = _.toString(ids);
				this.deleteHistory(id);
      }
    },
    
	}
</script>

<style lang="scss">
  @import '@/common/scss/mixin.scss';
  .page-container {
    padding-top: 198rpx;
    padding-bottom: 98rpx;
  }
	.loading {
		text-align: center;
		line-height: 80px;
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
  
  // 列表
  .c-product-list {
    padding: 0 24rpx;
  }
  .c-product {
    position: relative;
    display: flex;
    padding: 24rpx;
    background: #fff;
    border-radius: 10rpx;
    margin-bottom: 24rpx;
  }
  .c-product__check, .c-product__checkbox {
    width: 36rpx;
    height: 36rpx;
    border-radius: 4rpx;
  }
  .c-product__check {
    position: absolute;
    left: 36rpx;
    top: 36rpx;
    z-index: 1;
    background: #fff;
    border: 1px solid rgba(201,201,201,1);
  }
  .c-product__check--checked {
    border: none;
  }
  .c-product__checkbox {
    display: block;
  }
  .c-product__image {
    width: 180rpx;
    height: 180rpx;
    border-radius: 6rpx 6rpx 0 0;
  }
  .c-product__content {
    position: relative;
    flex: 1;
    padding-left: 24rpx;
  }
  .c-product__title {
    height: 90rpx;
    font-size: 32rpx;
    font-weight: 400;
    color: rgba(102,102,102,1);
    line-height:45rpx;
    @include ellipsis(2);
  }
  .c-product__price {
    display: flex;
    margin-top: 42rpx;
  }
  .c-product__price-label {
    height: 40rpx;
    line-height: 40rpx;
    color:rgba(0,0,0,0.65);
    font-size: 24rpx;
  }
  .c-product__price-value {
    position: relative;
    padding-left: 22rpx;
    height: 40rpx;
    line-height: 40rpx;
    color: #FA6400;
    font-size: 28rpx;
  }
  .c-product__price-value:before {
    position: absolute;
    font-size: 22rpx;
    content: "￥";
    left: 0;
    top: 0;
    height: 40rpx;
    line-height: 45rpx;
    z-index: 1;
  }
  .c-product__price-split {
    padding: 0 10rpx;
    font-size: 22rpx;
    height: 40rpx;
    line-height: 40rpx;
    color: #FA6400;
  }
  
  // footer
  .c-footer {
    height: 98rpx;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
  }
  .c-footer-btn {
    height: 98rpx;
    line-height: 98rpx;
    font-size: 34rpx;
    font-weight: bold;
    color: rgba(255,255,255,1);
  }
</style>
