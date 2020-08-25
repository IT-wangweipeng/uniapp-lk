const isProduction = true
const HOST_DEV = 'https://linco.uzipm.com'
const HOST_PRODUCTION = 'https://linco.uzipm.com'

export const whichApi = () => {
	return isProduction ? HOST_PRODUCTION : HOST_DEV
}


const getApi = (path, params) => {
	console.log('--------------- GET ----------------')
	console.log('path ===== ', path)
	console.log('params ===== ', params)
	let obj = {
		url: path,
		method: 'GET',
		data: params,
		header: {
			'Content-Type': 'application/json;charset=UTF-8',
		}
	};

	return uni.request(obj).then(data => {
		console.log('datat ====== ', typeof(data), data)
		const [err, res] = data
		if (err) {
			return Promise.reject(err)
		}
		if (res.data.code === 0) {
			return Promise.resolve(res.data)
		}
		if (res.data && res.data.code !== 1) {
			return Promise.reject(res.data.msg)
		}
		return Promise.resolve(res.data)
	})
}

const postApi = (path, params) => {
	console.log('--------------- POST ----------------')
	console.log('path ===== ', path)
	console.log('params ===== ', params)
	let obj = {
		url: path,
		method: 'POST',
		data: params,
		header: {
			'Content-Type': 'application/json;charset=UTF-8',
		}
	};

	return uni.request(obj).then(data => {
		console.log('data ====== ', typeof(data), data)
		const [err, res] = data
		if (err) {
			return Promise.reject(err)
		}
		if (res.data.code === 0) {
			return Promise.resolve(res.data)
		}
		if (res.data && res.data.code !== 1) {
			return Promise.reject(res.data.msg)
		}
		return Promise.resolve(res.data)
	})
}

/// ========== 地址管理 ==========
// 收货地址列表
export const UserAddressListApi = (uid) => {
	return getApi(`${whichApi()}/user/userAddress/index`, {
		uid,
	})
}

// 编辑地址
// id: 地址的id, 可选,传表示编辑保存,不传表示添加
export const UserAddressDetailApi = (uid, id) => {
	return getApi(`${whichApi()}/user/userAddress/show`, {
		uid,
		id,
	})
}

// 保存地址
/*
realname: 姓名
mobile: 手机
province: 省
city: 市
area: 区
address: 地址
id: 可选,传表示编辑保存,不传表示添加
isdefault: 默认地址
*/
export const SaveAddressApi = (uid, realname, mobile, province, city, area, address, id, isdefault) => {
	return postApi(`${whichApi()}/user/userAddress/save`, {
		uid,
		realname,
		mobile,
		province,
		city,
		area,
		address,
		id,
		isdefault
	})
}

// 删除地址
export const DelateAddressApi = (uid, id) => {
	return getApi(`${whichApi()}/user/userAddress/delete`, {
		uid,
		id,
	})
}




/// ========== 清货 ==========
// 联盟清货列表
export const GroupProductSellListApi = (uid, title, page) => {
	return getApi(`${whichApi()}/user/UserGroupProductSell/index`, {
		uid,
		title,
		page,
	})
}

// 联盟再次清货商品
export const GroupProductSellApi = (uid, id) => {
	return postApi(`${whichApi()}/user/UserGroupProductSell/shelve`, {
		uid,
		id,
	})
}

// 联盟删除清货商品
export const GroupProductSellDeleteApi = (uid, id) => {
	return postApi(`${whichApi()}/user/UserGroupProductSell/delete`, {
		uid,
		id,
	})
}

// 联盟下线清货商品
export const GroupProductSellUnshelveApi = (uid, id) => {
	return postApi(`${whichApi()}/user/UserGroupProductSell/unshelve`, {
		uid,
		id,
	})
}

