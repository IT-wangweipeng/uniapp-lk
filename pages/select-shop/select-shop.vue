<template>
	<view class="page-container">
		<view class="c-shop" v-for="item in outlet_list" :key="item" @tap="goIndex(item)">
			<image class="c-shop__image" :src="item.logo" mode="aspectFill"></image>
			<view class="c-shop__name">{{ item.name }}</view>
		</view>
		<view class="loading">{{ loadingText }}</view>
	</view>
</template>

<script>
import { GetStoreListApi, ChangeStoreIdApi, GetUserInfoApi } from '../../api/index.js';
export default {
	data() {
		return {
			outlet_list: [],
			outlet_id: '',
			startPage: 1,
			totalPage: 1,
			loadingText: '加载中...'
		};
	},

	computed: {
		uid: {
			get() {
				return getApp().globalData.uid;
			}
		}
	},

	onLoad() {
		this.getStoreList();
	},

	onReachBottom() {
		if (Number(this.startPage) >= Number(this.totalPage)) {
			this.loadingText = '没有更多了~';
		} else {
			this.startPage += 1;
			this.getStoreList();
		}
	},

	methods: {
		getStoreList() {
			GetStoreListApi(this.uid)//this.uid
				.then(res => {
					console.log('GetStoreListApi res == ', res);
					this.outlet_list = this.outlet_list.concat(res.data.data);
					this.totalPage = res.data.last_page;
					if (this.startPage >= this.totalPage) {
						this.loadingText = '没有更多了~';
					}
					if(this.outlet_list.length <= 0){
						this.loadingText = '什么都没有发现哦';
					}
				})
				.catch(err => {
					console.log('GetStoreListApi error', err);
				});
		},

		goIndex(item) {
			ChangeStoreIdApi(item.id, this.uid)//this.uid
				.then(res => {
					uni.showToast({
						title: '切换成功',
						icon: 'success',
						mask: true
					});
					console.log('ChangeStoreIdApi res', res);
					if (res.code == 1) {
						this.getUserInfo();
					}
				})
				.catch(err => {
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					})
					console.log('ChangeStoreIdApi error', err);
				});
		},

		getUserInfo() {
			GetUserInfoApi(this.uid)
				.then(res => {
					console.log('ChangeStoreIdApi res', res);
					if (res.code == 1) {
						getApp().globalData.userInfo = res.data.userinfo;
						uni.switchTab({
							url: '/pages/index/index'
						});
					}
				})
				.catch(err => {
					console.log('GetStoreListApi error', err);
				});
		},
	}
};
</script>

<style lang="scss">
@import '@/common/scss/mixin.scss';
.loading {
	text-align: center;
	line-height: 50px;
}
.page-container {
	flex-direction: column;
	padding: 24rpx;
}
.c-shop {
	height: 140rpx;
	display: flex;
	background: #fff;
	padding: 30rpx 24rpx;
	align-items: center;
	border-radius: 10rpx;
}
.c-shop + .c-shop {
	margin-top: 24rpx;
}
.c-shop__image {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
}
.c-shop__name {
	flex: 1;
	padding: 0 20rpx;
	height: 45rpx;
	line-height: 45rpx;
	@include ellipsis(1);
	color: #333333;
	font-size: 32rpx;
}
</style>
