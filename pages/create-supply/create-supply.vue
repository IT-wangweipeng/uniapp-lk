<template>
	<view class="page-container">
		<!-- 搜索 -->
		<view class="c-header"><sg-search placeholder="输入型号或档口搜索库存" @search="handleSearch"></sg-search></view>

		<!-- 列表 -->
		<view class="c-product-list">
			<view class="c-product" v-for="item in productList" :key="item.id">
				<view class="c-product__check" :class="{ 'c-product__check--checked': item.checked }" @tap.stop="handleProductCheckboxTap(item)">
					<image v-if="item.checked" class="c-product__checkbox" src="../../static/common/ic_checked@2x.png" mode="aspectFill"></image>
				</view>
				<image class="c-product__image" :src="item.img" mode="aspectFill"></image>
				<view class="c-product__content">
					<view class="c-product__title">{{item.title}}</view>
					<view class="c-product__label">库存数量：{{item.stock_num}}</view>
					<!-- <view class="c-product__label" v-if="item.id === 0">尺码：XL/XXL</view>
					<view class="c-product__label" v-if="item.id === 0">颜色：黄色、黑色</view> -->
					<view class="c-product-price">
						<view class="c-product-price__label">设置零售价</view>
						<view class="c-stepper">
							<image class="c-stepper__icon" src="../../static/common/ic_minus_orange@2x.png" mode="aspectFill" @tap.stop="handleProductPriceMinusTap(item)"></image>
							<!-- <view class="c-stepper__val">{{item.price}}</view> -->
							<input class="c-field__input" type="number" v-model="item.price" />
							<image class="c-stepper__icon" src="../../static/common/ic_plus_orange@2x.png" mode="aspectFill" @tap.stop="handleProductPricePlusTap(item)"></image>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="loading">{{ loadingText }}</view>

		<!-- footer -->
		<view class="c-footer"><button class="sg-button sg-button--square c-footer-btn" type="primary" v-if="isSupplying == 2">提交成功</button></view>
		<view class="c-footer"><button class="sg-button sg-button--square c-footer-btn" type="primary" v-if="isSupplying == 1">正在提交...</button></view>
		<view class="c-footer"><button class="sg-button sg-button--square c-footer-btn" type="primary" v-if="isSupplying == 0" @tap="handleSubmitBtnTap()">提交供货信息</button></view>
	</view>
</template>