/// 清货宝
// 我的清货列表
export const ProductSellApi = (uid, title, page) => {
	return getApi(`${whichApi()}/user/ProductSell/index`, {
		uid,
		title,
		page,
	})
}
//寻货宝发布供货 & 批量发布清货
export const ProductSellBatSaveApi = (uid, list) => {
	return postApi(`${whichApi()}/user/ProductSell/batSave`, {
		uid,
		list,
	})
}

// 清货商品详情
// id: 商品id
export const ProductDetailApi = (uid, id) => {
	return getApi(`${whichApi()}/productSell/show`, {
		uid,
		id,
	})
}

// 清货大厅列表
/*
group_id: 联盟id
page: 页码
area: 区域
main_sector: 类别id
price: 商品价格区间,如:100-200
*/
export const ProductSellListApi = (uid, area, main_sector, price, page, title) => {
	return getApi(`${whichApi()}/ProductSell/index`, {
		uid,
		area,
		main_sector,
		price,
		page,
		title,
	})
}

// 删除清货商品
export const ProductSellDeleteApi = (uid, id) => {
	return postApi(`${whichApi()}/user/ProductSell/delete`, {
		uid,
		id,
	})
}

// 再次清货商品
export const ProductSellShelveApi = (uid, id) => {
	return postApi(`${whichApi()}/user/ProductSell/shelve`, {
		uid,
		id,
	})
}

// 下线清货商品
export const ProductSellUnshelveApi = (uid, id) => {
	return postApi(`${whichApi()}/user/ProductSell/unshelve`, {
		uid,
		id,
	})
}

// 发布清货
/*
min_price: 最低价
max_price: 最高价
product_stock_id: 库存id
*/
export const ProductSellSaveApi = (uid, min_price, max_price, product_stock_id) => {
	return postApi(`${whichApi()}/user/productSell/save`, {
		uid,
		min_price,
		max_price,
		product_stock_id,
	})
}






/// ========== 寻货 ==========
// 发布寻货库存列表
export const FindGoodsStoreListApi = (uid, title, page) => {
	return getApi(`${whichApi()}/user/ProductStock/index`, {
		uid,
		title,
		page,
	})
}

// 批量发布寻货
export const ProductBuyBatSaveApi = (uid, list) => {
	return postApi(`${whichApi()}/user/ProductBuy/batSave`, {
		uid,
		list,
	})
}

// 联盟编辑寻货商品
export const GroupEditProductApi = (uid, id, min_price, max_price) => {
	return postApi(`${whichApi()}/user/GroupProductSell/save`, {
		uid,
		id,
		min_price,
		max_price,
	})
}

// 联盟寻货列表
export const GroupProductBuyListApi = (uid, title, page) => {
	return getApi(`${whichApi()}/user/UserGroupProductBuy/index`, {
		uid,
		title,
		page,
	})
}

// 联盟下线寻货商品
export const GroupProductBuyUnshelveApi = (uid, id) => {
	return getApi(`${whichApi()}/user/UserGroupProductBuy/unshelve`, {
		uid,
		id,
	})
}

// 联盟删除寻货商品
export const GroupProductBuyDeleteApi = (uid, id) => {
	return getApi(`${whichApi()}/user/UserGroupProductBuy/delete`, {
		uid,
		id,
	})
}

// 联盟再次寻货商品
export const GroupProductBuyShelveApi = (uid, id) => {
	return getApi(`${whichApi()}/user/UserGroupProductBuy/shelve`, {
		uid,
		id,
	})
}

/// 寻货宝
// 寻货商品详情
export const ProductBuyDetailApi = (uid, id) => {
	return getApi(`${whichApi()}/productBuy/show`, {
		uid,
		id,
	})
}

// 我的寻货列表
export const MineProductBuyApi = (uid, title, page) => {
	return getApi(`${whichApi()}/user/ProductBuy/index`, {
		uid,
		title,
		page,
	})
}

