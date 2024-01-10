import request from '@/utils/request'

// 查询门店资金日志列表
export function listTenantFundLog(query) {
  return request({
    url: '/store/tenantFundLog/list',
    method: 'get',
    params: query
  })
}

// 查询门店资金日志详细
export function getTenantFundLog(id) {
  return request({
    url: '/store/tenantFundLog/' + id,
    method: 'get'
  })
}

// 新增门店资金日志
export function addTenantFundLog(data) {
  return request({
    url: '/store/tenantFundLog',
    method: 'post',
    data: data
  })
}

// 修改门店资金日志
export function updateTenantFundLog(data) {
  return request({
    url: '/store/tenantFundLog',
    method: 'put',
    data: data
  })
}

// 删除门店资金日志
export function delTenantFundLog(id) {
  return request({
    url: '/store/tenantFundLog/' + id,
    method: 'delete'
  })
}

// 导出门店资金日志
export function exportTenantFundLog(query) {
  return request({
    url: '/store/tenantFundLog/export',
    method: 'get',
    params: query
  })
}