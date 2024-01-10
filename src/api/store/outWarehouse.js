import request from '@/utils/request2'



// 新增出库
export function addOutWarehouse(data) {
  return request({
    url: '/store/outWarehouse',
    method: 'post',
    data: data
  })
}
// 查询出库列表
export function listOutWarehouse(query) {
  return request({
    url: '/store/outWarehouse/list',
    method: 'get',
    params: query
  })
}
// 查询出库详细
export function getOutWarehouse(outWarehouseId) {
  return request({
    url: '/store/outWarehouse/' + outWarehouseId,
    method: 'get'
  })
}
// 修改出库
export function updateOutWarehouse(data) {
 return request({
 	url:'/store/outWarehouse',
 	method:'put',
 	data:data
 })
}
// 删除出库
export function delOutWarehouse(outWarehouseId) {
  return request({
    url: '/store/outWarehouse/' + outWarehouseId,
    method: 'delete'
  })
}

// 历史数据模板下载
export function historydownlode(){
	return request({
		url:'/store/outWarehouseSales/importTemplate',
		method:'get'
	})
}















// 导出出库
export function exportOutWarehouse(query) {
  return request({
    url: '/store/outWarehouse/export',
    method: 'get',
    params: query
  })
}