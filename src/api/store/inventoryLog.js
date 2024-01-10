import request from '@/utils/request'

// 查询库存日志列表
export function listInventoryLog(query) {
  return request({
    url: '/store/inventoryLog/list',
    method: 'get',
    params: query
  })
}

// 查询库存日志详细
export function getInventoryLog(inventoryLogId) {
  return request({
    url: '/store/inventoryLog/' + inventoryLogId,
    method: 'get'
  })
}

// 新增库存日志
export function addInventoryLog(data) {
  return request({
    url: '/store/inventoryLog',
    method: 'post',
    data: data
  })
}

// 修改库存日志
export function updateInventoryLog(data) {
  return request({
    url: '/store/inventoryLog',
    method: 'put',
    data: data
  })
}

// 删除库存日志
export function delInventoryLog(inventoryLogId) {
  return request({
    url: '/store/inventoryLog/' + inventoryLogId,
    method: 'delete'
  })
}

// 导出库存日志
export function exportInventoryLog(query) {
  return request({
    url: '/store/inventoryLog/export',
    method: 'get',
    params: query
  })
}