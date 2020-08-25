<template>
	<view class="page-container">
		<view class="c-header">
			<view v-for="(item, index) in images" class="c-goods-wrapper">
				<image  class="c-product-image" :src="item">
					<image @tap="deleteGoodsCover(item, index)" class="c-delete-button" src="../../static/ic_cancle_red.png"></image>
				</image>
			</view>
			
			<image @tap="chooseProductImage" class="c-goods-image" src="../../static/ic_add_picture.png">
			</image>
		</view>
		

		

    <view class="c-cell-list">
			<view class="c-cell">
			  <view class="c-cell__title">型号</view>
			  <textarea  class="c-cell__input" value="goods_model" v-model="goods_model"
			    placeholder-class="c-textarea-cell__placeholder" placeholder="我想调这里的货" />
			</view>
			
      <!-- <view class="c-cell"> -->
        <!-- <view class="c-cell__title">商品分类</view> -->
        <!-- <input class="c-cell__input" type="text" placeholder="请输入商品分类" value="productCategory" v-model="productCategory"/> -->
        <!-- <view v-else class="c-cell__val">{{product.category}}</view> -->
      <!-- </view> -->
			
			<!-- 选择商品分类 -->
			<view class="c-cell" :class="{'c-cell--clickable': true}" @tap="handleAllianceTypeCellTap">
			  <view class="c-cell__title">商品分类</view>
			  <view class="c-cell__select ">{{goodsCategory}}</view>
			</view>
			
      <view class="c-cell">
        <view class="c-cell__title">档口号</view>
        <input class="c-cell__input" type="text" placeholder="请输入档口号" value="stalls" v-model="stalls"/>
        <!-- <view v-else class="c-cell__val">{{product.stalls}}</view> -->
      </view>
    </view>
    
    <view class="c-cell-list">
      <view class="c-cell-list__title">编辑价格信息</view>
      <view class="c-cell">
        <view class="c-cell__title">最低价</view>
        <view class="c-stepper">
          <image class="c-stepper__icon" src="../../static/common/ic_minus@2x.png" mode="aspectFill" 
            @tap="handleMinPriceMinusTap"></image>
          <view class="c-stepper__val">
						<input type="text" value="min_price" v-model="min_price" />
					</view>
          <image class="c-stepper__icon" src="../../static/common/ic_plus@2x.png" mode="aspectFill"
            @tap="handleMinPricePlusTap"></image>
        </view>
      </view>
      <!-- <view class="c-cell"> -->
        <!-- <view class="c-cell__title">最高价</view> -->
        <!-- <view class="c-stepper"> -->
          <!-- <image class="c-stepper__icon" src="../../static/common/ic_minus@2x.png" mode="aspectFill" -->
            <!-- @tap="handleMaxPriceMinusTap"></image> -->
          <!-- <view class="c-stepper__val"> -->
						<!-- <input type="text" value="max_price" v-model="max_price" /> -->
					<!-- </view> -->
          <!-- <image class="c-stepper__icon" src="../../static/common/ic_plus@2x.png" mode="aspectFill" -->
            <!-- @tap="handleMaxPricePlusTap"></image> -->
        <!-- </view> -->
      <!-- </view> -->
      <view class="c-cell" :class="{'c-cell--clickable': true}" @tap="showStyleSelectPopup">
        <view class="c-cell__title">款式</view>
        <view class="c-cell__select ">{{style || '请选择款式'}}</view>
      </view>
      <view class="c-cell" :class="{'c-cell--clickable': true}" @tap="showCategorySelectPopup">
        <view class="c-cell__title">类别</view>
        <view class="c-cell__select">{{category || '请选择类别'}}</view>
      </view>
			
			<!-- 添加颜色及尺寸 -->
			<view class="c-cell">
			  <view class="c-cell__title">颜色及尺码</view>
				<view class="c-flex"></view>
			  <view @tap="addNewSize" class="c-cell_wrapper">
					<image class="ic-arrow-add-image" src="../../static/ic_arrow_right_gury.png"></image>
					<view class="ic-arrow-add-text">添加</view>
				</view>
			</view>
			
		
			
			<view>
				<view class="c-cell c-cell-wrapper">
				  <view class="c-cell_wrapper__title">颜色</view>
					<view class="c-cell_wrapper__title">尺寸</view>
					<view class="c-cell_wrapper__title">需要寻货数量</view>
				</view>
				
				<view class="c-list-wrapper" v-for="(item, index) in sizes">
					<image @tap="deleteProductSize(item, index)" class="c-delete" src="../../static/ic_cancle_red.png"></image>
					<view class="c-color">{{item.p_color}}</view>
					<view class="c-flex"></view>
					<view class="c-size">{{item.p_size}}</view>
					<view class="c-flex"></view>
					
					<view class="c-stepper">
					  <image class="c-stepper__icon" src="../../static/common/ic_minus@2x.png" mode="aspectFill" 
					    @tap="minusTap(item, index)"></image>
					  <view class="c-stepper__val">
							<input @input="replaceInput(e, item)" type="c-count" v-model="item.num" value="item.num"/>
						</view>
					  <image class="c-stepper__icon" src="../../static/common/ic_plus@2x.png" mode="aspectFill"
					    @tap="plusTap(item, index)"></image>
					</view>
				</view>
			</view>
			
			
			<!-- 邮费 -->
			<view class="c-placehoder-view" />
			<view class="c-cell">
			  <view class="c-cell__title">邮费</view>
				<view class="c-flex"></view>
				<view class="c-postage-wrapper">
					<view class="postage-input">¥</view>
					<input placeholder="0.00" class="c-input-pistage postage-input" type="number" v-model="postage"/>
				</view>
			</view>
			<view class="c-placehoder-view" />
			
			
			
			
      <view class="c-textarea-cell">
        <view class="c-textarea-cell__title">商品信息</view>
        <textarea v-model="description" v-if="!hideNativeComponent" class="c-textarea-cell__input" value="" 
          placeholder-class="c-textarea-cell__placeholder" placeholder="输入商品信息" />
      </view>
    </view>
    
    <!-- footer -->
    <view class="c-footer">
			<button class="sg-button sg-button--square c-footer-btn" type="primary" @tap="submitFindGoods">
				发布寻货信息
			</button>
    </view>
    
    <!-- 颜色及尺码选择 -->
    <sg-popup v-model="colorSelectPopupVisible" position="bottom" @show="hideNativeComponent = true" 
      @close="hideNativeComponent = false">
      <image class="c-popup-close" src="../../static/common/ic_cancel@2x.png" 
        mode="aspectFill" @tap="colorSelectPopupVisible = false;"></image>
      <view class="c-color-popup">
        <!-- 选择颜色 -->
        <view class="c-tag-selector">
          <view class="c-tag-selector__title">选择颜色</view>
					<scroll-view class="c-scroll-wrapper" scroll-y="true">
          <view class="c-tag-list">
            <view class="c-tag-item" :class="{'c-tag-item--active': item.checked}" 
              v-for="item in colorOptions" :key="item.id" @tap="handleColorOptionTap(item)">{{item.name}}</view>
          </view>
					</scroll-view>
          <view class="c-tag-selector__footer">
            <view class="c-tag-selector__btn c-tag-selector__btn--primary" @tap="showAddColorDialog">添加</view>
            <view class="c-tag-selector__btn" @tap="deleteColor">删除</view>
          </view>
        </view>
        <!-- 选择尺码 -->
        <view class="c-tag-selector">
          <view class="c-tag-selector__title">选择尺寸</view>
					<scroll-view class="c-scroll-wrapper" scroll-y="true">
						<view class="c-tag-list">
						  <view class="c-tag-item" :class="{'c-tag-item--active': item.checked}"
						    v-for="item in sizeOptions" :key="item.id" @tap="handleSizeOptionTap(item)">{{item.name}}</view>
						</view>
					</scroll-view>
          <view class="c-tag-selector__footer">
            <view class="c-tag-selector__btn c-tag-selector__btn--primary" @tap="showAddSizeDialog">添加</view>
            <view class="c-tag-selector__btn" @tap="deleteSize">删除</view>
          </view>
        </view>
        <!-- 确定 -->
        <view class="c-color-popup-footer">
          <button class="sg-button c-color-popup-submit" type="primary" @tap="handleColorPopupSubmit">确定</button>
        </view>
      </view>
    </sg-popup>
    
    <!-- 添加颜色 -->
    <sg-dialog ref="addColorDialogRef" @confirm="handleColorAdd">
      <input class="c-add-color-input" placeholder-class="c-add-color-input__placeholder" 
        type="text" v-model="newColorName" placeholder="输入颜色名称"/>
    </sg-dialog>
    
		<!-- 添加尺寸 -->
    <sg-dialog ref="addSizeDialogRef" @confirm="handleSizeAdd">
      <input class="c-add-size-input" placeholder-class="c-add-size-input__placeholder" 
        type="text" v-model="newSizeName" placeholder="输入尺寸"/>
    </sg-dialog>
		
		<!-- 添加类别 -->
		<sg-dialog ref="addCategoryDialogRef" @confirm="handleCategoryAdd">
		  <input class="c-add-size-input" placeholder-class="c-add-size-input__placeholder" 
		    type="text" v-model="newCategoryName" placeholder="输入类别"/>
		</sg-dialog>
		
		<!-- 添加款式 -->
		<sg-dialog ref="addStyleDialogRef" @confirm="handleStyleAdd">
		  <input class="c-add-size-input" placeholder-class="c-add-size-input__placeholder" 
		    type="text" v-model="newStyleName" placeholder="输入款式"/>
		</sg-dialog>
		
		
		
		
		<!-- 设置类别 -->
		<sg-popup v-model="categorySelectPopupVisible" position="bottom" @show="hideNativeComponent = true" 
		  @close="hideNativeComponent = false">
		  <image class="c-popup-close" src="../../static/common/ic_cancel@2x.png" 
		    mode="aspectFill" @tap="categorySelectPopupVisible = false;"></image>
		  <view class="c-color-popup">
		    <!-- 选择类别 -->
		    <view class="c-tag-selector">
		      <view class="c-tag-selector__title">选择类别</view>
		      <view class="c-tag-list">
		        <view class="c-tag-item" :class="{'c-tag-item--active': item.checked}" 
		          v-for="item in categoryOptios" :key="item.id" @tap="handleCategoryOptionTap(item)">{{item.name}}</view>
		      </view>
		      <view class="c-tag-selector__footer">
		        <view class="c-tag-selector__btn c-tag-selector__btn--primary" @tap="showAddCategoryDialog">添加</view>
		        <view class="c-tag-selector__btn" @tap="deleteCategory">删除</view>
		      </view>
		    </view>
		    <!-- 确定 -->
		    <view class="c-color-popup-footer">
		      <button class="sg-button c-color-popup-submit" type="primary" @tap="handleCategoryPopupSubmit">确定</button>
		    </view>
		  </view>
		</sg-popup>
		
		
		
		
		<!-- 设置款式 -->
		<sg-popup v-model="styleSelectPopupVisible" position="bottom" @show="hideNativeComponent = true" 
		  @close="hideNativeComponent = false">
		  <image class="c-popup-close" src="../../static/common/ic_cancel@2x.png" 
		    mode="aspectFill" @tap="styleSelectPopupVisible = false;"></image>
		  <view class="c-color-popup">
		    <!-- 选择款式 -->
		    <view class="c-tag-selector">
		      <view class="c-tag-selector__title">选择款式</view>
		      <view class="c-tag-list">
		        <view class="c-tag-item" :class="{'c-tag-item--active': item.checked}" 
		          v-for="item in styleOptions" :key="item.id" @tap="handleStyleOptionTap(item)">{{item.name}}</view>
		      </view>
		      <view class="c-tag-selector__footer">
		        <view class="c-tag-selector__btn c-tag-selector__btn--primary" @tap="showAddStyleDialog">添加</view>
		        <view class="c-tag-selector__btn" @tap="deleteStyle">删除</view>
		      </view>
		    </view>
		    <!-- 确定 -->
		    <view class="c-color-popup-footer">
		      <button class="sg-button c-color-popup-submit" type="primary" @tap="handleStylePopupSubmit">确定</button>
		    </view>
		  </view>
		</sg-popup>
		
		
		<!-- 选择商品类别 -->
		<sg-popup v-model="typePopupVisible" position="bottom" @close="handleTypePopupClose">
			<view class="c-type-popup">
				<image class="c-type-popup__close" src="../../static/common/ic_cancel@2x.png" mode="aspectFill" @tap="handleTypePopupClose"></image>
				<view class="c-type-popup__title">选择商品类别</view>
				<scroll-view class="c-type-popup__content" scroll-y="true">
					<view class="c-alliance-type-list">
						<view
							class="c-alliance-type-item"
							:class="{ 'c-alliance-type-item--active': item.checked }"
							v-for="(item, index) in categorys"
							:key="item.id"
							@tap="handleAllianceTypeItemTap(item, index)"
						>
							{{ item.name }}
						</view>
					</view>
				</scroll-view>
				<view class="c-type-popup__footer"><button class="sg-button c-type-popup__submit" type="primary" @tap="handleAllianceTypeSubmit">确定</button></view>
			</view>
		</sg-popup>
    
	</view>
