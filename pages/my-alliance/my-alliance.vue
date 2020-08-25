<template>
	<view class="page-container">
		<view class="c-header">
			<!-- 搜索 -->
			<sg-search placeholder="输入联盟主题搜索" @search="handleSearch"></sg-search>
			<!-- 类别 -->
			<view class="c-tabs">
				<view class="c-tab" :class="{ 'c-tab--active': activeTabIndex === 0 }" @tap="handleTabTap(0)">我创建的</view>
				<view class="c-tab" :class="{ 'c-tab--active': activeTabIndex === 1 }" @tap="handleTabTap(1)">我加入的</view>
				<view class="c-tab" :class="{ 'c-tab--active': activeTabIndex === 2 }" @tap="handleTabTap(2)">待审核的</view>
			</view>
		</view>
		<!-- 列表 -->
		<view class="c-alliance-list" v-if="activeTabIndex !== 2">
			<view class="c-alliance-item" v-for="item in allianceList" :key="item" @tap="goAllianceDetail(item.id)">
				<view class="c-alliance-item__left">
					<image class="c-alliance-item__image" :src="item.icon" mode="aspectFill"></image>
					<!-- <view class="c-alliance-item__tip">99+</view> -->
				</view>
				<view class="c-alliance-item__content">
					<view class="c-alliance-item__title">{{item.title}}</view>
					<view class="c-alliance-item__date">{{item.create_time}}</view>
					<view class="c-alliance-item__msg">最新消息：{{item.msg}}</view>
				</view>
			</view>
		</view>
		<view class="c-alliance-list" v-else>
			<view class="c-alliance-item" v-for="item in allianceList" :key="item" @tap="goAllianceDetail(item.id)">
				<view class="c-alliance-item__left">
					<image class="c-alliance-item__image" src="item.icon" mode="aspectFill"></image>
					<!-- <view class="c-alliance-item__tip">99+</view> -->
				</view>
				<view class="c-alliance-item__content">
					<view class="c-alliance-item__title c-alliance-item__title--hasarrow">{{item.title}}</view>
					<image class="c-alliance-item__arrow" src="item.icon" mode="aspectFill"></image>
					<view class="c-alliance-item__date">盟主：{{item.nickname}}</view>
					<view class="c-alliance-item__desc">推荐商品数:{{item.product_count}}件</view>
					<view class="c-alliance-item__status">等待审核</view>
				</view>
			</view>
		</view>
		<view class="loading">{{ loadingText }}</view>
	</view>
</template>

