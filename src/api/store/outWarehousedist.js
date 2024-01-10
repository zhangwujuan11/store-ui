import request from '@/utils/request'

// 查询出库分配列表
export function listOutWarehousedist(query) {
  return request({
    url: '/store/outWarehousedist/list',
    method: 'get',
    params: query
  })
}

// 查询出库分配详细
export function getOutWarehousedist(outWarehouseDistId) {
  return request({
    url: '/store/outWarehousedist/' + outWarehouseDistId,
    method: 'get'
  })
}

// 新增出库分配
export function addOutWarehousedist(data) {
  return request({
    url: '/store/outWarehousedist',
    method: 'post',
    data: data
  })
}

// 修改出库分配
export function updateOutWarehousedist(data) {
  return request({
    url: '/store/outWarehousedist',
    method: 'put',
    data: data
  })
}

// 删除出库分配
export function delOutWarehousedist(outWarehouseDistId) {
  return request({
    url: '/store/outWarehousedist/' + outWarehouseDistId,
    method: 'delete'
  })
}

// 导出出库分配
export function exportOutWarehousedist(query) {
  return request({
    url: '/store/outWarehousedist/export',
    method: 'get',
    params: query
  })
}