<template>
	<view class="page-container">
		<!-- 商品基础信息 -->
		<view class="c-product">
			<view class="c-share" @tap="sharePopupVisible = true">
				<image class="c-share__icon" src="../../static/common/ic_share@2x.png" mode="aspectFill"></image>
				<view class="c-share__label">分享</view>
			</view>

			<!-- 轮播图 -->
			<swiper class="c-product-swiper" indicator-dots="true" autoplay>
				<!-- <swiper-item><image class="c-product__image" :src="detail.product.img" mode="aspectFill"></image></swiper-item> -->
				<swiper-item v-for="item in detail.product.img" :key="item"><image class="c-product__image" :src="item" mode="aspectFill"></image></swiper-item>
			</swiper>

			<view class="c-product__content">
				<view class="c-product__title">{{ detail.product.title }}</view>
				<view class="c-product__row">
					<!-- <view class="c-product__label c-product-logistics" v-if="productType == 0 || productType == 1 || productType == 4 || productType == 5 || productType == 6">物流：上海物流 <view class="c-product-logistics__price">{{ detail.product.freight }}</view></view> -->
					<view class="c-product__label c-product-logistics">型号：{{ detail.product.model }}</view>
					<view class="c-product__label c-product__inventory" v-if="productType == 2 || productType == 3">求购：{{ detail.buy_num }}件</view>
					<view class="c-product__label c-product__inventory" v-if="productType == 0 || productType == 1 || productType == 4 || productType == 5 || productType == 6">
						库存：{{ detail.product.stock }}件
					</view>
				</view>
				<view class="c-product__row">
					<view class="c-product__label">价格：</view>
					<view class="c-product__price" v-if="productType == 0 || productType == 1 || productType == 5">￥{{ detail.min_price }}~￥{{ detail.max_price }}</view>
					<view class="c-product__price" v-if="productType == 2 || productType == 3 || productType == 4 || productType == 6">￥{{ detail.min_price }}</view>
				</view>
				<view class="c-product__row">
					<view class="c-product__label">发起城市及位置：{{ outletInfo.area.length >= 0 ? outletInfo.area : '暂无' }}</view>
				</view>
				<view class="c-product__row">
					<view class="c-product__label">档口：{{ outletInfo.address.length >= 0 ? outletInfo.address : '暂无' }}</view>
				</view>
			</view>
		</view>

		<!-- 商品详情 -->
		<view class="c-product-detail">
			<view class="c-title">
				<view class="c-title__line"></view>
				<view class="c-title__content">商品详情</view>
				<view class="c-title__line"></view>
			</view>
			
			<!-- v-if="hadDescription == true" -->
			<text class="c-address__label-text">{{ detail.product.description.length > 0 ? detail.product.description :'暂时没有商品详情' }}</text>
			<!-- <image style="width: 100%;display: block;" v-for="item in 5" :key="item" :src="detail.product.img" mode="widthFix"></image> -->
			<!-- <image style="width: 100%;" src="../../static/demo/product.jpeg" mode="widthFix"></image> -->
		</view>

		<!-- footer -->
		<view class="c-footer">
			<view class="c-footer-btn" @tap="handleConsultBtnTap">
				<image class="c-footer-btn__image" src="../../static/product/ic_phone@2x.png" mode="aspectFill"></image>
				<view class="c-footer-btn__label">电话咨询</view>
			</view>
			<view class="c-footer-btn" @tap="goCustomerServiceConsultPage">
				<image class="c-footer-btn__image" src="../../static/product/ic_msg@2x.png" mode="aspectFill"></image>
				<view class="c-footer-btn__label">在线咨询</view>
			</view>
			<!-- 联盟 库存商品 下单-->
			<button v-if="productType == 0" class="sg-button sg-button--square c-submit" type="primary" @tap="alliance_handlePlaceOrderTap">立即下单</button>
			<!-- 清货商品详情时捡漏（下单）流程 -->
			<button v-if="productType == 1" class="sg-button sg-button--square c-submit" type="primary" @tap="findgoods_handlePickTap">立即捡漏</button>
			<!-- 寻货商品  供货流程 -->
			<button v-if="productType == 2" class="sg-button sg-button--square c-submit" type="primary" @tap="findgoods_handleSupplyTap">立即供货</button>
			<!-- 联盟补货商品 供货流程-->
			<button v-if="productType == 3" class="sg-button sg-button--square c-submit" type="primary" @tap="alliance_handleSupplyTap">立即供货</button>
			<!-- 寻货宝供货商品 下单流程-->
			<button v-if="productType == 4" class="sg-button sg-button--square c-submit" type="primary" @tap="findgoods_handlePickTap">立即下单</button>
			<!-- 联盟新品商品 下单流程-->
			<button v-if="productType == 5" class="sg-button sg-button--square c-submit" type="primary" @tap="findgoods_handlePickTap">立即下单</button>
			<!-- 联盟供货商品 下单流程-->
			<button v-if="productType == 6" class="sg-button sg-button--square c-submit" type="primary" @tap="findgoods_handlePickTap">立即下单</button>
		</view>

		<!-- 电话咨询 -->
		<sg-popup v-model="dialDialogVisible" position="center">
			<view class="c-dialog">
				<!-- <view class="c-dialog__title">{{ isEditPhone ? '输入本机号码' : '将使用该号码加密呼出？' }}</view> -->
				<view class="c-dialog__title">电话咨询</view>
				<template v-if="!isEditPhone">
					<view class="c-dialog__content">{{ outletInfo.phone }}</view>
					<view class="c-dialog-phone" @tap="isEditPhone = true">
						<!-- <view class="c-dialog-phone__label">非本机号码修改</view> -->
						<!-- <image class="c-dialog-phone__arrow" src="../../static/common/ic_arrow_right_gury@2x.png" mode="aspectFill"></image> -->
					</view>
				</template>
				<view class="c-dialog-phone-input-container" v-if="isEditPhone"><input class="c-dialog-phone-input" type="number" maxlength="11" /></view>
				<view class="c-dialog__btns">
					<view class="c-dialog__btn" @tap="dialDialogVisible = false">取消</view>
					<view class="c-dialog__btn c-dialog__btn--active" @tap="handleCallBtnTap">立即呼叫</view>
				</view>
			</view>
		</sg-popup>

		<!-- 商品型号 -->
		<sg-popup v-model="specPopupVisible" position="bottom">
			<view class="c-product-spec">
				<image class="c-product-spec__cancel" src="../../static/common/ic_cancel@2x.png" mode="aspectFill" @tap="specPopupVisible = false"></image>
				<view class="c-product-spec-header">
					<image class="c-product-spec-header__img" :src="detail.product.img" mode="aspectFill"></image>
					<view class="c-product-spec-header__body">
						<view class="c-product-spec-header__total">
							总计
							<view class="c-product-spec-header__price">{{ all_product_price }}</view>
						</view>
						<view class="c-product-spec-header__model">{{ selectedSpecDescText }}</view>
					</view>
				</view>

				<scroll-view class="c-product-spec-content" scroll-y="true" show-scrollbar="true">
					<view class="c-product-spec-model" v-for="item in specs" :key="item.id">
						<view class="c-product-spec-model__label">{{ item.p_color }}</view>
						<view class="c-product-spec-model__label">{{ item.p_size }}</view>
						<view class="c-step">
							<image class="c-step__img" src="../../static/common/ic_minus@2x.png" mode="aspectFill" @tap="handleSpecMinus(item)"></image>
							<!-- <view class="c-step__val">{{ item.choosedNum }}</view> -->
							<input 
							class="c-field__input" 
							confirm-type="done" 
							type="number" 
							v-model="item.choosedNum"  
							@input="chooseNumInput($event,item)"
							@confirm="chooseNumInputConfirm($event,item)"
							/>
							
							<image class="c-step__img" src="../../static/common/ic_plus@2x.png" mode="aspectFill" @tap="handleSpecPlus(item)"></image>
						</view>
					</view>
				</scroll-view>

				<view class="c-product-offer-container" v-if="productType == 0 || productType == 1 || productType == 5">
					<view class="c-product-offer">
						<view class="c-product-offer__title">单价(元)</view>
						<view style="display: flex;align-items: center;padding-top: 20rpx;">
							<view class="c-product-offer__input-m">￥</view>
							<input
								class="c-product-offer__input"
								type="digit"
								@input="priceInput"
								placeholder="输入价格"
								placeholder-style="color:#BDBDBD;"
								v-model="product_price"
								@confirm="changeConfirm"
							/>
						</view>
						
					</view>
					<view class="c-product-offer-tip">
						单件价格不可低于
						<view class="c-product-offer-tip__price">¥{{ min_price }}</view>
						<view>，</view>
						不可高于
						<view class="c-product-offer-tip__price">¥{{ max_price }}</view>
						<view>。</view>
					</view>
				</view>
				<button class="sg-button sg-button--square c-product-spec__submit" type="primary" @tap="placeOrder">确定</button>
			</view>
		</sg-popup>

		<!-- 分享 -->
		<sg-popup v-model="sharePopupVisible" position="bottom">
			<view class="c-share-dialog">
				<view class="c-share-dialog__title">分享至：</view>
				<view class="c-share-dialog__content">
					<!-- <image open-type="share" class="c-share-app" src="../../static/common/wechat@2x.png" mode="aspectFit" @tap="shareToWechat"></image> -->
					<button open-type="share" class="c-share-app" src="../../static/common/wechat@2x.png" @tap="shareToWechat">
						<image class="c-share-wechat" src="../../static/common/wechat@2x.png" mode="aspectFit"></image>
					</button>
					<!-- <image class="c-share-app" src="../../static/common/wechat_friend_circle@2x.png" mode="aspectFit" @tap="shareToTimeLine"></image>
					<image class="c-share-app" src="../../static/common/qq@2x.png" mode="aspectFit" @tap="shareToQQ"></image> -->
				</view>
			</view>
		</sg-popup>
	</view>
