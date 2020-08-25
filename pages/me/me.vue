<template>
	<view class="page-container">
    <!-- 用户信息 -->
		<view class="c-header">
      <view class="c-header__bg"></view>
      <view class="c-userinfo">
        <image class="c-userinfo__portrait" :src="portraitUrl" mode="aspectFill" @tap="choosePortrait()"></image>
        <view class="c-userinfo__content">
          <view class="c-userinfo__name">
           {{userInfo.nickname}}
            <image class="c-userinfo__arrow" src="../../static/common/ic_arrow_right_gury@2x.png" mode="aspectFill" @tap="editNickname"></image>
          </view>
          <view class="c-userinfo-amount">
            <view class="c-userinfo-amount__label">余额</view>
            <view class="c-userinfo-amount__val">{{balance}}</view>
            <view class="c-userinfo-amount__btn c-userinfo-amount__btn--active" @tap="go('/pages/recharge/recharge')">充值</view>
          </view>
          <view class="c-userinfo-amount">
            <view class="c-userinfo-amount__label">可提现余额</view>
            <view class="c-userinfo-amount__val">{{can_withdraw_balance}}</view>
            <view class="c-userinfo-amount__btn" @tap="go('/pages/withdraw-deposit/withdraw-deposit')">提现</view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 列表 -->
    <view class="c-cell-list">
      <view class="c-cell" @tap="go('/pages/my-alliance/my-alliance')">
        <image class="c-cell__icon" src="../../static/me/ic_alliance@2x.png" mode="aspectFill"></image>
        <view class="c-cell__title">联盟管理</view>
        <image class="c-cell__arrow" src="../../static/common/ic_arrow_right_gury@2x.png" mode="aspectFill"></image>
      </view>
      <view class="c-cell" @tap="go('/pages/buyer-order-list/buyer-order-list')">
        <image class="c-cell__icon" src="../../static/me/ic_order_manage@2x.png" mode="aspectFill"></image>
        <view class="c-cell__title">订单管理</view>
        <image class="c-cell__arrow" src="../../static/common/ic_arrow_right_gury@2x.png" mode="aspectFill"></image>
      </view>
      <view class="c-cell" @tap="go('/pages/message-list/message-list')">
        <image class="c-cell__icon" src="../../static/me/ic_message@2x.png" mode="aspectFill"></image>
        <view class="c-cell__title">消息中心</view>
        <image class="c-cell__arrow" src="../../static/common/ic_arrow_right_gury@2x.png" mode="aspectFill"></image>
      </view>
      <view class="c-cell" @tap="go('/pages/bind-phone/bind-phone')">
        <image class="c-cell__icon" src="../../static/me/ic_phone@2x.png" mode="aspectFill"></image>
        <view class="c-cell__title">手机绑定</view>
        <image class="c-cell__arrow" src="../../static/common/ic_arrow_right_gury@2x.png" mode="aspectFill"></image>
      </view>
      <view class="c-cell" @tap="go('/pages/forget-password/forget-password?type=2')">
        <image class="c-cell__icon" src="../../static/me/ic_password@2x.png" mode="aspectFill"></image>
        <view class="c-cell__title">密码修改</view>
        <image class="c-cell__arrow" src="../../static/common/ic_arrow_right_gury@2x.png" mode="aspectFill"></image>
      </view>
      <view class="c-cell" @tap="go('/pages/address-list/address-list?canSelected=0')">
        <image class="c-cell__icon" src="../../static/me/ic_address@2x.png" mode="aspectFill"></image>
        <view class="c-cell__title">收货地址设置</view>
        <image class="c-cell__arrow" src="../../static/common/ic_arrow_right_gury@2x.png" mode="aspectFill"></image>
      </view>
      <view class="c-cell" @tap="go('/pages/seller-order-list/seller-order-list')">
        <image class="c-cell__icon" src="../../static/me/ic_send@2x.png" mode="aspectFill"></image>
        <view class="c-cell__title">店铺发货管理</view>
        <image class="c-cell__arrow" src="../../static/common/ic_arrow_right_gury@2x.png" mode="aspectFill"></image>
      </view>
      <view class="c-cell" @tap="go('/pages/supply-record/supply-record')">
        <image class="c-cell__icon" src="../../static/me/ic_record@2x.png" mode="aspectFill"></image>
        <view class="c-cell__title">供货记录</view>
        <image class="c-cell__arrow" src="../../static/common/ic_arrow_right_gury@2x.png" mode="aspectFill"></image>
      </view>
      <view class="c-cell" @tap="openFindGoodsModal">
        <image class="c-cell__icon" src="../../static/me/ic_find_goods@2x.png" mode="aspectFill"></image>
        <view class="c-cell__title">寻货宝管理</view>
        <image class="c-cell__arrow" src="../../static/common/ic_arrow_right_gury@2x.png" mode="aspectFill"></image>
      </view>
      <view class="c-cell" @tap="go('/pages/problem-list/problem-list')">
        <image class="c-cell__icon" src="../../static/me/ic_question@2x.png" mode="aspectFill"></image>
        <view class="c-cell__title">常见问题编辑</view>
        <image class="c-cell__arrow" src="../../static/common/ic_arrow_right_gury@2x.png" mode="aspectFill"></image>
      </view>
    </view>
    
    <view class="c-logout-btn" type="default" @tap="goLoginPage">退出登录</view>
    
	</view>
