<template>
	<view class="page-container">
		<view class="c-header">
      <!-- 搜索 -->
      <sg-search placeholder="输入商品名称搜索" @search="handleSearch"></sg-search>
    </view>
    
    <!-- 库存标题 -->
    <view class="c-title">
      <view class="c-title__line"></view>
      <view class="c-title__content">{{type === 3 ? '七天新品数据' : '店铺库存'}}</view>
      <view class="c-title__line"></view>
    </view>
    
    <!-- 商品列表 -->
    <view class="c-product-list">
      <view class="c-product" v-for="item in productList" :key="item.id" @tap="handleProductTap(item)">
        <image class="c-product__image" :src="item.img" mode="aspectFill"></image>
        <view class="c-product__check" :class="{'c-product__check--checked': item.checked}" @tap.stop="handleProductCheckboxTap(item)">
          <image v-if="item.checked" class="c-product__checkbox" src="../../static/common/ic_checked@2x.png" mode="aspectFill"></image>
        </view>
        <view class="c-product__content">
          <view class="c-product__title">{{item.style}}</view>
          <view class="c-product-price">
            <view class="c-product-price__label">价格：</view>
            <view class="c-product__price__val">{{item.fac_price}}</view>
            <view class="c-product__price__split">~</view>
            <view class="c-product__price__val">{{item.market_price}}</view>
          </view>
        </view>
      </view>
    </view>
		
		<view class="loading">{{ loadingText }}</view>
    
    <!-- footer -->
    <view class="c-footer">
      <button class="sg-button sg-button--square c-footer-btn" type="primary" @tap="submit">{{type === 3 ? '发布新品共享' : '发布库存共享'}}</button>
    </view>
    
	</view>
</template>

<script>
	import { GetAllianceTypeListApi ,AllianceBatchShareApi , AllianceShareApi ,GroupProductListApi} from '../../api/index.js';
	import _ from 'lodash'
	export default {
		data() {
			return {
				alliance_id:'',
				store_id:'',
        type: 1, // 发布类型，1：发布库存共享 3：发布新品共享 2：补货共享
				newest:'',//用于请求新品共享列表 传1
				stock_num:'',//用于请求补货列表 传0
				startPage:1,
				totalPage:1,
				productList:[],
				searchTitle:'',
				loadingText: '加载中...',
			};
		},
    methods: {
			
			getProductList(){
				///store_id 当前店铺id;title 商品名(用于筛选);page 页码 ;newest 新品共享,固定传 1 ; stock_num 补货共享,固定传 0;uid
				GetAllianceTypeListApi(this.store_id,this.searchTitle, this.startPage, this.newest, this.stock_num,this.uid)
				.then(res => {
					let toConcatArr = res.data.data;
          for(let i = 0; i < toConcatArr.length; i++) {
						toConcatArr[i].checked = false;
					}
					this.productList = this.productList.concat(toConcatArr);
					this.totalPage = res.data.last_page;
					console.log('get GetAllianceTypeshareListApi success', res);
					if(this.startPage >= this.totalPage){
						this.loadingText = '没有更多了~';
					}
					if(this.productList.length <= 0){
						this.loadingText = '什么都没有发现哦';
					}
					
				})
				.catch(err => {
					console.log('get GetAllianceTypeshareListApi error', err);
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					});

				});
				
				
				// GroupProductListApi(this.allianceID, this.startPage, this.type, this.store_id,this.uid) //getApp().globalData.uid
				// 	.then(res => {
				
				// 	let toConcatArr = res.data.data;
				//       for(let i = 0; i < toConcatArr.length; i++) {
				// 				toConcatArr[i].checked = false;
				// 			}
				// 			this.productList = this.productList.concat(toConcatArr);
				// 		this.totalPage = res.data.last_page;
				// 		console.log('get GroupProductListApi success', res);
				// 		if(this.startPage >= res.data.last_page){
				// 			this.loadingText = '没有更多了~';
				// 		}
						
				// 	})
				// 	.catch(err => {
				// 		console.log('get GroupProductListApi error', err);
				// 		uni.showToast({
				// 			title: err,
				// 			icon: 'none'
				// 		});
				// 	});
				
			},
			
			handleSearch(val) {
				console.log(val);
				this.searchTitle = val;
				this.loadingText = '加载中...';
				this.startPage = 1;
				this.productList = [];
				this.getProductList();
			},
			
			//这里是否需要可以点击看详情呢？=====
      handleProductTap(product) {
        // uni.navigateTo({
        //   url: '/pages/product-detail/product-detail'
        // })
      },
			
			
      handleProductCheckboxTap(product) {
        product.checked = !product.checked;
				console.log('选择后的列表数据====',this.productList);
      },
			
			
      submit() {
				
				const this_type = this.type;
				const this_groupid = this.alliance_id;
				const products = this.productList.filter(x => x.checked);
					const ret = _.map(products, (item, index) => {
						return _.pick(item, ['id', 'trade_price'])
					})
					let list = [];
					_.forEach(ret, (item, idx) => {
						list.push({
							product_stock_id: item.id,
							group_id:this_groupid,
							min_price:item.fac_price,
							max_price: item.market_price,
							type:this_type,
						})
					})
					
					console.log('share list == ',list);
					AllianceBatchShareApi(this.uid, list).then(result => {
						console.log('AllianceBatchShareApi ret === ', result);
						if(result.code == 1){
						  uni.navigateBack();
						}
					})
					.catch(err => {
						console.log('AllianceBatchShareApi err === ', err);
						uni.showToast({
							title:'失败' + err,
							icon: 'none'
						})
					})

				
      },
			
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
		
		
    onLoad(options) {
      this.type = Number(options.type);
			this.alliance_id = options.allianceID;
			this.store_id = this.userInfo.current_outlet_id;
			if(this.type == 2){ //2：补货
				this.newest ='';//用于请求新品共享列表 传1
				this.stock_num = 0;//用于请求补货列表 传0
			}
			if(this.type == 3){ //3：新品
				this.newest = 1;//用于请求新品共享列表 传1
				this.stock_num ='';//用于请求补货列表 传0
			}
			
			this.getProductList();
			
    },
		
		
		onReachBottom() {
			if (Number(this.startPage) >= Number(this.totalPage)) {
				this.loadingText = '没有更多了~';
			} else {
				this.startPage += 1;
				this.getProductList();
			}
		},
	}
