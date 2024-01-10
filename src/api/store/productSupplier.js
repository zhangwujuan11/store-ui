import request from '@/utils/request'

// 查询产品与供应商列表
export function listProductSupplier(query) {
  return request({
    url: '/store/productSupplier/list',
    method: 'get',
    params: query
  })
}

// 查询产品与供应商详细
export function getProductSupplier(productSupplierId) {
  return request({
    url: '/store/productSupplier/' + productSupplierId,
    method: 'get'
  })
}

// 新增产品与供应商
export function addProductSupplier(data) {
  return request({
    url: '/store/productSupplier',
    method: 'post',
    data: data
  })
}

// 修改产品与供应商
export function updateProductSupplier(data) {
  return request({
    url: '/store/productSupplier',
    method: 'put',
    data: data
  })
}

// 删除产品与供应商
export function delProductSupplier(productSupplierId) {
  return request({
    url: '/store/productSupplier/' + productSupplierId,
    method: 'delete'
  })
}

// 导出产品与供应商
export function exportProductSupplier(query) {
  return request({
    url: '/store/productSupplier/export',
    method: 'get',
    params: query
  })
}