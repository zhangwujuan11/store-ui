import request from '@/utils/request'

// 查询门店资金列表
export function listTenantFund(query) {
  return request({
    url: '/store/tenantFund/list',
    method: 'get',
    params: query
  })
}

// 查询门店资金详细
export function getTenantFund(tenantId) {
  return request({
    url: '/store/tenantFund/' + tenantId,
    method: 'get'
  })
}

// 新增门店资金
export function addTenantFund(data) {
  return request({
    url: '/store/tenantFund',
    method: 'post',
    data: data
  })
}

// 修改门店资金
export function updateTenantFund(data) {
  return request({
    url: '/store/tenantFund',
    method: 'put',
    data: data
  })
}

// 删除门店资金
export function delTenantFund(tenantId) {
  return request({
    url: '/store/tenantFund/' + tenantId,
    method: 'delete'
  })
}

// 导出门店资金
export function exportTenantFund(query) {
  return request({
    url: '/store/tenantFund/export',
    method: 'get',
    params: query
  })
}