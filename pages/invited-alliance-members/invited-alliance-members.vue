<template>
	<view class="page-container">
		<!-- header 搜索框 -->
		<view class="c-header"><sg-search custom-style="background:#F4F5F6" placeholder="输入店铺名称进行搜索" @search="handleSearch"></sg-search></view>

		<!-- 邀请联盟成员 -->
		<view class="c-member-header">选择联盟成员</view>

		<!-- 联盟成员列表 -->
		<view class="c-member-list">
			<view class="c-member-item" v-for="item in members" :key="item.id" @tap="handleMemberTap(item)">
				<image class="c-member-item__image" :src="item.logo" mode="aspectFill"></image>
				<view class="c-member-item__content">
					<view class="c-member-item__name">店铺名称：{{ item.name }}</view>
					<view class="c-member-item__label">主营类别：{{ item.main_sector }}</view>
					<view class="c-member-item__label">档口地址：{{ item.address }}}</view>
				</view>
				<image v-if="!item.checked" class="c-member-item__check" src="../../static/common/circle_unchecked@2x.png" mode="aspectFill"></image>
				<image v-else class="c-member-item__check" src="../../static/common/circle_checked@2x.png" mode="aspectFill"></image>
			</view>
		</view>

		<!-- footer -->
		<view class="c-footer">
			<button class="sg-button c-send-btn" type="primary" @tap="sendInvitation()">发送邀请</button>
			<view class="c-skip-btn" @tap="jumpToAllianceDetail()">跳过</view>
		</view>

		<!-- 提示 -->
		<sg-popup v-model="invitedDialogVisible" position="center">
			<view class="c-dialog">
				<view class="c-dialog__content">确定发送联盟邀请？</view>
				<view class="c-dialog__btns">
					<view class="c-dialog__btn" @tap="invitedDialogVisible = false">取消</view>
					<view class="c-dialog__btn c-dialog__btn--active" @tap="handleInviteDialogOkTap">确定</view>
				</view>
			</view>
		</sg-popup>
	</view>
</template>

<script>
import { RecommendShopListApi, InviteMemberApi } from '../../api/index.js';

