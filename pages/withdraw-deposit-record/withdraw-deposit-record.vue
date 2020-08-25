<template>
	<view class="page-container">
		<view class="c-header">
      <view class="c-tabs">
        <view class="c-tab" :class="{'c-tab--active': type === 0}" @tap="handleTypeChange('')">全部</view>
        <view class="c-tab" :class="{'c-tab--active': type === 1}" @tap="handleTypeChange(1)">待审核</view>
        <view class="c-tab" :class="{'c-tab--active': type === 2}" @tap="handleTypeChange(2)">待打款</view>
        <view class="c-tab" :class="{'c-tab--active': type === 3}" @tap="handleTypeChange(3)">已打款</view>
      </view>
    </view>
    
    <!-- 列表 -->
    <view class="c-card-list">
      <view v-for="(item, index) in records" key="item.id" class="c-card">
        <view class="c-record">
          <view class="c-record__title">提现到余额</view>
          <view class="c-record__time">{{item.update_time}}</view>
          <view class="c-record__price">￥{{item.amount}}</view>
					<view v-if="item.status === 1" class="c-record__status">待审核</view>
					<view v-if="item.status === 2" class="c-record__status">待打款</view>
          <view v-if="item.status === 3" class="c-record__status c-record__status--blue">已打款</view>
        </view>
        <view class="c-record-row">
          <view class="c-record-col">
            <view class="c-record-col__title">申请佣金</view>
            <view class="c-record-col__label">{{item.appliy_amount}}</view>
          </view>
          <view class="c-record-col">
            <view class="c-record-col__title">实际金额</view>
            <view class="c-record-col__label">{{item.amount}}</view>
          </view>
          <view class="c-record-col">
            <view class="c-record-col__title">提现手续费</view>
            <view class="c-record-col__label">{{item.tax}}</view>
          </view>
        </view>
      </view>
<!--      <view class="c-card">
        <view class="c-record">
          <view class="c-record__title">提现到余额</view>
          <view class="c-record__time">2019/10/16  15:30</view>
          <view class="c-record__price">￥255.00</view>
          <view class="c-record__status">待打款</view>
        </view>
        <view class="c-record-row">
          <view class="c-record-col">
            <view class="c-record-col__title">申请佣金</view>
            <view class="c-record-col__label">255.00</view>
          </view>
          <view class="c-record-col">
            <view class="c-record-col__title">实际金额</view>
            <view class="c-record-col__label">242.00</view>
          </view>
          <view class="c-record-col">
            <view class="c-record-col__title">提现手续费</view>
            <view class="c-record-col__label">13.00</view>
          </view>
        </view>
      </view> -->
			
			
			
			
<!--      <view class="c-card">
        <view class="c-record">
          <view class="c-record__title">提现到余额</view>
          <view class="c-record__time">2019/10/16  15:30</view>
          <view class="c-record__price">￥255.00</view>
          <view class="c-record__status">待审核</view>
        </view>
        <view class="c-record-row">
          <view class="c-record-col">
            <view class="c-record-col__title">申请佣金</view>
            <view class="c-record-col__label">255.00</view>
          </view>
          <view class="c-record-col">
            <view class="c-record-col__title">实际金额</view>
            <view class="c-record-col__label">242.00</view>
          </view>
          <view class="c-record-col">
            <view class="c-record-col__title">提现手续费</view>
            <view class="c-record-col__label">13.00</view>
          </view>
        </view>
      </view> -->
    </view>
    
		 <view class="loading">{{ loadingText }}</view>
	</view>
</template>

