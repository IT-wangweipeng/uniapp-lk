<template>
	<view class="page-container">
		<view class="c-cell">
      <view class="c-cell__title">收 货 人</view>
      <input class="c-cell__input" @input="nicknameInput" type="text" :value="nickname" placeholder="姓名" />
    </view>
    
    <view class="c-section">
      <view class="c-cell">
        <view class="c-cell__title">联系电话</view>
        <input class="c-cell__input" maxlength="11" @input="mobileInput" type="number" :value="mobile" placeholder="手机号" />
      </view>
      
      <view class="c-cell c-cell--clickable" @tap="showCityPicker">
        <view class="c-cell__title"><text space="ensp">城    市</text></view>
				<view class="c-cell__val">{{regionLabel}}</view>
        <image class="c-cell__arrow" src="../../static/common/ic_arrow_right_gury@2x.png" mode="aspectFill"></image>
      </view>
      <!-- 
      <view class="c-cell">
        <view class="c-cell__title"><text space="ensp">地    址</text></view>
        <input class="c-cell__input" type="text" :value="data.address" placeholder="请输入地址" />
      </view> -->
      
      <view class="c-cell">
        <view class="c-cell__title">详细地址</view>
        <input class="c-cell__input" @input="addressInput" type="text" :value="address" placeholder="如道路、门牌号、小区、楼栋号等" />
      </view>
      
      <view class="c-cell">
        <view class="c-cell__title">默认地址</view>
        <switch :checked="isDefault === 1" @change="switchChange" color="#FA6400" />
      </view>
      
    </view>
    
    <!-- footer -->
    <view class="c-footer">
      <button class="sg-button c-footer__btn" type="primary" @tap="saveAddressAction">保存并使用</button>
    </view>
    
    <mpvue-city-picker themeColor="#FA6400" title="选择地区" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
       @onConfirm="handleCityPickerConfirm"></mpvue-city-picker>
      
	</view>
</template>

<script>
	import {UserAddressDetailApi, SaveAddressApi} from '../../api/index.js'
	import {checkPhone} from '../../common/utils/CheckUtils.js'
	import mpvueCityPicker from '@/components/base/mpvue-citypicker/mpvueCityPicker.vue';
	export default {
	  components: { mpvueCityPicker },
		data() {
			return {
				cityPickerValueDefault: [0, 0, 0],
        regionLabel: ' ',
				uid: getApp().globalData.uid,
				nickname: '',
				mobile: '',
				address: '',
				isDefault: 0,
				id: '',
			};
		},
		onLoad(opt) {
			console.log('UserAddressDetailApi ==== ', opt)
			if (opt && opt.id == undefined) {
				// 新增地址
				this.regionLabel = '北京市 北京市 东城区'
				uni.setNavigationBarTitle({
					title: '新增收货地址'
				})
				return;
			}
			
			// 编辑地址
			uni.setNavigationBarTitle({
				title: '编辑地址'
			})
			this.loadAddresDetail(opt.id)
		},
    methods: {
			loadAddresDetail (id) {
				UserAddressDetailApi(this.uid, id).then(ret => {
					console.log('UserAddressDetailApi ret === ', ret)
					if (ret.data && ret.data.vo) {
						const {realname, mobile, address, province, city, area, isdefault, id} = ret.data.vo;
						this.id = id
						this.nickname = realname;
						this.mobile = mobile;
						this.address = address;
						this.isDefault = isdefault;
						this.swithValue = isdefault;
						this.regionLabel = `${province} ${city} ${area}`
					}
				})
				.catch(err => {
					console.log('UserAddressDetailApi err === ', errr)
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					})
				})
			},
			
      saveAddressAction() {
				const l1 = this.nickname.length === 0;
				const l2 = this.mobile.length === 0;
				const l3 = this.address.length === 0;
				if (l1 || l2 || l3) {
					const tips = (l1 && '请填写收件人') || (l2 && '请填写联系方式') || (l3 && '请填写收货地址')
					uni.showToast({
					  title: tips,
					  icon: 'none',
					});
					return
				}
				
				if (!checkPhone(this.mobile)) {
					uni.showToast({
					  title: '手机号格式不正确',
					  icon: 'none',
					});
					return;
				}
					
				if (!!this.id) {
					// 编辑地址
					this.saveAddress(this.id)
				} else {
					// 新增地址
					this.saveAddress()
				}
      },
			saveAddress(id) {
				const [province, city, area] = this.regionLabel.split(' ')
				SaveAddressApi(this.uid, this.nickname, this.mobile, province, city, area, this.address, id, this.swithValue).then(ret => {
					console.log('SaveAddressApi ret ===== ', ret)
					uni.showToast({
					  title: '保存成功',
					  icon: 'success',
					  mask: true
					});
					
					setTimeout(() => {
						uni.navigateBack()
						uni.$emit('refreshList', {})
					}, 1000)
				})
				.catch(err => {
					console.log('SaveAddressApi err ===== ', err)
					uni.showToast({
					  title: '失败' + err,
					  icon: 'failed',
					  mask: true
					});
				})
			},
			nicknameInput(e) {
				this.nickname = e.target.value
			},
			switchChange(e) {
				this.swithValue = e.target.value
			},
			mobileInput(e) {
				this.mobile = e.target.value
			},
			addressInput(e) {
				this.address = e.target.value
			},
      showCityPicker() {
        this.$refs.mpvueCityPicker.show();
      },
      // 确认选择地区
      handleCityPickerConfirm(val) {
        console.log(val);
        this.regionLabel = val.label;
      },
    }
	}
</script>

<style lang="scss">
  @import '@/common/scss/mixin.scss';
  .page-container {
    background: #fff;
    padding-bottom: 120rpx;
  }
  .c-section {
    background: #F4F5F6;
    padding-top: 24rpx;
  }
  
  .c-cell {
    background: #fff;
    display: flex;
    height: 100rpx;
    padding: 0 40rpx;
    align-items: center;
    @include thin_line_bottom(#E7EBEA, 30rpx, 30rpx);
  }
  .c-cell--clickable:active {
    background: #F4F5F6;
  }
  .c-cell__title {
    height: 46rpx;
    font-size: 32rpx;
    font-weight: 400;
    color: rgba(13,19,13,1);
    line-height: 46rpx;
    width: 184rpx;
  }
  .c-cell__input {
    flex: 1;
    height: 56rpx;
    line-height: 56rpx;
    font-size: 30rpx;
    color: #0D130D;
  }
  .c-cell__val {
    flex: 1;
    height: 56rpx;
    line-height: 56rpx;
    font-size: 30rpx;
    color: #0D130D;
    @include ellipsis(1);
  }
  .c-cell__arrow {
    width: 36rpx;
    height: 36rpx;
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
</style>