<script>
import { GetSupplyListApi ,AllianceBatchShareApi,ProductSellBatSaveApi} from '../../api/index.js';
import _ from 'lodash'
export default {
	data() {
		return {
			productType: 0,
			group_product_buy_id:'',
			product_buy_id:'',
			startPage: 1,
			totalPage: 1,
			productList: [],
			searchTitle: '',
			store_id:'',
			loadingText: '加载中...',
			isSupplying:0,//是否正在请求供货接口
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
		// url: '/pages/create-supply/create-supply?productTpye=' + 3 + '&productBuyId=' + this.detail.id   //联盟补货
		// url: '/pages/create-supply/create-supply?productTpye=' + 0 + '&productBuyId=' + this.detail.id   //寻货宝寻货
		console.log('get options success', opt);
		this.productType = opt.productTpye;
		if(this.productType == 3){
			this.group_product_buy_id = opt.id;
		}
		if(this.productType == 0){
			this.product_buy_id = opt.id;
		}
		this.store_id = this.userInfo.current_outlet_id;
		this.getProductList();
	},

	onReachBottom() {
		if (Number(this.startPage) >= Number(this.totalPage)) {
			this.loadingText = '没有更多了~';
		} else {
			this.startPage += 1;
			this.getProductList();
		}
	},

	methods: {
		getProductList() {
			///store_id 当前店铺id;title 商品名(用于筛选);page 页码 ;uid ;group_product_buy_id:联盟补货商品id(用于供货时库存列表显示) ; product_buy_id:寻货商品id(用于供货时库存列表显示)
			GetSupplyListApi(this.store_id, this.searchTitle, this.startPage, this.uid, this.group_product_buy_id, this.product_buy_id)
				.then(res => {
					let toConcatArr = res.data.data;
					for (let i = 0; i < toConcatArr.length; i++) {
						toConcatArr[i].checked = false;
						toConcatArr[i].price = toConcatArr[i].fac_price;
					}
					this.productList = this.productList.concat(toConcatArr);
					this.totalPage = res.data.last_page;
					console.log('get GetSupplyListApi success', res);
					
					console.log('get GetSupplyListApi success this.productList == ', this.productList);
					if (this.startPage >= this.totalPage) {
						this.loadingText = '没有更多了~';
					}
					if(this.productList.length <= 0){
						this.loadingText = '什么都没有发现哦';
					}
				})
				.catch(err => {
					console.log('get GetSupplyListApi error', err);
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					});
				});
		},


		handleSearch(val) {
			console.log(val);
			this.searchTitle = val;
			this.loadingText = '加载中...';
			this.startPage = 1;
			this.productList = [];
			this.getProductList();
		},
		// 供货产品选中
		handleProductCheckboxTap(item) {
			item.checked = !item.checked;
		},
		// 减少价格
		handleProductPriceMinusTap(item) {
			if (item.price > 0) {
				item.price--;
			}
		},
		// 增加价格
		handleProductPricePlusTap(item) {
			item.price++;
		},
		
		
		// 发布供货
		handleSubmitBtnTap() {
			
			this.isSupplying = 1;
			
			if(this.productType == 0){
				
				//寻货宝供货
				let productbuyid = 0;
				if (this.product_buy_id != ''){
					productbuyid = this.product_buy_id
				}
				if (this.group_product_buy_id != ''){
					productbuyid = this.group_product_buy_id
				}
				const this_groupid = this.alliance_id;
				const products = this.productList.filter(x => x.checked);
				
				
				console.log('______________________',_);
				
				
				const ret = _.map(products, (item, index) => {
					return _.pick(item, ['id', 'price']);
				});
				let list = [];
				_.forEach(ret, (item, idx) => {
					list.push({
						product_stock_id: item.id,
						group_id: this_groupid,
						min_price: item.price,
						max_price: item.price,
						product_buy_id:productbuyid,
					});
				});
				
				console.log('share list == ', list);
				ProductSellBatSaveApi(this.uid, list)
					.then(result => {
						
						console.log('ProductSellBatSaveApi ret === ', result);
						if(result.code == 0){
							this.isSupplying = 0;
							uni.showToast({
								title: result.msg,
								icon:'none'
							});
							return;
						}
						
						
						if (result.code == 1) {
							this.isSupplying = 2;
							uni.showToast({
								title: '提交成功',
								icon: 'success',
								duration: 1000
							});
							setTimeout(function () {
							    uni.navigateBack();
							}, 1500);
				
						} else {
							this.isSupplying = 0;
							uni.showToast({
								title: '失败',
								icon: 'none'
							});
						}
					})
					.catch(err => {
						this.isSupplying = 0;
						console.log('ProductSellBatSaveApi err === ', err);
						uni.showToast({
							title: '失败' + err,
							icon: 'none'
						});
					});
				
			}
			
			if(this.productType == 3){
				
				//联盟发布供货
				let productbuyid = 0;
				if (this.product_buy_id != ''){
					productbuyid = this.product_buy_id
				}
				if (this.group_product_buy_id != ''){
					productbuyid = this.group_product_buy_id
				}
				const this_groupid = this.alliance_id;
				
				const products = this.productList.filter(x => x.checked);
				const ret = _.map(products, (item, index) => {
					return _.pick(item, ['id', 'price']);
				});
				
				
				let list = [];
				_.forEach(ret, (item, idx) => {
					list.push({
						product_stock_id: item.id,
						group_id: this_groupid,
						min_price: item.price,
						max_price: item.price,
						group_product_buy_id:productbuyid,
					});
				});
				
				console.log('share list == ', list);
				AllianceBatchShareApi(this.uid, list)
					.then(result => {
						console.log('AllianceBatchShareApi ret === ', result);
						if (result.code == 1) {
							this.isSupplying = 2;
							uni.showToast({
								title: '提交成功',
								icon: 'success',
								duration: 1000
							});
							setTimeout(function () {
							    uni.navigateBack();
							}, 1500);
				
						} else {
							
							this.isSupplying = 0;
							uni.showToast({
								title: '失败',
								icon: 'none'
							});
						}
					})
					.catch(err => {
						this.isSupplying = 0;
						console.log('AllianceBatchShareApi err === ', err);
						uni.showToast({
							title: '失败' + err,
							icon: 'none'
						});
					});
			}
			

		},
	}
};
</script>

