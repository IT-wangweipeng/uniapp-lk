<template>
  <sg-popup v-model="visible" z-index="3000" position="center" @close="_handleClose()">
    <view class="sg-dialog">
      <view class="sg-dialog__inner">
        <view class="sg-dialog__title" v-if="options.title">{{options.title}}</view>
        <view class="sg-dialog__content" v-if="options.content">{{options.content}}</view>
        <slot></slot>
      </view>
      <view class="sg-dialog__btns">
        <view class="sg-dialog__btn" :style="{'color': options.cancelColor}" v-if="options.showCancel" @tap="_handleCancel()">{{options.cancelText}}</view>
        <view class="sg-dialog__btn" :style="{'color': options.confirmColor}" @tap="_handleConfirm()">{{options.confirmText}}</view>
      </view>
    </view>
  </sg-popup>
</template>

<script>
  /**
   * 用法 this.$refs.show(options);
   * options: {
          title: '提示',
          content: '',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#666666',
          confirmText: '确定',
          confirmColor: '#FA6400'
        }
   * 
   */
  export default {
    data() {
    	return {
    		visible: false,
        options: {
          title: '提示',
          content: '',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#666666',
          confirmText: '确定',
          confirmColor: '#FA6400'
        }
    	};
    },
    methods: {
      // 打开
      show(options) {
        let opt = options || {};
        this.options = Object.assign(this.options, opt);
        this.visible = true;
      },
      // 关闭
      close() {
        this.visible = false;
      },
      _handleClose() {
        this.$emit('close');
      },
      _handleCancel() {
        this.visible = false;
        this.$emit('cancel');
      },
      _handleConfirm() {
        this.visible = false;
        this.$emit('confirm');
      }
    }
  }
</script>

<style lang="scss">
  @import '@/common/scss/mixin.scss';
  .sg-dialog {
    background: #fff;
  }
  .sg-dialog__inner {
    padding: 40rpx 32rpx;
    display: flex;
    justify-content: center;
    flex-direction: column;
    min-height: 204rpx;
  }
  .sg-dialog__title {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1E2229;
    font-size: 36rpx;
    line-height: 48rpx;
    padding: 0 32rpx;
    text-align: center;
  }
  .sg-dialog__content {
    padding: 32rpx 32rpx 0;
    font-size: 30rpx;
    font-weight:400;
    color: rgba(158,164,171,1);
    line-height: 45rpx;
    text-align: center;
  }
  .sg-dialog__btns {
    display: flex;
    @include thin-line-top(#DDDDDD, 0, 0);
  }
  .sg-dialog__btn {
    flex: 1;
    height: 100rpx;
    color: #666666;
    font-size: 36rpx;
    line-height: 100rpx;
    text-align: center;
    @include thin-line-right(#DDDDDD, 0, 0);
  }
  .sg-dialog__btn:active {
    opacity: 0.6;
  }
</style>
