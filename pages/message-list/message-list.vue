<template>
	<view class="page-container">
		<view class="c-header">
		  <!-- 类别 -->
		  <view class="c-tabs">
		    <view class="c-tab" :class="{'c-tab--active': activeTabIndex === 1}" @tap="handleTabTap(1)">系统消息</view>
		    <view class="c-tab" :class="{'c-tab--active': activeTabIndex === 2}" @tap="handleTabTap(2)">邀请消息</view>
		  </view>
		</view>
		
			
		<!-- 消息内容 -->
		<view class="c-msg-container">
		  <view class="c-msg-date">
		    <view class="c-msg-date__btn" @tap="preDate">前一天</view>
		    <view class="c-msg-date__val" @tap="showDatePicker">{{currentDate}}</view>
		    <view class="c-msg-date__btn" @tap="nextDate">后一天</view>
		  </view>
			
			
		  <view class="c-msg-list" v-if="activeTabIndex === 1">
		    <scroll-view class="c-msg-scroll" scroll-y="true" @scrolltolower="scollToBottom">
					<view class="c-msg" v-for="(item, index) in messageList" :key="index" @tap="go('/pages/message-detail/message-detail', item, index)">
					  <image class="c-msg__icon" :src="item.icon" mode="aspectFill"></image>
					  <view v-if="item.status === 1" class="c-msg__content">
					    <view class="c-msg__title">{{item.title}}</view>
					    <view class="c-msg__label">{{item.content}}</view>
					  </view>
						<view v-else class="c-msg__content">
						  <view class="c-msg__title c-msg-color">{{item.title}}</view>
						  <view class="c-msg__label c-msg-color">{{item.content}}</view>
						</view>
					</view>
		    </scroll-view>
		  </view>
		  
		  <view class="c-msg-list" v-else>
		    <scroll-view class="c-msg-scroll" scroll-y="true" @scrolltolower="scollToBottom">
		      <view class="c-msg" v-for="(item, index) in messageList" :key="index" @tap="go('/pages/message-detail/message-detail', item, index)">
		        <image class="c-msg__icon" :src="item.icon" mode="aspectFill"></image>
		        <view v-if="item.status === 1" class="c-msg__content">
		          <view class="c-msg__title">{{item.name}}</view>
		          <view class="c-msg__date">{{item.create_time}}</view>
		          <view class="c-msg__label">{{item.content}}</view>
		        </view>
						<view v-else class="c-msg__content">
							<view class="c-msg__title c-msg-color">{{item.name}}</view>
							<view class="c-msg__date c-msg-color">{{item.create_time}}</view>
							<view class="c-msg__label c-msg-color">{{item.content}}</view>
						</view>
		      </view>
		    </scroll-view>
		  </view>
		  
		</view>
    
    
    <mpvue-picker themeColor="#FA6400" ref="mpvuePicker" mode="dateSelector" 
      :pickerValueDefault="pickerValueDefault" @onConfirm="handleDatePickerConfirm"></mpvue-picker>
    
	</view>
</template>