// 寻货大厅列表
/*
page: 页码
area: 区域
main_sector: 类别id
price: 商品价格区间,如:100-200
*/
export const FindProductListApi = (uid, area, main_sector, price, page, title) => {
	return getApi(`${whichApi()}/ProductBuy/index`, {
		uid,
		area,
		main_sector,
		price,
		page,
		title,
	})
}

// 再次寻货
// id: 商品id
export const ProductBuyShelveApi = (uid, id) => {
	return postApi(`${whichApi()}/user/ProductBuy/shelve`, {
		uid,
		id,
	})
}

// 删除寻货商品
export const ProductBuyDeleteApi = (uid, id) => {
	return postApi(`${whichApi()}/user/ProductBuy/delete`, {
		uid,
		id,
	})
}

// 下线寻货商品
export const ProductBuyUnshelveApi = (uid, id) => {
	return postApi(`${whichApi()}/user/ProductBuy/unshelve`, {
		uid,
		id,
	})
}

// 发布寻货
/*
id: number 可选,有值时表示编辑
store_id: number 店铺id
model: string 型号
stalls: string 档口
img: string 图片
style: string 款式
category: string 类别
min_price: string 示例：0
max_price: string 最高价
p_color: string 颜色
p_size: string 尺寸
num: number 求购数量
*/
export const ProductBuySaveApi = ( data) => {
	return postApi(`${whichApi()}/user/ProductBuy/save`, {
		...data,
	})
}

/// ===========================


/// ========== 商品 ============
// 商品类型
export const ProductStyleApi = (uid) => {
	return getApi(`${whichApi()}/user/product/style`, {
		uid,
	})
}

// 商品类型增加
// type: category:分类； color：颜色； style：风格； size：尺寸
// name: 增加的名称
export const ProductInsertStyleApi = (uid, p_type, name) => {
	return postApi(`${whichApi()}/user/product/style/add`, {
		uid,
		type: p_type,
		name,
	})
}

// 商品类型删除
// type: category:分类； color：颜色； style：风格； size：尺寸
// id: 类型ID
export const ProductDeleteStyleApi = (uid, p_type, id) => {
	return getApi(`${whichApi()}/user/product/style/del`, {
		uid,
		type: p_type,
		id,
	})
}





// 7天滞销库存
export const SevenDayStockListApi = (uid, store_id, is_unsalable, title, page) => {
	return postApi(`${whichApi()}/user/ProductStock/index`, {
		uid,
		store_id,
		is_unsalable,
		title,
		page
	})
}

// 库存列表
// store_id: 当前店铺id
// title: 商品名(用于筛选)
// page: 页码
export const AllProductSockListApi = (uid, store_id, title, page) => {
	return getApi(`${whichApi()}/user/ProductStock/index`, {
		uid,
		store_id,
		title,
		page
	})
}


// 首页最新消息
export const UserNewMessageList = (uid) => {
	return getApi(`${whichApi()}/user/message/new`, {
		uid: uid,
	})
}


//创建联盟 界面里直接上传图片
export const CreatAllianceApi = (mobile, type) => {
	return postApi(`${whichApi()}/user/group/create`, {
		mobile: mobile,
		type: type
	})
}

//联盟类别列表
export const AllianceCateApi = (uid) => {
	return getApi(`${whichApi()}/user/group/category`, {
		uid: uid
	})
}
//联盟列表
export const AllianceListApi = (pData) => {
	return getApi(`${whichApi()}/user/group`, {
		uid: pData.uid,
		category_id: pData.category_id,
		area: pData.area,
		product_category_id: pData.product_category_id,
		title: pData.title,
		type: pData.type,
		limit: 10,
		page: pData.page,
	})
}
//联盟详情
export const AllianceDetailApi = (id, uid) => {
	return getApi(`${whichApi()}/user/group/detail/` + id, {
		uid: uid
	})
}

//推荐店铺
export const RecommendShopListApi = (id, uid,search_text) => {
	return getApi(`${whichApi()}/user/group/share/outlet/` + id, {
		uid: uid,
		search_text:search_text
	})
}

