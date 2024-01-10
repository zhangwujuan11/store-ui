import request from '@/utils/request'

// 查询品牌信息列表
export function listProductBrand(query) {
  return request({
    url: '/store/productBrand/list',
    method: 'get',
    params: query
  })
}

// 查询品牌信息详细
export function getProductBrand(productBrandId) {
  return request({
    url: '/store/productBrand/' + productBrandId,
    method: 'get'
  })
}

// 新增品牌信息
export function addProductBrand(data) {
  return request({
    url: '/store/productBrand',
    method: 'post',
    data: data
  })
}

// 修改品牌信息
export function updateProductBrand(data) {
  return request({
    url: '/store/productBrand',
    method: 'put',
    data: data
  })
}

// 删除品牌信息
export function delProductBrand(productBrandId) {
  return request({
    url: '/store/productBrand/' + productBrandId,
    method: 'delete'
  })
}

// 导出品牌信息
export function exportProductBrand(query) {
  return request({
    url: '/store/productBrand/export',
    method: 'get',
    params: query
  })
}