</template>

<script>
import { FindGoodsProductDetailApi, AllianceProductDetailApi } from '../../api/index.js';
export default {
	data() {
		return {
			productType: 0, // 商品类型
			dialDialogVisible: false, // 咨询提示框
			isEditPhone: false, // 是否编辑电话
			specPopupVisible: false, // 商品规格
			sharePopupVisible: false, // 分享
			specs: [],
			detail: {},
			outletInfo: {},
			min_price: 0,
			max_price: 0,
			productInfo: {},
			product_price: '',
			all_product_price: 0,
			product_nums: 0,
			selectedSpecDescText:'请选择规格',
			product_image_list:[],
		};
	},
	computed: {
		uid: {
			get() {
				return getApp().globalData.uid;
			}
		}

		// changeConfirm(event){
		// 	console.log('------------------event',event.target.value)
		// 	this.product_price = event.target.value;

		// },
	},

	onLoad(opt) {
		const id = opt.id; //商品id
		const type = opt.type;
		this.productType = opt.type;

		console.log('product-detail --- opt  === ', opt);

		if (type == 0 || type == 3 || type == 5 || type == 6) {
			//联盟商品详情
			console.log('hello  我是联盟商品哦 === ', opt);
			AllianceProductDetailApi(id, this.uid)
				.then(ret => {
					console.log('联盟商品详情AllianceProductDetailApi === ret ', ret);

					if (ret.data) {
						this.detail = ret.data;
						this.specs = this.detail.product.specs;
						this.productInfo = this.detail.product;
						this.outletInfo = this.detail.product.outlet;

						let specsFor = this.specs;
						for (let i = 0; i < specsFor.length; i++) {
							specsFor[i].id = i;
							specsFor[i].maxNum = specsFor[i].stock_num;
							specsFor[i].choosedNum = 0;
						}
						this.specs = specsFor;
						if (this.detail.min_price) {
							this.min_price = this.detail.min_price;
							if (this.productType == 2 || this.productType == 3 || this.productType == 4 || this.productType == 6) {
								this.product_price = this.min_price;
							}
						}
						if (this.detail.max_price) {
							this.max_price = this.detail.max_price;
						}

						console.log('this.specs ===  ', this.specs);
					} else {
						uni.showToast({
							title: '无法获取商品信息',
							icon: 'none'
						});
					}
				})
				.catch(err => {
					console.log('ProductDetailApi === err ', err);
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					});
				});
		} else {
			//寻货宝商品详情
			FindGoodsProductDetailApi(id, this.uid, type)
				.then(ret => {
					console.log('寻货宝商品详情ProductDetailApi === ret ', ret);

					if (ret.data) {
						this.detail = ret.data;
						this.specs = this.detail.product.specs;
						this.productInfo = this.detail.product;
						this.outletInfo = this.detail.product.outlet;

						let specsFor = this.specs;
						for (let i = 0; i < specsFor.length; i++) {
							specsFor[i].id = i;
							specsFor[i].maxNum = specsFor[i].stock_num;
							specsFor[i].choosedNum = 0;
						}
						this.specs = specsFor;
						if (this.detail.min_price) {
							this.min_price = this.detail.min_price;
							if (this.productType == 2 || this.productType == 3 || this.productType == 4 || this.productType == 6) {
								this.product_price = this.min_price;
							}
						}
						if (this.detail.min_price) {
							this.max_price = this.detail.max_price;
						}

						console.log('this.specs ===  ', this.specs);
					} else {
						uni.showToast({
							title: '无法获取商品信息',
							icon: 'none'
						});
					}
				})
				.catch(err => {
					console.log('ProductDetailApi === err ', err);
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					});
				});
		}
	},
	onShareAppMessage(res) {
		if (res.from === 'button') {
			// 来自页面内分享按钮
			console.log('右上角分享点击：', res.target);
			console.log('detail ==== ', this.detail);
		}
		const { product } = this.detail;
		uni.showToast({
			title: `type: ${this.productType} id: ${this.detail.id}`,
			icon: 'none'
		});
		return {
			title: product.title,
			path: `/pages/product-detail/product-detail?id=${this.detail.id}&type=${this.productType}`
		};
	},
	methods: {
		bindInput(event) {
			// (event.detail || {}).value;
		},

		// 电话咨询
		handleConsultBtnTap() {
			this.isEditPhone = false;
			this.dialDialogVisible = true;
		},
		// 拨打电话
		handleCallBtnTap() {
			this.dialDialogVisible = false;
			const self = this;
			uni.makePhoneCall({
				phoneNumber: this.outletInfo.phone
			});
		},
		// 咨询客户
		goCustomerServiceConsultPage() {
			uni.navigateTo({
				url: '/pages/customer-service-consult/customer-service-consult'
			});
		},

		selectedSpecDesc() {

			let label = '';
			// this.specs.forEach(spec => {
			// 	if (Number(spec.choosedNum) > 0) {
			// 		if (label !== '') {
			// 			label += '，';
			// 		}
			// 		label += spec.p_color  + ' ' + spec.p_size + ' ' +  spec.choosedNum + '件';
			// 	}
			// });
			
			let nums = 0;
			for (let i = 0; i < this.specs.length; i++) {
				nums += Number(this.specs[i].choosedNum);
			}
			
			if(nums > 0){
				label = nums;
			}
			
			if (label !== '') {
				this.selectedSpecDescText = '汇总：' + label +'件';
			} else {
				this.selectedSpecDescText = '请选择规格';
			}
		},
		
		// 减少数量
		handleSpecMinus(item) {
			console.log(item);
			console.log(this.specs);
			if (item.choosedNum == 0) {
				return;
			}
			item.choosedNum--;

			let nums = 0;
			for (let i = 0; i < this.specs.length; i++) {
				nums += Number(this.specs[i].choosedNum);
			}
			this.product_nums = nums;
			this.all_product_price = Number(nums) * Number(this.product_price);
			this.all_product_price = parseFloat(this.all_product_price.toFixed(2));
			console.log('zongjia == ', this.all_product_price);
			this.selectedSpecDesc();
		},
		// 增加数量
		handleSpecPlus(item) {
			console.log(item);
			if (item.choosedNum >= item.maxNum) {
				return;
			}
			item.choosedNum++;

			let nums = 0;
			for (let i = 0; i < this.specs.length; i++) {
				nums += Number(this.specs[i].choosedNum);
			}
			this.product_nums = nums;
			this.all_product_price = Number(nums) * Number(this.product_price);
			this.all_product_price = parseFloat(this.all_product_price.toFixed(2));
			console.log('zongjia == ', this.all_product_price);
			this.selectedSpecDesc();
		},
		
		chooseNumInput(e,item){
			console.log('inputVal ====', e );
			console.log('item ====',item );
			
			const slef = this;
			
			let input = (e.detail || {}).value;
			
			if(typeof input == "undefined" || input == null || input == ""){
				input = 0;
				console.log('空的赋值后0的input ===', input );
			}
			
			if(input.length >=2){
				input = input.replace(/^(0+)|[^\d]+/g,'');
				console.log('正则后的input ===', input );
			}
			
				item.choosedNum = input;
				console.log('item.choosedNum ===',item.choosedNum );
				
				let nums = 0;
				for (let i = 0; i < this.specs.length; i++) {
					nums += Number(this.specs[i].choosedNum);
				}
				this.product_nums = nums;
				this.all_product_price = Number(nums) * Number(this.product_price);
				this.all_product_price = parseFloat(this.all_product_price.toFixed(2));
				console.log('总价 == ', this.all_product_price);
				this.selectedSpecDesc();

		},
		
		chooseNumInputConfirm(e,item){
			//无效？？？

			console.log('chooseNumInputConfirm inputVal ====', e );
			console.log('chooseNumInputConfirm item ====',item );
			
			const slef = this;
			
			let input = (e.detail || {}).value;
			
			if(typeof input == "undefined" || input == null || input == ""){
				input = 0;
				console.log('空的赋值后0的input ===', input );
			}
			
			if(input.length >=2){
				input = input.replace(/^(0+)|[^\d]+/g,'');
				console.log('正则后的input ===', input );
			}
			 
				item.choosedNum = input;
				console.log('chooseNumInputConfirm item.choosedNum ===',item.choosedNum );
				
				let nums = 0;
				for (let i = 0; i < this.specs.length; i++) {
					nums += Number(this.specs[i].choosedNum);
				}
				this.product_nums = nums;
				this.all_product_price = Number(nums) * Number(this.product_price);
				this.all_product_price = parseFloat(this.all_product_price.toFixed(2));
				console.log('chooseNumInputConfirm 总价 == ', this.all_product_price);
				this.selectedSpecDesc();
		},
		
		
		
		
		
		priceInput(event) {
			const self = this;
			console.log('inputVal =  ', event,(event.detail || {}).value);

			let input = (event.detail || {}).value;

			if (input.charAt(0) == '.') {
				input = input.substr(1);
			}

			input = input.replace(/[^\d.]/g, ''); //清除“数字”和“.”以外的字符
			input = input.replace(/\.{2,}/g, '.'); //只保留第一个. 清除多余的
			input = input
				.replace('.', '$#$')
				.replace(/\./g, '')
				.replace('$#$', '.');
			input = input.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数

			if (input.length >= 2 && input[0] == '0' && input[1] != '.') {
				input = input.substr(1);
			}

			setTimeout(function() {
				self.product_price = input;
				console.log('product_price =  ', input,self.product_price);
				// self.product_price = event.detail.value;
				let nums = 0;
				for (let i = 0; i < self.specs.length; i++) {
					nums += Number(self.specs[i].choosedNum);
				}
				self.product_nums = nums;
				self.all_product_price = Number(nums) * Number(self.product_price);
				self.all_product_price = parseFloat(self.all_product_price.toFixed(2));
				console.log('zongjia ...== ', self.all_product_price);
			}, 100);
		},

		// 下单
		placeOrder() {
			if (Number(this.product_price) < Number(this.min_price)) {
				uni.showToast({
					title: '出价低于最低价格，无法购买',
					icon: 'none'
				});
				return;
			}

			if (Number(this.product_price) > Number(this.max_price)) {
				uni.showToast({
					title: '出价高于最高价格，无法购买',
					icon: 'none'
				});
				return;
			}

			if (Number(this.all_product_price) <= 0) {
				uni.showToast({
					title: '您还未选择商品',
					icon: 'none'
				});
				return;
			}

			//this.productType  0/1/4/5/6 为下单流程
			if (this.productType == 0 || this.productType == 1 || this.productType == 4 || this.productType == 5 || this.productType == 6) {
				if (this.product_price <= 0) {
					uni.showToast({
						title: '请输入单件价格',
						icon: 'none'
					});
					return;
				} else {
					let specs_arr = [].concat(this.specs);
					let fSpecs_arr = [];
					let product_num = 0;
					// console.log('待下单商品规格汇总表 == ',this.specs );
					for (let i = 0; i < specs_arr.length; i++) {
						if (Number(specs_arr[i].choosedNum) <= 0) {
							continue;
						} else {
							fSpecs_arr = fSpecs_arr.concat(specs_arr[i]);
							product_num += Number(specs_arr[i].choosedNum);
						}
					}
					// console.log('准备下单商品 规格  + 数目',fSpecs_arr,product_num);
					this.all_product_price = Number(product_num) * Number(this.product_price);
					this.all_product_price = parseFloat(this.all_product_price.toFixed(2));
					console.log('准备下单商品个数 及  单件 总价 == ', product_num, this.product_price, this.all_product_price);
					let orderinfo = {
						productType: this.productType,
						product_s_price: this.product_price, //单个价
						product_a_price: this.all_product_price, //总价
						product_info: this.productInfo,
						specs: fSpecs_arr,
						product_nums: this.product_nums
					};
					let jStr = JSON.stringify(orderinfo);
					// console.log('待处理订单信息 === ', orderinfo,jStr);
					uni.navigateTo({
						url: '/pages/place-order/place-order?orderinfo=' + jStr
					});
				}
			}

			this.specPopupVisible = false;
		},

		//联盟 立即下单
		alliance_handlePlaceOrderTap() {
			this.specPopupVisible = true;
		},
		//寻货 立即捡漏
		findgoods_handlePickTap() {
			const id = getApp().globalData.uid;
			console.log('findgoods_handlePickTa ===== ', id);
			if (!!id) {
				this.specPopupVisible = true;
				return;
			}

			uni.navigateTo({
				url: '../login/login'
			});
		},

		//联盟 立即供货  传type 和 商品id
		alliance_handleSupplyTap() {
			uni.navigateTo({
				url: '/pages/create-supply/create-supply?productTpye=' + 3 + '&id=' + this.detail.id //联盟补货商品id(用于供货时库存列表显示)
			});
		},
		//寻货 立即供货 传type 和 商品id
		findgoods_handleSupplyTap() {
			uni.navigateTo({
				url: '/pages/create-supply/create-supply?productTpye=' + 0 + '&id=' + this.detail.id
			});
		},

		shareToTimeLine() {},
		shareToQQ() {},
		// 分享到微信
		shareToWechat() {
			console.log('detail ========== ', this.detail);
			const { product } = this.detail;
			const path = `/pages/product-detail/product-detail?id=${this.detail.id}&type=${this.productType}`;
			//#ifdef APP-PLUS
			uni.share({
				provider: 'weixin',
				scene: 'WXSceneSession',
				type: 5,
				imageUrl: `${product.img}`,
				title: '零库',
				miniProgram: {
					id: 'gh_b6112a3ecee1',
					path: path,
					type: 0,
					webUrl: 'http://uniapp.dcloud.io'
				},
				success: ret => {
					uni.showToast({
						title: '分享成功',
						icon: 'success'
					});
				},
				fail: err => {
					uni.showToast({
						title: '分享失败',
						icon: 'failed'
					});
				}
			});
			//#endif
		}
	}
};
</script>

