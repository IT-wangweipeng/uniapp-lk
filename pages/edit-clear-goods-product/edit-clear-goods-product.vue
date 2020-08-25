<template>
	<view class="page-container">
		<view class="c-product">
      <image class="c-product__image" :src="info.img"></image>
      <view class="c-product__content">
        <view class="c-product__title">{{info.title}}</view>
      </view>
    </view>
    
    <view class="c-cell-list">
			<view class="c-cell-list__title"></view>
      <view class="c-cell">
        <view class="c-cell__title">商品分类</view>
        <view class="c-cell__val">{{info.category}}</view>
      </view>
      <view class="c-cell">
        <view class="c-cell__title">档口号</view>
        <view class="c-cell__val">{{info.stalls}}</view>
      </view>
      <view class="c-cell">
        <view class="c-cell__title">求购数量</view>
        <view class="c-cell__val">{{info.stock_num}}</view>
      </view>
    </view>
    
    <view class="c-cell-list">
      <view class="c-cell-list__title"></view>
      <view class="c-cell">
        <view class="c-cell__title">最低价</view>
        <view class="c-cell__val">{{info.trade_price }}</view>
      </view>
      <view class="c-cell">
        <view class="c-cell__title">最高价</view>
        <view class="c-cell__val">{{info.market_price}}</view>
      </view>
      <view class="c-cell">
        <view class="c-cell__title">规格</view>
        <view class="c-cell__val">{{info.p_size}} {{info.p_color}}</view>
      </view>
      <view class="c-textarea-cell">
        <view class="c-textarea-cell__title">商品信息</view>
        <view class="c-textarea-cell__val"></view>
      </view>
    </view>
    
	</view>
</template>

<script>
	import {ProductDetailApi} from '../../api/index.js'
	export default {
		data() {
			return {
				uid: getApp().globalData.uid,
				info: {}
			};
		},
		onLoad(opt) {
			const {id} = opt
			ProductDetailApi(this.uid, id).then(ret => {
				console.log('ProductDetailApi ret === ', ret);
				if (ret.data && ret.data.vo) {
					this.info = ret.data.vo;
				} else {
					uni.showToast({
						title: '无商品信息',
						icon: 'none'
					})
				}
			})
			.catch(err => {
				console.log('ProductDetailApi err === ', err)
				uni.showToast({
					title: '失败' + err,
					icon: 'none'
				})
			})
		},
    methods: {
    }
	}
</script>

<style lang="scss">
  @import '@/common/scss/mixin.scss';
  .c-product {
    position: relative;
    padding: 24rpx;
    display: flex;
    background: #FFFFFF;
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
    font-weight:400;
    color:rgba(102,102,102,1);
    line-height:45rpx;
    @include ellipsis(2);
  }
  
  // cell
  .c-cell-list__title {
    height: 20rpx;
    line-height: 20rpx;
    background: rgba(244,245,246,1);
    box-shadow: 0rpx 2rpx 0rpx 0rpx rgba(244,245,246, 1);
    font-size: 30rpx;
    font-weight: 400;
    color: rgba(153,153,153,1);
    padding: 0 24rpx;
  }
  .c-cell {
    display: flex;
    height: 100rpx;
    background: #fff;
    padding: 0 24rpx;
    align-items: center;
    @include thin_line_bottom(#F4F5F6, 0, 0);
  }
  .c-cell__title {
    width: 144rpx;
    height: 46rpx;
    font-size: 30rpx;
    font-weight: 400;
    color: rgba(102,102,102,1);
    line-height: 46rpx;
    @include ellipsis(1);
  }
  .c-cell__val {
    flex: 1;
    height: 46rpx;
    font-size: 30rpx;
    font-weight: 400;
    color: rgba(153,153,153,1);
    line-height: 46rpx;
    text-align: right;
    @include ellipsis(1);
  }
  
  .c-textarea-cell {
    background: #fff;
    padding: 24rpx;
  }
  .c-textarea-cell__title {
    height: 46rpx;
    font-size: 30rpx;
    font-weight: 400;
    color: rgba(102,102,102,1);
    line-height: 46rpx;
  }
  .c-textarea-cell__val {
    font-size: 30rpx;
    line-height: 46rpx;
    font-weight:400;
    color: #BDBDBD;
    min-height: 140rpx;
    margin-top: 16rpx;
  }
  
</style>
