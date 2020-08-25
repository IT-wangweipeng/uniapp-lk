<template>
	<view class="page-container">
		<!-- 成员列表 -->
		<view class="c-member" v-for="item in members" :key="item.id" @tap="handleMemberTap(item)">
			<image class="c-member__image" :src="item.logo" mode="aspectFill"></image>
			<view class="c-member__name">{{ item.name }}</view>
			<view class="c-member__check" v-if="isManageStatus">
				<image v-if="item.checked" class="c-member__checkbox" src="../../static/common/circle_checked@2x.png" mode="aspectFill"></image>
				<image v-if="!item.checked" class="c-member__checkbox" src="../../static/common/circle_unchecked@2x.png" mode="aspectFill"></image>
			</view>
		</view>

		<!-- footer -->
		<view class="c-footer">
			<button v-if="!isManageStatus && showRemoverBtn" class="sg-button sg-button--square c-footer-btn" type="primary" @tap="handleManageBtnTap">管理</button>
			<button v-if="isManageStatus && showRemoverBtn" class="sg-button sg-button--square c-footer-btn" type="primary" @tap="showRemoveMemberPopup">移除成员</button>
		</view>

		<!-- 移除成员提示 -->
		<sg-popup v-model="removeMemberPopupVisible" position="center">
			<view class="c-dialog">
				<view class="c-dialog__title">确定移除选中的成员？</view>
				<view class="c-dialog__content">移除后将不可撤回</view>
				<view class="c-remove-reason">
					<input
						v-if="removeMemberPopupVisible"
						class="c-remove-reason__input"
						v-model="remove_reason"
						placeholder-class="c-remove-reason__placeholder"
						placeholder="请输入移除成员的原因描述"
					/>
				</view>
				<view class="c-dialog__btns">
					<view class="c-dialog__btn" @tap="removeMemberPopupVisible = false">取消</view>
					<view class="c-dialog__btn c-dialog__btn--active" @tap="handleRemoveMember">确定</view>
				</view>
			</view>
		</sg-popup>
		
		<view class="loading" v-if="showNoMembers">{{ loadingText }}</view>
		
	</view>
</template>

<script>
import { AllianceMemberApi, RemoveMeberApi } from '../../api/index.js';
export default {
	data() {
		return {
			allianceID: '',
			isManageStatus: false, // 是否是管理状态
			removeMemberPopupVisible: false, // 显示删除成员popup
			members: [],
			remove_reason: '',
			loadingText:'当前没有联盟成员',
			showNoMembers:false,
			showRemoverBtn:false,
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

	onLoad(opt) {
		this.allianceID = opt.id;
		this.getAllianceMember();
	},

	methods: {
		getAllianceMember() {
			AllianceMemberApi(this.allianceID, this.uid)
				.then(res => {
					const memberList = res.data;
					this.members = [];
					for (let i = 0; i < memberList.length; i++) {
						this.members.push({
							id: memberList[i].id,
							name: memberList[i].outlet.name,
							logo: memberList[i].outlet.logo,
							checked: false
						});
					}
					console.log('get member list success this.members == ', this.members);
					if(this.members.length <= 0) {
						this.showNoMembers = true;
						this.showRemoverBtn = false;
					} else {
						this.showNoMembers = false;
						this.showRemoverBtn = true;
					}
					
					
				})
				.catch(err => {
					console.log('get Alliance member error', err);
					uni.showToast({
						title: '暂无成员',
						icon: 'none'
					});
				});
		},

		// 点击成员
		handleMemberTap(member) {
			if (!this.isManageStatus) {
				return;
			}
			member.checked = !member.checked;
		},
		// 点击管理按钮
		handleManageBtnTap() {
			this.isManageStatus = true;
		},
		// 移除成员
		showRemoveMemberPopup() {
			this.removeMemberPopupVisible = true;
		},
		handleRemoveMember() {
			let msg = this.remove_reason;
			console.log('remove reason', this.remove_reason);
			let choosed_id_arr = [];
			this.members.forEach(type => {
				if (type.checked) {
					choosed_id_arr.push(type.id);
				}
			});
			const choosed_id_str = choosed_id_arr.join(','); ///用作最终请求参数 id
			console.log(choosed_id_str);

			//group_id,uid,ids,msg
			RemoveMeberApi(this.allianceID, this.uid, choosed_id_str, msg)
				.then(res => {
					console.log('get RemoveMeberApi success', res);
					this.removeMemberPopupVisible = false;
					uni.showToast({
						title: '成功移除成员',
						icon: 'success'
					});
					
					this.getAllianceMember();
				})
				.catch(err => {
					console.log('get RemoveMeberApi error', err);
					uni.showToast({
						title: '移除失败',
						icon: 'none'
					});
				});
		}
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
	background: #fff;
	padding-bottom: 98rpx;
}

//  成员列表
.c-member {
	height: 140rpx;
	padding: 30rpx 24rpx;
	display: flex;
	align-items: center;
	@include thin-line-bottom(#f4f5f6, 24rpx, 24rpx);
}
.c-member__image {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
}
.c-member__name {
	flex: 1;
	height: 45rpx;
	font-size: 32rpx;
	font-weight: 400;
	color: rgba(51, 51, 51, 1);
	line-height: 45rpx;
	padding-left: 20rpx;
	padding-right: 20rpx;
	@include ellipsis(1);
}
.c-member__check {
	display: flex;
	height: 100%;
	align-items: center;
	justify-content: center;
}
.c-member__checkbox {
	width: 46rpx;
	height: 46rpx;
}

// footer
.c-footer {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	height: 98rpx;
	z-index: 100;
}
.c-footer-btn {
	width: 100%;
	height: 98rpx;
	line-height: 98rpx;
	font-weight: bold;
	color: #fff;
	font-size: 34rpx;
}

// 删除成员提示
.c-dialog {
	background: #fff;
}
.c-dialog__title {
	height: 118rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #1e2229;
	font-size: 36rpx;
	line-height: 1.2;
}
.c-dialog__content {
	padding: 0 32rpx;
	font-size: 30rpx;
	font-weight: 400;
	color: rgba(158, 164, 171, 1);
	line-height: 45rpx;
	text-align: center;
}
.c-dialog__btns {
	display: flex;
	@include thin-line-top(#dddddd, 0, 0);
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
.c-remove-reason {
	padding: 32rpx;
	height: 148rpx;
}
.c-remove-reason__input {
	border: 1px solid #d5d5d5;
	border-radius: 10rpx;
	width: 100%;
	height: 84rpx;
	min-height: 84rpx;
	font-size: 32rpx;
	color: #000;
	line-height: 84rpx;
	padding: 0 20rpx;
}
.c-remove-reason__placeholder {
	color: #bdbdbd;
}
</style>
