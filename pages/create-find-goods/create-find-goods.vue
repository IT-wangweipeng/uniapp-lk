<template>
	<view class="page-container">
		<view class="c-header">
      <view class="c-search-bar">
        <!-- 搜索 -->
        <view class="c-search">
          <sg-search placeholder="输入商品名称搜索" @search="handleSearch"></sg-search>
        </view>
        <!-- 新增 -->
        <view class="c-header-add" @tap="handleAddProductTap">
          <image class="c-header-add__icon" src="../../static/find-goods/ic_add_content@2x.png" mode="aspectFill"></image>
          <view class="c-header-add__label">调货</view>
        </view>
      </view>
    </view>
    
    <!-- 库存标题 -->
    <view class="c-title">
      <view class="c-title__line"></view>
      <view class="c-title__content">我的库存</view>
      <view class="c-title__line"></view>
    </view>
    
    <!-- 商品列表 -->
    <view class="c-product-list">
      <view class="c-product" v-for="item in products" :key="item.id" @tap="handleProductTap(item)">
        <view class="c-product__check" :class="{'c-product__check--checked': item.checked}" @tap.stop="handleProductCheckboxTap(item)">
          <image v-if="item.checked" class="c-product__checkbox" src="../../static/common/ic_checked@2x.png" mode="aspectFill"></image>
        </view>
        <view class="c-product__inner">
          <image class="c-product__image" :src="item.img" mode="aspectFill"></image>
          <view class="c-product__content">
            <view class="c-product__title">{{item.title}}</view>
            <view class="c-product__stock">库存数量：{{item.stock_num}}</view>
          </view>
        </view>
        <view class="c-product__footer" @tap.stop="">
          <!-- <view class="c-product-price"> -->
            <!-- <view class="c-product-price__label">最低价</view> -->
            <!-- <view class="c-stepper"> -->
              <!-- <image class="c-stepper__icon" src="../../static/common/ic_minus_orange@2x.png" mode="aspectFill" -->
                <!-- @tap.stop="handleProductMinPriceMinusTap(item)"></image> -->
              <!-- <view class="c-stepper__val">{{item.minPrice}}</view> -->
              <!-- <image class="c-stepper__icon" src="../../static/common/ic_plus_orange@2x.png" mode="aspectFill" -->
                <!-- @tap.stop="handleProductMinPricePlusTap(item)"></image> -->
            <!-- </view> -->
          <!-- </view> -->
          <view class="c-product-price">
            <view class="c-product-price__label">价格</view>
            <view class="c-stepper">
              <image class="c-stepper__icon" src="../../static/common/ic_minus_orange@2x.png" mode="aspectFill"
                @tap.stop="handleProductMaxPriceMinusTap(item)"></image>
              <view class="c-stepper__val">{{item.trade_price}}</view>
              <image class="c-stepper__icon" src="../../static/common/ic_plus_orange@2x.png" mode="aspectFill"
                @tap.stop="handleProductMaxPricePlusTap(item)"></image>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- footer -->
    <view class="c-footer">
      <button class="sg-button sg-button--square c-footer-btn" type="primary" @tap="submit">发布寻货信息</button>
    </view>
    <view class="loading">{{ loadingText }}</view>
	</view>
</template>

