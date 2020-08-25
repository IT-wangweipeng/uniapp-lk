<template>
	<view class="page-container">
		<view class="c-product">
      <image v-if="canEdit" class="c-product__select-image" src="../../static/find-goods/ic_camera@2x.png" mode="aspectFill"></image>
      <image class="c-product__image" :src="product.img" mode="aspectFill"></image>
      <view class="c-product__content">
        <view class="c-product__title">{{product.title}}</view>
      </view>
    </view>
    
    <view class="c-cell-list">
      <view class="c-cell">
        <view class="c-cell__title">商品分类</view>
        <input v-if="canEdit" class="c-cell__input" type="text" placeholder="请输入商品分类" value="女装"/>
        <view v-else class="c-cell__val">{{product.category}}</view>
      </view>
      <view class="c-cell">
        <view class="c-cell__title">档口号</view>
        <input v-if="canEdit" class="c-cell__input" type="text" placeholder="请输入档口号" value="档口号"/>
        <view v-else class="c-cell__val">{{product.stalls}}</view>
      </view>
      <view class="c-cell">
        <view class="c-cell__title">求购数量</view>
        <input v-model="product.buy_num" v-if="canEdit" class="c-cell__input" type="number" placeholder="请输入求购数量"/>
        <view v-else class="c-cell__val">{{product.buy_num}}</view>
      </view>
    </view>
    
    <view class="c-cell-list">
      <view class="c-cell-list__title">价格信息</view>
      <view class="c-cell">
        <view class="c-cell__title">最低价</view>
        <view class="c-stepper" v-if="canEdit">
          <image class="c-stepper__icon" src="../../static/common/ic_minus@2x.png" mode="aspectFill" 
            @tap="handleMinPriceMinusTap"></image>
          <view class="c-stepper__val">{{product.min_price}}</view>
          <image class="c-stepper__icon" src="../../static/common/ic_plus@2x.png" mode="aspectFill"
            @tap="handleMinPricePlusTap"></image>
        </view>
        <view v-else class="c-cell__val">50</view>
      </view>
      <view class="c-cell">
        <view class="c-cell__title">最高价</view>
        <view class="c-stepper" v-if="canEdit">
          <image class="c-stepper__icon" src="../../static/common/ic_minus@2x.png" mode="aspectFill" 
            @tap="handleMaxPriceMinusTap"></image>
          <view class="c-stepper__val">{{product.max_price}}</view>
          <image class="c-stepper__icon" src="../../static/common/ic_plus@2x.png" mode="aspectFill"
            @tap="handleMaxPricePlusTap"></image>
        </view>
        <view v-else class="c-cell__val">100</view>
      </view>
      <view class="c-cell" :class="{'c-cell--clickable': canEdit}" @tap="showStyleSelectPopup">
        <view class="c-cell__title">款式</view>
        <view class="c-cell__select ">{{product.style}}</view>
      </view>
      <view class="c-cell" :class="{'c-cell--clickable': canEdit}" @tap="showCategorySelectPopup">
        <view class="c-cell__title">类别</view>
        <view class="c-cell__select">{{product.category}}</view>
      </view>
      <view class="c-cell" :class="{'c-cell--clickable': canEdit}" @tap="showColorSelectPopup">
        <view class="c-cell__title">颜色及尺码</view>
        <view class="c-cell__select c-cell__select--active">{{product.p_color + ' ' + product.p_size}}</view>
      </view>
      <view class="c-textarea-cell">
        <view class="c-textarea-cell__title">商品信息</view>
        <textarea v-if="canEdit && !hideNativeComponent" class="c-textarea-cell__input" value="" 
          placeholder-class="c-textarea-cell__placeholder" placeholder="输入商品信息" />
        <view v-if="!canEdit" class="c-textarea-cell__val">{{product.description}}</view>
      </view>
    </view>
    
    <!-- footer -->
    <view class="c-footer" v-if="canEdit">
      <button v-if="type === 1" class="sg-button sg-button--square c-footer-btn" type="primary" @tap="submit">
				发布清货信息
			</button>
			<button v-else-if="type === 2" class="sg-button sg-button--square c-footer-btn" type="primary" @tap="submit">
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
          <view class="c-tag-list">
            <view class="c-tag-item" :class="{'c-tag-item--active': item.checked}" 
              v-for="item in colorOptions" :key="item.id" @tap="handleColorOptionTap(item)">{{item.name}}</view>
          </view>
          <view class="c-tag-selector__footer">
            <view class="c-tag-selector__btn c-tag-selector__btn--primary" @tap="showAddColorDialog">添加</view>
            <view class="c-tag-selector__btn" @tap="deleteColor">删除</view>
          </view>
        </view>
        <!-- 选择尺码 -->
        <view class="c-tag-selector">
          <view class="c-tag-selector__title">选择尺寸</view>
          <view class="c-tag-list">
            <view class="c-tag-item" :class="{'c-tag-item--active': item.checked}"
              v-for="item in sizeOptions" :key="item.id" @tap="handleSizeOptionTap(item)">{{item.name}}</view>
          </view>
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
    <sg-dialog ref="addSizDialogRef" @confirm="handleSizeAdd">
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
    
	</view>
