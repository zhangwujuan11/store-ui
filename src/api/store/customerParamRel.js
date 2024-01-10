import request from '@/utils/request2'

// 查询客户参数与客户信息关联列表
export function listCustomerParamRel(query) {
  return request({
    url: '/store/customerParamRel/list',
    method: 'get',
    params: query
  })
}

// 查询客户参数与客户信息关联详细
export function getCustomerParamRel(relId) {
  return request({
    url: '/store/customerParamRel/' + relId,
    method: 'get'
  })
}

// 新增客户参数与客户信息关联
export function addCustomerParamRel(data) {
  return request({
    url: '/store/customerParamRel',
    method: 'post',
    data: data
  })
}

// 修改客户参数与客户信息关联
export function updateCustomerParamRel(data) {
  return request({
    url: '/store/customerParamRel',
    method: 'put',
    data: data
  })
}

// 删除客户参数与客户信息关联
export function delCustomerParamRel(relId) {
  return request({
    url: '/store/customerParamRel/' + relId,
    method: 'delete'
  })
}

// 导出客户参数与客户信息关联
export function exportCustomerParamRel(query) {
  return request({
    url: '/store/customerParamRel/export',
    method: 'get',
    params: query
  })
}