<script>
import { AllianceListApi } from '../../api/index.js';
export default {
	data() {
		return {
			activeTabIndex: 0, // 选中的类型
			allianceList: [],
			startPage: 1,
			category_id: '',
			product_category_id: '',
			area: '',
			totalPage: 1,
			loadingText: '加载中...',
			type:'1',
			search_title:''
		};
	},
	onLoad() {
		
	},
	
	onPullDownRefresh() {
		
		//请求
		this.startPage = 1;
		this.allianceList = [];
		this.loadingText = '加载中...',
		this.getAllianceListByType(this.type);
		
		
		console.log('refresh');
		setTimeout(function() {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	
	onShow() {
		this.startPage = 1;
		this.allianceList = [];
		this.loadingText = '加载中...',
		this.getAllianceListByType(this.type);
	},
	
	computed: {
		uid: {
			get() {
				return getApp().globalData.uid;
			}
		},
	
		userInfo: {
			get() {
				return getApp().globalData.userInfo;
			}
		}
	},
	
	onReachBottom() {
		if (Number(this.startPage) >= Number(this.totalPage)) {
			this.loadingText = '没有更多了~';
		} else {
			this.startPage += 1;
			this.getAllianceListByType();
		}
	},

	methods: {
		handleSearch(val) {
			console.log(val);
			this.search_title = val;
			this.startPage = 1;
			this.allianceList = [];
			this.loadingText = '加载中...',
			this.getAllianceListByType();
		},
		
		// 切换tab
		handleTabTap(val) {
			this.startPage = 1;
			this.allianceList = [];
			this.loadingText = '加载中...',
			this.activeTabIndex = val;
			let type = '';
			if(val == 0){
				type = '1';
			}
			if(val == 1){
				type = '2';
			}
			if(val == 2){
				type = '3';
			}
			this.type = type;
			this.getAllianceListByType();
		},
		
		
		getAllianceListByType() {
			//请求默认（我创建的）列表
			let postData = {
				category_id: this.category_id,
				area: this.area,
				product_category_id: this.product_category_id,
				title: this.search_title,
				type: this.type,
				limit: 10,
				page: this.startPage,
				uid: this.uid,
			};
			console.log('get AllianceList post data', postData);
			AllianceListApi(postData)
				.then(res => {
					
					this.allianceList = this.allianceList.concat(res.data.data);
					this.totalPage = res.data.last_page;
					if (Number(this.startPage) >= Number(this.totalPage)) {
						this.loadingText = '没有更多了~';
					}
					if(this.allianceList.length <= 0){
						this.loadingText = '什么都没有发现哦';
					}
					console.log('get AllianceList success by type = ' ,res.data);
				})
				.catch(err => {
					console.log('get AllianceList error', err);
				});
		},
		
		goAllianceDetail(id) {
			console.log('准备传递的 联盟id == ' ,id);
			uni.navigateTo({
				url: '/pages/alliance-intro/alliance-intro?id='+ id
				
			});
		},
		
		
		go(url) {
			uni.navigateTo({
				url
			});
		},
	}
};
</script>

<style lang="scss">
@import '@/common/scss/mixin.scss';

.loading {
	text-align: center;
	line-height: 80px;
}

.page-container {
	padding-top: 198rpx;
}
.c-header {
	position: fixed;
	z-index: 100;
	left: 0;
	right: 0;
	top: 0;
	height: 198rpx;
	width: 100%;
	background: #f4f5f6;
	padding: 24rpx 24rpx 0;
}
// tabs
.c-tabs {
	height: 102rpx;
	display: flex;
	align-items: center;
	background: #f4f5f6;
}
.c-tab {
	position: relative;
	flex: 1;
	height: 102rpx;
	font-size: 32rpx;
	font-weight: 400;
	color: #666666;
	line-height: 102rpx;
	text-align: center;
}
.c-tab--active {
	color: #262626;
	font-weight: bold;
}
.c-tab--active:after {
	content: '';
	position: absolute;
	z-index: 1;
	left: 50%;
	top: 76rpx;
	transform: translateX(-50%);
	width: 72rpx;
	height: 8rpx;
	border-radius: 4rpx;
	background: #ef4345;
}
// 联盟列表
.c-alliance-list {
	background: rgba(255, 255, 255, 1);
	box-shadow: 0 0 10rpx 0 rgba(15, 3, 20, 0.1);
	border-radius: 20rpx 20rpx 0 0;
	overflow: hidden;
	min-height: calc(100vh - 198rpx);
}
.c-alliance-item {
	position: relative;
	display: flex;
	background: #fff;
	padding: 24rpx;
}
.c-alliance-item__left {
	position: relative;
}
.c-alliance-item__image {
	width: 204rpx;
	height: 152rpx;
	box-shadow: 0 0 4rpx 0 rgba(0, 0, 0, 0.2);
	border-radius: 4rpx;
}
.c-alliance-item__tip {
	position: absolute;
	right: 0;
	top: 0;
	z-index: 1;
	background: #ef4345;
	border-radius: 17rpx;
	height: 34rpx;
	min-width: 34rpx;
	text-align: center;
	line-height: 34rpx;
	padding: 0 6rpx;
	color: #fff;
	font-size: 24rpx;
}
.c-alliance-item__content {
	position: relative;
	flex: 1;
	padding-left: 24rpx;
}
.c-alliance-item__title {
	height: 46rpx;
	font-size: 32rpx;
	font-weight: bold;
	color: rgba(0, 0, 0, 1);
	line-height: 46rpx;
	@include ellipsis(1);
}
.c-alliance-item__title--hasarrow {
	padding-right: 38rpx;
}
.c-alliance-item__date {
	margin-top: 3rpx;
	height: 40rpx;
	font-size: 28rpx;
	font-weight: 400;
	color: rgba(0, 0, 0, 0.45);
	line-height: 40rpx;
}
.c-alliance-item__msg {
	margin-top: 4rpx;
	height: 68rpx;
	font-size: 24rpx;
	font-weight: 400;
	color: rgba(102, 102, 102, 1);
	line-height: 34rpx;
	@include ellipsis(2);
}
.c-alliance-item__desc {
	margin-top: 38rpx;
	height: 34rpx;
	font-size: 24rpx;
	font-weight: 400;
	color: rgba(0, 0, 0, 0.45);
	line-height: 34rpx;
	padding-right: 138rpx;
	@include ellipsis(1);
}
.c-alliance-item__status {
	position: absolute;
	right: 0;
	bottom: 0;
	z-index: 1;
	width: 138rpx;
	height: 54rpx;
	line-height: 54rpx;
	text-align: center;
	background: rgba(213, 213, 213, 1);
	border-radius: 4rpx;
	color: #fff;
	font-weight: bold;
	font-size: 26rpx;
}
.c-alliance-item__arrow {
	position: absolute;
	right: 0;
	top: 4rpx;
	z-index: 1;
	width: 38rpx;
	height: 38rpx;
}
</style>
