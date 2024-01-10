import request from '@/utils/request'

// 查询门店管理列表
export function listWarehouse(query) {
  return request({
    url: '/store/warehouse/list',
    method: 'get',
    params: query
  })
}

// 查询门店管理详细
export function getWarehouse(warehouseId) {
  return request({
    url: '/store/warehouse/' + warehouseId,
    method: 'get'
  })
}

// 新增门店管理
export function addWarehouse(data) {
  return request({
    url: '/store/warehouse',
    method: 'post',
    data: data
  })
}

// 修改门店管理
export function updateWarehouse(data) {
  return request({
    url: '/store/warehouse',
    method: 'put',
    data: data
  })
}

// 删除门店管理
export function delWarehouse(warehouseId) {
  return request({
    url: '/store/warehouse/' + warehouseId,
    method: 'delete'
  })
}

// 导出门店管理
export function exportWarehouse(query) {
  return request({
    url: '/store/warehouse/export',
    method: 'get',
    params: query
  })
}