//邀请成员
export const InviteMemberApi = (group_id, outlet_id, uid) => {
	return postApi(`${whichApi()}/user/group/outlet/invite`, {
		uid: uid,
		group_id: group_id,
		outlet_id: outlet_id
	})
}


//最新分享商品
export const NewShareGoodsApi = (id, uid) => {
	return getApi(`${whichApi()}/user/group/product/` + id, {
		uid: uid
	})
}

//修改密码
export const ChangePasswordApi = (mobile, type) => {
	return postApi(`${whichApi()}/user/findPassword`, {
		mobile: mobile,
		type: type
	})
}
//绑定手机号
export const BindPhoneApi = (mobile, authcode) => {
	return postApi(`${whichApi()}/user/bindMobile`, {
		mobile: mobile,
		code: authcode
	})
}

// 所在地区
export const CityApi = (uid) => {
	return getApi(`${whichApi()}/user/group/city`, {
		uid,
	})
}

// 消息列表
// type: 1系统消息 2联盟类型
export const UserMessageList = (uid, type, time, page) => {
	return getApi(`${whichApi()}/user/message`, {
		uid,
		type,
		create_time: time,
		page,
		limit: 10,
	})
}

// 消息详情
// id: 消息id
export const MessageDetail = (uid, id) => {
	return getApi(`${whichApi()}/user/message/detail/${id}`, {
		uid,
	})
}

// 同意或者加入联盟
// id: 消息 id
// status: 1同意 2拒绝
export const AllowOrRejectJoinUnion = (uid, id, status) => {
	return getApi(`${whichApi()}/user/group/agree/outlet`, {
		uid,
		id,
		status,
	})
}

//立即加入  ApplyAllianceApi(this.uid, this.detail.business_id)
export const ApplyAllianceApi = (uid, id) => {
	return getApi(`${whichApi()}/user/group/join/outlet/` + id, {
		uid:uid
	})
}



//联盟成员删除
//group_id:联盟ID ids:成员ID 多个用逗号隔开  msg:移除原因
export const RemoveMeberApi = (group_id, uid, ids, msg) => {
	return getApi(`${whichApi()}/user/group/delete/outlet/` + group_id, {
		ids: ids,
		msg: msg,
		uid: uid
	})
}

//删除联盟
//id:联盟ID
export const DeleteAllianceApi = (id, uid) => {
	return getApi(`${whichApi()}/user/group/delete/group/` + id, {
		uid: uid
	})
}


//编辑联盟
export const ChangeAllianceNameApi = (pData) => {
	return postApi(`${whichApi()}/user/group/edit`, {
		id: pData.id,
		icon: pData.icon,
		title: pData.title,
		area: pData.area,
		category_id: pData.category_id,
		need_check: pData.need_check,
		description: pData.description,
		uid: pData.uid,
		city:pData.city
	})
}


//联盟成员列表
//id:联盟ID
export const AllianceMemberApi = (id, uid) => {
	return getApi(`${whichApi()}/user/group/outlet/${id}`, {
		uid: uid
	})
}


//申请加入联盟
//id:联盟ID
export const ApplyJoinAllianceApi = (id, uid) => {
	return getApi(`${whichApi()}/user/group/join/outlet/${id}`, {
		uid: uid
	})
}

//退出联盟
//id:联盟ID
export const QuitAllianceApi = (id, uid) => {
	return getApi(`${whichApi()}/user/group/exit/outlet/${id}`, {
		uid: uid
	})
}

//店铺名片(详情)
//id:店铺ID
export const ShopDetailsApi = (id, uid) => {
	return getApi(`${whichApi()}/user/group/show/outlet/` + id, {
		uid: uid
	})
}

//商品类别
export const ProductCategoryApi = (uid) => {
	return getApi(`${whichApi()}/user/group/product/category`, {
		uid: uid
	})
}