</template>

<script>
	import {
		ProductStyleApi,
		ProductInsertStyleApi,
		ProductDeleteStyleApi,
		ProductBuySaveApi,
		GroupEditProductApi
	} from '../../api/index.js'

	export default {
		props: {
			// 是否可以编辑
			canEdit: Boolean,
			// 传递的商品数据
			product: Object,
		},
		data() {

			return {
        canEdit: false, // 是否可编辑
        hideNativeComponent: false, // 是否隐藏原生组件，不隐藏的话打开的popup会出问题
        

        newColorName: '', // 设置的新颜色
        newSizeName: '', // 设置新的尺寸
				newCategoryName: '',
				newStyleName: '',
				styleSelectPopupVisible: false,
				colorSelectPopupVisible: false, // 显示颜色尺寸选取popup
				categorySelectPopupVisible: false, // 分类
				uid: getApp().globalData.uid,
				product: {},
				styles: {},
				type: 0, // 1: 清货， 2：寻货， 0: 默认
				colorOptions: [],
				sizeOptions: [],
				categoryOptios: [],
				styleOptions: [],
				selectItem: {},
				isNew: false,
			};
		},
		/**
		 * @param {Object} options
		 * canEdit: Boolean , true为编辑状态，false为查看状态
		 */
		onLoad(opt) {
			this.product = JSON.parse(opt.product)
			
			console.log('product ==== ', this.product)
		},
    methods: {
      // 最低价减少
      handleMinPriceMinusTap() {
        if (this.product.min_price > 0) {
          this.product.min_price --;
        }
      },
      // 最低价增加
      handleMinPricePlusTap() {
        this.product.min_price ++;
      },
      // 最高价减少
      handleMaxPriceMinusTap() {
        if (this.product.max_price > this.product.min_price) {
          this.product.max_price --;
        }
      },
      // 最高价增加
      handleMaxPricePlusTap() {
        this.product.max_price ++;
      },
			editGroupFindProduct() {
				// 编辑联盟寻货商品
				GroupEditProductApi(this.uid, t)
			},
      // 发布
      submit() {
				
				
				// export const GroupEditProductApi = (uid, id, min_price, max_price) => {
				
				console.log('p ========== ', this.product)
        
				if (!this.isNew) {
					
					this.editGroupFindProduct();
					
				} else {
					// 新增
				}
				
				const {
					id,
					store_id, 
					model, 
					stalls, 
					img, 
					style, 
					category, 
					min_price, 
					max_price, 
					p_color, 
					p_size, 
					buy_num
				} = this.product
				
				ProductBuySaveApi(this.uid, id, store_id, model, stalls, img, style, category, min_price, max_price, p_color, p_size, buy_num).then(ret => {
					console.log('ProductBuySaveApi ret === ', ret);
				})
				.catch(err => {
					console.log('ProductBuySaveApi err === ', err);
					uni.showToast({
						title: '失败' + err,
						icon: 'none'
					})
				})
      },
      showColorSelectPopup() {
        if (this.canEdit) {
          this.colorSelectPopupVisible = true;
        }
      },
			showStyleSelectPopup() {
			  if (this.canEdit) {
			    this.styleSelectPopupVisible = true;
			  }
			},
			showCategorySelectPopup() {
			  if (this.canEdit) {
			    this.categorySelectPopupVisible = true;
			  }
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
					ProductInsertStyleApi(this.uid, 'color', this.newCategoryName).then(ret => {
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
				this.product.category = ret.name;
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
				this.product.style = ret.name;
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
        this.product.p_color = selectedColor.name;
        this.product.p_size = selectedSize.name;
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
    flex: 1;
    padding-left: 24rpx;
  }
  .c-product__title {
    height: 90rpx;
    font-size: 32rpx;
    font-weight:400;
    color:rgba(102,102,102,1);
    line-height:45rpx;
    @include ellipsis(2);
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
    min-width: 90rpx;
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
  
</style>
