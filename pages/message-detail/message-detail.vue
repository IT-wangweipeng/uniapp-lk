<template>
	<view class="page-container">
		<view class="c-msg-title">{{detail.title}}</view>
    <view class="c-msg-date">{{detail.create_time}}</view>
    <view class="c-msg-content">
			<text space="nbsp">  {{detail.content}}</text>
		</view>
      
    <!-- 底部按钮根据消息类型显示不一样 -->
    <view class="c-footer" v-if="detail.business_type === 2">
       <button @tap="joinUnion" class="sg-button c-footer-btn" type="primary">立即加入</button>
       <button @tap="unionDetail" class="sg-button c-footer-btn" type="primary" plain>查看联盟详情</button>
    </view>
		
		<view class="c-footer" v-else-if="detail.business_type === 3">
		   <button @tap="unionDetail" class="sg-button c-footer-btn" type="primary" plain>查看联盟详情</button>
		</view>
		
    <view class="c-footer" v-else-if="detail.business_type === 5">
      <button @tap="enterUnion" class="sg-button c-footer-btn" type="primary">进入联盟</button>
      <button @tap="unionDetail" class="sg-button c-footer-btn" type="primary" plain>查看联盟详情</button>
    </view>
		
    <view class="c-footer" v-else-if="detail.business_type === 6 && detail.status !== 3">
       <button @tap="allowUnion" class="sg-button c-footer-btn" type="primary">通过申请</button>
       <button @tap="refuseUnion" class="sg-button c-footer-btn" primary plain>拒绝申请</button>
    </view>
		
		<view class="c-footer" v-else-if="detail.business_type === 7">
		  <button @tap="checkOrder" class="sg-button c-footer-btn" type="primary">查看订单</button>
		  <!-- <button @tap="checkProduct" class="sg-button c-footer-btn" type="primary" plain>查看商品</button> -->
		</view>
		
		<view class="c-footer" v-else-if="detail.business_type === 8">
		   <button @tap="withdrawalRecord" class="sg-button c-footer-btn" type="primary" plain>查看提现记录</button>
		</view>
	</view>
</template>

<script>
	import {ApplyAllianceApi, MessageDetail, AllowOrRejectJoinUnion} from '../../api/index.js'
	export default {
		data() {
			return {
				id:'',
				uid: getApp().globalData.uid,
				detail: {},
			};
		},
		onLoad(option) {
			const {id} = option;
			this.id = id;
			this.getMessageDetail();
		  
		},
		methods: {
			
			getMessageDetail(){
				MessageDetail(this.uid, this.id).then(ret => {
					console.log('MessageDetail ret === ', ret)
					this.detail = ret.data
				})
				.catch(err => {
					console.log('MessageDetail err === ', err)
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					})
				})
				
			},
			
			// 同意或者拒绝加入联盟
			unionOperation(status) {
				AllowOrRejectJoinUnion(this.uid, this.detail.id, status).then(ret => {
					console.log('ApplyUnion ret ==== ', ret)
					uni.showToast({
						title: '操作成功',
						icon: 'none'
					})
					this.detail.status === 3;
				})
				.catch(err => {
					console.log('ApplyUnion err ==== ', err)
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					})
				})
			},
			// 立即加入联盟
			joinUnion() {
				AllowOrRejectJoinUnion(this.uid, this.detail.business_id,1).then(ret => {
					console.log('ApplyAllianceApi ret ==== ', ret)
					uni.showToast({
						title: '加入联盟成功',
						icon: 'none'
					});
					this.detail.status === 3;
				})
				.catch(err => {
					console.log('ApplyAllianceApi err ==== ', err)
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					})
				})
			},
			// 查看联盟详情
			unionDetail() {
				uni.navigateTo({
					url: `../alliance-intro/alliance-intro?id=${this.detail.business_id_two}`
				})
			},
			// 进入联盟
			enterUnion(item) {
				uni.navigateTo({
					url: `../alliance-detail/alliance-detail?allianceID=${this.detail.business_id_two}`
				})
			},
			// 通过联盟申请
			allowUnion() {
				this.unionOperation(1)
			},
			// 拒绝申请
			refuseUnion() {
				this.unionOperation(2)
			},
			// 查看订单
			checkOrder() {
				const {business_id} = this.detail;
				let is_seller = this.detail.is_seller
				console.log('detail ===== ', this.detail);
				if(is_seller == 0) {
					uni.navigateTo({
						url: `../buyer-order-detail/buyer-order-detail?orderid=${business_id}`,
					})
				}
				
				if(is_seller == 1) {
					uni.navigateTo({
						url: `../seller-order-detail/seller-order-detail?orderid=${business_id}`,
					})
				}
				
				
				
			},
			// 查看商品
			checkProduct() {
				const {business_id} = this.detail;
				uni.navigateTo({
					url: `../product-detail/product-detail?id=${business_id}`
				})
			},
			// 提现记录
			withdrawalRecord() {
				uni.navigateTo({
					url: '../withdraw-deposit-record/withdraw-deposit-record'
				})
			}
		},
	}
</script>

<style lang="scss">
  .page-container {
    background: #fff;
    padding-top: 48rpx;
  }
  .c-msg-title {
    padding: 0 40rpx;
    font-size: 36rpx;
    font-weight: bold;
    color: rgba(15,3,20,0.85);
    line-height: 50rpx;
    text-align: center;
  }
  .c-msg-date {
    margin-top: 20rpx;
    height: 38rpx;
    font-size: 26rpx;
    font-weight: 400;
    color: rgba(15,3,20,0.3);
    line-height: 38rpx;
    text-align: center;
  }
  .c-msg-content {
    margin-top: 42rpx;
    height: 184rpx;
    font-size: 30rpx;
    font-weight: 400;
    color: rgba(15,3,20,0.85);
    line-height: 46rpx;
    padding: 0 40rpx;
  }
  .c-footer {
    position: fixed;
    height: 80rpx;
    left: 0;
    right: 0;
    bottom: 98rpx;
    z-index: 100;
    display: flex;
    padding: 0 40rpx;
    justify-content: center;
  }
  .c-footer-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 300rpx;
    height: 80rpx;
    line-height: 1.2;
    font-weight: 400;
  }
  .c-footer-btn + .c-footer-btn {
    margin-left: 70rpx;
  }
</style>
