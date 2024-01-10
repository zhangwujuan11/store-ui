import request from '@/utils/request'

// 查询出库明细列表
export function listOutWarehouseDetail(query) {
  return request({
    url: '/store/outWarehouseDetail/list',
    method: 'get',
    params: query
  })
}

// 查询出库明细详细
export function getOutWarehouseDetail(outWarehouseDelId) {
  return request({
    url: '/store/outWarehouseDetail/' + outWarehouseDelId,
    method: 'get'
  })
}

// 新增出库明细
export function addOutWarehouseDetail(data) {
  return request({
    url: '/store/outWarehouseDetail',
    method: 'post',
    data: data
  })
}

// 修改出库明细
export function updateOutWarehouseDetail(data) {
  return request({
    url: '/store/outWarehouseDetail',
    method: 'put',
    data: data
  })
}

// 删除出库明细
export function delOutWarehouseDetail(outWarehouseDelId) {
  return request({
    url: '/store/outWarehouseDetail/' + outWarehouseDelId,
    method: 'delete'
  })
}

// 导出出库明细
export function exportOutWarehouseDetail(query) {
  return request({
    url: '/store/outWarehouseDetail/export',
    method: 'get',
    params: query
  })
}