</template>

<script>
	import {
		ProductStyleApi,
		ProductInsertStyleApi,
		ProductDeleteStyleApi,
		ProductBuySaveApi,
		GroupEditProductApi,
		AllianceCateApi,
		whichApi
	} from '../../api/index.js'
	import _ from 'lodash'

	export default {
		data() {

			return {
        hideNativeComponent: false, // 是否隐藏原生组件，不隐藏的话打开的popup会出问题
				min_price: '0',
				max_price: '0',
				img: '',
				category: '',
				stalls: '', 
				style: '', 
				p_color: '', 
				p_size: '', 
				buy_num: 0,
				imageUrl: '',
				description: '',
        

        newColorName: '', // 设置的新颜色
        newSizeName: '', // 设置新的尺寸
				newCategoryName: '',
				newStyleName: '',
				styleSelectPopupVisible: false,
				colorSelectPopupVisible: false, // 显示颜色尺寸选取popup
				categorySelectPopupVisible: false, // 分类
				uid: getApp().globalData.uid,
				// store_id: getApp().globalData
				styles: {},
				colorOptions: [],
				sizeOptions: [],
				categoryOptios: [],
				styleOptions: [],
				selectItem: {},
				productCategory: '',
				images: [],
				sizes: [],
				postage: '',
				title: '',
				categorys: [],
				typePopupVisible: false, // 显示选择类别弹窗
				hasPopupOpen: false, // 是否有选择框打开，有的话隐藏原生组件
				goodsCategory: '请选择商品分类',
				goods_model: '',
				items: [],
			};
		},
		/**
		 * @param {Object} options
		 * canEdit: Boolean , true为编辑状态，false为查看状态
		 */
		onLoad(options) {
			this.loadCategory();
			this.loadStyle();
		},
    methods: {
			loadCategory() {
				AllianceCateApi(this.uid).then(ret => {
					console.log('AllianceCateApi ret == ', ret);
					if (ret && ret.data && ret.data.length > 0) {
						const data = ret.data;
						const i = [];
						data.forEach((item, index) => {
							i.push({
								...item,
								checked: false,
							})
						})
						console.log('data ===== ', i);
						this.categorys = this.categorys.concat(i);
						console.log('data ret ===== ', this.categoryIds);
					}
				}).catch(err => {
					console.log('AllianceCateApi err == ', err);
				})
			},
			loadStyle() {
				ProductStyleApi(this.uid).then(ret => {
					console.log('ProductStyleApi ret ==== ', ret);
					const data = ret.data;
					if (data) {
						const colros = data.color;
						const sizes = data.size;
						const categories = data.category;
						const styls = data.style;
						if (colros && colros.length > 0) {
							const i = [];
							colros.forEach((item, index) => {
								i.push({
									...item,
									checked: false,
								})
							})
							this.colorOptions = i;
						}
						
						if (sizes && sizes.length > 0) {
							const i = [];
							sizes.forEach((item, index) => {
								i.push({
									...item,
									checked: false,
								})
							})
							this.sizeOptions = i;
						}
						
						if (categories && categories.length > 0) {
							const i = [];
							categories.forEach((item, index) => {
								i.push({
									...item,
									checked: false,
								})
							})
							this.categoryOptios = i;
						}
						
						if (styls && styls.length > 0) {
							const i = [];
							styls.forEach((item, index) => {
								i.push({
									...item,
									checked: false,
								})
							})
							this.styleOptions = i;
						}
					}
				})
				.catch(err => {
					console.log('ProductStyleApi err ==== ', err);
				})
			},
			deleteGoodsCover(item, index) {
				this.images.splice(index, 1);
			},
      // 选择产品图片
      chooseProductImage() {
				if (this.images.length === 5) {
					uni.showToast({
						icon:'none',
						title: '最多上传5张图片',
						duration: 1000 
					});
					return;
				} 
				
				let that = this;
				uni.chooseImage({
					count: 5 - that.images.length,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: function (res) {
						console.log("图片路径",res, that.images);
						that.images = that.images.concat(res.tempFilePaths);
					}
				});
      },
      // 最低价减少
      handleMinPriceMinusTap() {
        if (this.min_price > 0) {
          this.min_price --;
        }
      },
      // 最低价增加
      handleMinPricePlusTap() {
        this.min_price ++;
      },
      // 最高价减少
      handleMaxPriceMinusTap() {
        if (this.max_price > this.min_price) {
          this.max_price --;
        }
      },
      // 最高价增加
      handleMaxPricePlusTap() {
        this.max_price ++;
      },
			showMsg(msg) {
				uni.showToast({
					title: msg,
					icon: 'none'
				})
			},
			handleAllianceTypeCellTap() {
				this.typePopupVisible = true;
				this.hasPopupOpen = this.typePopupVisible;
			},
			handleTypePopupClose() {
				this.typePopupVisible = false;
				this.hasPopupOpen = false;
			},
			// 选择联盟类型点击选择项
			handleAllianceTypeItemTap(item, index) {
				console.log('handleAllianceTypeItemTap ==== ', item, index);
				
				if (!item.checked && this.items.length === 3) {
					uni.showToast({
						title: '最多能选3个',
						icon: 'none'
					})
					return;
				}
				
				item.checked = !item.checked;
				if (item.checked) {
					this.items.push(item.name);
				} else {
					this.items = _.filter(this.items, i => {
						return i !== item.name;
					})
				}
				
				setTimeout(() => {
					this.goodsCategory = _.toString(this.items);
				}, 500);
			},
			handleAllianceTypeSubmit() {
				this.typePopupVisible = false;
				this.hasPopupOpen = false;
				
				
			},
			submitFindGoods() {
				const s = [...this.sizes]
				console.log('postage ==== ', this.postage);
				console.log('s ========== ', s)
				if (this.images.length === 0) {
					uni.showToast({
						title: '请选择商品展示图',
						icon: 'none'
					})
					return;
				}
				if (this.goods_model.length === 0) {
					this.showMsg('请输入商品型号');
					return;
				}
				
				if (this.goodsCategory.length === 0) {
					this.showMsg('请填写商品分类');
					return;
				}
				
				if (this.stalls.length === 0) {
					this.showMsg('请填写商品档口号');
					return;
				}
				
				
				
				if (this.postage.length === 0) {
					this.showMsg('邮费还未填写');
					return;
				}
				

				console.log('images ===== ', this.images)
				
				uni.showLoading({
					title: '上传中'
				});
				let flag = 0;
				let that = this;
				let imageURLs = [];
				for(let i = 0; i < this.images.length; i++){
					console.log('this.images[i] ===== ', this.images[i])
					uni.uploadFile({
						url: `${whichApi()}/user/file/save`,
						filePath: this.images[i],
						name: 'file',
						fileType: 'image',
						formData: {
							uid: that.uid,
						},
						success: (result) => {
							console.log("上传结果：======================= ", result);
							const {data} = JSON.parse(result.data);
							flag += 1;
							imageURLs = imageURLs.concat(data.file);
							console.log('s ===== ', imageURLs);
							if (that.images.length == flag) {
								uni.hideLoading();
								that.postGoods(imageURLs);
							}
						},
						failed:(e) => {
							console.log('er------- ', e)
							uni.showToast({
								title: '发布失败',
								icon: 'failed'
							})
						}
					});
				}
			},
			postGoods(imageURLs) {
				console.log('imageURLs ==== ', imageURLs);
				const {current_outlet_id} = getApp().globalData.userInfo;
				const data = {
					uid: this.uid,
					store_id: current_outlet_id,
					model: this.goods_model,
					stalls: this.stalls,
					// title: this.title,
					goods_category: this.goodsCategory,
					style: this.style,
					category: this.category,
					min_price: this.min_price,
					max_price: this.max_price,
					description: this.description,
					specs: this.sizes,
					postage: this.postage,
					img: imageURLs,
				}
				
				console.log('data ===== ', data)
				
				ProductBuySaveApi(data).then(ret => {
					console.log('上传结束', ret);
					// let obj = JSON.parse(ret.data);
					// console.log('obj 上传结束', obj);
					uni.showToast({
						title: '发布成功',
						icon: 'none'
					})
					
					setTimeout(function() {
						uni.redirectTo({
						  url: '/pages/find-goods-record/find-goods-record'
						});
					}, 1000);
				})
				.catch(err => {
					uni.showToast({
						title:'发布失败：'+ err,
						icon: 'none'
					})
					console.log('发布失败：', err);
				})
				
				// uni.uploadFile({
				// 	url: `${whichApi()}/user/ProductBuy/save`,
				// 	formData: {
				// 		...data,
				// 	},
				// 	success: function(uploadFileRes) {
						
				// 	},
				// 	fail: function(err) {
						
				// 	}
				// })
			},
			addNewSize() {
				this.colorSelectPopupVisible = true;
			},
      // 发布
			showStyleSelectPopup() {
			  this.styleSelectPopupVisible = true;
			},
			showCategorySelectPopup() {
			  this.categorySelectPopupVisible = true;
			},
      // 点击颜色选择项
      handleColorOptionTap(item) {
        this.colorOptions.forEach(opt => {
          if (opt.checked) {
            opt.checked = false;
          }
        });
        item.checked = true;
				this.selectItem = item;
      },
			handleCategoryOptionTap(item) {
				this.categoryOptios.forEach(opt => {
				  if (opt.checked) {
				    opt.checked = false;
				  }
				});
				item.checked = true;
				this.selectItem = item;
			},
			// 款式选择
			handleStyleOptionTap(item) {
				this.styleOptions.forEach(opt => {
				  if (opt.checked) {
				    opt.checked = false;
				  }
				});
				item.checked = true;
				this.selectItem = item;
			},
      // 点击尺寸选择项
      handleSizeOptionTap(item) {
        this.sizeOptions.forEach(opt => {
          if (opt.checked) {
            opt.checked = false;
          }
        });
        item.checked = true;
				this.selectItem = item;
      },
			deleteCategory() {
				this.productDeleteStyle(this.selectItem, 'category');
			},
			deleteColor() {
				this.productDeleteStyle(this.selectItem, 'color');
			},
			deleteStyle() {
				this.productDeleteStyle(this.selectItem, 'style');
			},
			deleteSize() {
				this.productDeleteStyle(this.selectItem, 'size');
			},
			deleteProductSize(item, index) {
				this.sizes.splice(item, 1);
			},
			replaceInput(e, item) {
				if (item.num === '0') {
					item.num = 1;
				}
			},
			minusTap(item, index) {
				console.log('minus ----- ', this.sizes);
				const num = parseInt(item.num);
				if (num === 1) {
					uni.showToast({
						title: '最少需要选择1件',
						icon: 'none'
					});
					return;
				}
				if (num !== 0) {
					item.num = num - 1;
				}
			},
			plusTap(item, index) {
				const num = parseInt(item.num);
				item.num = num + 1;
			},
			deleteOptios(type) {
				console.log('s ====== ', this.categoryOptios);
				if (type === 'category') {
					this.categoryOptios = this.categoryOptios.filter((obj, idx) => {
						if (!obj.checked) {
							return obj;
						}
					})
				} else if (type === 'color') {
					this.colorOptions = this.colorOptions.filter((obj, idx) => {
						if (!obj.checked) {
							return obj;
						}
					})
				} else if (type === 'style') {
					this.styleOptions = this.styleOptions.filter((obj, idx) => {
						if (!obj.checked) {
							return obj;
						}
					})
				} else if (type === 'size') {
					this.sizeOptions = this.sizeOptions.filter((obj, idx) => {
						if (!obj.checked) {
							return obj;
						}
					})
				}
			},
			productDeleteStyle(item, type) {
				ProductDeleteStyleApi(this.uid, type, item.id).then(ret => {
					console.log('ProductDeleteStyleApi ret === ', ret);
					this.deleteOptios(type);
				})
				.catch(err => {
					console.log('ProductDeleteStyleApi err === ', err);
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					})
				})
			},
			// 颜色添加完成
			handleColorAdd() {
			  if (this.newColorName !== '') {
					ProductInsertStyleApi(this.uid, 'color', this.newColorName).then(ret => {
						console.log('ProductInsertStyleApi ret === ', ret);
						const data = ret.data;
						if (data && data.id) {
							this.colorOptions.push({
							  id: data.id,
							  name: this.newColorName,
							  checked: false
							});
							this.newColorName = '';
						}
					})
					.catch(err => {
						console.log('ProductInsertStyleApi err === ', err);
					})
			  }
			},
			handleCategoryAdd() {
			  if (this.newCategoryName !== '') {
					ProductInsertStyleApi(this.uid, 'category', this.newCategoryName).then(ret => {
						console.log('ProductInsertStyleApi ret === ', ret);
						const data = ret.data;
						if (data && data.id) {
							this.categoryOptios.push({
							  id: data.id,
							  name: this.newCategoryName,
							  checked: false
							});
							this.newCategoryName = '';
						}
					})
					.catch(err => {
						console.log('ProductInsertStyleApi err === ', err);
					})
			  }
			},
			handleStyleAdd() {
			  if (this.newStyleName !== '') {
			    ProductInsertStyleApi(this.uid, 'style', this.newStyleName).then(ret => {
			    	console.log('ProductInsertStyleApi ret === ', ret);
			    	const data = ret.data;
			    	if (data && data.id) {
			    		this.styleOptions.push({
			    		  id: data.id,
			    		  name: this.newStyleName,
			    		  checked: false
			    		});
							this.newSizeName = '';
			    	}
			    })
			    .catch(err => {
			    	console.log('ProductInsertStyleApi err === ', err);
			    })
			  }
			},
			// 尺寸添加完成
			handleSizeAdd() {
			  if (this.newSizeName !== '') {
			    ProductInsertStyleApi(this.uid, 'size', this.newSizeName).then(ret => {
			    	console.log('ProductInsertStyleApi ret === ', ret);
			    	const data = ret.data;
			    	if (data && data.id) {
			    		this.sizeOptions.push({
			    		  id: data.id,
			    		  name: this.newSizeName,
			    		  checked: false
			    		});
							this.newSizeName = '';
			    	}
			    })
			    .catch(err => {
			    	console.log('ProductInsertStyleApi err === ', err);
			    })
			  }
			},
      // 显示添加颜色dialog
      showAddColorDialog() {
        this.newColorName = '';
        this.$refs.addColorDialogRef.show({
          title: '设置颜色',
          content: '',
          showCancel: true,
          cancelText: '取消',
          confirmText: '确定'
        });
      },
      // 显示添加尺寸dialog
      showAddSizeDialog() {
        this.newSizeName = '';
        this.$refs.addSizeDialogRef.show({
          title: '设置尺寸',
          content: '',
          showCancel: true,
          cancelText: '取消',
          confirmText: '确定'
        });
      },
			showAddCategoryDialog() {
				this.newCategoryName = '';
				this.$refs.addCategoryDialogRef.show({
				  title: '设置类别',
				  content: '',
				  showCancel: true,
				  cancelText: '取消',
				  confirmText: '确定'
				});
			},
			showAddStyleDialog() {
				this.newSizeName = '';
				this.$refs.addStyleDialogRef.show({
				  title: '设置款式',
				  content: '',
				  showCancel: true,
				  cancelText: '取消',
				  confirmText: '确定'
				});
			},
			handleCategoryPopupSubmit() {
				const ret = this.categoryOptios.find(opt => opt.checked);
				if (!ret) {
					uni.showToast({
					  title: '请选类别',
					  icon: 'none'
					});
					return;
				}
				this.categorySelectPopupVisible = false;
				this.category = ret.name;
			},
			handleStylePopupSubmit() {
				const ret = this.styleOptions.find(opt => opt.checked);
				if (!ret) {
					uni.showToast({
					  title: '请选款式',
					  icon: 'none'
					});
					return;
				}
				this.styleSelectPopupVisible = false;
				this.style = ret.name;
			},
      handleColorPopupSubmit() {
        let selectedColor = this.colorOptions.find(opt => opt.checked);
        if (!selectedColor) {
          uni.showToast({
            title: '请选择颜色',
            icon: 'none'
          });
          return;
        }
        let selectedSize = this.sizeOptions.find(opt => opt.checked);
        if (!selectedSize) {
          uni.showToast({
            title: '请选择尺寸',
            icon: 'none'
          });
          return;
        }
        this.colorSelectPopupVisible = false;
				
				this.sizes.push({
					p_color: selectedColor.name,
					p_size: selectedSize.name,
					num: 1,
				})
      }
    },
	}
