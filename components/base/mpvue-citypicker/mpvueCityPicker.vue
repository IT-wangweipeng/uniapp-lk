<template>
  <view class="mpvue-picker">
    <view :class="{ pickerMask: showPicker }" @click="maskClick" catchtouchmove="true"></view>
    <view class="mpvue-picker-content " :class="{ 'mpvue-picker-view-show': showPicker }">
      <view class="mpvue-picker__hd" catchtouchmove="true">
        <view class="mpvue-picker__action" @click="pickerCancel">取消</view>
        <view class="mpvue-picker__title" v-if="title">{{title}}</view>
        <view class="mpvue-picker__action" :style="{ color: themeColor }" @click="pickerConfirm">
          确定
        </view>
      </view>
      <picker-view
        indicator-style="height: 40px;"
        class="mpvue-picker-view"
        :value="pickerValue"
        @change="pickerChange"
      >
        <block>
          <picker-view-column>
            <view class="picker-item" v-for="(item, index) in provinceDataList" :key="index">
              {{ item.text }}
            </view>
          </picker-view-column>
          <picker-view-column>
            <view class="picker-item" v-for="(item, index) in cityDataList" :key="index">
              {{ item.text }}
            </view>
          </picker-view-column>
          <picker-view-column>
            <view class="picker-item" v-for="(item, index) in areaDataList" :key="index">
              {{ item.text }}
            </view>
          </picker-view-column>
        </block>
      </picker-view>
    </view>
  </view>
</template>

<script>
import provinceData from './city-data/province.js';
import cityData from './city-data/city.js';
import areaData from './city-data/area.js';
export default {
  data() {
    return {
      pickerValue: [0, 0, 0],
      provinceDataList: [],
      cityDataList: [],
      areaDataList: [],
			/* 是否显示控件 */
			showPicker: false,
    };
  },
  created() {
    this.init()
  },
  props: {
    /* 默认值 */
    pickerValueDefault: {
      type: Array,
      default(){
				return [0, 0, 0]
			}
    },
    /* 主题色 */
    themeColor: String,
    /* 标题 */
    title: String
  },
	watch:{
		pickerValueDefault(){
			this.init();
		}
	},
  methods: {
		init() {
			this.handPickValueDefault(); // 对 pickerValueDefault 做兼容处理
			this.provinceDataList = provinceData;
			this.cityDataList = cityData[this.pickerValueDefault[0]];
			this.areaDataList = areaData[this.pickerValueDefault[0]][this.pickerValueDefault[1]];
			this.pickerValue = this.pickerValueDefault;
		},
    show() {
      setTimeout(() => {
        this.showPicker = true;
      }, 0);
    },
    maskClick() {
      this.pickerCancel();
    },
    pickerCancel() {
      this.showPicker = false;
      this._$emit('onCancel');
    },
    pickerConfirm(e) {
      this.showPicker = false;
      this._$emit('onConfirm');
    },
    showPickerView() {
      this.showPicker = true;
    },
    handPickValueDefault() {
      if (this.pickerValueDefault !== [0, 0, 0]) {
        if (this.pickerValueDefault[0] > provinceData.length - 1) {
          this.pickerValueDefault[0] = provinceData.length - 1;
        }
        if (this.pickerValueDefault[1] > cityData[this.pickerValueDefault[0]].length - 1) {
          this.pickerValueDefault[1] = cityData[this.pickerValueDefault[0]].length - 1;
        }
        if (this.pickerValueDefault[2] > areaData[this.pickerValueDefault[0]][this.pickerValueDefault[1]].length - 1) {
          this.pickerValueDefault[2] = areaData[this.pickerValueDefault[0]][this.pickerValueDefault[1]].length - 1;
        }
      }
    },
    pickerChange(e) {
      let changePickerValue = e.mp.detail.value;
      if (this.pickerValue[0] !== changePickerValue[0]) {
        // 第一级发生滚动
        this.cityDataList = cityData[changePickerValue[0]];
        this.areaDataList = areaData[changePickerValue[0]][0];
        changePickerValue[1] = 0;
        changePickerValue[2] = 0;
      } else if (this.pickerValue[1] !== changePickerValue[1]) {
        // 第二级滚动
        this.areaDataList =
          areaData[changePickerValue[0]][changePickerValue[1]];
        changePickerValue[2] = 0;
      }
      this.pickerValue = changePickerValue;
      this._$emit('onChange');
    },
    _$emit(emitName) {
      let pickObj = {
        label: this._getLabel(),
        value: this.pickerValue,
        areas: this._getAreas()
      };
      this.$emit(emitName, pickObj);
    },
    _getLabel() {
      let pcikerLabel =
        this.provinceDataList[this.pickerValue[0]].text +
        ' ' +
        this.cityDataList[this.pickerValue[1]].text +
        ' ' +
        this.areaDataList[this.pickerValue[2]].text;
      return pcikerLabel;
    },
    _getAreas() {
      const areas = [];
      areas.push({
        text: this.provinceDataList[this.pickerValue[0]].text,
        value: this.provinceDataList[this.pickerValue[0]].value
        });
      areas.push({
        text: this.cityDataList[this.pickerValue[1]].text,
        value: this.cityDataList[this.pickerValue[1]].value
        });
      areas.push({
        text: this.areaDataList[this.pickerValue[2]].text,
        value: this.areaDataList[this.pickerValue[2]].value
        });
      return areas;
    }
  }
};
</script>

<style>
.pickerMask {
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}
.mpvue-picker-content {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  transition: all 0.3s ease;
  transform: translateY(100%);
  z-index: 3000;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
}
.mpvue-picker-view-show {
  transform: translateY(0);
}
.mpvue-picker__hd {
  display: flex;
  padding: 9px 15px;
  background-color: #fff;
  position: relative;
  text-align: center;
  font-size: 17px;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  height: 110rpx;
  align-items: center;
}
.mpvue-picker__hd:after {
  content: ' ';
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #e5e5e5;
  color: #e5e5e5;
  transform-origin: 0 100%;
  transform: scaleY(0.5);
}
.mpvue-picker__title {
  color: #666666;
  font-size: 34rpx;
  font-weight: bold;
}
.mpvue-picker__action {
  display: block;
  flex: 1;
  color: #1aad19;
}
.mpvue-picker__action:first-child {
  text-align: left;
  color: #888;
}
.mpvue-picker__action:last-child {
  text-align: right;
}
.picker-item {
  text-align: center;
  line-height: 40px;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
}
.mpvue-picker-view {
  position: relative;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 238px;
  background-color: rgba(255, 255, 255, 1);
}
</style>
