import request from '@/utils/request'

// 查询移库/调拨明细列表
export function listInventoryTransferDetail(query) {
  return request({
    url: '/store/inventoryTransferDetail/list',
    method: 'get',
    params: query
  })
}

// 查询移库/调拨明细详细
export function getInventoryTransferDetail(inventoryTransferDelId) {
  return request({
    url: '/store/inventoryTransferDetail/' + inventoryTransferDelId,
    method: 'get'
  })
}

// 新增移库/调拨明细
export function addInventoryTransferDetail(data) {
  return request({
    url: '/store/inventoryTransferDetail',
    method: 'post',
    data: data
  })
}

// 修改移库/调拨明细
export function updateInventoryTransferDetail(data) {
  return request({
    url: '/store/inventoryTransferDetail',
    method: 'put',
    data: data
  })
}

// 删除移库/调拨明细
export function delInventoryTransferDetail(inventoryTransferDelId) {
  return request({
    url: '/store/inventoryTransferDetail/' + inventoryTransferDelId,
    method: 'delete'
  })
}

// 导出移库/调拨明细
export function exportInventoryTransferDetail(query) {
  return request({
    url: '/store/inventoryTransferDetail/export',
    method: 'get',
    params: query
  })
}