<script>
	import {
		FindGoodsStoreListApi,
		ProductBuyBatSaveApi,
	} from '../../api/index.js'
	import _ from 'lodash'
	
	export default {
		data() {
			return {
				products: [],
				
				uid: getApp().globalData.uid,
				title: '',
				total: 0,
				page: 1,
				loadingText: '加载中...',
			};
		},
		onLoad(opt) {
			this.loadStoreProduct();
			uni.$on('clear', () => {
				console.log('clear ====== ')
				this.title = '';
				this.resetData();
				this.loadStoreProduct();
			})
		},
		onUnload() {
			uni.$off('clear')
		},
		onReachBottom() {
			if (this.products.length < this.total) {
				this.page++;
				this.loadStoreProduct()
			}
		},
    methods: {
			loadStoreProduct() {
				this.loadingText = "加载中..."
				FindGoodsStoreListApi(this.uid, this.title, this.page).then(ret => {
					console.log('FindGoodsStoreListApi ret ==== ', ret)
					const result = ret.data;
					if (result && result.data && result.data.length > 0) {
						const products = result.data.map((item, index) => {
							return {
								...item,
								checked: false
							}
						})
						this.products = this.products.concat(products);
						this.total = result.total;
					if (this.products.length == this.total) {
							this.loadingText = '没有更多了'
						}
						if (this.products.length <= 0) {
							this.loadingText = '什么都没有发现哦'
						}
					} else {
						uni.showToast({
							title: '没有商品',
							icon: 'none'
						})
						this.loadingText = "没有更多了"
						this.products = [];
					}
				})
				.catch(err => {
					console.log('FindGoodsStoreListApi err === ', err);
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					})
				})
			},
      handleSearch(e) {
        console.log('e =============== ', e);
				this.title = e;
				this.resetData();
				this.loadStoreProduct();
      },
			resetData() {
				this.products = [];
				this.page = 1;
				this.total = 0;
			},
      // 产品点击
      handleProductTap(item) {
        uni.navigateTo({
					url: `../find-goods-product-detail/find-goods-product-detail?product=${JSON.stringify(item)}`
        })
      },
      // 产品选中
      handleProductCheckboxTap(product) {
        product.checked = !product.checked;
      },
      // 减少最低价
      handleProductMinPriceMinusTap(product) {
        if (product.minPrice > 0) {
          product.minPrice--;
        }
      },
      // 增加最低价
      handleProductMinPricePlusTap(product) {
        product.minPrice++;
      },
      // 减少最高价
      handleProductMaxPriceMinusTap(item) {
        if (item.trade_price !== 0) {
          item.trade_price --;
        }
      },
      // 增加最高价
      handleProductMaxPricePlusTap(item) {
				item.trade_price ++;
      },
      // 新增寻货
      handleAddProductTap() {
        uni.navigateTo({
          url: '/pages/add-new-goods/add-new-goods'
        })
      },
      submit() {
				const products = this.products.filter(x => x.checked);
				const ret = _.map(products, (item, index) => {
					return _.pick(item, ['id', 'trade_price'])
				})
				let list = [];
				_.forEach(ret, (item, idx) => {
					list.push({
						product_stock_id: item.id,
						min_price: item.trade_price,
					})
				})
				
				if (list.length === 0) {
					uni.showToast({
						title: '请选择商品',
						icon: 'none'
					})
					return;
				}
				
				ProductBuyBatSaveApi(this.uid, list).then(result => {
					console.log('ProductBuyBatSaveApi ret === ', result);
					
					uni.redirectTo({
					  url: '/pages/find-goods-record/find-goods-record?tabIndex=2'
					});
				})
				.catch(err => {
					console.log('ProductBuyBatSaveApi err === ', err);
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					})
				})
      }
    },

	}
</script>

<style lang="scss">
  @import '@/common/scss/mixin.scss';
  .page-container {
    padding: 96rpx 24rpx 98rpx;
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
  .c-search-bar {
    display: flex;
    align-items: center;
    padding: 0 24rpx 24rpx;
    background: #EF4345;
  }
  // 搜索
  .c-search {
    flex: 1;
  }
  // 新增
  .c-header-add {
    width: 162rpx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-left: 32rpx;
  }
  .c-header-add:active {
    opacity: 0.6;
  }
  .c-header-add__icon {
    display: block;
    width: 54rpx;
    height: 54rpx;
    margin-right: 16rpx;
  }
  .c-header-add__label {
    font-size: 36rpx;
    color: #fff;
    line-height: 50rpx;
  }
  // 标题
  .c-title {
    height: 94rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .c-title__line {
    width: 120rpx;
    height: 1px;
    background: rgba(250,100,0,0.5);
  }
  .c-title__content {
    padding: 0 18rpx;
    height: 45rpx;
    font-size: 32rpx;
    font-weight: 400;
    color: rgba(250,100,0,1);
    line-height: 45rpx;
  }
  // 商品列表
  .c-product {
    position: relative;
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
  .c-product__inner {
    display: flex;
    position: relative;
  }
  .c-product__image {
    width: 180rpx;
    height: 180rpx;
    border-radius: 6rpx 6rpx 0 0;
  }
  .c-product__content {
    flex: 1;
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
  .c-product__stock {
    height: 34rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: rgba(189,189,189,1);
    line-height: 34rpx;
    margin-top: 15rpx;
  }
  .c-product__footer {
    padding-top: 24rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .c-product-price {
    display: flex;
    align-items: center;
  }
  .c-product-price__label {
    height: 34rpx;
    font-size: 24rpx;
    font-weight: 400;
    color: rgba(0,0,0,0.65);
    line-height: 34rpx;
    padding-right: 24rpx;
  }
  .c-stepper {
    display: flex;
    align-items: center;
  }
  .c-stepper__icon {
    width: 44rpx;
    height: 44rpx;
  }
  .c-stepper__val {
    height: 44rpx;
    font-size: 30rpx;
    font-weight: bold;
    color: rgba(3,11,4,1);
    line-height: 44rpx;
    padding: 0 18rpx;
    text-align: center;
  }
  .loading {
  	text-align: center;
  	line-height: 80px;
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
