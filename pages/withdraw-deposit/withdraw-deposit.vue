<template>
	<view class="page-container">
		<view class="c-cell">
      <view class="c-cell__title">可提现金额</view>
      <view class="c-cell__val">￥ {{info.balance}}</view>
    </view>
    <view class="c-field">
      <view class="c-field__title">输入提现金额</view>
      <view class="c-field__unit">￥</view>
      <input @input="cacheChange" class="c-field__input" type="digit" v-model="withdrawCache" value="withdrawCache" placeholder="0"/>
    </view>
    <view class="c-cell">
      <view class="c-cell__title">扣除提现手续费金额</view>
      <view class="c-cell__val">¥ {{(withdrawCache * info.rate).toFixed(2)}}</view>
    </view>
    <view class="c-cell">
      <view class="c-cell__title">实际到账</view>
      <view class="c-cell__val c-actual-price">¥ {{withdrawCache - ((withdrawCache * info.rate).toFixed(2))}}</view>
    </view>
    
    <view class="c-withdraw-desc">
      <button class="sg-button c-withdraw-record-btn" type="primary" 
        @tap="go('/pages/withdraw-deposit-record/withdraw-deposit-record')">提现记录</button>
      <view class="c-withdraw-desc-title">
        <image class="c-withdraw-desc-title__icon" src="../../static/common/ic_info_orange@2x.png" mode="aspectFill"></image>
        <view class="c-withdraw-desc-title__label">详细说明</view>
      </view>
      <view class="c-withdraw-desc__label">
        <text>佣金提现扣除提现手续费 5%\n扣除提现手续费金额在￥3000到￥10000间免收</text>
      </view>
    </view>
    
    <view class="c-withdraw-btn-container">
      <button class="sg-button c-withdraw-btn" type="primary" @tap="showWithdrawPopup">下一步</button>
    </view>
    
    <!-- 提现 -->
    <sg-popup v-model="widthdrawPopupVisible" custom-class="c-payment-popup" position="bottom">
      <image class="c-payment-popup__close" src="../../static/common/ic_cancel@2x.png" mode="aspectFill" @tap="closeWithdrawPopup"></image>
			
      <view class="c-payment">
        <view class="c-payment__title">选择提现方式</view>
        <view class="c-payment__subtitle">待提现</view>
        <view class="c-payment__price">¥ {{withdrawCache - ((withdrawCache * info.rate).toFixed(2))}}</view>
        <view class="c-payway-list">
					
					<!-- 微信提现 -->
          <view class="c-payway-item">
            <view class="c-payway" @tap="selectPay(1)">
              <image class="c-payway__image" src="../../static/common/ic_wechatpay@2x.png" mode="aspectFill"></image>
              <view class="c-payway__content">
                <view class="c-payway__title">提现到微信</view>
                <view class="c-payway__label">微信安全支付</view>
              </view>
              <image v-if="payWay === 1" class="c-payway__check" src="../../static/common/circle_checked@2x.png" mode="aspectFill"></image>
              <image v-else class="c-payway__check" src="../../static/common/circle_unchecked@2x.png" mode="aspectFill"></image>
            </view>
            <view class="c-withdraw-info-container" v-if="payWay === 1">
              <view class="c-withdraw-info">
                <view class="c-withdraw-info__title">姓名</view>
                <input class="c-withdraw-info__input" type="text" v-model="realname" value="" placeholder="输入姓名"/>
              </view>
              <view class="c-withdraw-info">
                <view class="c-withdraw-info__title">微信账号</view>
                <input class="c-withdraw-info__input" type="text" v-model="account_num" value="" placeholder="输入微信账号"/>
              </view>
              <view class="c-withdraw-info">
                <view class="c-withdraw-info__title">确认账号</view>
                <input class="c-withdraw-info__input" type="text" v-model="check_account_num" value="" placeholder="再次输入微信账号"/>
              </view>
            </view>
          </view>
					
					<!-- 支付宝提现 -->
          <view class="c-payway-item">
            <view class="c-payway" @tap="selectPay(2)">
              <image class="c-payway__image" src="../../static/common/ic_alipay@2x.png" mode="aspectFill"></image>
              <view class="c-payway__content">
                <view class="c-payway__title">提现到支付宝</view>
                <view class="c-payway__label">支付宝安全支付</view>
              </view>
              <image v-if="payWay === 2" class="c-payway__check" src="../../static/common/circle_checked@2x.png" mode="aspectFill"></image>
              <image v-else class="c-payway__check" src="../../static/common/circle_unchecked@2x.png" mode="aspectFill"></image>
            </view>
            <view class="c-withdraw-info-container" v-if="payWay === 2">
              <view class="c-withdraw-info">
                <view class="c-withdraw-info__title">姓名</view>
                <input class="c-withdraw-info__input" type="text" value="" v-model="realname" placeholder="输入姓名"/>
              </view>
              <view class="c-withdraw-info">
                <view class="c-withdraw-info__title">支付宝账号</view>
                <input class="c-withdraw-info__input" type="text" value="" v-model="account_num" placeholder="输入支付宝账号"/>
              </view>
              <view class="c-withdraw-info">
                <view class="c-withdraw-info__title">确认账号</view>
                <input class="c-withdraw-info__input" type="text" value="" v-model="check_account_num" placeholder="再次输入支付宝账号"/>
              </view>
            </view>
          </view>
          <!-- <view class="c-payway-item">
            <view class="c-payway" @tap="payWay = 3">
              <image class="c-payway__image" src="../../static/common/ic_wallet_pay@2x.png" mode="aspectFill"></image>
              <view class="c-payway__content">
                <view class="c-payway__title">提现到余额</view>
                <view class="c-payway__label">余额：￥20.99</view>
              </view>
              <image v-if="payWay === 3" class="c-payway__check" src="../../static/common/circle_checked@2x.png" mode="aspectFill"></image>
              <image v-else class="c-payway__check" src="../../static/common/circle_unchecked@2x.png" mode="aspectFill"></image>
            </view>
          </view> -->
        </view>
        
        <view class="c-payment__footer">
          <button class="sg-button c-payment__pay" type="primary" @tap="payOrder()">提交申请</button>
        </view>
      </view>
    </sg-popup>
    
	</view>