<style lang="scss">
@import '@/common/scss/mixin.scss';

.c-address__label-text{
	margin-left: 20rpx;
	margin-right: 20rpx;
	margin-top: 20rpx;
	padding-bottom: 20rpx;
	font-size: 26rpx;
	font-weight: 400;
	color: rgba(13, 19, 13, 1);
	line-height: 36rpx;
	lines: 2;
	overflow: hidden;
}

.page-container {
	padding-bottom: 118rpx;
}
.c-product {
	background: #fff;
}
.c-product-swiper {
	width: 750rpx;
	height: 750rpx;
}
.c-product__image {
	display: block;
	width: 750rpx;
	height: 750rpx;
}
.c-product__content {
	padding: 24rpx;
}
.c-product__title {
	max-height: 96rpx;
	font-size: 34rpx;
	font-weight: bold;
	color: rgba(38, 38, 38, 1);
	line-height: 48rpx;
	@include ellipsis(2);
}
.c-product__row {
	display: flex;
	height: 34rpx;
	line-height: 34rpx;
	margin-top: 17rpx;
	align-items: center;
}
.c-product__label,
.c-product__inventory {
	height: 34rpx;
	font-size: 30rpx;
	font-weight: 400;
	color: rgba(0, 0, 0, 0.65);
	line-height: 34rpx;
}
.c-product-logistics {
	display: flex;
	align-items: center;
	width: 460rpx;
}
.c-product-logistics__price {
	position: relative;
	font-size: 32rpx;
	font-weight: bold;
	color: rgba(250, 100, 0, 1);
	line-height: 34rpx;
	padding-left: 34rpx;
}
.c-product-logistics__price:before {
	content: '￥';
	position: absolute;
	z-index: 1;
	font-weight: normal;
	left: 12rpx;
	top: 0;
	height: 34rpx;
	line-height: 40rpx;
	font-size: 22rpx;
}
.c-product__price {
	font-size: 34rpx;
	font-weight: bold;
	color: rgba(250, 100, 0, 1);
}
//店铺详情
.c-product-detail {
	background: #fff;
	margin-top: 24rpx;
  padding-bottom: 0rpx;
}
// 详情标题
.c-title {
	height: 106rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
.c-title__line {
	width: 38rpx;
	height: 1px;
	background: #bdbdbd;
}
.c-title__content {
	padding: 0 12rpx;
	height: 45rpx;
	font-size: 32rpx;
	font-weight: 400;
	color: #666666;
	line-height: 45rpx;
}

// footer
.c-footer {
	height: 98rpx;
	display: flex;
	position: fixed;
	left: 0;
	bottom: 0;
	right: 0;
	z-index: 100;
	background: #fff;
}
.c-footer-btn {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
	padding: 10rpx 0;
	width: 135rpx;
}

.c-footer-btn__image {
	width: 54rpx;
	height: 54rpx;
	display: block;
}
.c-footer-btn__label {
	height: 30rpx;
	font-size: 22rpx;
	font-weight: 400;
	color: rgba(102, 102, 102, 1);
	line-height: 30rpx;
}
.c-submit {
	height: 98rpx;
	flex: 1;
	line-height: 98rpx;
	font-weight: bold;
	font-size: 34rpx;
	color: #fff;
}

// dialog提示
.c-dialog {
	background: #fff;
}
.c-dialog__title {
	height: 46rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #1e2229;
	font-size: 36rpx;
	line-height: 46rpx;
	margin-top: 47rpx;
}
.c-dialog__content {
	margin-top: 15rpx;
	padding: 0 32rpx;
	font-size: 30rpx;
	font-weight: 400;
	color: #999;
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

.c-dialog-phone {
	display: flex;
	margin-top: 24rpx;
	margin-bottom: 17rpx;
	align-items: center;
	justify-content: center;
}
.c-dialog-phone__label {
	height: 36rpx;
	font-size: 32rpx;
	font-weight: 400;
	color: rgba(250, 100, 0, 1);
	line-height: 36rpx;
}
.c-dialog-phone__arrow {
	width: 32rpx;
	height: 32rpx;
	margin-left: 16rpx;
}
.c-dialog-phone:active {
	opacity: 0.6;
}
.c-dialog-phone-input-container {
	padding: 17rpx 38rpx;
}
.c-dialog-phone-input {
	height: 84rpx;
	background: rgba(255, 255, 255, 1);
	border-radius: 10rpx;
	border: 1px solid rgba(213, 213, 213, 1);
}

// 商品规格
.c-product-spec {
	position: relative;
	max-height: 100vh;
	background: #fff;
}
.c-product-spec__cancel {
	position: absolute;
	right: 24rpx;
	top: 24rpx;
	z-index: 1;
	width: 54rpx;
	height: 54rpx;
}
.c-product-spec__cancel:active {
	opacity: 0.6;
}
.c-product-spec-header {
	display: flex;
	padding-bottom: 32rpx;
	padding: 24rpx 24rpx 32rpx;
	@include thin-line-bottom(#f4f5f6, 24rpx, 24rpx);
}
.c-product-spec-header__img {
	width: 240rpx;
	height: 240rpx;
	display: block;
	border-radius: 8rpx 8rpx 0px 0px;
}
.c-product-spec-header__body {
	flex: 1;
	padding-left: 32rpx;
	margin-top: 143rpx;
}
.c-product-spec-header__total {
	width: 100%;
	height: 34rpx;
	font-size: 30rpx;
	font-weight: 400;
	color: rgba(38, 38, 38, 1);
	line-height: 34rpx;
	display: flex;
}
.c-product-spec-header__price {
	height: 34rpx;
	font-size: 32rpx;
	font-weight: 400;
	color: rgba(250, 100, 0, 1);
	line-height: 34rpx;
	padding-left: 32rpx;
	position: relative;
}
.c-product-spec-header__price:before {
	content: '￥';
	color: #fa6400;
	position: absolute;
	left: 10rpx;
	top: 0;
	height: 34rpx;
	line-height: 40rpx;
	font-size: 22rpx;
}
.c-product-spec-header__model {
	margin-top: 29rpx;
	width: 100%;
	height: 34rpx;
	font-size: 30rpx;
	font-weight: 400;
	color: rgba(102, 102, 102, 1);
	line-height: 34rpx;
	@include ellipsis(1);
}
.c-product-spec-content {
	padding: 26rpx 24rpx;
	height: 400rpx;
	@include thin-line-bottom(#f4f5f6, 24rpx, 24rpx);
}
.c-product-spec-model {
	height: 60rpx;
	display: flex;
	align-items: center;
}
.c-product-spec-model + .c-product-spec-model {
	margin-top: 26rpx;
}
.c-product-spec-model__label {
	height: 60rpx;
	font-size: 34rpx;
	font-weight: 400;
	color: rgba(38, 38, 38, 1);
	line-height: 60rpx;
	flex: 1;
}
.c-step {
	height: 60rpx;
	display: flex;
}
.c-step__img {
	display: block;
	width: 60rpx;
	height: 60rpx;
}
.c-step__img:active {
	opacity: 0.6;
}

.c-field__input{
	width: 120rpx;
	height: 60rpx;
	background: rgba(245, 245, 245, 1);
	margin: 0 2rpx;
	line-height: 60rpx;
	text-align: center;
	font-size: 30rpx;
	font-weight: bold;
	color: rgba(38, 38, 38, 1);
}

.c-step__val {
	width: 76rpx;
	height: 60rpx;
	background: rgba(245, 245, 245, 1);
	margin: 0 2rpx;
	line-height: 60rpx;
	text-align: center;
	font-size: 30rpx;
	font-weight: bold;
	color: rgba(38, 38, 38, 1);
}
.c-product-spec__submit {
	height: 98rpx;
	line-height: 98rpx;
	font-weight: bold;
	font-size: 34rpx;
	color: #fff;
	margin-top: 56rpx;
}

.c-product-offer-container {
}
.c-product-offer {
	height: 135rpx;
	padding: 0 24rpx;
	display: flex;
	flex-direction: column;
	// align-items: center;
	@include thin-line-bottom(#f4f5f6, 24rpx, 24rpx);
}
.c-product-offer__title {
	padding-top: 15rpx;
	height: 48rpx;
	font-size: 34rpx;
	font-weight: 400;
	// color: rgba(38, 38, 38, 1);
	color:#666666;
	line-height: 48rpx;
}
.c-product-offer__input-m{
	
	color:#BDBDBD;
	width: 50rpx;
	font-size: 50rpx;
	height: 50rpx;
	line-height: 50rpx;
}
.c-product-offer__input {
	// padding-top: 20rpx;
	padding-left: 20rpx;
	color: #262626;
	font-size: 40rpx;
	height: 50rpx;
	line-height: 50rpx;
}


.c-product-offer-tip {
	padding: 16rpx 24rpx;
	display: flex;
	align-items: center;
	font-size: 26rpx;
	font-weight: 400;
	line-height: 37rpx;
}
.c-product-offer-tip__price {
	color: #fa6400;
}

// 分享
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

// 分享dialog
.c-share-dialog {
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
	background: #ffffff;
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