<script>
  import mpvuePicker from 'mpvue-picker';
	import {UserMessageList} from '../../api/index.js'
	export default {
    components: {
      mpvuePicker
    },
		data() {
			return {
				activeTabIndex: 1, // 选中的消息类型
        currentDate: '',
        pickerValueDefault: [],
				totalMessage: 0,
				messageList: [],
				lastPage: 1,
				uid: getApp().globalData.uid
			};
		},
    methods: {
      handleTabTap(val) {
        this.activeTabIndex = val;
				this.loadMessageList(val, this.currentDate, 1)
      },
      go(url, item, index) {
				const i = this.messageList[index];
				i.status = 2;
				this.messageList.splice(index, 1, i);
				
				// 消息详情
        uni.navigateTo({
          url: `${url}?id=${item.id}`
        });
      },
      showDatePicker() {
        let currentDate = new Date(this.currentDate);
        this.pickerValueDefault = [currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate()];
        this.$refs.mpvuePicker.show();
        this.$refs.mpvuePicker.show();
      },
      preDate() {
				this.messageList = [];
        let date = new Date(new Date(this.currentDate).getTime() - 24*60*60*1000);
        this.currentDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
				this.loadMessageList(this.activeTabIndex, this.currentDate, 1)
      },
      nextDate() {
				this.messageList = [];
        let date = new Date(new Date(this.currentDate).getTime() + 24*60*60*1000);
        this.currentDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
				this.loadMessageList(this.activeTabIndex, this.currentDate, 1)
      },
      handleDatePickerConfirm(e) {
        console.log('confirm ===== ', e);
				this.messageList = [];
        this.currentDate = e.value[0] + '/' + e.value[1] + '/' + e.value[2];
				this.loadMessageList(this.activeTabIndex, this.currentDate, 1)
      },
			scollToBottom (e) {
				console.log('messageList === ', this.messageList.length)
				if (this.messageList.length < this.totalMessage) {
					this.loadMoreMessage(this.activeTabIndex, this.currentDate, this.lastPage)
				} else {
					uni.showToast({
						title: '已经加载完了',
						icon: 'none'
					})
				}
			},
			loadMoreMessage(type, date, page) {
				UserMessageList(this.uid, type, date, page).then(ret => {
					const msg = ret.data;
					console.log('UserMessageListMore === ', msg);
					this.messageList = this.messageList.concat(msg.data);
				})
				.catch(err => {
					console.log('UserMessageList err === ', err)
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					})
				})
			},
			loadMessageList(type, date, page) {
				console.log('activeTabIndex === ', this.activeTabIndex)
				UserMessageList(this.uid, type, date, page).then(ret => {
					const msg = ret.data;
					console.log('UserMessageList === ', msg);
					this.totalMessage = msg.total;
					this.messageList = msg.data;
					this.lastPage = msg.last_page;
				})
				.catch(err => {
					console.log('UserMessageList err === ', err)
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					})
				})
			}
    },
    onLoad() {
      let date = new Date();
      this.currentDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
			
			this.loadMessageList(this.activeTabIndex, this.currentDate, 1)
    },
		
	}
	

</script>

<style lang="scss">
  @import '@/common/scss/mixin.scss';
  .page-container {
    padding-top: 102rpx;
  }
	.c-msg_cell {
		flex: 1;
		height: 40rpx;
	}
	.c-msg_list {
		flex: 1;
	}
  .c-header {
    position: fixed;
    z-index: 100;
    left: 0;
    right: 0;
    top: 0;
    height: 102rpx;
    width: 100%;
    background: #F4F5F6;
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
    width: 86rpx;
    height: 8rpx;
    border-radius: 4rpx;
    background: #EF4345;
  }
  // 切换日期
  .c-msg-container {
    background: #fff;
    overflow: hidden;
    box-shadow: 0 0 10rpx 0 rgba(15,3,20,0.1);
    border-radius: 20rpx 20rpx 0rpx 0rpx;
  }
  .c-msg-date {
    height: 96rpx;
    display: flex;
    @include thin_line_bottom(#F4F5F6, 0, 0);
  }
  .c-msg-date__btn {
    padding: 0 40rpx;
    height: 96rpx;
    font-size: 30rpx;
    font-weight: 400;
    color: rgba(102,102,102,1);
    line-height: 96rpx;
  }
  .c-msg-date__btn:active {
    opacity: 0.6;
  }
  .c-msg-date__val {
    flex: 1;
    text-align: center;
    font-size: 32rpx;
    font-weight: bold;
    color: rgba(102,102,102,1);
    height: 96rpx;
    line-height: 96rpx;
  }
  
  // 滚动
  .c-msg-scroll {
    height: calc(100vh - 198rpx);
    background: #fff;
  }
  .c-msg {
    padding: 24rpx 40rpx;
    display: flex;
    box-shadow: 0 0 6rpx 0 rgba(0,0,0,0.2);
    margin-bottom: 24rpx;
  }
  .c-msg__icon {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
  }
  .c-msg__content {
    flex: 1;
    padding-left: 32rpx;
  }
  .c-msg__title {
    height: 50rpx;
    font-size: 36rpx;
    font-weight: bold;
    color: rgba(15,3,20,0.85);
    line-height: 50rpx;
    @include ellipsis(1);
  }
  .c-msg__label {
    margin-top: 12rpx;
    font-size: 30rpx;
    font-weight: 400;
    color: rgba(15,3,20,0.85);
    line-height: 46rpx;
  }
  .c-msg__date {
    height: 38rpx;
    font-size: 26rpx;
    font-weight:400;
    color:rgba(15,3,20,0.3);
    line-height:38rpx;
  }
	.c-msg-color {
		color:rgba(170,170,170,0.3);
	}
</style>
