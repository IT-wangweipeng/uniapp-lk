<template>
	<view class="page-container">
		<!-- header -->
		<view class="c-header">
			<view class="c-search-bar">
				<!-- 搜索 -->
				<view class="c-search"><sg-search placeholder="搜索" @search="handleSearch"></sg-search></view>
				<!-- 我的联盟 -->
				<view class="c-my-alliance" @tap="go('/pages/create-alliance/create-alliance')">
					<image class="c-my-alliance__icon" src="../../static/alliance/ic_alliance@2x.png" mode="aspectFill"></image>
					<view class="c-my-alliance__label">创建联盟</view>
				</view>
			</view>
			<!-- 筛选 -->
			<view class="c-filter-list">
				<view class="c-filter-item" :class="{ 'c-filter-item--active': allianceFilterIndex == 1 }" @tap="handleFilterItemTap(1)">
					<view class="c-filter-item__label" :class="{ 'c-filter-item__label_had': allianceTypeHadChoose == true}">联盟分类</view>
					<image class="c-filter-item__icon" src="../../static/common/arrow_dropdown@2x.png" mode="aspectFill"></image>
				</view>
				<view class="c-filter-item" :class="{ 'c-filter-item--active': allianceFilterIndex == 2 }" @tap="handleFilterItemTap(2)">
					<view class="c-filter-item__label" :class="{ 'c-filter-item__label_had': productTypeHadChoose == true}">商品分类</view>
					<image class="c-filter-item__icon" src="../../static/common/arrow_dropdown@2x.png" mode="aspectFill"></image>
				</view>
				<view class="c-filter-item" :class="{ 'c-filter-item--active': allianceFilterIndex == 3 }" @tap="handleFilterItemTap(3)">
					<view class="c-filter-item__label" :class="{ 'c-filter-item__label_had': regionFilterHadChosse == true }">{{ currentCity }}</view>
					<image class="c-filter-item__icon" src="../../static/common/arrow_dropdown@2x.png" mode="aspectFill"></image>
				</view>
				<view class="c-filter-item" @tap="goToMyAlliance()">
					<view class="c-filter-item__label">我的联盟</view>
					<!-- <image class="c-filter-item__icon" src="../../static/common/arrow_dropdown@2x.png" mode="aspectFill"></image> -->
				</view>
			</view>
		</view>

		<!-- 联盟分类筛选 -->
		<sg-popup :value="allianceFilterIndex === 1" z-index="90" custom-class="c-filter-popup" position="top" @close="handleAllianceTypeFilterPopupClose">
			<scroll-view class="c-filter-popup__inner" scroll-y="true">
				<view class="c-filter-tags">
					<view
						class="c-filter-tag"
						:class="{ 'c-filter-tag--active': item.checked }"
						v-for="item in allianceTypeItems"
						:key="item.id"
						@tap="handleAllianceTypeFilterItemTap(item)"
					>
						{{ item.name }}
					</view>
				</view>
			</scroll-view>
			<view class="c-filter-popup__footer">
				<button class="sg-button c-filter-popup__reset" @tap="handleAllianceTypeFilterItemTap('reset')">重置</button>
				<button class="sg-button c-filter-popup__submit" type="primary" @tap="handleAllianceTypeFilterSubmit">确定</button>
			</view>
		</sg-popup>

		<!-- 商品类别筛选 -->
		<sg-popup :value="allianceFilterIndex === 2" z-index="90" custom-class="c-filter-popup" position="top" @close="handleAllianceTypeFilterPopupClose">
			<scroll-view class="c-filter-popup__inner" scroll-y="true">
				<view class="c-filter-tags">
					<view class="c-filter-tag" :class="{ 'c-filter-tag--active': item.checked }" v-for="item in productTypeItems" :key="item.id" @tap="handleProductTypeFilterItemTap(item)">
						{{ item.name }}
					</view>
				</view>
			</scroll-view>
			<view class="c-filter-popup__footer">
				<button class="sg-button c-filter-popup__reset" @tap="handleProductTypeFilterItemTap('reset')">重置</button>
				<button class="sg-button c-filter-popup__submit" type="primary" @tap="handleProductTypeFilterSubmit">确定</button>
			</view>
		</sg-popup>

		<!-- 所在地区筛选 -->
		<sg-popup :value="allianceFilterIndex === 3" z-index="90" custom-class="c-filter-popup" position="top" @close="handleRegionFilterPopupClose">
			<scroll-view class="c-filter-popup__inner" scroll-y="true">
				<view class="c-filter-tags">
					<view class="c-filter-tag" :class="{ 'c-filter-tag--active': item.checked }" v-for="item in regionFilterItems" :key="item.id" @tap="handleRegionFilterItemTap(item)">
						{{ item.name }}
					</view>
				</view>
			</scroll-view>
			<view class="c-filter-popup__footer">
				<button class="sg-button c-filter-popup__reset" @tap="handleRegionFilterItemTap('reset')">重置</button>
				<button class="sg-button c-filter-popup__submit" type="primary" @tap="handleRegionFilterSubmit">确定</button>
			</view>
		</sg-popup>

		<!-- 联盟列表 -->
		<view class="c-alliance-item" v-for="item in allianceList" :key="item" @tap="goAllianceDetail(item.id)">
			<image class="c-alliance-item__image" :src="item.icon" :mode="aspectFill"></image>
			<view class="c-alliance-item__content">
				<image class="c-alliance-item__arrow" src="../../static/alliance/ic_arrow_right_gury@2x.png" mode="aspectFill"></image>
				<view class="c-alliance-item__title">{{ item.title }}</view>
				<view class="c-alliance-item__label">{{ item.user.nickname }}</view>
				<view class="c-alliance-item-appraise">
					<!-- 不确定评价星星数用for循环 for最大循环数为星星数上限，下面的src加判断用来确认评分（黄色）星星数量 -->
					<image
						class="c-alliance-item-appraise__star"
						v-for="(star, starIndex) in 5"
						:key="star"
						:src="starIndex < item.level ? '/static/common/ic_star_active@2x.png' : '/static/common/ic_star_inactive@2x.png'"
						mode="aspectFill"
					></image>
				</view>
				<view class="c-alliance-item__products">推荐商品数:{{ item.product_count }}件</view>
				<!-- <button class="sg-button c-alliance-item__btn" type="primary" @tap.stop="goAllianceDetail()">加入联盟</button> -->
			</view>
		</view>
		<view class="loading">{{ loadingText }}</view>
	</view>
