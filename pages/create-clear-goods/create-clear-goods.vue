<template>
	<view class="page-container">
		<view class="c-header">
      <sg-search placeholder="输入型号或档口搜索库存" @blur="handleSearch"></sg-search>
      <!-- 类别 -->
      <view class="c-tabs">
        <view class="c-tab" :class="{'c-tab--active': type === 1}" @tap="handleTabTap(1)">全部库存</view>
        <view class="c-tab" :class="{'c-tab--active': type === 2}" @tap="handleTabTap(2)">7天滞销货</view>
      </view>
    </view>
    
    
    <!-- 商品列表 -->
    <scroll-view class="c-product-list" scroll-y="true" @scrolltolower="scollToBottom">
      <view class="c-product" v-for="(item, index) in products" :key="item.id" @tap="handleProductTap(item, index)">
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
          <view class="c-product-price">
            <view class="c-product-price__label">最低价</view>
            <view class="c-stepper">
              <image class="c-stepper__icon" src="../../static/common/ic_minus_orange@2x.png" mode="aspectFill" 
                @tap.stop="handleProductMinPriceMinusTap(item, index)"></image>
              <input type="number" class="c-stepper__input" value="item.trade_price" v-model="item.trade_price">
							</input>
              <image class="c-stepper__icon" src="../../static/common/ic_plus_orange@2x.png" mode="aspectFill"
                @tap.stop="handleProductMinPricePlusTap(item, index)"></image>
            </view>
          </view>
          <view class="c-product-price">
            <view class="c-product-price__label">最高价</view>
            <view class="c-stepper">
              <image class="c-stepper__icon" src="../../static/common/ic_minus_orange@2x.png" mode="aspectFill"
                @tap.stop="handleProductMaxPriceMinusTap(item, index)"></image>
              <view class="c-stepper__val" v-model="item.high_price">{{item.high_price}}</view>
							<!-- <input class="c-stepper__input" value="item.high_price" v-model="item.high_price" /> -->
							
							<image v-if="item.high_price >= item.market_price " class="c-stepper__icon" src="../../static/common/ic_question_orange@2x.png" mode="aspectFill"
							  @tap.stop="handleProductMaxPricePlusTap(item)"></image>
							
              <image v-else class="c-stepper__icon" src="../../static/common/ic_plus_orange@2x.png" mode="aspectFill"
                @tap.stop="handleMaxPrice(item, index)"></image>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <!-- footer -->
    <view class="c-footer">
      <button class="sg-button sg-button--square c-footer-btn" type="primary" @tap="handleSubmitBtnTap">发布清货信息</button>
    </view>
    
    <!-- 最高价提示 -->
    <sg-dialog ref="maxPriceTipDialogRef"></sg-dialog>
    
    <!-- 最高价提示 -->
    <sg-dialog ref="submitClearGoodsDialogRef" @confirm="submitClearGoods"></sg-dialog>
    
	</view>
</template>

