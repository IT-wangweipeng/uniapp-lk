<template>
	<view class="page-container">
		<view class="c-header">
		  <sg-search placeholder="输入型号或档口搜索库存" @search="handleSearch"></sg-search>
		</view>
    <view class="c-product-list">
      <!-- 产品 -->
      <view class="c-product">
        <view class="c-product__inner">
          <image class="c-product__image" src="../../static/demo/product.jpeg" mode="aspectFill"></image>
          <view class="c-product__content">
            <view class="c-product__title">商品名称商品名称商品名称商品名称商品名称商品名称</view>
            <view class="c-product__views">浏览量：56</view>
            <view class="c-product__stock">库存数量：99</view>
            <view class="c-product__status c-product__status--verifying">审核中</view>
          </view>
        </view>
        <view class="c-product__footer">
          <view class="c-product__btn">一键取消</view>
          <view class="c-product__btn">删除</view>
          <view class="c-product__btn c-product__btn--primary">编辑</view>
        </view>
      </view>
      
      <view class="c-product">
        <view class="c-product__inner">
          <image class="c-product__image" src="../../static/demo/product.jpeg" mode="aspectFill"></image>
          <view class="c-product__content">
            <view class="c-product__title">商品名称商品名称商品名称商品名称商品名称商品名称</view>
            <view class="c-product__views">浏览量：56</view>
            <view class="c-product__stock">库存数量：99</view>
            <view class="c-product__status c-product__status--offline">已下架</view>
          </view>
        </view>
        <view class="c-product__footer">
          <view class="c-product__btn">再次清货</view>
          <view class="c-product__btn">删除</view>
          <view class="c-product__btn c-product__btn--primary">编辑</view>
        </view>
      </view>
      
      <view class="c-product">
        <view class="c-product__inner">
          <image class="c-product__image" src="../../static/demo/product.jpeg" mode="aspectFill"></image>
          <view class="c-product__content">
            <view class="c-product__title">商品名称商品名称商品名称商品名称商品名称商品名称</view>
            <view class="c-product__views">浏览量：56</view>
            <view class="c-product__stock">库存数量：99</view>
            <view class="c-product__status c-product__status--online">清货中</view>
          </view>
        </view>
        <view class="c-product__footer">
          <view class="c-product__btn">一键取消</view>
          <view class="c-product__btn">删除</view>
          <view class="c-product__btn c-product__btn--primary">编辑</view>
        </view>
      </view>
      
      <view class="c-product">
        <view class="c-product__inner">
          <image class="c-product__image" src="../../static/demo/product.jpeg" mode="aspectFill"></image>
          <view class="c-product__content">
            <view class="c-product__title">商品名称商品名称商品名称商品名称商品名称商品名称</view>
            <view class="c-product__views">浏览量：56</view>
            <view class="c-product__stock">库存数量：99</view>
            <view class="c-product__status c-product__status--notpass">未通过</view>
          </view>
        </view>
        <view class="c-product__footer">
          <view class="c-product__btn">查看原因</view>
          <view class="c-product__btn">重新提交</view>
          <view class="c-product__btn">删除</view>
          <view class="c-product__btn c-product__btn--primary">编辑</view>
        </view>
      </view>
      
      
    </view>
    
    
    
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
    methods: {
      handleSearch(text) {
        
      }
    },
    onLoad() {
      
    }
	}
</script>

<style lang="scss">
  @import '@/common/scss/mixin.scss';
  .page-container {
    padding-top: 120rpx;
  }
  .c-header {
    position: fixed;
    z-index: 100;
    left: 0;
    right: 0;
    top: 0;
    width: 100%;
    background: #F4F5F6;
    padding: 24rpx;
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
    color: #EF4345;
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
