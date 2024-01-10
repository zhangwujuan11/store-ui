import request from '@/utils/request'

// 查询入库明细列表
export function listInWarehouseDetail(query) {
  return request({
    url: '/store/inWarehouseDetail/list',
    method: 'get',
    params: query
  })
}

// 查询入库明细详细
export function getInWarehouseDetail(inWarehouseDelId) {
  return request({
    url: '/store/inWarehouseDetail/' + inWarehouseDelId,
    method: 'get'
  })
}

// 新增入库明细
export function addInWarehouseDetail(data) {
  return request({
    url: '/store/inWarehouseDetail',
    method: 'post',
    data: data
  })
}

// 修改入库明细
export function updateInWarehouseDetail(data) {
  return request({
    url: '/store/inWarehouseDetail',
    method: 'put',
    data: data
  })
}

// 删除入库明细
export function delInWarehouseDetail(inWarehouseDelId) {
  return request({
    url: '/store/inWarehouseDetail/' + inWarehouseDelId,
    method: 'delete'
  })
}

// 导出入库明细
export function exportInWarehouseDetail(query) {
  return request({
    url: '/store/inWarehouseDetail/export',
    method: 'get',
    params: query
  })
}