</template>

<script>
	import {GetUserInfoApi ,WithdrawalInfoApi} from '../../api/index.js';
	
	export default {
		data() {
			return {
				portraitUrl: '/static/demo/shop.jpeg',
				can_withdraw_balance: 0,
				balance:0,
				userInfo: getApp().globalData.userInfo,
			};
		},
		onShow() {
			// this.userInfo = getApp().globalData.userInfo;
			console.log('this.userInfo == ',this.userInfo);
			if( this.userInfo && !!this.userInfo.id){
				WithdrawalInfoApi(this.userInfo.id).then(ret => {
						console.log('WithdrawalInfoApi ret ==== ', ret);
						this.balance = ret.data.balance;
						this.can_withdraw_balance = ret.data.can_withdraw_balance;
					})
					.catch(err => {
						console.log('WithdrawalInfoApi err ==== ', err);
						uni.showToast({
							title: '失败' + err,
							icon: 'none'
						});
					});
				//已登录状态
				if(this.userInfo.headimg && this.userInfo.headimg.length > 0){
					this.portraitUrl = this.userInfo.headimg;
				}
				
			} else {
				//登录
				uni.reLaunch({
				  url: '/pages/login/login'
				});
			}
		},
		onLoad() {
			uni.$on('updateUserInfo', () => {
				this.fetchUserInfo();
			})
		},
		onUnload() {
			uni.$off('updateUserInfo')
		},
		
		computed: {
			uid: {
				get() {
					return getApp().globalData.uid;
				}
			},
		},
		
    methods: {
      go(url) {
        uni.navigateTo({
          url
        });
      },
      // 选择头像
      choosePortrait() {
				
				const self = this;
				
        uni.chooseImage({
            count: 1, 
            sizeType: ['original', 'compressed'], 
            sourceType: ['album'],
            success: (res) => {
                console.log(JSON.stringify(res.tempFilePaths));
                self.portraitUrl = res.tempFilePaths[0];
								
								const uploadTask = uni.uploadFile({
									url: 'https://linco.uzipm.com/user/uploadAvatar',
									filePath: this.portraitUrl,
									name: 'headimg',
									formData: {
										uid: self.uid,
									},
									success: function(uploadFileRes) {
										console.log('上传结束', uploadFileRes.data);
										
										//获取用户信息
										GetUserInfoApi(self.uid)
											.then(res => {
												console.log('GetUserInfoApi res ==== ', res);
												if (res.code == 1) {
													getApp().globalData.userInfo = res.data.userinfo;
												}
											})
											.catch(err => {
												console.log('GetUserInfoApi error', err);
											});
										
										
										
									},
									fail: function(err) {
										console.log('上传失败。。。', err);
									}
								});
								
            }
        });
				
				
      },
			fetchUserInfo() {
				//获取用户信息
				GetUserInfoApi(this.uid)
					.then(res => {
						console.log('GetUserInfoApi res ==== ', res);
						if (res.code == 1) {
							getApp().globalData.userInfo = res.data.userinfo;
							this.userInfo = res.data.userinfo;
						}
					})
					.catch(err => {
						console.log('GetUserInfoApi error', err);
					});
			},
			editNickname() {
				uni.navigateTo({
				  url: '/pages/edit-nickname/edit-nickname'
				});
			},
      goLoginPage() {
				uni.removeStorage({
				    key: 'global_user_data',
				    success: function (res) {
				        console.log('uni.removeStorage global_user_data success');
								getApp().globalData.uid = '';
								getApp().globalData.userInfo = {};
								
								uni.reLaunch({
								  url: '/pages/login/login'
								});
				    }
				});
				
      },
      // 打开寻货宝管理选项
      openFindGoodsModal() {
        uni.showActionSheet({
          itemList: ['清货记录', '寻货记录'],
          itemColor: '#353535',
          success: (item) => {
            console.log(item);
            if (item.tapIndex === 0) {
              uni.navigateTo({
                url: '/pages/clear-goods-record/clear-goods-record'
              });
            } else if (item.tapIndex === 1) {
              uni.navigateTo({
                url: '/pages/find-goods-record/find-goods-record?tabIndex=1'
              });
            }
          }
        });
      }
    }
	}
