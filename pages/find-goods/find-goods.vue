<template>
	<view class="page-container">
		<!-- header -->
		<view class="c-header">
		  <view class="c-search-bar">
         <!-- 搜索 -->
		    <view class="c-search">
          <sg-search placeholder="输入商品名称搜索" @search="handleSearch" :setFocus="set_focus"></sg-search>
        </view>
		    <!-- 新增 -->
		    <view class="c-header-add" @tap="handleAddTap">
		      <image class="c-header-add__icon" src="../../static/find-goods/ic_add_content@2x.png" mode="aspectFill"></image>
		      <view class="c-header-add__label">发布</view>
		    </view>
		  </view>
      <!-- 类别 -->
      <view class="c-tabs">
        <view class="c-tab" :class="{'c-tab--active': activeTabIndex === 0}" @tap="handleTabTap(0)">清货大厅</view>
        <view class="c-tab" :class="{'c-tab--active': activeTabIndex === 1}" @tap="handleTabTap(1)">调货大厅</view>
      </view>
		  <!-- 筛选 -->
		  <view class="c-filter-list">
		    <view class="c-filter-item" :class="{'c-filter-item--selected': allButtonActive}"
		      @tap="loadAll">
		      <view class="c-filter-item__label">综合</view>
		    </view>
				
		    <view class="c-filter-item" :class="{'c-filter-item--active': filterActiveIndex === 1, 'c-filter-item--selected': priceActive}" 
		      @tap="handleFilterItemTap(1)">
		      <view class="c-filter-item__label">价格</view>
		      <image class="c-filter-item__icon" src="../../static/common/arrow_dropdown@2x.png" mode="aspectFill"></image>
		    </view>
				
				
		    <view class="c-filter-item" :class="{'c-filter-item--active': filterActiveIndex === 2, 'c-filter-item--selected': citysActive}" 
		      @tap="handleFilterItemTap(2)">
		      <view class="c-filter-item__label">所在地区</view>
		      <image class="c-filter-item__icon" src="../../static/common/arrow_dropdown@2x.png" mode="aspectFill"></image>
		    </view>
				
				
		    <view class="c-filter-item" :class="{'c-filter-item--active': filterActiveIndex === 3, 'c-filter-item--selected': categoryActive}"
		      @tap="handleFilterItemTap(3)">
		      <view class="c-filter-item__label">主营类别</view>
		      <image class="c-filter-item__icon" src="../../static/common/arrow_dropdown@2x.png" mode="aspectFill"></image>
		    </view>
				<!-- :class="{'c-filter-item--selected': mineActive}" -->
		    <view class="c-filter-item" 
		     @tap="handleMineProductSell">
		      <view class="c-filter-item__label">{{activeTabIndex === 0 ? "我的清货" : "我的寻货"}}</view>
		    </view>
		  </view>
    </view>
    
    <!-- filter popup -->
    <!-- 价格筛选 -->
    <sg-popup :value="filterActiveIndex === 1" z-index="90" custom-class="c-filter-popup" position="top" 
      @close="handlePriceFilterPopupClose">
      <view class="c-filter-popup__inner">
        <view class="c-price-filter-title">价格区间（元）</view>
        <view class="c-price-filter-range">
          <input class="c-price-filter-range__input" placeholder-class="c-price-filter-range__placeholder" 
            type="digit" placeholder="最低价" v-model="min_price"/>
          <view class="c-price-filter-range__split"></view>
          <input class="c-price-filter-range__input" placeholder-class="c-price-filter-range__placeholder" 
            type="digit" placeholder="最高价" v-model="max_price"/>
        </view>
      </view>
      <view class="c-filter-popup__footer">
        <button class="sg-button c-filter-popup__reset" @tap="resetPrice">重置</button>
        <button class="sg-button c-filter-popup__submit" type="primary" @tap="handlePriceFilterSubmit">确定</button>
      </view>
    </sg-popup>
		
		
		<!-- 所在地区筛选 -->
		<sg-popup :value="filterActiveIndex === 2" z-index="90" custom-class="c-filter-popup" position="top"
		  @close="handleRegionFilterPopupClose">
		  <scroll-view class="c-filter-popup__inner" scroll-y="true">
		    <view class="c-filter-tags">
		      <view class="c-filter-tag" :class="{'c-filter-tag--active': city.checked}" 
		        v-for="city in citys" :key="city.id" @tap="handleRegionFilterItemTap(city)">{{city.name}}</view>
		    </view>
		  </scroll-view>
		  <view class="c-filter-popup__footer">
		    <button class="sg-button c-filter-popup__reset" @tap="resetCity">重置</button>
		    <button class="sg-button c-filter-popup__submit" type="primary" @tap="handleRegionFilterSubmit(item, index)">确定</button>
		  </view>
		</sg-popup>
    
		
		
		
		<!-- 主营类别筛选 -->
		<sg-popup :value="filterActiveIndex === 3" z-index="90" custom-class="c-filter-popup" position="top"
		  @close="handleBusTypeFilterPopupClose">
		  <scroll-view class="c-filter-popup__inner" scroll-y="true">
		    <view class="c-filter-tags">
		      <view class="c-filter-tag" :class="{'c-filter-tag--active': item.checked}" 
		        v-for="(item, index) in categorys" :key="item.id" @tap="handleBusTypeFilterItemTap(item, index)">{{item.name}}</view>
		    </view>
		  </scroll-view>
		  <view class="c-filter-popup__footer">
		    <button class="sg-button c-filter-popup__reset" @tap="resetCategory">重置</button>
		    <button class="sg-button c-filter-popup__submit" type="primary" @tap="handleBusTypeFilterSubmit">确定</button>
		  </view>
		</sg-popup>

    
    <!-- 新订单tips -->
    <view class="c-tips" v-if="newOrderTipsVisible">
      <image class="c-tips__image" src="../../static/demo/shop.jpeg" mode="aspectFill"></image>
      <view class="c-tips__label">{{tips_message}}</view>
    </view>
    
    <!-- 商品列表 -->
    <view class="c-product-list">
      <view class="c-product-item" v-for="item in products" :key="item" @tap="goProductDetailPage(item)">
				<view style="position: relative;">
					
					<image class="c-product-item__image" :src="item.img" mode="aspectFill"></image>
					<view class="c-product-outlet">
						<image class="c-product-outlet-img" :src="item.logo"></image>
						<view class="c-product-outlet-name">{{ item.name }}</view>
					</view>
					<view class="c-product_mask" v-if="activeTabIndex == 0">清</view>
					<view class="f-product_mask" v-if="activeTabIndex == 1">调</view>
				</view>
				
				
        <view class="c-product-item__title">{{item.title}}</view>
				<view class="c-product-item-city-label">{{ item.area }}</view>
        <view class="c-product-item__price">
          <view class="c-product-item__price-label">价格：</view>
					
					<view class="c-product-item__price-value" v-if="activeTabIndex === 0">￥{{ item.min_price }} ~ ￥{{ item.max_price }}</view>
					<view class="c-product-item__price-value" v-if="activeTabIndex === 1">￥{{ item.min_price }}</view>
        </view>
				
				<view class="c-product-item-stalls">
					<view class="c-product-item-stalls-label">{{item.stalls}}</view>
					<view class="c-product-item-stalls-model-l">型号</view>
					<view class="c-product-item-stalls-model">{{ item.model }}</view>
				</view>
      </view>
    </view>
    
    <!-- 新增清货&寻货 -->
    <view class="c-add-popover" :class="{'c-add-popover--visible': addPopoverVisible}">
      <view class="c-add-popover__inner">
        <view class="c-add-popover-item" @tap="handleAddPopoverItemTap(1)">我要清货</view>
        <view class="c-add-popover-item" @tap="handleAddPopoverItemTap(2)">我要寻货</view>
      </view>
    </view>
    <view class="loading">{{ loadingText }}</view>
	</view>