<script>
	import {
		AllProductSockListApi, 
		SevenDayStockListApi,
		ProductSellBatSaveApi
	} from '../../api/index.js';
	import _ from 'lodash'
	export default {
		data() {
			return {
        type: 2, // 发布类型，1：全部库存 2：7天滞销货
				products: [],
        maxPriceTipDialogVisible: false,  // 最高价提示
				
				totalPage: 0,
				page: 1,
				searchText: '',
			};
		},
		computed: {
			uid: {
				get() {
					return getApp().globalData.uid
				}
			}
		},
		onLoad(opt) {
			this.loadProducts()
		},
		
    methods: {
			loadProducts() {
				if (this.type === 1) {
					this.loadAllProductList();
				} else {
					this.loadStockProduct();
				}
			},
			loadAllProductList() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				const {current_outlet_id} = getApp().globalData.userInfo;
				AllProductSockListApi(this.uid, current_outlet_id, this.searchText, this.page).then(ret => {
					console.log('AllProductSockListApi ret ==== ', ret);
					const result = ret.data;
					if (result && result.data && result.data.length > 0) {
						const products = result.data.map((item, index) => {
							return {
								...item,
								checked: false,
								high_price: item.market_price,
							}
						})
						this.products = this.products.concat(products);
						this.totalPage = result.last_page;
					} else {
						uni.showToast({
							title: '没有找到商品',
							icon: 'none'
						});
						this.products = [];
					}
					uni.hideLoading()
				})
				.catch(err => {
					console.log('AllProductSockListApi err === ', err)
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					})
					uni.hideLoading()
				})
			},
			loadStockProduct() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				const {current_outlet_id} = getApp().globalData.userInfo;
				SevenDayStockListApi(this.uid, current_outlet_id, 1, this.searchText, this.page).then(ret => {
					console.log('SevenDayStockListApi ==== ret', ret)
					const result = ret.data;
					if (result && result.data && result.data.length > 0) {
						const products = result.data.map((item, index) => {
							return {
								...item,
								checked: false,
								high_price: item.market_price,
							}
						})
						this.products = this.products.concat(products);
						this.totalPage = result.last_page;
					} else {
						uni.showToast({
							title: '没有找到商品',
							icon: 'none'
						})
						this.products = [];
					}
					uni.hideLoading()
				})
				.catch(err => {
					console.log('SevenDayStockListApi ==== err', err)
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					})
					uni.hideLoading()
				})
			},
			// 加载更多
			scollToBottom() {
				if (this.page <= this.totalPage) {
					this.page ++;
					this.loadProducts()
				} else {
					// 没有更多了
					uni.showToast({
						title: '没有更多了',
						icon: 'none'
					})
				}
				
			},
      handleSearch(val) {
				this.page = 1;
				const title = val.detail.value;
				console.log('title ====== ', title);
				this.searchText = title;
				
        this.loadProducts();
      },
      // tab被点击
      handleTabTap(type) {
        this.type = type;
				this.page = 1;
				this.products = [];
				this.loadProducts()
      },
      // 产品点击
      handleProductTap(product, index) {
				console.log('itt === ', product)
				const {id} = product
        uni.navigateTo({
          // url: `/pages/edit-clear-goods-product/edit-clear-goods-product?id=${id}`
					url: `../find-goods-product-detail/find-goods-product-detail?product=${JSON.stringify(product)}`
					
        })
      },
      // 产品选中
      handleProductCheckboxTap(product) {
        product.checked = !product.checked;
      },
      // 减少最低价
      handleProductMinPriceMinusTap(item, index) {
        if (item.trade_price > 0) {
          // item.trade_price --;
					this.products[index].trade_price --;
        }
      },
      // 增加最低价
      handleProductMinPricePlusTap(item, index) {
				if (parseInt(item.trade_price) < parseInt(item.high_price)) {
					this.products[index].trade_price ++;
				} else {
					uni.showToast({
						title: '最低价不能超过最高价',
						icon: 'none'
					})
				}
				
      },
      // 减少最高价
      handleProductMaxPriceMinusTap(item, index) {
        if (parseInt(item.high_price) > parseInt(item.trade_price)) {
					this.products[index].high_price --;
        } else {
					uni.showToast({
						title: '最高价不能低于最低价',
						icon: 'none'
					})
				}
      },
			handleMaxPrice(item, index) {
				if (parseInt(item.high_price) < parseInt(item.market_price)) {
				  // item.market_price --;
					this.products[index].high_price ++;
				}
			},
      // 增加最高价
      handleProductMaxPricePlusTap(product) {
        this.$refs.maxPriceTipDialogRef.show({
          title: '最高价是取自您库存的中价格的最高价展示。',
          content: '',
          showCancel: false,
          confirmText: '我知道了'
        });
      },
      // 新增寻货
      handleAddProductTap() {
        uni.navigateTo({
          url: '/pages/edit-find-goods-product/edit-find-goods-product?canEdit=1'
        })
      },
      // 发布清货确认框
      handleSubmitBtnTap() {
				const products = this.products.filter(x => x.checked);
				if (products.length === 0) {
					uni.showToast({
						title: '请选择商品',
						icon: 'none'
					})
					return;
				}
        this.$refs.submitClearGoodsDialogRef.show({
          title: '是否确认发布清货？',
          content: '发布后，系统审核通过将会在清货大厅展示。'
        });
      },
      // 确认发布清货
      submitClearGoods() {
				const products = this.products.filter(x => x.checked);
				const ret = _.map(products, (item, index) => {
					return _.pick(item, ['id', 'trade_price', 'high_price'])
				})
				let list = [];
				_.forEach(ret, (item, idx) => {
					list.push({
						product_stock_id: item.id,
						min_price: item.trade_price,
						max_price: item.high_price,
					})
				})
				
				ProductSellBatSaveApi(this.uid, list).then(result => {
					console.log('ProductSellBatSaveApi ret === ', result);
					
					uni.redirectTo({
					  url: '/pages/clear-goods-record/clear-goods-record'
					});
				})
				.catch(err => {
					console.log('ProductSellBatSaveApi err === ', err);
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
    padding: 198rpx 24rpx 98rpx;
  }
  .c-header {
    position: fixed;
    z-index: 100;
    left: 0;
    right: 0;
    top: 0;
    width: 100%;
    background: #F4F5F6;
    padding: 24rpx 24rpx 0;
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

  // 商品列表
  .c-product {
    position: relative;
    padding: 24rpx;
    background: #fff;
    border-radius: 10rpx;
    margin-bottom: 24rpx;
  }
	.c-product-list {
		height: calc(100vh - 198rpx);
		background: #fff;
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
  .c-stepper__icon:active {
    opacity: 0.6;
  }
	.c-stepper__input {
		height: 44rpx;
		font-size: 30rpx;
		font-weight: bold;
		color: rgba(3,11,4,1);
		line-height: 44rpx;
		padding: 0 18rpx;
		text-align: center;
		max-width: 100rpx;
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