</script>

<style lang="scss">
  @import '@/common/scss/mixin.scss';
  .page-container {
    padding-bottom: 24rpx;
  }
  .c-header {
    position: relative;
    height: 360rpx;
  }
  .c-header__bg {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    z-index: 1;
    height: 180rpx;
    background: #EF4345;
  }
  .c-userinfo {
    position: absolute;
    top: 32rpx;
    left: 24rpx;
    right: 24rpx;
    z-index: 2;
    height: 296rpx;
    background: #fff;
    border-radius: 16rpx;
    padding: 32rpx;
    display: flex;
  }
  .c-userinfo__portrait {
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
  }
  .c-userinfo__content {
    flex: 1;
    padding-left: 40rpx;
  }
  .c-userinfo__name {
    position: relative;
    height: 54rpx;
    font-size: 36rpx;
    color: rgba(13,19,13,1);
    line-height: 54rpx;
    margin-top: 20rpx;
    padding-right: 35rpx;
    @include ellipsis(1);
  }
  .c-userinfo__arrow {
    position: absolute;
    z-index: 1;
    height: 54rpx;
    width: 54rpx;
    display: block;
    top: 0;
    right: -10rpx;
  }
  .c-userinfo-amount {
    margin-top: 24rpx;
    height: 54rpx;
    display: flex;
  }
  .c-userinfo-amount__label {
    line-height: 54rpx;
    font-size: 30rpx;
    font-weight: 400;
    color: rgba(102,102,102,1);
  }
  .c-userinfo-amount__val {
    flex: 1;
    font-size: 35rpx;
    font-weight: bold;
    color: rgba(250,100,0,1);
    line-height: 54rpx;
    padding-left: 24rpx;
  }
  .c-userinfo-amount__btn {
    position: relative;
    width: 120rpx;
    height: 54rpx;
    line-height: 54rpx;
    border-radius: 27rpx;
    font-size: 26rpx;
    font-weight: 400;
    background: #E0E0E0;
    color: #000000;
    text-align: center;
  }
  .c-userinfo-amount__btn:active::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 1;
    border-radius: inherit;
    background: rgba(0, 0, 0, 0.05);
  }
  .c-userinfo-amount__btn--active {
    background: #FA6400;
    color: rgba(255,255,255,1);
  }
  //  列表
  .c-cell {
    height: 110rpx;
    display: flex;
    padding: 0 24rpx;
    align-items: center;
    background: #fff;
  }
  .c-cell:not(:last-child) {
    @include thin-line-bottom(#E7EBEA, 0, 0);
  }
  .c-cell:active {
    background: #F4F5F6;
  }
  .c-cell__icon {
    width: 36rpx;
    height: 36rpx;
  }
  .c-cell__title {
    flex: 1;
    padding-left: 16rpx;
    height: 46rpx;
    font-size: 30rpx;
    color:rgba(38,38,38,1);
    line-height: 46rpx;
  }
  .c-cell__arrow {
    width: 36rpx;
    height: 36rpx;
  }
  
  // 退出登录
  .c-logout-btn {
    position: relative;
    text-align: center;
    height: 110rpx;
    line-height: 110rpx;
    background: #fff;
    border: none;
    margin-top: 24rpx;
    color: #E80216;
    font-weight: 400;
    font-size: 34rpx;
  }
  
  .c-logout-btn:active {
    background: #F4F5F6;
  }
  
  .c-findgoods-cell {
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    font-size: 34rpx;
    font-weight: 400;
    color: rgba(53,53,53,1);
    @include thin-line-bottom(#E7EBEA, 0, 0);
  }
  .c-findgoods-cell:active {
    background: #F4F5F6;
  }
  
</style>
