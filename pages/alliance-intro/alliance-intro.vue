<template>
	<view class="page-container">
		<!-- 联盟简介 -->
		<view class="c-alliance-container">
			<view class="c-share" @tap="sharePopupVisible = true">
				<image class="c-share__icon" src="../../static/common/ic_share@2x.png" mode="aspectFill"></image>
				<view class="c-share__label">分享</view>
			</view>
			<image class="c-alliance-image" :src="alliance_detail.icon" :mode="aspectFill"></image>
			
			
				<input v-if="isleader == 1" class="c-calliance-title" type="text" v-model="alliance_title" @confirm="changeConfirm" :focus="setFocus">
					<image v-if="isleader == 1" class="c-calliance-title__edit" src="../../static/alliance/ic_edit@2x.png" mode="aspectFill" @tap="changeNickName"></image>
				</input>
				<view v-if="isleader == 0" class="c-calliance-title" v-model="allianceTitle">{{alliance_title}}</view>
		
			
			<view class="c-calliance-desc">
				<text space="nbsp">{{ alliance_detail.description }}</text>
			</view>
		</view>
		<view class="c-alliance-info">
			<view class="c-alliance-cell">
				<view class="c-alliance-cell__label">联盟地区</view>
				<view class="c-alliance-cell__val">{{ alliance_detail.area }}</view>
			</view>
			<view class="c-alliance-cell">
				<view class="c-alliance-cell__label">联盟类别</view>
				<view class="c-alliance-cell__val">{{ alliance_detail.category_name }}</view>
				<!-- <view class="c-alliance-cell__val">我是很长的 我真的很长 很长 我是很长的 我真的很长 很长 我是很长的 我真的很长 很长的我</view> -->
			</view>
			<!-- <view class="c-alliance-cell">
				<view class="c-alliance-cell__label">联盟分类</view>
				<view class="c-alliance-cell__val">{{ alliance_detail.category_name }}</view>
			</view> -->
			<view class="c-alliance-cell">
				<view class="c-alliance-cell__label">联盟盟主</view>
				<view class="c-alliance-cell__val">
					<image class="c-alliance-cell__portrait" :src="alliance_detail.user_avatar" mode="aspectFill"></image>
					{{ alliance_detail.user_name }}
				</view>
			</view>
			<view class="c-alliance-cell">
				<view class="c-alliance-cell__label">店主星级</view>
				<view class="c-alliance-cell__val">
					<image
						class="c-alliance-cell__star"
						v-for="(star, starIndex) in 5"
						:key="star"
						:src="starIndex < alliance_detail.level ? '/static/common/ic_star_active@2x.png' : '/static/common/ic_star_inactive@2x.png'"
						mode="aspectFill"
					></image>

				</view>
			</view>
			<view class="c-alliance-cell">
				<view class="c-alliance-cell__label">店铺地址</view>
				<view class="c-alliance-cell__val">{{ alliance_detail.outlet.address }}</view>
			</view>
			
		</view>
		<!-- 联盟成员管理 -->
		<view v-if="isleader == 1" class="c-alliance-member" @tap="goMemberManagePage()">
			<view class="c-alliance-member__label">联盟成员</view>
			<view class="c-alliance-member__val">管理</view>
			<image class="c-alliance-member__arrow" src="../../static/common/ic_arrow_right_gury@2x.png" mode="aspectFill"></image>
		</view>
		<!-- 商品 -->
		<view class="c-product-container">
			<view class="c-product-title">
				联盟最新分享商品
				<!-- <view class="c-product-more">更多</view> -->
			</view>
			<view class="c-product-list">
				<!-- @tap="goProductDetailPage(item)" -->
				<view class="c-product-item" v-for="item in shareGoodsList" :key="item">
					<image class="c-product-item__image" :src="item.product.img" mode="aspectFill"></image>
					<!-- <view class="c-product-item__title">{{item.product.stalls}}</view> -->
					<!-- <view class="c-product-item__price">
						<view class="c-product-item__price-label">价格：</view>
						<view class="c-product-item__price-value">￥{{item.min_price}} ~ ￥{{item.max_price}}</view>
					</view> -->
				</view>
			</view>
		</view>

		<!-- 退出联盟 -->
		<view v-if="status === 1 && isleader === 0" class="c-exit-alliance-container"><view class="c-exit-alliance"  @tap="quitAlliance">退出联盟</view></view>
		<view v-if="isleader === 1" class="c-exit-alliance-container"><view class="c-exit-alliance"  @tap="deleteAlliance">删除联盟</view></view>

		<!-- footer -->
		<view class="c-footer">
			<button v-if="status === 0" class="sg-button sg-button--square c-footer-btn" type="primary" @tap="joinAllianceDialogVisible = true">加入联盟</button>
			<view v-if="status === 2" class="c-footer-btn c-footer-btn--disabled">等待盟主审核</view>
			<button v-if="status === 1" class="sg-button sg-button--square c-footer-btn" type="primary" @tap="goAllianceContent">进入联盟</button>
		</view>

		<!-- 加入联盟提示 -->
		<sg-popup v-model="joinAllianceDialogVisible" position="center">
			<view class="c-dialog">
				<view class="c-dialog__title">是否申请加入该联盟？</view>
				<view class="c-dialog__content">提交申请后，部分联盟需要等待盟主审核后方可成功加入。</view>
				<view class="c-join-notice">
					<view class="c-join-notice__check" @tap="acceptAgreement = !acceptAgreement">
						<image v-if="acceptAgreement" class="c-join-notice__icon" src="../../static/common/ic_checked@2x.png" mode="aspectFill"></image>
					</view>
					<view class="c-join-notice__label" @tap="acceptAgreement = !acceptAgreement">
						同意
						<view class="c-join-notice__agreement" @tap.stop="goAllianceAgreementPage">加入联盟须知</view>
					</view>
				</view>
				<view class="c-dialog__btns">
					<view class="c-dialog__btn" @tap="joinAllianceDialogVisible = false">取消</view>
					<view class="c-dialog__btn c-dialog__btn--active" @tap="handleJoinAllianceDialogOkTap">确定</view>
				</view>
			</view>
		</sg-popup>

		<!-- 分享 -->
		<sg-popup v-model="sharePopupVisible" position="bottom">
			<view class="c-share-dialog">
				<view class="c-share-dialog__title">分享至：</view>
				<view class="c-share-dialog__content">
					<button open-type="share" class="c-share-app" src="../../static/common/wechat@2x.png" @tap="shareToWechat">
						<image class="c-share-wechat" src="../../static/common/wechat@2x.png" mode="aspectFit" ></image>
					</button>
					
					<!-- <image class="c-share-app" src="../../static/common/wechat@2x.png" mode="aspectFit" @tap="shareToWechat"></image> -->
					<!-- <image class="c-share-app" src="../../static/common/wechat_friend_circle@2x.png" mode="aspectFit" @tap="share"></image>
					<image class="c-share-app" src="../../static/common/qq@2x.png" mode="aspectFit" @tap="share"></image> -->
				</view>
			</view>
		</sg-popup>
	</view>