</script>

<style lang="scss">
  @import '@/common/scss/mixin.scss';
  .page-container {
    padding-bottom: 98rpx;
  }
  .c-product {
    position: relative;
    padding: 24rpx;
    display: flex;
    background: #FFFFFF;
  }
  .c-product__select-image {
    position: absolute;
    z-index: 1;
    left: 148rpx;
    top: 160rpx;
    width: 44rpx;
    height: 33rpx;
  }
  .c-product__image {
    width: 180rpx;
    height: 180rpx;
    border-radius: 6rpx 6rpx 0 0;
  }
  .c-product__content {
    // flex: 1;
    padding-left: 100rpx;
  }
  .c-product__title {
    height: 90rpx;
    font-size: 32rpx;
    font-weight:400;
    color:rgba(102,102,102,1);
    line-height:45rpx;
    @include ellipsis(2);
		background: #07C160;
  }
  
  // cell
  .c-cell-list__title {
    height: 80rpx;
    line-height: 80rpx;
    background: rgba(244,245,246,1);
    box-shadow: 0rpx 2rpx 0rpx 0rpx rgba(244,245,246, 1);
    font-size: 30rpx;
    font-weight: 400;
    color: rgba(153,153,153,1);
    padding: 0 24rpx;
  }
  .c-cell {
    display: flex;
    height: 100rpx;
    background: #fff;
    padding: 0 24rpx;
    align-items: center;
    @include thin_line_bottom(#F4F5F6, 0, 0);
  }
	.c-cell-wrapper {
		background-color: #F4F5F6;
		padding-left: 30rpx;
		padding-right: 30rpx;
		height: 33rpx;
		flex-direction: row;
		justify-content: space-between;
	}
	.c-cell_wrapper__title {
		font-size: 23rpx;
		color: #666666;
	}
  .c-cell__title {
    height: 46rpx;
    padding-right: 20rpx;
    font-size: 30rpx;
    font-weight: 400;
    color: rgba(102,102,102,1);
    line-height: 46rpx;
    @include ellipsis(1);
  }
  .c-cell__input {
    flex: 1;
    height: 52rpx;
    line-height: 52rpx;
    min-height: 52rpx;
    text-align: right;
    font-size: 30rpx;
    font-weight: 400;
    color: rgba(38,38,38,1);
  }
  .c-cell__val,
  .c-cell__select {
    flex: 1;
    height: 46rpx;
    font-size: 30rpx;
    font-weight: 400;
    color: rgba(153,153,153,1);
    line-height: 46rpx;
    text-align: right;
    @include ellipsis(1);
  }
  .c-cell__select--active {
    color: #262626;
  }
  .c-cell--clickable:active {
    background: #F4F5F6;
  }
  
  .c-textarea-cell {
    background: #fff;
    padding: 24rpx;
  }
  .c-textarea-cell__title {
    height: 46rpx;
    font-size: 30rpx;
    font-weight: 400;
    color: rgba(102,102,102,1);
    line-height: 46rpx;
  }
  .c-textarea-cell__input {
    font-size: 30rpx;
    font-weight:400;
    color: rgba(38,38,38,1);
    height: 140rpx;
    margin-top: 16rpx;
  }
	.c-textare-cell__product-name {
		font-size: 30rpx;
		font-weight:400;
		color: rgba(38,38,38,1);
		height: 140rpx;
		// margin-top: 16rpx;
	}
  .c-textarea-cell__placeholder {
    color: #BDBDBD;
  }
  .c-textarea-cell__val {
    font-size: 30rpx;
    line-height: 46rpx;
    font-weight:400;
    color: #BDBDBD;
    min-height: 140rpx;
    margin-top: 16rpx;
  }
  
  // stepper
  .c-stepper {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .c-stepper__icon {
    width: 66rpx;
    height: 60rpx;
    border-radius: 4rpx;
  }
  .c-stepper__val {
    padding: 0 16rpx;
    // min-width: 90rpx;
		max-width: 60px;
    text-align: center;
    height: 60rpx;
    font-size: 30rpx;
    font-weight: bold;
    color: rgba(38,38,38,1);
    line-height: 60rpx;
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
    color: rgba(255,255,255,1);
  }
  
  // tag选择popup
  .c-color-popup {
  }
  .c-popup-close {
    width: 54rpx;
    height: 54rpx;
    position: absolute;
    right: 24rpx;
    top: 24rpx;
    z-index: 1;
  }
  .c-tag-selector {
    padding: 48rpx 24rpx 0;
    position: relative;
    overflow: hidden;
  }
  .c-tag-selector__title {
    height: 48rpx;
    font-size: 34rpx;
    font-weight: bold;
    color: rgba(102,102,102,1);
    line-height: 48rpx;
    text-align: center;
  }
  // tag
  .c-tag-list {
    margin-top: 32rpx;
    display: flex;
    flex-wrap: wrap;
    margin-right: -26rpx;
    margin-bottom: -26rpx;
    overflow: hidden;
  }
  .c-tag-item {
    position: relative;
    width: 215rpx;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    padding: 0 24rpx;
    background: rgba(244,245,246,1);
    border-radius: 8rpx;
    margin-right: 26rpx;
    margin-bottom: 26rpx;
    @include ellipsis(1);
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border: 1px solid rgba(213,213,213,1);
      border-radius: 8rpx;
    }
  }
  .c-tag-item--active {
    background:rgba(250,100,0,1);
    line-height: 80rpx;
    color: #fff;
    font-weight: 400;
    &:after {
      border: none;
    }
  }
  .c-tag-selector__footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 26rpx;
  }
  .c-tag-selector__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 150rpx;
    height: 56rpx;
    border-radius: 40rpx;
    border: 1px solid rgba(153,153,153,1);
    font-size: 26rpx;
    font-weight: 400;
    color: rgba(153,153,153,1);
  }
  .c-tag-selector__btn:active {
    opacity: 0.6;
  }
  .c-tag-selector__btn + .c-tag-selector__btn {
    margin-left: 17rpx;
  }
  .c-tag-selector__btn--primary {
    border:1px solid #FA6400;
    color: #FA6400;
  }
  
  .c-color-popup-footer {
    padding: 40rpx 64rpx 24rpx;
  }
  
  .c-color-popup-submit {
    height: 88rpx;
    line-height: 88rpx;
    background:rgba(250,100,0,1);
    border-radius: 6rpx;
    font-size: 34rpx;
    font-weight: bold;
    color:rgba(255,255,255,1);
  }
  
  // 设置颜色和尺寸Input
  .c-add-color-input,
  .c-add-size-input{
    height: 84rpx;
    min-height: 84rpx;
    line-height: 80rpx;
    padding: 0 24rpx;
    border-radius: 10rpx;
    font-size: 32rpx;
    border: 1px solid rgba(213,213,213,1);
    color: #262626;
    margin-top: 27rpx;
  }
  .c-add-color-input__placeholder,
  .c-add-size-input__placeholder{
    color: #BDBDBD;
  }
	.c-goods-image {
		width: 180rpx;
		height: 180rpx;
	}

	.c-header {
		flex-flow: wrap;
		display: flex;
		padding-left: 24rpx;
		padding-right: 24rpx;
		padding-top: 24rpx;
		margin-bottom: 12rpx;
	},
	.c-product-image {
		width: 180rpx;
		height: 180rpx;
	}
	.c-goods-wrapper {
		position: relative;
		margin-right: 20rpx;
	}
	.c-delete-button {
		position: absolute;
		right: -22rpx;
		top: -22rpx;
		width: 44rpx;
		height: 44rpx;
		z-index: 1;
	}
	.ic-arrow-add-image {
		width: 36rpx;
		height: 36rpx;
	}
	.ic-arrow-add-text {
		color: #FA6400;
		font-size: #FA6400;
		margin-left: 4rpx;
	}
	.c-cell_wrapper {
		flex-direction: row;
		display: flex;
		justify-content: center;
		align-items: center;		
	}
	.c-flex {
		flex: 1;
	}
  .c-list-wrapper {
		flex-direction: row;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #FFFFFF;
		padding-left: 32rpx;
		padding-right: 32rpx;
		height: 90rpx;
	}
	.c-color {
		color: #666666;
		font-size: 32rpx;
		margin-left: 28rpx;
	}
	.c-size {
		color: #666666;
		font-size: 32rpx;
	}
	.c-count {
		color: #262626;
		font-size: 30rpx;
	}
	.c-delete {
		width: 44rpx;
		height: 44rpx;
	}
	.postage-input {
		color: #FA6400;
		font-size: 22rpx;
	}
	.c-input-pistage {
		width: 100rpx;
		height: 80rpx;
		margin-left: 20rpx;
	}
	.c-postage-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;
	}
	.c-placehoder-view {
		background-color: #F4F5F6;
		flex: 1;
		height: 24rpx;
	}
	// 类别弹窗
	.c-type-popup {
		position: relative;
		padding-top: 48rpx;
	}
	.c-type-popup__title {
		font-size: 34rpx;
		color: #666666;
		line-height: 48rpx;
		font-weight: bold;
		text-align: center;
	}
	.c-scroll-wrapper {
		margin-top: 32rpx;
		height: 300rpx;
	}
	.c-type-popup__content {
		margin-top: 32rpx;
		height: calc(90vh - 264rpx);
	}
	.c-type-popup__close {
		position: absolute;
		width: 54rpx;
		height: 54rpx;
		right: 24rpx;
		top: 24rpx;
	}
	.c-alliance-type-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 0 24rpx;
	}
	.c-alliance-type-item {
		width: 216rpx;
		height: 80rpx;
		border: 1px solid rgba(213, 213, 213, 1);
		background: #f4f5f6;
		border-radius: 8rpx;
		line-height: 80rpx;
		text-align: center;
		padding: 0 24rpx;
		color: #000000;
		font-size: 32rpx;
		margin-bottom: 26rpx;
	}
	.c-alliance-type-item--active {
		background: #fa6400;
		color: #fff;
		border: none;
	}
	.c-type-popup__footer {
		width: 100%;
		padding: 24rpx 64rpx;
	}
	.c-type-popup__submit {
		height: 88rpx;
		line-height: 88rpx;
		font-size: 34rpx;
		color: #fff;
		font-weight: bold;
	}
</style>
