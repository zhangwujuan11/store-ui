import request from '@/utils/request'

// 查询盘点明细列表
export function listTakingDetail(query) {
  return request({
    url: '/v1/store/takingDetail/list',
    method: 'get',
    params: query
  })
}

// 查询盘点明细详细
export function getTakingDetail(storeTakingDetailId) {
  return request({
    url: '/v1/store/takingDetail/' + storeTakingDetailId,
    method: 'get'
  })
}

// 新增盘点明细
export function addTakingDetail(data) {
  return request({
    url: '/v1/store/takingDetail',
    method: 'post',
    data: data
  })
}

// 修改盘点明细
export function updateTakingDetail(data) {
  return request({
    url: '/v1/store/takingDetail',
    method: 'put',
    data: data
  })
}

// 删除盘点明细
export function delTakingDetail(storeTakingDetailId) {
  return request({
    url: '/v1/store/takingDetail/' + storeTakingDetailId,
    method: 'delete'
  })
}

// 导出盘点明细
export function exportTakingDetail(query) {
  return request({
    url: '/v1/store/takingDetail/export',
    method: 'get',
    params: query
  })
}