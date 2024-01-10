import request from '@/utils/request2'

// 查询客户分类列表
export function listCustomerCategory(query) {
  return request({
    url: '/store/customerCategory/list',
    method: 'get',
    params: query
  })
}

// 查询客户分类详细
export function getCustomerCategory(customerCategoryId) {
  return request({
    url: '/store/customerCategory/' + customerCategoryId,
    method: 'get'
  })
}

// 新增客户分类
export function addCustomerCategory(data) {
  return request({
    url: '/store/customerCategory',
    method: 'post',
    data: data
  })
}

// 修改客户分类
export function updateCustomerCategory(data) {
  return request({
    url: '/store/customerCategory',
    method: 'put',
    data: data
  })
}

// 删除客户分类
export function delCustomerCategory(customerCategoryId) {
  return request({
    url: '/store/customerCategory/' + customerCategoryId,
    method: 'delete'
  })
}

// 导出客户分类
export function exportCustomerCategory(query) {
  return request({
    url: '/store/customerCategory/export',
    method: 'get',
    params: query
  })
}