// 首页滚动banner
export const RollBannerApi = (uid) => {
	return getApi(`${whichApi()}/banner/index`, {
		uid: uid
	})
}

//商品详情--联盟
export const AllianceProductDetailApi = (id, uid) => {
	return getApi(`${whichApi()}/user/product/group/detail`, {
		id: id,
		uid: uid,
	})
}

//商品详情--寻货宝
export const FindGoodsProductDetailApi = (id, uid, type) => {
	return getApi(`${whichApi()}/user/product/hunt/detail`, {
		id: id,
		uid: uid,
		type: type
	})
}



/// ========== 下单/订单信息/订单详情/订单列表/支付 ============

//下单接口
///address_id 地址ID, type 商品类型,product_id 商品ID,price 价格, specs规格 , 是供货supply_type = 1
export const PlaceOrderApi = (address_id, type, product_id, price, specs, uid ,supply_type) => {
	return postApi(`${whichApi()}/user/order/confirm`, {
		address_id: address_id,
		type: type,
		product_id: product_id,
		price: price,
		specs: specs,
		uid: uid,
		supply_type: supply_type
	})
}

export const RechargePlaceOrderApi = (pay_price,uid) => {
	return getApi(`${whichApi()}/user/recharge/save`, {
		pay_price :pay_price,
		uid: uid
	})
}

//充值下单

//获取订单信息接口
export const GetOrderInfoApi = (order_no, pay_type, channel, uid) => {
	return getApi(`${whichApi()}/payment/pay`, {
		order_no: order_no,
		pay_type: pay_type,
		channel: channel,
		uid: uid
	})
}

//获取订单详情接口  id :订单id
export const GetOrderDetailInfoApi = (id, uid) => {
	return getApi(`${whichApi()}/user/order/detail/` + id, {
		uid: uid
	})
}

//获取订单列表接口
/*
type 订单类型 1:联盟,2:寻货宝
order_no 订单编号
page 第几页
status 状态 -1待支付 -2已取消 1已支付 待确认 2待发货 3待收货 4已完成 5退款中 6退款完成 7已关闭（不传为全部，多个状态用逗号隔开）
is_seller 1:发货订单  2:买货订单  0:全部订单
uid 
*/
export const GetOrderListApi = (type, order_no, page, status, is_seller, uid) => {
	return getApi(`${whichApi()}/user/order`, {
		order_no: order_no,
		type: type,
		page: page,
		status: status,
		is_seller: is_seller,
		uid: uid
	})
}

//取消订单 id:订单id
export const CancelOrderApi = (id, uid) => {
	return getApi(`${whichApi()}/user/order/cancel`, {
		id: id,
		uid: uid
	})
}
//申请退款 id:订单id
export const ApplyforFefundApi = (id, uid) => {
	return getApi(`${whichApi()}/user/order/return/submit/` + id, {
		uid: uid
	})
}
//取消退款 id:订单id
export const CancelforFefundApi = (id, uid) => {
	return getApi(`${whichApi()}/user/order/return/cancel/` + id, {
		uid: uid
	})
}

//物流公司
export const GetExpressListApi = (uid) => {
	return getApi(`${whichApi()}/user/order/express`, {
		uid: uid
	})
}

//确认发货 
///id:订单id , expresscom 快递公司,expresssn 快递单号 
export const DeliverGoodsApi = (id, expresscom, expresssn,uid) => {
	return postApi(`${whichApi()}/user/order/send`, {
		id:id,
		expresscom:expresscom,
		expresssn:expresssn,
		uid: uid
	})
}

//确认收货 id:订单id
export const ConfirmReceiptApi = (id, uid) => {
	return getApi(`${whichApi()}/user/order/complete/` + id, {
		uid: uid
	})
}

//拒绝退款
export const RefusalRefundApi = (id, uid) => {
	return getApi(`${whichApi()}/user/order/return/refuse/` + id, {
		uid: uid
	})
}

