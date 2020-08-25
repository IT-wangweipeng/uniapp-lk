<template>
	<view class="page-container">
		<view class="c-cell c-cell--clickable c-alliance-image-cell" @tap="chooseImage">
			<view class="c-cell__label">联盟头像</view>

			<view class="c-cell__value c-cell__placeholder">
				<template v-if="!alliance.image">
					设置头像
				</template>
				<image v-if="alliance.image" class="c-alliance-image" :src="alliance.image" mode="aspectFill"></image>
			</view>
			<image class="c-cell__arrow" src="../../static/common/ic_arrow_right_gury@2x.png" mode="aspectFill"></image>
		</view>
		<view class="c-cell">
			<view class="c-cell__label">联盟名称</view>
			<input class="c-cell__input" type="text" v-model="alliance.title" value="" maxlength="15" placeholder-class="c-cell__placeholder" placeholder="输入联盟名称 0/15" />
		</view>
		<view class="c-cell c-cell--clickable" @tap="handleAllianceRegionTap">
			<view class="c-cell__label">联盟地区</view>
			<view class="c-cell__value" :class="{ 'c-cell__placeholder': !alliance.region }" v-model="alliance.region">{{ alliance.region || '选择联盟地区' }}</view>
			<image class="c-cell__arrow" src="../../static/common/ic_arrow_right_gury@2x.png" mode="aspectFill"></image>
		</view>
		
		
		<view class="c-cell c-cell--clickable" @tap="handleAllianceTypeCellTap">
			<view class="c-cell__label">联盟类别</view>
			<view class="c-cell__value" :class="{ 'c-cell__placeholder': !alliance.types }">{{ alliance.types || '选择联盟类别' }}</view>
			<image class="c-cell__arrow" src="../../static/common/ic_arrow_right_gury@2x.png" mode="aspectFill"></image>
		</view>
		
		
		
		<view class="c-cell">
			<view class="c-cell__label">加入需要审核</view>
			<switch class="c-cell__switch" color="#4DD865" :checked="false" @change="switchChange"/>
		</view>
		<view class="c-cell c-cell--clickable">
			<view class="c-cell__label">店铺地址</view>
			<view class="c-cell__value" >{{ current_outlet_area }}</view>
		</view>
		<view class="c-textarea-cell">
			<view class="c-textarea-cell__title">联盟描述</view>
			<textarea
				:style="{ display: hasPopupOpen ? 'none' : 'block' }"
				class="c-textarea-cell__value"
				placeholder-class="c-textarea-cell__placeholder"
				placeholder="请输入联盟描述"
				maxlength="500"
				v-model="alliance.desc"
			/>
			<view class="c-textarea-cell__words" style="{'display': hasPopupOpen? 'none': 'block'}">
				<view
					class="c-textarea-cell__writewords"
					:class="{
						'c-textarea-cell__writewords--write': alliance.desc.length > 0
					}"
					v-model="alliance.desc"
				>
					{{ alliance.desc.length }}
				</view>
				/500
			</view>
		</view>

		<!-- footer -->
		<view class="c-footer" v-if="isCreate ==0"><button class="sg-button sg-button--square c-footer__btn" type="primary" @tap="createAlliance">创建联盟</button></view>
		<view class="c-footer" v-if="isCreate ==1"><button class="sg-button sg-button--square c-footer__btn" type="primary">创建中...</button></view>
		<view class="c-footer" v-if="isCreate ==2"><button class="sg-button sg-button--square c-footer__btn" type="primary">创建完成</button></view>

		<sg-popup v-model="typePopupVisible" position="bottom" @close="handleTypePopupClose">
			<view class="c-type-popup">
				<image class="c-type-popup__close" src="../../static/common/ic_cancel@2x.png" mode="aspectFill" @tap="handleTypePopupClose"></image>
				<view class="c-type-popup__title">选择联盟类别（{{ selectedTypeCount }}/5）</view>
				<scroll-view class="c-type-popup__content" scroll-y="true">
					<view class="c-alliance-type-list">
						<view
							class="c-alliance-type-item"
							:class="{ 'c-alliance-type-item--active': item.selected }"
							v-for="item in allianceTypes"
							:key="item.id"
							@tap="handleAllianceTypeItemTap(item)"
						>
							{{ item.name }}
						</view>
					</view>
				</scroll-view>
				<view class="c-type-popup__footer"><button class="sg-button c-type-popup__submit" type="primary" @tap="handleAllianceTypeSubmit">确定</button></view>
			</view>
		</sg-popup>
		<mpvue-city-picker
			themeColor="#FA6400"
			title="选择联盟地区"
			ref="mpvueCityPicker"
			:pickerValueDefault="cityPickerValueDefault"
			@onCancel="handleCityPickerCancel"
			@onConfirm="handleCityPickerConfirm"
		></mpvue-city-picker>
	</view>
