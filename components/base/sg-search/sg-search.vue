<template>
	<view class="sg-search" :class="[customClass]" :style="customStyle">
		<view class="sg-search__content">
      <image class="c-search__icon sg-search__left-icon" src="/static/common/search.png" mode="aspectFill"></image>
      <input class="sg-search__input" placeholder-class="sg-search__placeholder"
        type="text" 
        :value="inputValue" 
				:focus="setFocus"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :confirm-type="confirmType"
        :confirm-hold="confirmHold"
        @focus="bindFocus" 
        @input="bindInput" 
        @blur="bindBlur" 
        @confirm="bindConfirm"
      />
      <image :style="{display: clearVisible ? 'block' : 'none'}" class="sg-search__clearable" 
        @tap.stop="bindClearableTap" src="/static/common/ic_search_close@2x.png"></image>
    </view>
    <view class="sg-search__cancel" v-if="showCancelButton" @tap="bindCancelButtonTap" @tap.stop.prevent="">取消</view>
	</view>
</template>

<script>
  /**
   * 事件：
   * clear, cancel, search, change ,focus
   */
	export default {
    name: 'sg-search',
    props: {
			// setFocus:{
			// 	type: Boolean,
			// 	default:false
			// },
      value: { // 当前值
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: '输入关键词'
      },
      maxlength: { // 输入最大长度
        type: Number,
        default: -1
      },
      confirmType: {
        type: String,
        default: 'search'
      },
      confirmHold: Boolean,
      showCancelButton: Boolean, // 是否显示取消按钮
      customClass: String, // 自定义class
      customStyle: String ,// 自定义style
			setFocus:Boolean
    },
		data() {
			return {
				clearVisible: false,
        inputValue: '',
			};
		},
    methods: {
      bindFocus(event) { // 获得焦点
        this.setClearVisible(); // 设置清除文字按钮
        this.$emit('focus', event);
				console.log('sg-search focus event == ',event);
      },
      bindInput(event) {
        this.inputValue = (event.detail || {}).value;
        this.inputValue = this.inputValue === void 0 ? '' : this.inputValue;
        this.setClearVisible();
        this.emitChange();
      },
      bindBlur(event) {
        setTimeout(() => {
          this.clearVisible = false;
        });
        this.$emit('blur', event);
      },
      bindConfirm(event) {
        this.$emit('search', this.inputValue);
      },
      setClearVisible() {
        if (this.inputValue !== null && this.inputValue.length > 0) {
          if (!this.clearVisible) {
            this.clearVisible = true;
          }
        } else {
          if (this.clearVisible) {
            this.clearVisible = false;
          }
        }
      },
			bindOnlyTap(){
				
			},
      bindClearableTap() { // 当清空按钮点击
        this.inputValue = '';
        this.clearVisible = false;
        this.emitChange();
        this.$emit('clear', '');
        uni.$emit('clear');
				uni.$emit('clearInputValue')
      },
      bindCancelButtonTap() { // 当取消按钮点击
        this.inputValue = '';
        this.clearVisible = false;
        this.emitChange();
        this.$emit('cancel', '');
      },
      emitChange() {
        this.$emit('input', this.inputValue);
        this.$emit('change', this.inputValue);
      }
    },
    watch: {
      value() {
        this.inputValue = this.value;
      }
    },
    created() {
      this.inputValue = this.value;
    }
	}
</script>

<style lang="scss">
  .sg-search {
    width: 100%;
    height: 72rpx;
    padding: 0 32rpx;
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 36rpx;
  }
  .sg-search__content {
    position: relative;
    flex: 1;
    height: 72rpx;
    border-radius: 38rpx;
    display: flex;
    align-items: center;
  }
  .sg-search__input {
    display: block;
    flex: 1;
    resize: none;
    margin: 0;
    padding: 0;
    height: 72rpx;
    min-height: 72rpx;
    line-height: 72rpx;
    font-size: 32rpx;
    color: #000;
  }
  .sg-search__placeholder {
    font-size: 32rpx;
    opacity: 0.55;
  }
  .c-search__icon {
    width: 32rpx;
    height: 32rpx;
  }
  .sg-search__left-icon {
    font-size: 32rpx;
    margin-right: 16rpx;
  }

  .sg-search__clearable {
    position: relative;
    z-index: 1;
    width: 80rpx;
    height: 72rpx;
    padding: 20rpx 24rpx;
    margin-right: -32rpx;
  }

  .sg-search__cancel {
    font-size: 32rpx;
    color: #999;
    margin-left: 24rpx; 
  }
  .sg-search__cancel:active {
    opacity: .6;
  }
</style>