//同意退款 && 拒绝报价
export const AgreeRefundApi = (id,remark_msg,status,uid) => {
	return getApi(`${whichApi()}/user/order/return/agree/` + id, {
		remark_msg:remark_msg,
		status:status,
		uid: uid
	})
}

//确认订单
export const ConfirmOrdereRefundApi = (id, uid) => {
	return getApi(`${whichApi()}/user/order/agree/` + id, {
		uid: uid
	})
}


/// ============ 用户基础信息 ====================
//登录(验证码)
export const UserLoginApi = (mobile, code,wxmpcode) => {
	return postApi(`${whichApi()}/user/loginForCode`, {
		mobile: mobile,
		code: code,
		wxcode:wxmpcode
	})
}
//获取验证码
export const GetSmsCodeApi = (mobile, type) => {
	return postApi(`${whichApi()}/user/getCode`, {
		mobile: mobile,
		type: type
	})
}

//注册
export const UserRegisterApi = (userName, authcode, password, password2) => {
	return postApi(`${whichApi()}/user/register`, {
		mobile: userName,
		code: authcode,
		password: password,
		repassword: password2
	})
}

//登录(密码)
export const UserLoginByPasswordApi = (mobile, password) => {
	return postApi(`${whichApi()}/user/login`, {
		mobile: mobile,
		password: password
	})
}

//微信小程序code上传
export const UploadWXMPCodeApi = (code) => {
	return getApi(`${whichApi()}/user/Publicity/miniappLogin`, {
		code:code
	})
}

// 上传图片 
export const UploadImageApi = (uid, headimg) => {
	return postApi(`${whichApi()}/user/upload`, {
		uid,
		headimg
	})
}
//店铺列表
export const GetStoreListApi = (uid) => {
	return getApi(`${whichApi()}/user/outlet/index`, {
		uid: uid
	})
}

//切换店铺
export const ChangeStoreIdApi = (outlet_id, uid) => {
	return getApi(`${whichApi()}/user/switchOutlet`, {
		outlet_id: outlet_id,
		uid: uid
	})
}

//获取用户信息
export const GetUserInfoApi = (uid) => {
	return postApi(`${whichApi()}/user/show`, {
		uid: uid
	})
}

//获取用户默认地址
export const GetDefaultAddressApi = (uid) => {
	return getApi(`${whichApi()}/user/order/address`, {
		uid: uid
	})
}

// 设置默认地址
export const SetDefaultAddressApi = (uid, id) => {
	return postApi(`${whichApi()}/user/order/address/default?uid=${uid}&id=${id}`, {
		
	})
}


// 保存用户信息
export const SaveUserInfoApi = (uid, nickname) => {
	return getApi(`${whichApi()}/user/saveInfo`, {
		uid,
		nickname,
	})
}


/// ============ 联盟商品 ====================
//联盟商品列表->库存列表
///store_id 当前店铺id;title 商品名(用于筛选);page 页码 ;newest 新品共享,固定传 1 ; stock_num 补货共享,固定传 0;
export const GetAllianceTypeListApi = (store_id, title, page, newest, stock_num, uid) => {
	return getApi(`${whichApi()}/user/ProductStock/index`, {
		store_id: store_id,
		title: title,
		page: page,
		newest: newest,
		stock_num: stock_num,
		uid: uid
	})
}

///store_id 当前店铺id;title 商品名(用于筛选);page 页码 ;uid ;group_product_buy_id:联盟补货商品id(用于供货时库存列表显示) ; product_buy_id:寻货商品id(用于供货时库存列表显示)
export const GetSupplyListApi = (store_id, title, page, uid, group_product_buy_id, product_buy_id) => {
	return getApi(`${whichApi()}/user/ProductStock/index`, {
		uid: uid,
		store_id: store_id,
		title: title,
		page: page,
		product_buy_id: product_buy_id,
		group_product_buy_id: group_product_buy_id
	})
}