</template>

<script>
import mpvueCityPicker from '@/components/base/mpvue-citypicker/mpvueCityPicker.vue';
import {CreatAllianceApi,AllianceCateApi,ShopDetailsApi} from '../../api/index.js';
export default {
	components: { mpvueCityPicker },
	data() {
		return {
			alliance: {
				title: '',
				image: '',
				region: '',
				types: '',
				desc: '',
				categary_id: '',
				need_check: 2,
				city:''
			},
			typePopupVisible: false, // 显示选择类别弹窗
			hasPopupOpen: false, // 是否有选择框打开，有的话隐藏原生组件
			allianceTypes: [],
			cityPickerValueDefault: [0, 0, 0],
			isCreate:0,
			current_outlet_area:'',
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
		},
		
		selectedTypeCount() {
			const selectedTypes = this.allianceTypes.filter(type => type.selected);
			return selectedTypes.length;
		}
	},
	methods: {
		
		//获取店铺地址
		getOutletAddress(){
			let current_outlet_id = this.userInfo.current_outlet_id;
			ShopDetailsApi(current_outlet_id, this.uid)
				.then(res => {
					console.log('get ShopDetail res == ', res);
					if (res.code == 1) {
						this.current_outlet_area = res.data.address;
					} else {
						this.current_outlet_area = '';
					}
				})
				.catch(err => {
					console.log('get ShopDetail error', err);
				});
		},
		
		//获取联盟类别
		getAllianceCate() {
			AllianceCateApi(this.uid)
				.then(res => {
					console.log('get categary success', res);

					if (res.code == 1) {
						for (let i = 0; i < res.data.length; i++) {
							this.allianceTypes.push({
								id: res.data[i].id,
								name: res.data[i].name,
								selected: false
							});
						}
					} else {
						console.info(res);
					}
				})
				.catch(err => {
					console.log('get code error', err);
				});
		},

		chooseImage() {
			uni.chooseImage({
				count: 1,
				sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album'], //从相册选择
				success: res => {
					console.log(JSON.stringify(res.tempFilePaths));
					const tempFilePaths = res.tempFilePaths;
					this.alliance.image = res.tempFilePaths[0];
				}
			});
		},
		
		switchChange(e){
			console.log('switch.value == ' ,e.target.value);
			
			if(e.target.value == true){
				this.alliance.need_check = 1;
			} else {
				this.alliance.need_check = 2;
			}
			
			console.log('this.alliance.need_check == ' ,this.alliance.need_check);
			
		},

		//
		handleAllianceTypeCellTap() {
			this.typePopupVisible = true;
			this.hasPopupOpen = this.typePopupVisible;
		},
		// 选择联盟类型点击选择项
		handleAllianceTypeItemTap(item) {
			if (this.selectedTypeCount >= 5 && !item.selected) {
				return;
			}
			item.selected = !item.selected;
		},
		// 确认选择联盟类型
		handleAllianceTypeSubmit() {
			const selectedTypeNames = [];
			const categary_id_arr = [];
			this.allianceTypes.forEach(type => {
				if (type.selected) {
					selectedTypeNames.push(type.name);
					categary_id_arr.push(type.id);
				}
			});

			const categary_id_str = categary_id_arr.join(',');
			console.log(categary_id_str);
			this.alliance.types = selectedTypeNames.join(' ');
			this.alliance.categary_id = categary_id_str
			this.typePopupVisible = false;
		},
		// 打开选择地区
		handleAllianceRegionTap() {
			this.$refs.mpvueCityPicker.show();
			this.hasPopupOpen = true;
		},
		handleCityPickerCancel() {
			this.hasPopupOpen = false;
		},
		handleTypePopupClose() {
			this.typePopupVisible = false;
			this.hasPopupOpen = false;
		},
		// 确认选择地区
		handleCityPickerConfirm(val) {
			console.log(val);
			
			this.alliance.region = val.label;
			this.alliance.city = val.areas[1].text;
			console.log('this.alliance.city == ' ,this.alliance.city);
		},
		// 创建联盟
		createAlliance() {
			if(this.alliance.title.length <=0 || this.alliance.region.length <=0 || this.alliance.categary_id.length <= 0 || this.alliance.desc.length <= 0){
				uni.showToast({
					title: '请将资料填写完整再创建',
					icon:'none'
				});
				return;
			}

			const self = this;
			console.log('创建联盟-----info ==', this.alliance.title, this.alliance.region,this.alliance.categary_id,this.alliance.desc,this.alliance.need_check);
			this.isCreate = 1;
			
			const uploadTask = uni.uploadFile({
				url: 'https://linco.uzipm.com/user/group/create',
				filePath: this.alliance.image,
				name: 'icon',
				formData: {
					uid: this.uid,
					title: this.alliance.title,
					area: this.alliance.region,
					category_id: this.alliance.categary_id,
					need_check: this.alliance.need_check,
					description: this.alliance.desc,
					city:this.alliance.city
				},
				success: function(uploadFileRes) {
					
					uni.showToast({
						title: '创建成功',
						duration: 2000
					});
					
					console.log('上传结束', uploadFileRes.data);
					let obj = JSON.parse(uploadFileRes.data);
					if(obj.code == 1){
						self.isCreate = 2;
						let id = obj.data.id
						uni.navigateTo({
							url: '/pages/invited-alliance-members/invited-alliance-members?id='+ id + '&allianceText=' + self.alliance.title
						});
					} else {
						self.isCreate = 0;
						uni.showToast({
							title: '创建失败' + uploadFileRes.data.msg,
							icon:'none'
						});
					}
					
				},
				fail: function(err) {
					console.log('创建失败。。。', err);
				}
			});
		}
	},
	onLoad() {
		//获取联盟类别列表
		this.getAllianceCate();
		this.getOutletAddress();
	}
};
</script>

