<script>
	export default {
		globalData:{
			uid:'',
			userInfo:{},
			findSearch:false
		},
		onLaunch: function() {
			console.log('App Launch')
			// let globalData = this.$options.globalData;
			
			const self = this
			// console.log('App Launch -- globalData',globalData)
			
			uni.getStorage({
			    key: 'global_user_data',
			    success: function (res) {
					self.$options.globalData.uid = res.data.uid;
			    },
				fail:function (err) {
					console.log(err)
					self.$options.globalData.uid = '';
					self.$options.globalData.userInfo = {};
				}
			});
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
	
</script>

<style lang="scss">
  view, input, image, button, scroll-view, textarea {
    box-sizing: border-box;
  }
  .page-container {
    background: $uni-bg-color;
    min-height: 100vh;
  }
  
</style>
