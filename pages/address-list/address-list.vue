<template>
	<view class="page-container">
		<view v-if="addressList.length === 0" class="c-nodata">
      <image class="c-nodata__image" src="../../static/common/ic_nodata@2x.png" mode="aspectFill"></image>
      <view class="c-nodata__label">您还没有添加收货地址</view>
    </view>
    
    <view class="c-address">
      <view class="c-address__header">
        <image class="c-address__icon" src="../../static/common/ic_location@2x.png" mode="aspectFill"></image>
        <view class="c-address__title">收货地址</view>
      </view>
			
			
      <view @tap="tapAddress(item, index)" v-for="(item, index) in addressList" :key="index" class="c-address__content">
        <view class="c-address__name">{{item.province}}{{item.city}}{{item.area}}</view>
        <view class="c-address__label">{{item.address}}</view>
        <view class="c-address__label">{{item.realname}} | {{item.mobile}}</view>
        <view class="c-address__tag" v-if="item.isdefault === 1" >{{'默认'}}</view>
        <image class="c-address__edit" src="../../static/problem/ic_ic_edit@2x.png" mode="aspectFill" @tap.stop="" @tap="goEditAdressPage(item)"></image>
        <image class="c-address__delete" src="../../static/common/ic_delete@2x.png" mode="aspectFill" @tap.stop="" @tap="deleteAddress(item, index)"></image>
      </view>
    </view>
    
    
    <!-- footer -->
    <view class="c-footer">
      <button class="sg-button c-footer__btn" type="primary" @tap="goEditAdressPage()">添加新收货地址</button>
    </view>
    
	</view>
</template>

<script>
	import {UserAddressListApi, DelateAddressApi, SetDefaultAddressApi} from "../../api/index.js"
	export default {
		data() {
			return {
				uid: getApp().globalData.uid,
				addressList: [],
				canSelected: true,
			};
		},
		onLoad(opt) {
			const canSelected = parseInt(opt.canSelected);
			this.canSelected = (canSelected === 1)
			
			this.loadAddressList()
			uni.$on('refreshList', (e) => {
				console.log('e ==== ', e)
				this.loadAddressList();
			})
		},
		onUnload() {
			uni.$off('refreshList')
		},
    methods: {
			loadAddressList() {
				UserAddressListApi(this.uid).then(ret => {
					console.log('UserAddressListApi ret === ', ret)
					if (ret.data && ret.data.data) {
						this.addressList = ret.data.data
					}
				})
				.catch(err => {
					console.log('UserAddressListApi err === ', err)
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					})
				})
			},
			tapAddress(item, index) {
				if (!this.canSelected) {
					return;
				}
				SetDefaultAddressApi(this.uid, item.id).then(ret => {
					console.log('SetDefaultAddressApi ret === ', ret);
					uni.navigateBack({})
				})
				.catch(err => {
					console.log('SetDefaultAddressApi err === ', err);
				})
			},
      // 前往新增/编辑地址页面
      goEditAdressPage(item) {
				let url = '/pages/edit-address/edit-address';
				if (item != undefined) {
					url = `${url}?id=${item.id}`;
				}
        uni.navigateTo({
          url: url,
        });
      },
			// 删除地址
			deleteAddress(item, index) {
				DelateAddressApi(this.uid, item.id).then(ret => {
					console.log('DelateAddressApi ret === ', ret)
					this.addressList.splice(index, 1)
					uni.showToast({
						title: '删除成功',
						icon: 'success'
					})
				})
				.catch(err => {
					console.log('DelateAddressApi err === ', err)
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					})
				})
			}
    }
	}
</script>

<style lang="scss">
  @import '@/common/scss/mixin.scss';
  .page-container {
    background: #fff;
    padding-bottom: 120rpx;
  }
  // 无数据显示
  .c-nodata {
    position: fixed;
    left: 0;
    right: 0;
    top: 50%;
    z-index: 1;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .c-nodata__image {
    display: block;
    width: 330rpx;
    height: 224rpx;
  }
  .c-nodata__label {
    margin-top: 30rpx;
    height: 46rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: rgba(13,19,13,0.45);
    line-height: 46rpx;
  }
  
  // footer 
  .c-footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 120rpx;
    background: #FFFFFF;
    z-index: 100;
    padding: 0 64rpx 32rpx;
  }
  .c-footer__btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    font-size: 34rpx;
    font-weight: bold;
    color: rgba(255,255,255,1);
  }
  
  // 地址
  .c-address {
    background: #fff;
  }
  .c-address__header {
    height: 102rpx;
    line-height: 102rpx;
    display: flex;
    align-items: center;
    padding: 0 40rpx;
    @include thin_line_bottom(#E7EBEA, 30rpx, 30rpx);
  }
  .c-address__icon {
    display: block;
    width: 40rpx;
    height: 40rpx;
  }
  .c-address__title {
    height: 40rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: rgba(13,19,13,0.65);
    line-height: 40rpx;
    padding-left: 11rpx;
  }
  .c-address__content {
    position: relative;
    padding: 32rpx 40rpx;
    padding-right: 200rpx;
    @include thin_line_bottom(#E7EBEA, 30rpx, 30rpx);
  }
  .c-address__name {
    height: 45rpx;
    font-size: 32rpx;
    font-weight: bold;
    color: rgba(13,19,13,1);
    line-height: 45rpx;
    @include ellipsis(1);
  }
  .c-address__label {
    margin-top: 14rpx;
    height: 40rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: rgba(13,19,13,1);
    line-height: 40rpx;
    opacity: 0.65;
    @include ellipsis(1);
  }
  .c-address__tag {
    position: absolute;
    top: 36rpx;
    right: 40rpx;
    z-index: 1;
    height: 37rpx;
    line-height: 37rpx;
    padding: 0 16rpx;
    background:rgba(213,213,213,1);
    border-radius:4rpx;
    color: #fff;
    font-size: 26rpx;
    font-weight: 400;
  }
  .c-address__edit {
    position: absolute;
    width: 64rpx;
    height: 64rpx;
    right: 128rpx;
    bottom: 30rpx;
    z-index: 1;
  }
  .c-address__delete {
    position: absolute;
    width: 64rpx;
    height: 64rpx;
    right: 40rpx;
    bottom: 30rpx;
    z-index: 1;
  }
  .c-address__edit:active,
  .c-address__delete:active {
    opacity: 0.6;
  }
</style>