<style lang="scss">
@import '@/common/scss/mixin.scss';
.page-container {
	padding-bottom: 98rpx;
}
// cell
.c-cell {
	position: relative;
	background: #fff;
	height: 110rpx;
	display: flex;
	align-items: center;
	padding: 0 24rpx;
	@include thin-line-bottom(#eee, 24rpx, 24rpx);
}
.c-cell--clickable:active {
	background: #f2f2f2;
}
.c-cell__label {
	color: #666666;
	font-size: 34rpx;
	line-height: 46rpx;
	padding-right: 24rpx;
}
.c-cell__value {
	flex: 1;
	line-height: 46rpx;
	text-align: right;
	color: #262626;
	font-size: 34rpx;
	@include ellipsis(1);
}
.c-cell__input {
	flex: 1;
	height: 60rpx;
	min-height: 60rpx;
	line-height: 60rpx;
	text-align: right;
	color: #262626;
	font-size: 34rpx;
}
.c-cell__placeholder {
	font-size: 34rpx;
	color: rgba(0, 0, 0, 0.3);
}
.c-cell__switch {
	flex: 1;
	text-align: right;
}
.c-cell__arrow {
	width: 36rpx;
	height: 36rpx;
	margin-left: 12rpx;
}

// 头像cell
.c-alliance-image-cell {
	height: 160rpx;
}
.c-alliance-image {
	width: 124rpx;
	height: 124rpx;
	border-radius: 50%;
	margin-right: 12rpx;
	text-align: right;
}

// textarea cell
.c-textarea-cell {
	height: 334rpx;
	padding: 0 24rpx;
	background: #fff;
	padding-bottom: 24rpx;
}
.c-textarea-cell__title {
	height: 94rpx;
	line-height: 94rpx;
	color: #666;
	font-size: 34rpx;
}

.c-textarea-cell__value {
	height: 176rpx;
	width: 100%;
	font-size: 32rpx;
	color: #262626;
	line-height: 46rpx;
}
.c-textarea-cell__placeholder {
	font-size: 32rpx;
	color: rgba(158, 164, 171, 1);
}
.c-textarea-cell__words,
.c-textarea-cell__writewords {
	height: 40rpx;
	text-align: right;
	font-size: 28rpx;
	color: rgba(0, 0, 0, 0.25);
}
.c-textarea-cell__writewords {
	display: inline-block;
}
.c-textarea-cell__writewords--write {
	color: #666;
}

// footer
.c-footer {
	position: fixed;
	z-index: 100;
	left: 0;
	bottom: 0;
	right: 0;
}
.c-footer__btn {
	width: 100%;
	height: 98rpx;
	line-height: 98rpx;
	font-size: 34rpx;
	color: #ffffff;
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