//联盟共享商品列表
export const GroupProductListApi = (group_id, page, type,store_id ,uid) => {
	return postApi(`${whichApi()}/user/GroupProductSell/index`, {
		group_id: group_id,
		page: page,
		type: type,
		store_id:store_id,
		uid: uid
	})
}

//联盟发布共享接口
///product_stock_id 库存id,  group_id 联盟id, max_price 最大价格  min_price 最小价格    type 类型|1:库存共享,2:补货共享,3:新品共享  id 
export const AllianceShareApi = (product_stock_id, group_id, max_price, min_price, type, id, uid) => {
	return postApi(`${whichApi()}/user/GroupProductSell/save`, {
		product_stock_id: product_stock_id,
		group_id: group_id,
		max_price: max_price,
		min_price: min_price,
		type: type,
		id: id,
		uid: uid
	})
}

// 联盟 批量发布共享 &供货
export const AllianceBatchShareApi = (uid, list) => {
	return postApi(`${whichApi()}/user/GroupProductSell/batchSave`, {
		uid,
		list,
	})
}



/// ========== 供货 ==========
// 联盟我的供货历史
export const GroupSellHistoryApi = (uid, is_supply, title, page) => {
	return getApi(`${whichApi()}/user/UserGroupProductSell/index`, {
		uid,
		is_supply,
		title,
		page
	})
}

// 联盟批量取消供货
// id: 逗号分隔
export const CancelGroupSellHistoryApi = (uid, id) => {
	return postApi(`${whichApi()}/user/UserGroupProductSell/batchCancelSupply`, {
		uid,
		id,
	})
}

// 联盟供应给我的商品列表
export const GroupSupplyToMeProductApi = (uid, id, title, page) => {
	return getApi(`${whichApi()}/user/UserGroupProductSell/supplyToMe`, {
		uid,
		id,
		title,
		page
	})
}

// 我的供货历史
export const SellHistoryApi = (uid, is_supply, title, page) => {
	return getApi(`${whichApi()}/user/ProductSell/index`, {
		uid,
		is_supply,
		title,
		page
	})
}

// 批量取消我的供货历史
export const CancelSellHistoryApi = (uid, id) => {
	return postApi(`${whichApi()}/user/ProductSell/batchCancelSupply`, {
		uid,
		id,
	})
}

// 供应给我的商品列表
export const SupplyToMeProductApi = (uid, id, title, page) => {
	return getApi(`${whichApi()}/user/ProductSell/supplyToMe`, {
		uid,
		id,
		title,
		page
	})
}



/// ============ 客服咨询 ===============
// 咨询问题列表
export const QuestionListApi = (uid) => {	return getApi(`${whichApi()}/user/outlet/question/`, {		uid,	})}

// 添加问题
export const AddQuestionApi = (uid, question, answer) => {	return postApi(`${whichApi()}/user/outlet/question/create`, {		uid,
		question,
		answer,	})}

// 问题修改
export const EditQuestionApi = (uid, question, answer, id) => {	return postApi(`${whichApi()}/user/outlet/question/edit`, {		uid,
		question,
		answer,
		id,	})}

// 咨询问题删除
export const DeleteQuestionApi = (uid, id) => {	return postApi(`${whichApi()}/user/outlet/question/delete/${id}`, {		uid,	})}


/// ============ 提现 =============
// 提现记录
export const WithdrawalListApi = (uid, status) => {	return getApi(`${whichApi()}/user/withdrawal/index`, {		uid,
		status,	})}

// 可提现信息
export const WithdrawalInfoApi = (uid, id) => {	return getApi(`${whichApi()}/user/withdrawal/availableWithdrawalInfo`, {		uid,	})}

// 提现申请,微信/支付宝/余额
export const WithdrawalApplyApi = (uid, realname, amount, alipay_account, wechat_account) => {	return postApi(`${whichApi()}/user/withdrawal/save`, {		uid,
		realname,
		amount,
		alipay_account,
		wechat_account	})}