<style lang="scss">
@import '@/common/scss/mixin.scss';
.c-field__input {
	// flex: 1;
	min-width: 72rpx;
	width: 150rpx;
	height: 44rpx;
	line-height: 44rpx;
	font-size: 30rpx;
	color: rgba(3, 11, 4, 1);
	padding: 0 18rpx;
	font-weight: bold;
	text-align: center;
	
	
	// min-width: 72rpx;
	// height: 44rpx;
	// font-size: 30rpx;
	// font-weight: bold;
	// color: rgba(3, 11, 4, 1);
	// line-height: 44rpx;
	// padding: 0 18rpx;
	// text-align: center;
}
.loading {
	text-align: center;
	line-height: 60px;
}
.page-container {
	padding-top: 120rpx;
	padding-bottom: 98rpx;
}
.c-header {
	position: fixed;
	z-index: 100;
	left: 0;
	right: 0;
	top: 0;
	width: 100%;
	background: #f4f5f6;
	padding: 24rpx;
}

// 列表
.c-product-list {
	padding: 0 24rpx;
}
.c-product {
	position: relative;
	display: flex;
	padding: 24rpx;
	background: #fff;
	border-radius: 10rpx;
	margin-bottom: 24rpx;
}
.c-product__check,
.c-product__checkbox {
	width: 36rpx;
	height: 36rpx;
	border-radius: 4rpx;
}
.c-product__check {
	position: absolute;
	left: 36rpx;
	top: 36rpx;
	z-index: 1;
	background: #fff;
	border: 1px solid rgba(201, 201, 201, 1);
}
.c-product__check--checked {
	border: none;
}
.c-product__checkbox {
	display: block;
}
.c-product__image {
	width: 180rpx;
	height: 180rpx;
	border-radius: 6rpx 6rpx 0 0;
}
.c-product__content {
	flex: 1;
	padding-left: 24rpx;
}
.c-product__title {
	height: 90rpx;
	font-size: 32rpx;
	font-weight: 400;
	color: rgba(102, 102, 102, 1);
	line-height: 45rpx;
	@include ellipsis(2);
}
.c-product__label {
	height: 34rpx;
	font-size: 28rpx;
	font-weight: 400;
	color: rgba(189, 189, 189, 1);
	line-height: 34rpx;
	@include ellipsis(1);
	margin-top: 12rpx;
}
.c-product-price {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 10rpx;
}
.c-product-price__label {
	height: 34rpx;
	font-size: 24rpx;
	font-weight: 400;
	color: rgba(0, 0, 0, 0.65);
	line-height: 34rpx;
}

// stepper
.c-stepper {
	display: flex;
	align-items: center;
}
.c-stepper__icon {
	width: 44rpx;
	height: 44rpx;
}
.c-stepper__icon:active {
	opacity: 0.6;
}
.c-stepper__val {
	min-width: 72rpx;
	height: 44rpx;
	font-size: 30rpx;
	font-weight: bold;
	color: rgba(3, 11, 4, 1);
	line-height: 44rpx;
	padding: 0 18rpx;
	text-align: center;
}

// footer
.c-footer {
	height: 98rpx;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 100;
}
.c-footer-btn {
	height: 98rpx;
	line-height: 98rpx;
	font-size: 34rpx;
	font-weight: bold;
	color: rgba(255, 255, 255, 1);
}
</style>