</template>

<script>
import { AllianceDetailApi, NewShareGoodsApi ,ChangeAllianceNameApi,ApplyJoinAllianceApi,QuitAllianceApi,DeleteAllianceApi} from '../../api/index.js';
export default {
	data() {
		return {
			status: 0, // 0未加入 1审核中 2已加入
			joinAllianceDialogVisible: false, // 加入联盟dialog
			acceptAgreement: true, // 同意加入联盟须知
			sharePopupVisible: false, // 显示分享popup
			desc: '      联盟说明联盟说明联盟说明联盟说明联盟说明联盟说明联盟说明联盟说明联盟说明联盟说明联盟说明联盟说明',
			allianceID: '',
			alliance_detail: {},
			shareGoodsList: [],
			alliance_title:'',
			isleader:0,
			setFocus :false,
			need_check :true,
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
	onShareAppMessage(res) {
		if (res.from === 'button') {// 来自页面内分享按钮
			console.log('右上角分享点击：', res.target, this.allianceID)
		}
		return {
		  title: this.alliance_title || '零库',
		  path: `/pages/alliance-intro/alliance-intro?id=${this.allianceID}`,
		}
	},
	onLoad(opt) {
		
		console.log('联盟详情页联盟 onload opt== ', opt);
		//opt是传过来的queryString对象
		this.allianceID = opt.id;
		console.log('联盟详情页联盟 this.allianceID == ', this.allianceID);
		this.getAllianceIntro();
		
	},
	onShow() {
		this.getShareGoodsList(this.allianceID);
	},
	
	
	
	methods: {
		
		getAllianceIntro(){
			
			AllianceDetailApi(this.allianceID, this.uid)
				.then(res => {
					this.alliance_detail = res.data;
					this.alliance_title = this.alliance_detail.title;
					this.isleader = this.alliance_detail.is_group;
					this.status = this.alliance_detail.is_join;
					
					if(res.data.need_check === 2){
						console.log('res.data.need_check == ', res.data.need_check);
						this.need_check = false
					}
					
					console.log('get Alliance detail success', res.data);
				})
				.catch(err => {
					console.log('get Alliance detail error', err);
					uni.showToast({
						title: '获取失败' + err,
						icon: 'none'
					});
			
				});
			
		},
		
		changeNickName(){
			this.setFocus = true;
		},
		
		changeConfirm(event){
			console.log('------------------event',event.target.value)
			this.alliance_title = event.target.value;
			this.changeAllianceName();
		},
		getShareGoodsList(id) {
			NewShareGoodsApi(id,this.uid)
				.then(res => {
					console.log('get shareGoodsList success',res);
					this.shareGoodsList = res.data;
					console.log('get shareGoodsList success', this.shareGoodsList);
				})
				.catch(err => {
					console.log('get shareGoodsList error', err);
				});
		},

		handleJoinAllianceDialogOkTap() {
			
			console.log('need check == ', this.need_check);
			const id = getApp().globalData.uid;
			if (id == undefined) {
				uni.navigateTo({
					url: '../login/login'
				})
				return;
			}
			
			
			
			if(this.acceptAgreement){
				this.joinAllianceDialogVisible = false;
				ApplyJoinAllianceApi(this.allianceID,getApp().globalData.uid)
					.then(res => {
						console.log('ApplyJoinAllianceApi success', this.shareGoodsList);
						
						
						
						if(this.need_check == true) {
							this.status = 2;
							uni.showToast({
								title: '成功提交审核'
							});

						} else {
							this.status = 1;
							uni.showToast({
								title: '成功加入联盟'
							});
						}

					})
					.catch(err => {
						
						uni.showToast({
							title: '提交审核失败',
							icon:'none'
						});
						console.log('ApplyJoinAllianceApi error', err);
					});
				
			} else {
				
				return;
				
			}

		},
		
		quitAlliance(){
			
			QuitAllianceApi(this.allianceID,getApp().globalData.uid)
				.then(res => {
					console.log('QuitAllianceApi success', this.shareGoodsList);
					
					this.status = 0;
					uni.showToast({
						title: '退出成功',
						icon: 'success'
					});
					this.getAllianceIntro();
				})
				.catch(err => {
					uni.showToast({
						title: '退出失败'+ err,
						icon: 'none'
					});
					console.log('QuitAllianceApi error', err);
				});
		},
		
		
		deleteAlliance(){
			DeleteAllianceApi(this.allianceID,getApp().globalData.uid)
				.then(res => {
					console.log('QuitAllianceApi success', res);
					
					if(res.code == 0){
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
						
						return;
					}
					
					uni.showToast({
						title: '删除成功',
						icon: 'none'
					});
					setTimeout(() => {
					  uni.navigateBack();
					}, 500);
					
					
				})
				.catch(err => {
					uni.showToast({
						title: err,
						icon: 'none'
					});
					console.log('QuitAllianceApi error', err);
				});
		},
		
		goAllianceContent() {
			uni.navigateTo({
				url: '/pages/alliance-detail/alliance-detail?allianceID=' + this.allianceID +'&allianceText=' + this.alliance_title
			});
		},
		
		
		changeAllianceName(){
			let postData = {
				id:this.alliance_detail.id,
				icon :this.alliance_detail.icon,
				title :this.alliance_title,
				area :this.alliance_detail.area,
				category_id :this.alliance_detail.category_id,
				need_check :this.alliance_detail.need_check,
				description :this.alliance_detail.description,
				uid:this.uid,
				city:this.alliance_detail.city
			}
			ChangeAllianceNameApi(postData)
				.then(res => {
					
					if(res.code == 1){
						uni.showToast({
							title: '修改成功',
							icon: 'success'
						})
						
					} else {
						
						uni.showToast({
							title: '修改失败',
							icon: 'none'
						})
						
					}
					
					
					console.log('ChangeAllianceNameApi success', res.data);
				})
				.catch(err => {
					console.log(' ChangeAllianceNameApi error', err);
				});
		},
		// 分享到微信
		shareToWechat() {
			
			console.log('alliance_detail === ', this.alliance_detail, this.alliance_title)
			
			//#ifdef APP-PLUS
			uni.share({
			    provider: 'weixin',
			    scene: "WXSceneSession",
			    type: 5,
			    imageUrl: this.alliance_detail.icon,
			    title: this.alliance_title || '零库',
			    miniProgram: {
			        id: 'gh_b6112a3ecee1',
			        path: `/pages/alliance-intro/alliance-intro?id=${this.allianceID}`,
			        type: 0,
			        webUrl: 'http://uniapp.dcloud.io'
			    },
			    success: ret => {
						uni.showToast({
							title: '分享成功',
							icon: 'success'
						})
			    },
					fail: (err) => {
						uni.showToast({
							title: '分享失败',
							icon: 'failed'
						})
					}
			});
			//#endif
		},
		
		// 分享
		share() {
			this.sharePopupVisible = false;
		},
		// 联盟须知页面
		goAllianceAgreementPage() {
			uni.navigateTo({
				url: '/pages/alliance-join-agreement/alliance-join-agreement'
			});
		},
		// 成员管理
		goMemberManagePage() {
			uni.navigateTo({
				url: '/pages/alliance-member-manage/alliance-member-manage?id='+ this.alliance_detail.id
			});
		},
		// 产品详情
		goProductDetailPage(item) {
			// uni.navigateTo({
			// 	url: '/pages/product-detail/product-detail'
			// });
			uni.navigateTo({
				url: '/pages/product-detail/product-detail?id=' + item.id + '&type=' + 0
			});
		}
	}
};
</script>

<style lang="scss">
@import '@/common/scss/mixin.scss';
.page-container {
	padding-bottom: 98rpx;
}
.c-alliance-container {
	position: relative;
	background: #fff;
	text-align: center;
	padding: 32rpx;
	@include thin-line-bottom(#f4f5f6, 24rpx, 24rpx);
}
.c-share {
	position: absolute;
	top: 37rpx;
	right: 0;
	z-index: 1;
	border-radius: 100rpx 0rpx 0rpx 100rpx;
	background: rgba(244, 245, 246, 0.8);
	height: 64rpx;
	padding-left: 16rpx;
	padding-right: 24rpx;
	display: flex;
	align-items: center;
}
.c-share:active {
	opacity: 0.6;
}
.c-share__icon {
	width: 54rpx;
	height: 54rpx;
}
.c-share__label {
	height: 42rpx;
	font-size: 30rpx;
	font-weight: 400;
	color: rgba(102, 102, 102, 1);
	line-height: 42rpx;
	margin-left: 12rpx;
}

.c-alliance-image {
	width: 180rpx;
	height: 180rpx;
	margin-top: 32rpx;
	border-radius: 50%;
}
.c-calliance-title {
	font-size: 34rpx;
	font-weight: bold;
	color: rgba(0, 0, 0, 1);
	line-height: 46rpx;
	opacity: 0.85;
	margin-top: 32rpx;
	text-align: center;
}
.c-calliance-title__edit {
	width: 54rpx;
	height: 54rpx;
	display: inline-block;
	vertical-align: bottom;
}
.c-calliance-title__edit:active {
	opacity: 0.6;
}
.c-calliance-desc {
	text-align: left;
	margin-top: 32rpx;
	font-size: 32rpx;
	color: rgba(102, 102, 102, 1);
	line-height: 46rpx;
}

// 联盟信息
.c-alliance-info {
	padding: 12rpx 24rpx;
	background: #fff;
}
.c-alliance-cell {
	height: 64rpx;
	display: flex;
	align-items: center;
}
.c-alliance-cell__label,

.c-alliance-cell__val {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	text-align: left;

	height: 64rpx;
	line-height: 64rpx;
	font-size: 32rpx;
	font-weight: 400;
	color: rgba(153, 153, 153, 1);
}

.c-alliance-cell-text{
	padding-left: 10upx;
	padding-top: 10upx;
	// white-space: nowrap;
	text-align: left;
	// overflow: hidden;
	// text-overflow: ellipsis;
	
	height: 64rpx;
	line-height: 64rpx;
	font-size: 32rpx;
	font-weight: 400;
	
	color: rgba(153, 153, 153, 1);
}

.c-alliance-cell__val {
	flex: 1;
	padding-left: 32rpx;
	display: flex;
	align-items: center;
	color: #666666;
}
.c-alliance-cell__portrait {
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	margin-right: 18rpx;
}
.c-alliance-cell__star {
	width: 30rpx;
	height: 30rpx;
	margin-right: 5rpx;
}
// 联盟成员管理
.c-alliance-member {
	height: 94rpx;
	@include thin-line-top(#f4f5f6, 24rpx, 24rpx);
	display: flex;
	align-items: center;
	padding: 0 24rpx;
	background: #fff;
}
.c-alliance-member:active {
	background: #f4f5f6;
}
.c-alliance-member__label,
.c-alliance-member__val {
	font-size: 32rpx;
	font-weight: 400;
	color: rgba(153, 153, 153, 1);
	line-height: 30rpx;
}
.c-alliance-member__val {
	flex: 1;
	text-align: right;
}
.c-alliance-member__arrow {
	width: 36rpx;
	height: 36rpx;
	margin-left: 32rpx;
}

// 商品
.c-product-container {
	position: relative;
	padding: 12rpx 24rpx;
	background: #fff;
	margin-top: 24rpx;
}
.c-product-title {
	position: relative;
	height: 106rpx;
	font-size: 36rpx;
	font-weight: bold;
	color: rgba(102, 102, 102, 1);
	line-height: 106rpx;
}
.c-product-more {
	position: absolute;
	right: 0;
	top: 0;
	z-index: 1;
	height: 106rpx;
	font-size: 32rpx;
	font-weight: 400;
	color: rgba(250, 100, 0, 1);
	line-height: 106rpx;
}
.c-product-more:active {
	opacity: 0.6;
}
// 商品列表
.c-product-list {
	background: #fff;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}
.c-product-item {
	width: 340rpx;
	border-radius: 12rpx;
	box-shadow: 0px 0px 6rpx 0px rgba(0, 0, 0, 0.2);
	margin-bottom: 24rpx;
	overflow: hidden;
	padding-bottom: 16rpx;
}
.c-product-item__image {
	width: 340rpx;
	height: 340rpx;
	border-top-left-radius: 12rpx;
	border-top-right-radius: 12rpx;
}
.c-product-item__title {
	margin-top: 14rpx;
	padding: 0 16rpx;
	color: rgba(15, 3, 20, 0.65);
	font-size: 30rpx;
	height: 84rpx;
	line-height: 42rpx;
	font-weight: normal;
	@include ellipsis(2);
}
.c-product-item__price {
	display: flex;
	margin-top: 14rpx;
	padding: 0 16rpx;
}
.c-product-item__price-label {
	height: 40rpx;
	line-height: 40rpx;
	color: rgba(0, 0, 0, 0.65);
	font-size: 24rpx;
}
.c-product-item__price-value {
	height: 40rpx;
	line-height: 40rpx;
	flex: 1;
	color: #fa6400;
	font-size: 25rpx;
}
// 退出联盟
.c-exit-alliance-container {
	background: #fff;
	padding-bottom: 32rpx;
	display: flex;
	justify-content: center;
}
.c-exit-alliance {
	width: 622rpx;
	color: #ef4345;
	border: 1px solid #ef4345;
	height: 88rpx;
	line-height: 88rpx;
	text-align: center;
	border-radius: 6rpx;
}
.c-exit-alliance:active {
	opacity: 0.6;
}
// footer
.c-footer {
	position: fixed;
	left: 0;
	bottom: 0;
	right: 0;
	z-index: 100;
	height: 98rpx;
}
.c-footer-btn {
	width: 100%;
	height: 98rpx;
	line-height: 98rpx;
	color: #fff;
	font-weight: bold;
	font-size: 34rpx;
}
.c-footer-btn--disabled {
	background: #d5d5d5;
	color: #262626;
	text-align: center;
	border-radius: 4rpx;
}
// 申请加入联盟提示
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
.c-join-notice {
	height: 84rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
.c-join-notice__check {
	width: 38rpx;
	height: 38rpx;
	border-radius: 4rpx;
	border: 2rpx solid rgba(0, 0, 0, 0.1);
}
.c-join-notice__icon {
	display: block;
	width: 36rpx;
	height: 36rpx;
	border-radius: 4rpx;
}
.c-join-notice__label {
	height: 33rpx;
	font-size: 24rpx;
	font-weight: 400;
	color: rgba(38, 38, 38, 1);
	line-height: 1;
	display: flex;
	align-items: center;
	margin-left: 24rpx;
}
.c-join-notice__agreement {
	height: 33rpx;
	font-size: 24rpx;
	font-weight: 400;
	color: #2681ff;
	line-height: 33rpx;
}

// 分享
.c-share-dialog {
	// height: 430rpx;
}
.c-share-dialog__title {
	height: 46rpx;
	font-size: 32rpx;
	font-weight: bold;
	color: rgba(15, 3, 20, 0.65);
	line-height: 46rpx;
	text-align: center;
	margin: 48rpx 0;
}
.c-share-dialog__content {
	display: flex;
	align-items: center;
	justify-content: space-around;
	margin-bottom: 64rpx;
}
button:after {  
    border: none;  
}
.c-share-app {
	width: 122rpx;
	height: 124rpx;
	background: #FFFFFF;
	justify-content: center;
	align-items: center;
}
.c-share-wechat {
	position: absolute;
	width: 122rpx;
	height: 124rpx;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}
.c-share-app:active {
	opacity: 0.6;
}
</style>
