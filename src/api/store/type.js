import request from '@/utils/request'

// 查询基础参数类别列表
export function listType(query) {
  return request({
    url: '/store/type/list',
    method: 'get',
    params: query
  })
}

// 查询基础参数类别详细
export function getType(typeId) {
  return request({
    url: '/store/type/' + typeId,
    method: 'get'
  })
}

// 新增基础参数类别
export function addType(data) {
  return request({
    url: '/store/type',
    method: 'post',
    data: data
  })
}

// 修改基础参数类别
export function updateType(data) {
  return request({
    url: '/store/type',
    method: 'put',
    data: data
  })
}

// 删除基础参数类别
export function delType(typeId) {
  return request({
    url: '/store/type/' + typeId,
    method: 'delete'
  })
}

// 导出基础参数类别
export function exportType(query) {
  return request({
    url: '/store/type/export',
    method: 'get',
    params: query
  })
}