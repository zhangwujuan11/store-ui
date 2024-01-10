import request from '@/utils/request2'

// 查询移库/调拨列表
export function listInventoryTransfer(query) {
  return request({
    url: '/store/inventoryTransfer/list',
    method: 'get',
    params: query
  })
}
// 新增移库/调拨
export function addInventoryTransfer(data) {
  return request({
    url: '/store/inventoryTransfer',
    method: 'post',
    data: data
  })
}
// 查询移库/调拨详细
export function getInventoryTransfer(inventoryTransferId) {
  return request({
    url: '/store/inventoryTransfer/' + inventoryTransferId,
    method: 'get'
  })
}
// 修改移库/调拨
export function updateInventoryTransfer(data) {
  return request({
    url: '/store/inventoryTransfer',
    method: 'put',
    data: data
  })
}

// 审核移库
export function checkaudit(data){
	return request({
		url:'/store/inventoryTransfer/audit',
		method:'post',
		data:{
			inventoryTransferId:data
		}
	})
}




















// 删除移库/调拨
export function delInventoryTransfer(inventoryTransferId) {
  return request({
    url: '/store/inventoryTransfer/' + inventoryTransferId,
    method: 'delete'
  })
}

// 导出移库/调拨
export function exportInventoryTransfer(query) {
  return request({
    url: '/store/inventoryTransfer/export',
    method: 'get',
    params: query
  })
}