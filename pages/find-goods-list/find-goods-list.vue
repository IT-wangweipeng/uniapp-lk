<template>
	<view class="page-container">
		<view class="c-header">
		  <view class="c-search">
        <sg-search placeholder="输入商品名称搜索" @search="handleSearch"></sg-search>
      </view>
      <!-- 类别 -->
      <view class="c-tabs">
        <view class="c-tab" :class="{'c-tab--active': type === 1}" @tap="handleTabTap(1)">联盟记录</view>
        <view class="c-tab" :class="{'c-tab--active': type === 2}" @tap="handleTabTap(2)">寻货宝记录</view>
      </view>
		</view>
    <view class="c-product-list">
      <!-- 产品 -->
      <view class="c-product">
        <view class="c-product__inner">
          <image class="c-product__image" src="../../static/demo/product.jpeg" mode="aspectFill"></image>
          <view class="c-product__content">
            <view class="c-product__title">商品名称商品名称商品名称商品名称商品名称商品名称</view>
            <view class="c-product__views">浏览量：56</view>
            <view class="c-product__stock">求购数量：99</view>
            <view class="c-product__status c-product__status--verifying">审核中</view>
          </view>
        </view>
        <view class="c-product__footer">
          <view class="c-product__btn" @tap="goSupplyListPage">查看供货</view>
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
            <view class="c-product__stock">求购数量：99</view>
            <view class="c-product__status c-product__status--offline">已下架</view>
          </view>
        </view>
        <view class="c-product__footer">
          <view class="c-product__btn">查看供货</view>
          <view class="c-product__btn">再次寻货</view>
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
            <view class="c-product__stock">求购数量：99</view>
            <view class="c-product__status c-product__status--online">寻货中</view>
          </view>
        </view>
        <view class="c-product__footer">
          <view class="c-product__btn">查看供货</view>
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
            <view class="c-product__views"></view>
            <view class="c-product__stock">求购数量：99</view>
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
				type: 1, // 类型
			};
		},
    methods: {
      handleSearch(text) {
        
      },
      handleTabTap(type) {
        this.type = type;
      },
      // 供货列表
      goSupplyListPage() {
        uni.navigateTo({
          url: '/pages/supply-list/supply-list'
        });
      }
    },
    onLoad() {
      
    }
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
    padding: 0 24rpx;
  }
  .c-search {
    padding-top: 24rpx
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
    min-height: calc(100vh - 198rpx);
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
