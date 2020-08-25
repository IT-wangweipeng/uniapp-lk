<template>
  <view class="sg-popup" :class="[customClass]"
    :style="{display: display? 'block': 'none', zIndex: zIndex}">
    <view class="sg-overlay" v-if="showOverlay"
      :class="{'sg-overlay--visible': popupVisible}" 
      :style="{'z-index': zIndex + 1}" @tap.stop=""
      @tap="bindTapOverlay" @touchmove.stop="">
    </view>
    <view class="sg-popup__content" :class="['sg-popup--' + position, {
      'sg-popup--center--enter': position === 'center' && popupVisible,
      'sg-popup--bottom--enter': position === 'bottom' && popupVisible,
      'sg-popup--right--enter': position === 'right' && popupVisible,
      'sg-popup--top--enter': position === 'top' && popupVisible,
      'sg-popup--left--enter': position === 'left' && popupVisible
      }]" @tap.stop.prevent="" @touchmove.stop=""
      :style="{'z-index': zIndex + 2}" @transitionend="bindTransitionEnd()">
      
      <view class="sg-popup__body">
        <slot></slot>
      </view>
    </view>
  </view>
</template>
<script>
/*
* 提示： 
* 如果popup中的重置、确认按钮以及打开popup自动将slot中的子组件恢复到初始化状态，
* 需要把associateChild设置为true需在子组件中实现reset, getValue， 以及init方法，
* popup“重置”按钮会调用子组件 reset 方法，“确认”按钮会调用子组件 getValue 方法获取当前值，popup在打
* 开时会自动调用子组件 init 方法。当然，你也可以根据confirm,reset, show/close事件自行
* 在调用popup的地方使用
* 注意：
* 自动关联只会关联slot中的第一个子组件
* 
* 事件：
* show : popup显示，
* close: popup关闭
* click-overlay： 点击蒙版
* 
* slot
* 默认为内容
* */
export default {
  name: 'sg-popup',
	props:{
		position:{ // 弹出位置
			type: String,
			default: 'center' // right , bottom, top, left, center
		},
    zIndex: { // 弹框zindex
      type: Number,
      default: 1000
    },
    showOverlay: { // 是否显示遮罩
      type: Boolean,
      default: true
    },
    customClass: String, // 自定义class
    value: Boolean, // 是否显示,用于配合v-model
    closeOnClickOverlay: { // 点击蒙层是否关闭popup
      type: Boolean,
      default: true
    },
	},
	data() {
		return {
			popupVisible: false, // popup状态
      display: false, // 是否显示组件，主要用来close以后隐藏popup
      // showPopupTimeoutId: null
		};
	},
	methods: {
    valueChange(val) {
      if (val === this.popupVisible) {
        return;
      }
      if (val) {
        this.show();
      } else {
        this.close();
      }
    },
		show(){ // 显示
      if (this.popupVisible) {
        return;
      }
      this.display = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.popupVisible = true;
          this.emitInputEvent();
          this.$emit('show');
        }, 30);
      });
      
		},
		close(){ // 关闭
      this.popupVisible = false;
      this.emitInputEvent();
      this.$emit('close');
		},
    bindTapOverlay() {
      this.$emit('click-overlay');
      if (this.closeOnClickOverlay) {
        // this.close();
      }
    },
    bindTransitionEnd() { // 动画结束将组件diplay置位none
      if (!this.popupVisible) {
        this.display = false;
      }
    },
    emitInputEvent() { // 更新v-model的值
      this.$emit('input', this.popupVisible);
    }
	},
  watch: {
    value(val) {
      this.valueChange(val);
    }
  },
  created() {
    this.valueChange(this.value);
  }
}
</script>

<style lang="scss">
  @import '@/common/scss/mixin.scss';
  .sg-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.3);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s;
  }
  
  .sg-overlay--visible {
    opacity: 1;
    visibility: visible;
  }
  
  .sg-popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .sg-popup__content {
    will-change: transform;
    position: absolute;
    background: #fff;
    width: 100%;
    transition: all 0.3s ease;
    overflow: hidden;
    max-height: 100vh;
  }
  .sg-popup__body {
    position: relative;
    font-size: 34rpx;
    color: #666;
    max-height: 100vh;
    overflow-y: scroll;
  }
  
  .sg-popup--center {
    opacity: 0;
    top: 50%;
    left: 50%;
    width: 540upx;
    border-radius: 8upx;
    transform: translate3d(-50%, -50%, 0);
  }
  .sg-popup--center .sg-popup__body {
    max-height: 80vh;
  }
  .sg-popup--bottom {
    left: 0;
    right: 0;
    top: auto;
    bottom: 0;
    width: 100%;
    border-top-left-radius: 20upx;
    border-top-right-radius: 20upx;
    transform: translate3d(0, 100%, 0);
  }
  
  .sg-popup--bottom--enter {
    will-change: transform;
    transform: translate3d(0, 0, 0);
  }
  
  .sg-popup--top {
    left: 0;
    right: 0;
    top: 0;
    width: 100%;
    transform: translate3d(0, -100%, 0);
  }
  
  .sg-popup--top--enter {
    will-change: transform;
    transform: translate3d(0, 0, 0);
  }
  
  .sg-popup--right {
    right: 0;
    top: 0;
    bottom: 0;
    width: 510upx;
    height: 100vh;
    transform: translate3d(100%, 0, 0);
  }
  
  .sg-popup--right--enter {
    will-change: transform;
    transform: translate3d(0, 0, 0);
  }
  
  .sg-popup--left {
    left: 0;
    top: 0;
    bottom: 0;
    width: 510upx;
    height: 100vh;
    transform: translate3d(-100%, 0, 0);
  }
  
  .sg-popup--left--enter {
    will-change: transform;
    transform: translate3d(0, 0, 0);
  }
  
  .sg-popup--center--enter {
    opacity: 1;
    will-change: opacity;
  }

</style>