</template>

<script>
	import {
		ProductSellListApi, 
		FindProductListApi, 
		ProductCategoryApi, 
		CityApi
	} from '../../api/index.js'
	import _ from 'lodash'
	export default {
		data() {
			return {
        activeTabIndex: 0, // 当前选中的tab
        selectedFilterIndex: 0, // 选中的filter 
        filterActiveIndex: -1, // 打开激活的filter popup
        addPopoverVisible: false, // 是否显示新增选择框
        newOrderTipsVisible: false, // 新消息Tips是否显示
				
				min_price: '',
				max_price: '',
				products: [],
				categorys: [{name: '不限', id: 0, checked: true}],
				citys: [{name: '不限', id: 0, checked: true}],
				total: 0,
				totalPage: 0,
				page: 1,
				loadingText: '加载中...',
				cityIds: '',
				categoryIds: '',
				searchTitle: '',
				tips_message: '',
				set_focus:false,
				
				citysActive: false,
				categoryActive: false,
				priceActive: false,
				allButtonActive: true,
				mineActive: false,
				
				selectedCitys: [],
				selectedCategorys: [],
			};
		},
		computed:{
			uid: {
				get() {
					return getApp().globalData.uid
				}
			}
		},
		onLoad(opt) {
			
			
			this.loadProducts()
			this.loadCitys()
			this.loadCategory()
			
			let data = [
				'成功调货来自新七浦',
				'成功调货来自四季青',
				'成功调货来自银基',
				'成功调货来自十三行',
				'成功调货来自UUS',
				'成功调货来自圣和圣',
				'成功调货来自万嘉',
				'成功调货来自九天',
				'成功调货来自101',
				'成功调货来自南油',
			];
			
			const count = data.length - 1;
			setInterval(() => {
				this.newOrderTipsVisible = true;
				const ran = _.random(0, count);
				const msg = data[ran];
				this.tips_message = msg;
			}, 5000)
			
			uni.$on('clearInputValue', () => {
				this.searchTitle = '';
				this.resetSearch();
				this.loadProducts();
			})
		},
		onUnload() {
			console.log('销毁了');
			uni.$off('clearInputValue')
		},
		onShow() {
			
			if(getApp().globalData.findSearch){
				console.log('getApp().globalData.findSearch == ', getApp().globalData.findSearch);
				this.set_focus = true;
				getApp().globalData.findSearch = false;
			}
		},
		
		onHide() {
			console.log('find page hide == ', this.set_focus);
			this.set_focus = false;
		},
		
		onPullDownRefresh() {
			const that = this;
			console.log('resetSearch ===== ')
			this.resetSearch();
			setTimeout(() => {
				that.loadProducts();
			}, 500)
		},
		onReachBottom() {
			if (this.products.length < this.total) {
				this.page++;
				this.loadProducts()
			}
		},
    methods: {
			loadProducts() {
				if (this.activeTabIndex === 0) {
					// 清货大厅
					this.loadProductSellGoods()
				} else {
					// 寻货大厅
					this.loadFindGoods()
				}
			},
      handleSearch(val) {
        console.log('搜索文字 ===== ', val);
				this.searchTitle = val;
				this.resetSearch();
				this.loadProducts();
      },
			resetSearch() {
				this.page = 1;
				this.totalPage = 0;
				this.total = 0;
				this.products = [];
			},
			// inputBlur(v) {
			// 	const title = v.detail.value;
			// 	console.log('v ====== ', title);
			// 	this.searchTitle = title;
			// 	this.loadProducts();
			// },
      handleAddTap() {
        this.addPopoverVisible = !this.addPopoverVisible;
      },
      handleFilterItemTap(index) {
        this.filterActiveIndex = this.filterActiveIndex === index ? -1 : index;
				// this.selectedFilterIndex = index
      },
			handleMineProductSell() {
				
				this.selectedFilterIndex = 4;
				this.filterActiveIndex = -1;
				
				// this.selectedCategorys = [];
				// this.selectedCitys = [];
				// this.categoryActive = false;
				// this.citysActive = false;
				// this.priceActive = false;
				
				// this.categorys.forEach((item, index) => {
				// 	item.checked = index === 0;
				// });
				// this.citys.forEach(region => {
				//   region.checked = false;
				// });
				
				// this.min_price = '';
				// this.max_price = '';
				// this.allButtonActive = false;
				// this.mineActive = true;
				console.log('activeTabIndex ==== ', this.activeTabIndex)
				
				if (this.activeTabIndex === 0) {
					uni.navigateTo({
						url: '../clear-goods-record/clear-goods-record'
					})
				} else {
					uni.navigateTo({
						url: '../find-goods-record/find-goods-record',
					})
				}
			},
      // tab被点击
      handleTabTap(index) {
        this.activeTabIndex = index;
				this.products = [];
				this.page = 1;
				this.totalPage = 0;
				
				this.loadProducts()
      },
			loadAll() {
				this.selectedFilterIndex = 0;
				this.filterActiveIndex = -1;
				
				this.allButtonActive = true;
				this.priceActive = false;
				this.citysActive = false;
				this.categoryActive = false;
				this.mineActive = false;
				this.selectedCitys = [];
				this.selectedCategorys = [];
				this.categoryIds = '';
				this.categorys.forEach((item, index) => {
					item.checked = index === 0;
				});
				
				this.citys.forEach(region => {
				  region.checked = false;
				});
				
				this.max_price = '';
				this.min_price = '';
				this.cityIds = '';
				this.categoryIds = '';
				
				this.handleTabTap(this.activeTabIndex);
			},
			searchPrice() {
				let price = '';
				if (this.min_price.length > 0 && this.max_price.length > 0) {
					price = `${this.min_price}-${this.max_price}`
				}
				return price;
			},
			loadProductSellGoods () {
				this.loadingText = "加载中..."
				ProductSellListApi(this.uid, this.cityIds, this.categoryIds, this.searchPrice(), this.page, this.searchTitle).then(ret => {
					console.log('ProductSellListApi ret ==== ', ret)
					const result = ret.data;
					if (result && result.data && result.data.length > 0) {
						this.products = this.products.concat( ret.data.data)
						this.totalPage = result.last_page;
						this.total = result.total;
						if (this.products.length == this.total) {
							this.loadingText = '什么都没有发现哦'
						}
					} else {
						uni.showToast({
							title: '没有商品',
							icon: 'none'
						})
						this.loadingText = "什么都没有发现哦"
						this.products = [];
					}
					uni.stopPullDownRefresh()
				})
				.catch(err => {
					console.log('ProductSellListApi err ==== ', err)
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					})
					uni.stopPullDownRefresh()
				})
			},
			loadFindGoods() {
				this.loadingText = '加载中...'
				FindProductListApi(this.uid, this.cityIds, this.categoryIds, this.searchPrice(), this.page, this.searchTitle).then(ret => {
					console.log('FindProductListApi ret ==== ', ret)
					const result = ret.data;
					if (result && result.data && result.data.length > 0) {
						this.products = this.products.concat(result.data);
						this.totalPage = result.last_page;
						this.total = result.total;
						if (this.products.length == this.total) {
							this.loadingText = '没有更多了'
						}
						if (this.products.length <= 0) {
							this.loadingText = '什么都没有发现哦'
						}
					} else {
						uni.showToast({
							title: '什么都没有发现哦',
							icon: 'none'
						})
						this.products = [];
						this.loadingText = '没有更多了'
					}
					uni.stopPullDownRefresh()
				})
				.catch(err => {
					console.log('FindProductListApi err ==== ', err)
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					})
					uni.stopPullDownRefresh()
				})
			},
			loadCategory() {
				ProductCategoryApi(this.uid).then(ret => {
					console.log('ProductCategoryApi ret == ', ret);
					if (ret && ret.data && ret.data.length > 0) {
						const data = ret.data;
						const i = [];
						data.forEach((item, index) => {
							i.push({
								...item,
								checked: false,
							})
						})
						this.categorys = this.categorys.concat(i);
					}
				}).catch(err => {
					console.log('ProductCategoryApi err == ', err);
				})
			},
			loadCitys() {
				CityApi(this.uid).then(ret => {
					console.log('CityApi ret === ', ret)
					const result = ret.data;
					if (result && result.length > 0) {
						for (let i = 0; i < result.length; i++) {
							const item = result[i];
							this.citys.push({
								id: i + 1,
								name: item,
								checked: false
							})
						}
					}
				})
				.catch(err => {
					console.log('CityApi err === ', err)
				})
			},
      // 我要清货或我要寻货点击事件
      handleAddPopoverItemTap(type) {
        this.addPopoverVisible = false;
        if (type === 1) {
          uni.navigateTo({
            url: '/pages/create-clear-goods/create-clear-goods'
          })
        } else {
          uni.navigateTo({
            url: '/pages/create-find-goods/create-find-goods'
          })
        }
      },
      // 价格筛选
      handlePriceFilterSubmit() {
        this.filterActiveIndex = -1;
				console.log('handlePriceFilterSubmit ==== ', this.max_price, this.min_price)
				if (this.min_price.length === 0 || this.max_price.length === 0) {
					uni.showToast({
						title: '请输入查询价格',
						icon: 'none'
					})
					return
				}
				this.page = 1;
				this.total = 0;
				this.totalPage = 0;
				this.products = [];
				
				if (this.max_price.length > 0 || this.min_price.length > 0) {
					this.priceActive = true;
					this.allButtonActive = false;
					this.mineActive = false;
				} else {
					this.priceActive = false;
				}
				// 重新获取数据
				this.loadProducts()
      },
      handlePriceFilterPopupClose() {
        if (this.filterActiveIndex === 1) {
          this.filterActiveIndex = -1;
        }
      },
      // 地区筛选完成
      handleRegionFilterSubmit(item, index) {
        this.filterActiveIndex = -1;
				let items = this.citys.filter((item, index) => {
					return item.checked;
				})
				
				const names = _.map(items, 'name');
				let regions = _.toString(names);
				if (regions === '不限') {
					regions = '';
				}
				this.cityIds = regions;
				console.log('citys ======= ', this.cityIds);
				
				this.loadProducts();
      },
      // 地区筛选框关闭
      handleRegionFilterPopupClose() {
        if (this.filterActiveIndex === 2) {
          this.filterActiveIndex = -1;
        }
      },
      // 地区筛选项点击事件
      handleRegionFilterItemTap(item) {
        if (this.citys.indexOf(item) === 0) {
          item.checked = true;
					console.log('s1 ==== ');
          this.citys.forEach(region => {
            region.checked = false;
          });
					this.selectedCitys = [];
					this.citysActive = false;
        } else {
          if (this.citys[0].checked) {
            this.citys[0].checked = false;
						console.log('s2 ==== ');
          } else {
						console.log('s3 ==== ');
					}
        }
        item.checked = !item.checked;
				
				if (item.checked) {
					this.selectedCitys.push(item);
				} else {
					this.selectedCitys.splice(item, 1);
				}
				
				if (this.selectedCitys.length === 0) {
					this.citysActive = false;
				} else {
					this.citysActive = true;
					this.allButtonActive = false;
					this.mineActive = false;
				}
      },
			resetCategory() {
				this.categorys.forEach((item, index) => {
					item.checked = index === 0;
				});
				this.selectedCategorys = [];
				this.categoryActive = false;
				this.resetSearch();
				this.loadProducts();
			},
			resetCity() {
				this.citys.forEach((item, index) => {
				  item.checked = index === 0;
				});
				this.citysActive = false;
				this.selectedCitys = [];
				this.resetSearch();
				this.loadProducts();
			},
			resetPrice() {
				this.min_price = '';
				this.max_price = '';
				this.priceActive = false;
				this.resetSearch();
				this.loadProducts()
			},
      // 主营类别筛选完成
      handleBusTypeFilterSubmit() {
        this.filterActiveIndex = -1;
				// this.selectedCategorys = [];
				let items = this.categorys.filter((item, index) => {
					return item.checked;
				})
				// this.categoryActive = false;
				let ids = _.map(items, 'id');
				let categoryIds = (ids === 0) ? '' : _.toString(ids);
				this.categoryIds = categoryIds;
				console.log('handleBusTypeFilterSubmit2 === ', this.categoryIds)
				this.loadProducts()
      },
      // 主营类别筛选框关闭
      handleBusTypeFilterPopupClose() {
        if (this.filterActiveIndex === 3) {
          this.filterActiveIndex = -1;
        }
      },
      // 主营类别筛选项点击事件
      handleBusTypeFilterItemTap(item, index) {
        if (this.categorys.indexOf(item) === 0) {
          item.checked = true;
          this.categorys.forEach(region => {
            region.checked = false;
          });
					this.categoryActive = false;
					console.log('fuck1 ==== ');
					this.selectedCategorys = [];
        } else {
					this.categoryActive = true;
          if (this.categorys[0].checked) {
						console.log('fuck2 ==== ');
            this.categorys[0].checked = false;
          } else {
						console.log('fuck3 ==== ');
					}
        }
        item.checked = !item.checked;
				
				if (item.checked) {
					this.selectedCategorys.push(item);
				} else {
					this.selectedCategorys.splice(item, 1);
				}
				
				if (this.selectedCategorys.length === 0) {
					this.categoryActive = false;
				} else {
					this.allButtonActive = false;
					this.mineActive = false;
				}
      }, 
      goProductDetailPage(item) {
				let type = 0;
				if (this.activeTabIndex == 0) {
					type = 1; //清货
				} else {
					type = 2; //寻货
				}
				console.log('goProductDetailPage  item == =', item);
				uni.navigateTo({
					url: '/pages/product-detail/product-detail?id=' + item.id + '&type=' + type
				});
      }
    },
	}
