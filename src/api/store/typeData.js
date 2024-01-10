import request from '@/utils/request2'

// 查询基础参数数据列表
export function listTypeData(query) {
  return request({
    url: '/store/typeData/list',
    method: 'get',
    params: query
  })
}

// 查询基础参数数据详细
export function getTypeData(paramId) {
  return request({
    url: '/store/typeData/' + paramId,
    method: 'get'
  })
}

// 新增基础参数数据
export function addTypeData(data) {
  return request({
    url: '/store/typeData',
    method: 'post',
    data: data
  })
}

// 修改基础参数数据
export function updateTypeData(data) {
  return request({
    url: '/store/typeData',
    method: 'put',
    data: data
  })
}

// 删除基础参数数据
export function delTypeData(paramId) {
  return request({
    url: '/store/typeData/' + paramId,
    method: 'delete'
  })
}

// 生成导出文件
export function exportTypeData(query) {
  return request({
    url: '/store/typeData/export',
    method: 'get',
    params: query
  })
}

// 产品参数树形图
export function trredata(){
  return request({
    url:'/store/type/treeselect',
    method:'get'
  })
}