</template>

<script>
	import {
		WithdrawalInfoApi,
		WithdrawalApplyApi,
	} from '../../api/index.js'
	
	
	export default {
		data() {
			return {
				payWay: 1, // 1:微信 2：支付宝 3：余额
        widthdrawPopupVisible: false,
				
				info: {},
				withdrawCache: '',
				cache: '',
				realname: '',
				account_num: '',
				check_account_num: '',
				maxlength: 100
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
			this.withdrawalInfo();
		},
    methods: {
			withdrawalInfo() {
				WithdrawalInfoApi(this.uid).then(ret => {
					console.log('WithdrawalInfoApi ret ==== ', ret);
					const {data} = ret;
					this.info = data;
				})
				.catch(err => {
					console.log('WithdrawalInfoApi err ==== ', err);
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					});
				})
			},
			withdrawal() {
				const cache = this.withdrawCache - ((this.withdrawCache * this.info.rate).toFixed(2));
				let wechat;
				let alipay;
				if (this.payWay === 1) {
					wechat = this.account_num;
					alipay = '';
				} else if (this.payWay === 2) {
					wechat = '';
					alipay = this.account_num;
				}
				WithdrawalApplyApi(this.uid, this.realname, cache, alipay, wechat).then(ret => {
					console.log('WithdrawalApplyApi ret ==== ', ret);
					
					this.widthdrawPopupVisible = false;
					uni.showToast({
						title: '提现成功',
						icon: 'success'
					});
					
					setTimeout(() => {
						uni.navigateBack()
					}, 1000)
				})
				.catch(err => {
					console.log('WithdrawalApplyApi err ==== ', err);
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					});
				})
			},
			selectPay(type) {
				this.payWay = type;
				
				this.realname = '';
				this.account_num = '';
				this.check_account_num = '';
			},
			cacheChange(e) {
				let reg = /^(0|[1-9]\d*)(\.\d{1,2})?/;
				let price = e.detail.value.match(reg);
				const p = price ? price[0] : '';
				const ret = p.split('.');
				const last = ret[1];
				if (last && last.length >= 2) {
					let that = this;
					setTimeout(() => {
						that.withdrawCache = Number(p).toFixed(2)
					}, 500)
				}
			},
			payOrder() {
				if (this.realname.length === 0) {
					uni.showToast({
						title: '请填写姓名',
						icon: 'none'
					});
					return;
				}
				
				if (this.account_num !== this.check_account_num) {
					uni.showToast({
						title: '输入的账号不一致',
						icon: 'none'
					});
					return;
				}
				
				this.withdrawal()
			},
      go(url) {
				
        uni.navigateTo({
          url
        });
      },
      // 提现下一步
      showWithdrawPopup() {
				const balance = parseInt(this.info.balance);
				if (balance > 0) {
					this.widthdrawPopupVisible = true;
				} else {
					uni.showToast({
						title: '余额不足，无法提现',
						icon: 'none'
					});
				}
      },
      // 关闭提现窗口
      closeWithdrawPopup() {
        this.widthdrawPopupVisible = false;
      },
    }
	}