<script>
	import {
		WithdrawalListApi,
	} from '../../api/index.js'
	
	export default {
		data() {
			return {
				type: '',
				
				page: 1,
				total: 0,
				totalPage: 0,
				records: [],
				loadingText: '加载中...',
			};
		},
		computed: {
			uid: {
				get() {
					return getApp().globalData.uid
				}
			}
		},
		onLoad() {
			this.loadRecord();
		},
		onReachBottom() {
			console.log('records === ', this.records, this.total)
			if (this.records.length < this.total) {
				this.page ++;
				this.loadRecord()
			} else {
				this.loadingText = "没有更多了"
			}
		},
		
    methods: {
			loadRecord() {
				this.loadingText = "加载中..."
				WithdrawalListApi(this.uid, this.type).then(ret => {
					console.log('WithdrawalListApi ret === ', ret);
					const result = ret.data;
					if (result && result.data && result.data.length > 0) {
						this.records = this.records.concat(result.data)
						this.totalPage = result.last_page;
						this.total = result.total;
						if (this.records.length == this.total) {
							this.loadingText = '没有更多了'
						}
						if (this.records.length <= 0) {
							this.loadingText = '什么都没有发现哦'
						}
					} else {
						uni.showToast({
							title: '已加载完毕',
							icon: 'none'
						})
						this.loadingText = "没有更多了"
						this.records = [];
					}
					
				})
				.catch(err => {
					console.log('WithdrawalListApi err === ', err);
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					});
				})
			},
			
      handleTypeChange(type) {
        this.type = type;
				this.records = [];
				this.page = 1;
				this.totalPage = 0;
				this.loadRecord();
      }
    }
	}
</script>

<style lang="scss">
  @import '@/common/scss/mixin.scss';
  .page-container {
    background: #fff;
    padding-top: 116rpx;
  }
	.loading {
		text-align: center;
		line-height: 80px;
	}
  .c-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    height: 84rpx;
    background: #fff;
  }
  .c-tabs {
    display: flex;
    align-items: center;
  }
  .c-tab {
    position: relative;
    height: 84rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: #666666;
    line-height: 100rpx;
    padding: 0 30rpx;
  }
  .c-tab--active {
    font-weight: bold;
    color: #262626;
  }
  .c-tab--active:after {
    position: absolute;
    content: '';
    left: 18rpx;
    right: 18rpx;
    bottom: 0rpx;
    z-index: 1;
    height: 6rpx;
    border-radius: 3rpx;
    background: #FA6400;
  }
  
  // 列表
  .c-card-list {
    padding: 0 24rpx;
  }
  .c-card {
    position: relative;
    background: #fff;
    box-shadow: 0rpx 0rpx 6rpx 0rpx rgba(0,0,0,0.2);
    border-radius: 10rpx;
    margin-bottom: 24rpx;
  }
  .c-record {
    padding: 32rpx 24rpx 40rpx;
    position: relative;
    @include thin_line_bottom(#E7EBEA, 12rpx, 0);
  }
  .c-record__title {
    height: 50rpx;
    font-size: 36rpx;
    font-weight: bold;
    color: rgba(15,3,20,0.85);
    line-height: 50rpx;
  }
  .c-record__time {
    margin-top: 24rpx;
    height: 37rpx;
    font-size: 26rpx;
    font-weight: 400;
    color: rgba(15,3,20,0.3);
    line-height: 37rpx;
  }
  .c-record__price {
    position: absolute;
    right: 24rpx;
    top: 34rpx;
    z-index: 1;
    height: 46rpx;
    font-size: 34rpx;
    font-weight: bold;
    color: rgba(250,100,0,1);
    line-height: 46rpx;
  }
  .c-record__status {
    position: absolute;
    top: 104rpx;
    right: 24rpx;
    z-index: 1;
    height: 46rpx;
    font-size: 32rpx;
    font-weight: 400;
    color: #666666;
    line-height: 46rpx;
  }
  .c-record__status--blue {
    color: #2681FF;
  }
  .c-record-row {
    padding: 32rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .c-record-col {
    height: 100%;
  }
  .c-record-col__title {
    height: 46rpx;
    font-size: 30rpx;
    font-weight: 400;
    color: rgba(13,19,13,1);
    line-height: 46rpx;
    text-align: center;
  }
  .c-record-col__label {
    margin-top: 17rpx;
    height: 46rpx;
    font-size: 30rpx;
    font-weight: 400;
    color: rgba(153,153,153,1);
    line-height: 46rpx;
    text-align: center;
  }
</style>