</script>

<style lang="scss">
  @import '@/common/scss/mixin.scss';
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
	
  .page-container {
    padding-top: 276rpx;
    background: #fff;;
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
    // height: 180rpx;
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
  
  // filter
  .c-filter-list {
    border-radius: 20rpx 20rpx 0 0;
    background: #fff;
    height: 78rpx;
    padding: 0 32rpx;
    overflow-x: scroll;
    white-space: nowrap;
    @include thin-line-bottom(#EEEEEE, 0, 0);
  }
  .c-filter-item {
    height: 78rpx;
    line-height: 78rpx;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: 54rpx;
  }
  .c-filter-item--selected .c-filter-item__label {
    color: #FA6400;
  }
  .c-filter-item--active .c-filter-item__icon {
    transform: rotate3d(0, 0, 1, -180deg);
  }
  .c-filter-item__label {
    color:rgba(15,3,20,0.85);
    font-size: 30rpx;
    line-height: 1;
    font-weight: bold;
  }
  .c-filter-item__icon {
    width: 36rpx;
    height: 36rpx;
    transition: all .3s;
  }
  
  // 商品列表
  .c-product-list {
    background: #fff;
    display: flex;
    flex-wrap: wrap;
    padding: 24rpx;
    justify-content: space-between;
  }
  .c-product-item {
    width: 340rpx;
    border-radius: 12rpx;
    box-shadow:0px 0px 6rpx 0px rgba(0,0,0,0.2);
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
    color:rgba(15,3,20,0.65);
    font-size: 30rpx;
    height: 84rpx;
    line-height: 42rpx;
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
    // color:rgba(0,0,0,0.65);
		color: #bdbdbd;
    font-size: 22rpx;
  }
  .c-product-item__price-value {
    // position: relative;
    // padding-left: 22rpx;
    // height: 40rpx;
    // line-height: 40rpx;
    // color: #FA6400;
    // font-size: 26rpx;
		
		height: 40rpx;
		line-height: 40rpx;
		flex: 1;
		color: #fa6400;
		font-weight: bold;
		font-size: 20rpx;
		
  }
  .c-product-item__price-value:before {
    position: absolute;
    font-size: 22rpx;
    content: "￥";
    left: 0;
    top: 0;
    height: 40rpx;
    line-height: 45rpx;
    z-index: 1;
  }
  .c-product-item__price-split {
    padding: 0 10rpx;
    font-size: 22rpx;
    height: 40rpx;
    line-height: 40rpx;
    color: #FA6400;
  }
  
  // tips 
  .c-tips {
    position: fixed;
    left: 0;
    top: 260rpx;
    height: 80rpx;
    z-index: 200;
    background:rgba(38,38,38,0.6);
    border-radius:0px 48rpx 48rpx 0px;
    display: flex;
    align-items: center;
    padding: 0 24rpx;
  }
  .c-tips__image {
    width: 48rpx;
    height: 48rpx;
    border-radius: 50%;
  }
  .c-tips__label {
    padding-left: 12rpx;
    height: 45rpx;
    font-size: 32rpx;
    font-weight: 400;
    color: rgba(255,255,255,1);
    line-height: 45rpx;
  }
  // 新增清货popover
  .c-add-popover {
    position: fixed;
    z-index: 1000;
    right: 24rpx;
    top: 72rpx;
    padding-top: 20rpx;
    transition: all .3s;
    opacity: 0;
    visibility: hidden;
    background: transparent;
  }
  .c-add-popover--visible {
    visibility: visible;
    opacity: 1;
  }
  .c-add-popover__inner {
    position: relative;
    width: 248rpx;
    background:rgba(255,255,255,0.85);
    box-shadow:0rpx 0rpx 6rpx 0rpx rgba(0,0,0,0.5);
    padding: 20rpx 0;
    border-radius: 6rpx;
  }
  .c-add-popover__inner:after {
    position: absolute;
    right: 12rpx;
    top: -20rpx;
    z-index: 10;
    content: "";
    width: 0;
    height: 0;
    border-left: 20rpx solid transparent;
    border-right:20rpx solid transparent;
    border-bottom:20rpx solid rgba(255,255,255,0.85);
;
   }
  .c-add-popover-item {
    padding: 0 20rpx;
    height: 98rpx;
    line-height: 98rpx;
    font-size: 30rpx;
    color: rgba(15,3,20,1);
    text-align: center;
  }
  .c-add-popover-item:not(:last-child) {
    @include thin-line-bottom(#D5D5D5, 20rpx, 20rpx);
  }

  // filter popup
  .c-filter-popup .sg-popup--top {
    top: 272rpx;
  }
  .c-filter-popup__inner {
    height: 304rpx;
    // padding: 24rpx 40rpx 20rpx;
		padding: 24rpx 0rpx 20rpx 40rpx;
  }
  .c-filter-popup__footer {
    height: 100rpx;
    padding: 0 56rpx 24rpx;
    display: flex;
    justify-content: space-between;
  }
  .c-filter-popup__reset {
    height: 72rpx;
    line-height: 72rpx;
    background: rgba(217,217,217,1);
    border-radius: 4rpx;
    color: #fff;
    font-size: 26rpx;
    font-weight: bold;
    width: 202rpx;
  }
  
  .c-filter-popup__submit {
    border-radius: 4rpx;
    width: 342rpx;
    height: 72rpx;
    line-height: 72rpx;
    font-size: 26rpx;
    font-weight: bold;
  }
  
  // 价格筛选框
  .c-price-filter-title {
    height: 42rpx;
    font-size: 30rpx;
    font-weight: 400;
    color: rgba(0,0,0,0.65);
    line-height: 42rpx;
  }
  
  .c-price-filter-range {
    display: flex;
    align-items: center;
    margin-top: 24rpx;
  }
  .c-price-filter-range__input {
    width: 210rpx;
    height: 64rpx;
    line-height: 64rpx;
    min-height: 64rpx;
    background: #F4F5F6;
    border-radius: 32rpx;
    color: #262626;
    text-align: center;
    font-size: 30rpx;
  }
  .c-price-filter-range__placeholder {
    color: #BDBDBD;
    font-size: 30rpx;
  }
  .c-price-filter-range__split {
    width: 104rpx;
    margin: 0 20rpx;
    height: 1px;
    background: rgba(189,189,189,1);
  }
  
  // filter tag
  .c-filter-tags {
    display: flex;
    flex-wrap: wrap;
    margin-right: -41rpx;
    margin-bottom: -44rpx;
  }
  .c-filter-tag {
    // width: 136rpx;
    height: 64rpx;
    line-height: 64rpx;
    background: #F4F5F6;
    border: 1px solid rgba(213,213,213,1);
    border-radius: 10rpx;
    color: #999999;
    text-align: center;
    margin-right: 41rpx;
    margin-bottom: 44rpx;
  }
  .c-filter-tag--active {
    background: #FA6400;
    color: #fff;
    border: none;
    font-weight: bold;
  }
  .c-product_mask {
  	position: absolute;
  	right: 0;
  	top: 0;
  	z-index: 1;
  	background: #FA6400;
  	border-radius: 12rpx;
  	height: 50rpx;
  	min-width: 75rpx;
  	text-align: center;
  	line-height: 50rpx;
  	padding: 0 15rpx;
  	color: #FFFFFF;
  	font-size: 35rpx;
  }
  .f-product_mask {
  	position: absolute;
  	right: 0;
  	top: 0;
  	z-index: 1;
  	background: #44D7B6;
  	border-radius: 12rpx;
  	height: 50rpx;
  	min-width: 75rpx;
  	text-align: center;
  	line-height: 50rpx;
  	padding: 0 15rpx;
  	color: #FFFFFF;
  	font-size: 35rpx;
  }
  .c-product-item-stalls{
  	display: flex;
  	padding-top: 10rpx;
  }
  .c-product-item-stalls-label{
  	padding-left: 15rpx;
  	font-size: 28rpx;
  	color:#BDBDBD; 
  }
  .c-product-item-stalls-model-l{
  	padding-right: 5rpx;
  	margin-left: auto;
  	font-size: 28rpx;
  	color:#BDBDBD; 
  }
  .c-product-item-stalls-model{
  	margin-right: 15rpx;
  	font-size: 28rpx;
  	line-height: 28rpx;
  	text-align: center;
  	color:#666666; 
  	border-radius: 10rpx;
  	// border-color: #000000;
  	// border-width: 2rpx;
  	border: 1px solid #eee;
  }
	
	.c-product-item-city-label {
		height: 35rpx;
		padding-left: 15rpx;
		font-size: 28rpx;
		color: #bdbdbd;
	}
</style>
