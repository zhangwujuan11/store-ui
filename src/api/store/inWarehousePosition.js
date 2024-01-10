import request from '@/utils/request'

// 查询入库库位列表
export function listInWarehousePosition(query) {
  return request({
    url: '/store/inWarehousePosition/list',
    method: 'get',
    params: query
  })
}

// 查询入库库位详细
export function getInWarehousePosition(inWarehousePositionId) {
  return request({
    url: '/store/inWarehousePosition/' + inWarehousePositionId,
    method: 'get'
  })
}

// 新增入库库位
export function addInWarehousePosition(data) {
  return request({
    url: '/store/inWarehousePosition',
    method: 'post',
    data: data
  })
}

// 修改入库库位
export function updateInWarehousePosition(data) {
  return request({
    url: '/store/inWarehousePosition',
    method: 'put',
    data: data
  })
}

// 删除入库库位
export function delInWarehousePosition(inWarehousePositionId) {
  return request({
    url: '/store/inWarehousePosition/' + inWarehousePositionId,
    method: 'delete'
  })
}

// 导出入库库位
export function exportInWarehousePosition(query) {
  return request({
    url: '/store/inWarehousePosition/export',
    method: 'get',
    params: query
  })
}