</template>

<script>
import { AllianceListApi, AllianceCateApi, ProductCategoryApi, CityApi } from '../../api/index.js';
export default {
	data() {
		return {
			allianceFilterIndex: -1,
			allianceTypeItems: [{ id: 0, checked: true, name: '不限' }],
			choosed_allianceCate_id_str: '', //联盟类别（）
			allianceList: [],
			startPage: 1,
			productTypeItems: [{ id: 0, checked: true, name: '不限' }],
			regionFilterItems: [{ id: 0, checked: true, name: '不限' }],
			choosed_product_category_id_str: '',
			area: '',
			totalPage: 1,
			loadingText: '加载中...',
			search_titile: '',
			currentCity: '所在地区',
			productTypeHadChoose:false,
			regionFilterHadChosse:false,
			allianceTypeHadChoose:false,
			
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

	onLoad() {
		// this.getAllianceList();
		this.getAllianceTypeList();
		this.getProductCategoryList();
		this.loadCitys();
	},

	onPullDownRefresh() {
		
		//请求
		this.loadingText = '加载中...';
		this.startPage = 1;
		this.allianceList = [];
		this.getAllianceList();
		
		
		console.log('refresh');
		setTimeout(function() {
			uni.stopPullDownRefresh();
		}, 1000);
	},

	onShow() {
		//请求
		this.loadingText = '加载中...';
		this.startPage = 1;
		this.allianceList = [];
		this.getAllianceList();
		console.log('alliance page show ==  ');
	},

	// onPullDownRefresh() {
	// 	this.loadingText = '加载中...';
	// 	this.startPage = 1;
	// 	this.allianceList = [];
	// 	this.getAllianceList();
	// },

	onReachBottom() {
		if (Number(this.startPage) >= Number(this.totalPage)) {
			this.loadingText = '没有更多了~';
		} else {
			this.startPage += 1;
			this.getAllianceList();
		}
	},

	methods: {
		go(url) {
			uni.navigateTo({
				url
			});
		},
		goToMyAlliance() {
			uni.navigateTo({
				url: '/pages/my-alliance/my-alliance'
			});
		},
		handleSearch(val) {
			console.log(val);
			this.search_titile = val;
			this.loadingText = '加载中...';
			this.startPage = 1;
			this.allianceList = [];
			this.getAllianceList();
		},
		handleFilterItemTap(index) {
			this.allianceFilterIndex = this.allianceFilterIndex === index ? -1 : index;
		},

		//获取地区
		loadCitys() {
			CityApi(this.uid)
				.then(ret => {
					console.log('CityApi ret === ', ret);
					const result = ret.data;
					if (result && result.length > 0) {
						for (let i = 0; i < result.length; i++) {
							const item = result[i];
							this.regionFilterItems.push({
								id: i + 1,
								name: item,
								checked: false
							});
						}
					}
				})
				.catch(err => {
					console.log('CityApi err === ', err);
				});
		},

		handleRegionFilterItemTap(item) {
			if (item == 'reset') {
				this.regionFilterHadChosse = false;
				this.regionFilterItems.forEach(region => {
					region.checked = false;
				});
				this.regionFilterItems[0].checked = true;
				this.currentCity = '所在地区';
				this.area = '';
				return;
			}

			if (this.regionFilterItems.indexOf(item) == 0) {
				console.log('地区选了不限');
				this.area = '';
				this.currentCity = '所在地区';
				// item.checked = true;
				this.regionFilterItems.forEach(region => {
					if (region.id == 0) {
						region.checked = true;
					} else {
						region.checked = false;
					}
				});
				
			} else {
				if (this.regionFilterItems[0].checked) {
					this.regionFilterItems[0].checked = false;
				}
				const currentRegion = item;
				this.regionFilterItems.forEach(region => {
					// region.checked = false;
					if (region.id == currentRegion.id) {
						region.checked = true;
						this.currentCity = region.name;
						this.area = this.currentCity;
					} else {
						region.checked = false;
					}
				});
			}

			this.regionFilterHadChosse = false;
			this.regionFilterItems.forEach(type => {
				if (type.checked) {
					if(type.id != 0){
						this.regionFilterHadChosse = true;
					}
				}
			});
		},

		handleRegionFilterSubmit() {
			this.allianceFilterIndex = -1;

			//请求
			this.loadingText = '加载中...';
			this.startPage = 1;
			this.allianceList = [];
			this.getAllianceList();
		},

		//联盟类别筛选
		handleAllianceTypeFilterItemTap(item) {
			if (item == 'reset') {
				this.allianceTypeHadChoose = false;
				this.allianceTypeItems.forEach(region => {
					region.checked = false;
				});
				this.allianceTypeItems[0].checked = true;
				return;
			}

			if (this.allianceTypeItems.indexOf(item) === 0) {
				item.checked = true;
				this.allianceTypeItems.forEach(region => {
					region.checked = false;
				});
			} else {
				if (this.allianceTypeItems[0].checked) {
					this.allianceTypeItems[0].checked = false;
				}
			}
			item.checked = !item.checked;
			
			this.allianceTypeHadChoose = false;
			this.allianceTypeItems.forEach(type => {
				if (type.checked) {
					if(type.id != 0){
						this.allianceTypeHadChoose = true;
					}
				}
			});

		},

		handleAllianceTypeFilterSubmit() {
			let choosed_id_arr = [];
			this.allianceTypeItems.forEach(type => {
				if (type.checked) {
					choosed_id_arr.push(type.id);
				}
			});
			const choosed_id_str = choosed_id_arr.join(','); ///用作最终请求参数
			this.choosed_allianceCate_id_str = choosed_id_str;
			console.log('this.choosed_allianceCate_id_str == ', this.choosed_allianceCate_id_str);
			this.allianceFilterIndex = -1;

			//请求
			this.loadingText = '加载中...';
			this.startPage = 1;
			this.allianceList = [];
			this.getAllianceList();
		},
		handleAllianceTypeFilterPopupClose() {
			this.allianceFilterIndex = -1;
		},
		handleRegionFilterPopupClose() {
			this.allianceFilterIndex = -1;
		},

		getAllianceTypeList() {
			AllianceCateApi(getApp().globalData.uid)
				.then(res => {
					console.log('AllianceCateApi res == ', res);
					if (res.code == 1) {
						for (let i = 0; i < res.data.length; i++) {
							this.allianceTypeItems.push({
								id: res.data[i].id,
								name: res.data[i].name,
								checked: false
							});
						}
					} else {
						console.info(res);
					}
				})
				.catch(err => {
					console.log('get AllianceList error', err);
				});
		},
		//商品分类筛选
		handleProductTypeFilterItemTap(item) {
			if (item == 'reset') {
				this.productTypeHadChoose = false;
				this.productTypeItems.forEach(region => {
					region.checked = false;
				});
				this.productTypeItems[0].checked = true;
				return;
			}

			if (this.productTypeItems.indexOf(item) === 0) {
				item.checked = true;
				this.productTypeItems.forEach(region => {
					region.checked = false;
				});
			} else {
				if (this.productTypeItems[0].checked) {
					this.productTypeItems[0].checked = false;
				}
			}
			item.checked = !item.checked;
			
			this.productTypeHadChoose = false;
			this.productTypeItems.forEach(type => {
				if (type.checked) {
					if(type.id != 0){
						this.productTypeHadChoose = true;
					}
				}
			});
			
		},

		handleProductTypeFilterSubmit() {
			let choosed_id_arr = [];
			this.productTypeItems.forEach(type => {
				if (type.checked) {
					choosed_id_arr.push(type.id);
				}
			});
			const choosed_id_str = choosed_id_arr.join(','); ///用作最终请求参数
			this.choosed_product_category_id_str = choosed_id_str;
			console.log('this.choosed_product_category_id_str == ', this.choosed_product_category_id_str);
			this.allianceFilterIndex = -1;

			//请求
			this.loadingText = '加载中...';
			this.startPage = 1;
			this.allianceList = [];
			this.getAllianceList();
		},

		getProductCategoryList() {
			ProductCategoryApi(getApp().globalData.uid)
				.then(res => {
					console.log('ProductCategoryApi res == ', res);
					if (res.code == 1) {
						for (let i = 0; i < res.data.length; i++) {
							this.productTypeItems.push({
								id: res.data[i].id,
								name: res.data[i].name,
								checked: false
							});
						}
					} else {
						console.info(res);
					}
				})
				.catch(err => {
					console.log('get AllianceList error', err);
				});
		},

		goAllianceDetail(id) {
			console.log('准备传递的 联盟id == ', id);
			uni.navigateTo({
				url: '/pages/alliance-intro/alliance-intro?id=' + id
			});
		},

		//获取列表
		getAllianceList() {
			let postData = {
				category_id: this.choosed_allianceCate_id_str,
				area: this.area,
				product_category_id: this.choosed_product_category_id_str,
				title: this.search_titile,
				type: '',
				limit: 10,
				page: this.startPage,
				uid: this.uid
			};
			console.log('get AllianceList post data', postData);
			AllianceListApi(postData)
				.then(res => {
					this.allianceList = this.allianceList.concat(res.data.data);
					this.totalPage = res.data.last_page;
					console.log('get AllianceList success', res.data);
					if (Number(this.startPage) >= Number(this.totalPage)) {
						this.loadingText = '没有更多了~';
					}
					if(this.allianceList.length <= 0){
						this.loadingText = '什么都没有发现哦';
					}
				})
				.catch(err => {
					console.log('get AllianceList error', err);
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
	padding-top: 180rpx;
}
.c-header {
	position: fixed;
	z-index: 100;
	left: 0;
	right: 0;
	top: 0;
	height: 180rpx;
	width: 100%;
	background: #ef4345;
}
.c-search-bar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 24rpx;
}
// 搜索
.c-search {
	width: 456rpx;
}
// 我的联盟
.c-my-alliance {
	display: flex;
	align-items: right;
	margin-left: 32rpx;
}
.c-my-alliance:active {
	opacity: 0.6;
}
.c-my-alliance__icon {
	width: 54rpx;
	height: 54rpx;
	margin-right: 16rpx;
}
.c-my-alliance__label {
	font-size: 36rpx;
	color: #fff;
	line-height: 50rpx;
}
// filter
.c-filter-list {
	border-radius: 20rpx 20rpx 0 0;
	background: #fff;
	height: 92rpx;
	margin-top: 16rpx;
	display: flex;
	align-items: center;
}
.c-filter-item {
	height: 92rpx;
	line-height: 92rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 32rpx;
}
.c-filter-item--active .c-filter-item__icon {
	transform: rotate3d(0, 0, 1, -180deg);
}
.c-filter-item__label {
	color: rgba(15, 3, 20, 0.85);
	font-size: 24rpx;
	line-height: 1;
	font-weight: bold;
}
.c-filter-item__label_had {
	color: #FA6400;
	font-size: 24rpx;
	line-height: 1;
	font-weight: bold;
}

.c-filter-item__icon {
	width: 36rpx;
	height: 36rpx;
	transition: all 0.3s;
}

// 联盟列表
.c-alliance-item {
	padding: 20rpx 24rpx;
	background: #fff;
	display: flex;
}
.c-alliance-item__image {
	margin-top: 4rpx;
	width: 204rpx;
	height: 152rpx;
	box-shadow: 0px 0px 4rpx 0px rgba(0, 0, 0, 0.2);
	border-radius: 4rpx;
}
.c-alliance-item__content {
	position: relative;
	flex: 1;
	padding-left: 25rpx;
}
.c-alliance-item__arrow {
	position: absolute;
	top: 5rpx;
	right: 0rpx;
	z-index: 1;
	width: 38rpx;
	height: 38rpx;
}
.c-alliance-item__title {
	color: #000000;
	opacity: 0.85;
	font-weight: bold;
	font-size: 32rpx;
	height: 45rpx;
	line-height: 45rpx;
	padding-right: 38rpx;
	@include ellipsis(1);
}
.c-alliance-item__label {
	color: rgba(0, 0, 0, 0.45);
	line-height: 40rpx;
	height: 40rpx;
	font-size: 28rpx;
	@include ellipsis(1);
	margin-top: 5rpx;
}
.c-alliance-item-appraise {
	display: flex;
	align-items: center;
	margin-top: 6rpx;
}
.c-alliance-item-appraise__star {
	width: 30rpx;
	height: 30rpx;
	margin-right: 5rpx;
}
.c-alliance-item__products {
	font-size: 24rpx;
	font-weight: 400;
	color: rgba(0, 0, 0, 0.45);
	line-height: 33rpx;
	height: 33rpx;
	margin-top: 6rpx;
}
.c-alliance-item__btn {
	position: absolute;
	right: 0;
	bottom: 2rpx;
	z-index: 1;
	width: 138rpx;
	height: 54rpx;
	line-height: 54rpx;
	font-size: 26rpx;
	color: #fff;
	font-weight: bold;
	padding: 0;
	border-radius: 4rpx;
}

.c-filter-popup__inner {
	height: 600rpx;
	padding: 230rpx 0rpx 20rpx 0rpx;
}

.c-filter-tags {
	display: flex;
	flex-wrap: wrap;
	margin-right: -10rpx;
	margin-bottom: -44rpx;
}

.c-filter-tag {
	overflow: hidden;
	width: 168rpx;
	height: 64rpx;
	line-height: 64rpx;
	background: #f4f5f6;
	border: 1px solid rgba(213, 213, 213, 1);
	border-radius: 10rpx;
	color: #999999;
	text-align: center;
	font-size: 26rpx;
	margin-left: 10rpx;
	margin-right: 10rpx;
	margin-bottom: 24rpx;
}
.c-filter-tag--active {
	background: #fa6400;
	color: #fff;
	border: none;
	font-weight: bold;
}

.c-filter-popup {
	top: 400rpx;
}
.c-filter-popup__footer {
	height: 100rpx;
	padding: 0 56rpx 24rpx;
	display: flex;
	justify-content: space-between;
}
.c-filter-popup__reset {
	height: 72rpx;
	line-height: 72rpx;
	background: rgba(217, 217, 217, 1);
	border-radius: 4rpx;
	color: #fff;
	font-size: 26rpx;
	font-weight: bold;
	width: 202rpx;
}

.c-filter-popup__submit {
	align-self: center;
	border-radius: 10rpx;
	width: 342rpx;
	height: 72rpx;
	line-height: 72rpx;
	font-size: 26rpx;
	font-weight: bold;
}
</style>