</script>

<style lang="scss">
  @import '@/common/scss/mixin.scss';
	.loading {
		text-align: center;
		line-height: 60px;
	}
  .page-container {
    padding-top: 120rpx;
    padding-bottom: 98rpx;
		flex-direction: column;
  }
  .c-header {
    position: fixed;
    z-index: 100;
    left: 0;
    right: 0;
    top: 0;
    height: 120rpx;
    width: 100%;
    background: #F4F5F6;
    padding: 24rpx;
  }
  // 标题
  .c-title {
    height: 45rpx;
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
  .c-product-list {
    padding: 24rpx;
  }
  .c-product {
    display: flex;
    background: #fff;
    padding: 24rpx;
    border-radius: 10rpx;
    position: relative;
  }
  .c-product + .c-product {
    margin-top: 24rpx;
  }
  .c-product__image {
    width: 180rpx;
    height: 180rpx;
    border-radius: 6rpx 6rpx 0 0;
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
  .c-product-price {
    display: flex;
    align-items: center;
    margin-top: 39rpx;
  }
  .c-product-price__label {
    height: 34rpx;
    font-size: 24rpx;
    font-weight: 400;
    color: rgba(0,0,0,0.65);
    line-height: 34rpx;
  }
  .c-product__price__val {
    position: relative;
    padding-left: 22rpx;
    height: 40rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: rgba(250,100,0,1);
    line-height: 40rpx;
    display: flex;
    align-items: center;
  }
  .c-product__price__val:before {
    position: absolute;
    content: "￥";
    left: 0;
    top: 0;
    height: 40rpx;
    line-height: 45rpx;
    font-size: 22rpx;
    display: inline-block;
    color: #FA6400;
  }
  .c-product__price__split {
    color: #FA6400;
    padding: 0 10rpx;
    font-size: 22rpx;
    height: 40rpx;
    line-height: 40rpx;
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
