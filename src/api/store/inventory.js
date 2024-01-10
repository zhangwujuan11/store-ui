import request from '@/utils/request2'

// 查询库存有用列表
export function listInventory(query) {
  return request({
    url: '/store/inventory/list',
    method: 'get',
    params: query
  })
}
// 查询库存所有列表
export function listInventoryall(query) {
  return request({
    url: '/store/inventory/listAll',
    method: 'get',
    params: query
  })
}


// 查询门店所有列表
export function listAll(data){
	return request({
		url:'/store/warehouse/listAll',
		method:'get',
		params:data
	})
}


// 导出库存
export function exportInventory(query) {
  return request({
    url: '/store/inventory/export',
    method: 'get',
    params: query
  })
}

// 查看日志
export function look(data){
	return request({
		url:'/store/inventoryLog/list',
		method:'get',
		params:data
	})
}

// 销售情况table上
export function information(data){
	return request({
		url:'/store/outWarehouseDetail/information',
		method:'get',
		params:data
	})
}

export function purchase(data){
	return request({
		url:'/store/inWarehouseDetail/purchase',
		method:'get',
		params:data
	})
}

// 门店与用户关联
export function userWarehouse(data){
	return request({
		url:'/store/userWarehouse/userIds',
		method:'post',
		data:data
	})
}

// 用户与门店关联
export function Warehouseuser(data){
	return request({
		url:'/store/userWarehouse/warehouseIds',
		method:'post',
		data:data
	})
}

// 发送门店id
export function sendWarehouseuserid (data){
	return request({
		url:'/store/userWarehouse/warehouseId/' + data,
		method:'get'
	})
}
// 发送userid
export function senduserid(data){
	return request({
		url:'/store/userWarehouse/userId/' + data,
		method:'get'
	})
}





// 打印

// 入库打印数据
export function printinhose(data){
	return request({
		url:'/store/inWarehouse/printing/' + data,
		method:'get'
	})
}

// 出库打印数据
export function printouthose(data){
	return request({
		url:'/store/outWarehouse/print/' + data,
		method:'get'
	})
}

// 打印2
export function printouthosetwo(data){
	return request({
		url:'/store/outWarehouse/salesPrint/' + data,
		method:'get'
	})
}


// 分享模板导出
export function muexports (data){
	return request({
		url:'store/inventory/templateExport',
		method:'get',
		params:data
	})
}

//模板下载
export function muexporttow(){
	return request({
		url:'store/inventory/importTemplate',
		method:'get'
	})
}