</script>

<style lang="scss">
  @import '@/common/scss/mixin.scss';
  .page-container {
    background: #fff;
  }
  .c-cell {
    display: flex;
    height: 110rpx;
    background: #fff;
    align-items: center;
    padding: 0 24rpx;
    @include thin_line_bottom(#E7EBEA, 0, 0);
  }
  .c-cell__title {
    height: 46rpx;
    font-size: 32rpx;
    font-weight: 400;
    color: rgba(102,102,102,1);
    line-height: 46rpx;
  }
  .c-cell__val {
    flex: 1;
    height: 46rpx;
    font-size: 34rpx;
    font-weight: 400;
    color: rgba(38,38,38,1);
    line-height: 46rpx;
    padding-left: 32rpx;
  }
  .c-actual-price {
    color: #FA6400;
  }
  
  // field
  .c-field {
    padding: 0 24rpx;
    background: #fff;
    display: flex;
    height: 110rpx;
    align-items: center;
    @include thin_line_bottom(#E7EBEA, 0, 0);
  }
  .c-field__title {
    height: 46rpx;
    font-size: 32rpx;
    font-weight: 400;
    color: rgba(102,102,102,1);
    line-height: 46rpx;
  }
  .c-field__input {
    height: 56rpx;
    line-height: 56rpx;
    min-height: 56rpx;
    width: 155rpx;
    font-size: 34rpx;
    color: #262626;
  }
  .c-field__unit {
    padding-left: 36rpx;
    padding-right: 10rpx;
    height: 46rpx;
    font-size: 32rpx;
    font-weight: 400;
    color: rgba(102,102,102,1);
    line-height: 46rpx;
  }
  
  // 提现说明
  .c-withdraw-desc {
    position: relative;
    padding: 40rpx 24rpx;
  }
  .c-withdraw-record-btn {
    position: absolute;
    right: 24rpx;
    top: 27rpx;
    z-index: 1;
    padding: 0 24rpx;
    height: 48rpx;
    line-height: 48rpx;
    border-radius: 22rpx;
    font-size: 28rpx;
    font-weight: 400;
  }
  .c-withdraw-desc-title {
    display: flex;
    align-items: center;
    height: 34rpx;
  }
  .c-withdraw-desc-title__icon {
    display: block;
    width: 29rpx;
    height: 28rpx;
  }
  .c-withdraw-desc-title__label {
    padding-left: 11rpx;
    height: 34rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: rgba(189,189,189,1);
    line-height: 34rpx;
  }
  .c-withdraw-desc__label {
    padding-left: 11rpx;
    height: 34rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: rgba(189,189,189,1);
    line-height: 42rpx;
    margin-top: 24rpx;
  }
  
  // 提现确定按钮
  .c-withdraw-btn-container {
    margin-top: 40rpx;
    padding: 0 64rpx;
  }
  .c-withdraw-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background: rgba(250,100,0,1);
    border-radius: 6rpx;
    color: #fff;
    font-size: 34rpx;
    font-weight: bold;
  }
  
  // 支付弹窗
  .c-payment-popup .sg-popup--bottom{
    border-radius: 0;
  }
  .c-payment-popup__close {
    position: absolute;
    right: 0;
    top: 18rpx;
    right: 24rpx;
    z-index: 1;
    width: 54rpx;
    height: 54rpx;
  }
  .c-payment {
    padding: 32rpx 0;
  }
  .c-payment__title {
    height: 50rpx;
    font-size: 36rpx;
    font-weight: bold;
    color: rgba(0,0,0,1);
    line-height: 50rpx;
    text-align: center;
  }
  .c-payment__subtitle {
    height: 46rpx;
    font-size: 30rpx;
    font-weight: 400;
    color: rgba(13,19,13,1);
    line-height: 46rpx;
    margin-top: 30rpx;
    text-align: center;
    opacity: 0.5;
  }
  .c-payment__price {
    height: 66rpx;
    font-size: 46rpx;
    font-weight: bold;
    color: rgba(0,0,0,1);
    line-height: 66rpx;
    text-align: center;
    margin-top: 10rpx;
  }
  .c-payway-list {
    margin-top: 40rpx;
  }
  .c-payway {
    display: flex;
    background: #fff;
    padding: 0 40rpx;
    align-items: center;
    height: 160rpx;
  }
  .c-payway-item:not(:last-child) {
    @include thin_line_bottom(#E7EBEA, 30rpx, 30rpx);
  }
  
  .c-payway__image {
    width: 40rpx;
    height: 40rpx;
  }
  .c-payway__content {
    flex: 1;
    padding: 0 24rpx;
  }
  .c-payway__title {
    height: 42rpx;
    font-size: 30rpx;
    font-weight: bold;
    color: rgba(0,0,0,1);
    line-height: 42rpx;
  }
  .c-payway__label {
    margin-top: 4rpx;
    height: 46rpx;
    font-size: 30rpx;
    font-weight: 400;
    color: rgba(13,19,13,1);
    line-height: 46rpx;
    opacity: 0.5;
  }
  .c-payway__check {
    width: 42rpx;
    height: 42rpx;
  }
  .c-payment__footer {
    margin-top: 50rpx;
    padding: 0 64rpx;
  }
  .c-payment__pay {
    height: 88rpx;
    line-height: 88rpx;
    font-size: 34rpx;
    font-weight: bold;
    color: rgba(255,255,255,1);
  }
  
  // 提现填写信息
  .c-withdraw-info-container {
    width: 654rpx;
    margin-left: 44rpx;
    background: #F4F5F6;
    border-radius: 10rpx;
  }
  .c-withdraw-info {
    display: flex;
    align-items: center;
    padding: 0 24rpx;
    height: 90rpx;
  }
  .c-withdraw-info__title {
    height: 46rpx;
    font-size: 32rpx;
    font-weight: 400;
    color: rgba(13,19,13,1);
    line-height: 46rpx;
    min-width: 200rpx;
    padding-right: 32rpx;
  }
  .c-withdraw-info__input {
    color: #262626;
    height: 56rpx;
    min-height: 56rpx;
    line-height: 56rpx;
    font-weight: 400;
    font-size: 34rpx;
    color: rgba(13,19,13,1);
  }
</style>