export default {
	data() {
		return {
			allianceID: '',
			allianceTitle:'',
			shopList: [],
			invitedDialogVisible: false,
			members: [],
			searchTitle:'',
		};
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
	
	
	methods: {
		handleSearch(val) {
			console.log(val);
			this.searchTitle = val;
			this.members = [];
			this.getShopList(this.allianceID);
		},

		handleMemberTap(member) {
			member.checked = !member.checked;
		},

		sendInvitation() {
			if(this.members.length <= 0){
				uni.showToast({
					title: '暂无店铺可邀请',
					icon:'none'
				});
				return;
			}
			this.invitedDialogVisible = true;
		},
		handleInviteDialogOkTap() {
			console.log('最终选择店铺 this.members  ', this.members);
			let choosed_id_arr = [];

			this.members.forEach(type => {
				if (type.checked) {
					choosed_id_arr.push(type.id);
				}
			});
			const choosed_id_str = choosed_id_arr.join(','); ///用作最终请求参数 id
			console.log(choosed_id_str);
			if (choosed_id_str.length <= 0){
				uni.showToast({
					title: '暂无店铺可邀请',
					icon:'none'
				});
				return;
			}

			InviteMemberApi(this.allianceID, choosed_id_str, this.uid)
				.then(res => {
					console.log('invite member success this.members == ', res);
					if(res.code == 1){
						this.invitedDialogVisible = false;
						
						uni.navigateTo({
							url: '/pages/alliance-detail/alliance-detail?allianceID=' + this.allianceID +'&allianceText=' + this.allianceTitle
						});
					}
				})
				.catch(err => {
					console.log('invite member  error', err);
				});
		},

		getShopList(id) {
			console.log('创建联盟 id  ', id);
			//opt是传过来的queryString对象
			RecommendShopListApi(this.allianceID, this.uid,this.searchTitle)
				.then(res => {
					const shopList = res.data;

					for (let i = 0; i < shopList.length; i++) {
						this.members.push({
							id: shopList[i].id,
							name: shopList[i].name,
							address: shopList[i].address,
							main_sector: shopList[i].main_sector,
							logo: shopList[i].logo,
							checked: false
						});
					}

					console.log('get shop list success this.members == ', this.members);
				})
				.catch(err => {
					console.log('get shop list  error', err);
				});
		},
		
		jumpToAllianceDetail(){
			uni.navigateTo({
				url: '/pages/alliance-detail/alliance-detail?allianceID=' + this.allianceID +'&allianceText=' + this.allianceTitle
			});
		},
	},
	onLoad(opt) {
		console.log('invited alliance members id == ', opt.id);
		this.allianceID = opt.id;
		this.allianceTitle = opt.allianceText
		this.getShopList(opt.id);
	}
};
</script>

<style lang="scss">
@import '@/common/scss/mixin.scss';
.page-container {
	padding-top: 120rpx;
	padding-bottom: 136rpx;
}
// header
.c-header {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	background: #fff;
	z-index: 100;
	height: 120rpx;
	padding: 24rpx;
}
.c-search {
	background: #f4f5f6;
}

// 邀请成员标题
.c-member-header {
	height: 80rpx;
	line-height: 80rpx;
	background: #fff;
	font-size: 34rpx;
	color: #666;
	font-weight: bold;
	padding: 0 24rpx;
}
// 成员列表
.c-member-list {
	background: #fff;
}
.c-member-item {
	background: #fff;
	display: flex;
	padding: 24rpx;
	@include thin-line-bottom(#f4f5f6, 24rpx, 24rpx);
}
.c-member-item__image {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
}
.c-member-item__content {
	flex: 1;
	padding: 0 20rpx;
}
.c-member-item__name {
	color: #333333;
	font-size: 32rpx;
	height: 46rpx;
	line-height: 46rpx;
	@include ellipsis(1);
}
.c-member-item__label {
	margin-top: 16rpx;
	font-size: 30rpx;
	height: 42rpx;
	line-height: 42rpx;
	@include ellipsis(1);
	color: #666666;
}
.c-member-item__check {
	width: 46rpx;
	height: 46rpx;
}

// footer
.c-footer {
	position: fixed;
	z-index: 100;
	left: 0;
	right: 0;
	bottom: 0;
	height: 136rpx;
	background: #fff;
	display: flex;
	align-items: center;
	padding: 0 24rpx;
}
.c-send-btn {
	width: 544rpx;
	height: 88rpx;
	line-height: 88rpx;
	color: #fff;
	font-size: 34rpx;
	font-weight: bold;
}
.c-skip-btn {
	flex: 1;
	color: #999999;
	font-size: 30rpx;
	height: 88rpx;
	line-height: 88rpx;
	position: relative;
	text-align: center;
}
.c-skip-btn:active {
	opacity: 0.6;
}
.c-skip-btn:after {
	position: absolute;
	width: 70rpx;
	left: 45rpx;
	bottom: 22rpx;
	height: 1px;
	content: '';
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	background-color: #d8d8d8;
	z-index: 1;
}

//dialog
.c-dialog {
	background: #fff;
}
.c-dialog__content {
	height: 216rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #1e2229;
	font-size: 36rpx;
	line-height: 1.2;
	@include thin-line-bottom(#dddddd, 0, 0);
}
.c-dialog__btns {
	display: flex;
}
.c-dialog__btn {
	flex: 1;
	height: 100rpx;
	color: #666666;
	font-size: 36rpx;
	line-height: 100rpx;
	text-align: center;
	@include thin-line-right(#dddddd, 0, 0);
}
.c-dialog__btn:active {
	opacity: 0.6;
}
.c-dialog__btn--active {
	color: #fa6400;
}
</style>
