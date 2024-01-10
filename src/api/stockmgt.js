import request from '@/utils/request2'


// 销售开单列表
export function salelist(data){
	return request({
		url:'/store/outWarehouseSales/list',
		method:'get',
		params:data
	})
}

// 添加销售开单
export function saleadd(data){
	return request({
		url:'/store/outWarehouseSales',
		method:'post',
		data:data
	})
}

// 销售开单详情
export function saleinfo(data){
	return request({
		url:'/store/outWarehouseSales/' + data,
		method:'get'
	})
}

// 销售开单修改
export function saleupdate(data){
	return request({
		url:'/store/outWarehouseSales',
		method:'put',
		data:data
	})
}

// 删除销售开单
export function delsalelist(data){
	return request({
		url:'/store/outWarehouseSales/' + data,
		method:'DELETE'
	})
}

// 销售开单审核
export function checksaleware(data){
	return request({
		url:'/store/outWarehouseSales/audit',
		method:'post',
		data:data
	})
}

// 前台开单列表
export function forelist(data){
	return request({
		url:'/store/outWarehouseForeground/list',
		method:'get',
		params:data
	})
}


// 添加前台开单
export function foregroundadd(data){
	return request({
		url:'/store/outWarehouseForeground',
		method:'post',
		data:data
	})
}

// 采购退货新增
export function purreturn(data){
	return request({
		url:'/store/purchaseReturn',
		method:'post',
		data:data
	})
}

// 采购退货修改
export function updatepurreturn(data){
	return request({
		url:'/store/purchaseReturn',
		method:'put',
		data:data
	})
}
// 采购审核
export function checkourreturn(data){
	return request({
		url:'/store/purchaseReturn/audit',
		method:'post',
		data:{
			inWarehouseId:data
		}
	})
}


// 销售退货
// 销售退货列表
export function salereturnlist(data){
	return request({
		url:'/store/outWarehouseReturn/list',
		method:'get',
		params:data
	})
}

// 销售退货删除
export function salereturndetel(data){
	return request({
		url:'/store/outWarehouseReturn/' + data,
		method:'DELETE'
	})
}

// 客户购买出库的列表
export function outBoundlist(data){
	return request({
		url:'/store/outWarehouseDetail/outBound/',
		method:'get',
		params:data
	})
}

// 销售退货添加
export function addsalereturn (data){
	return request({
		url:'/store/outWarehouseReturn',
		method:'post',
		data:data
	})
}

// 销售退货详情
export function salereturninfo(data){
	return request({
		url:'/store/outWarehouseReturn/' +data,
		method:'get'
	})
}

// 销售退货修改
export function updatasalereturn(data){
	return request({
		url:'/store/outWarehouseReturn',
		method:'PUT',
		data:data
	})
}

// 销售退货审核
export function salereturncheck(data){
	return request({
		url:'/store/outWarehouseReturn/audit',
		method:'post',
		data:data
	})
}

// 报损单
// 报损单列表
export function damagelist(data){
	return request({
		url:'/store/damage/list',
		method:'get',
		params:data
	})
}

// 报损新增
export function damageadd(data){
	return request({
		url:'/store/damage',
		method:'post',
		data:data
	})
}
// 报损删除
export function damagedetel(data){
	return request({
		url:'/store/damage/' + data,
		method:'DELETE',
	})
}

// 报损详情
export function damageinfo(data){
	return request({
		url:'/store/damage/' + data,
		method:'get'
	})
}

// 报损审核
export function damageaudit(data){
	return request({
		url:'/store/damage/audit',
		method:'POST',
		data:data
	})
}

// 报损修改
export function damageuodate(data){
	return request({
		url:'/store/damage',
		method:'PUT',
		data:data
	})
}

// 前台开单详情
export function forefroundinfo(data){
	return request({
		url:'/store/outWarehouseForeground/' + data,
		method:'get'
	})
}

// 前台开单修改
export function forefroundupdata(data){
	return request({
		url:'/store/outWarehouseForeground',
		method:'put',
		data:data
	})
}