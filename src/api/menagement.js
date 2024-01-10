import request from '@/utils/request2'

export function listTypeData(data){
  return request({
    url:'/store/productBrand/list',
    method:'get',
    params:data
  })
}

export function trredata(data){
  return request({
    url:'/store/productBrand/treeSelect',
    method:'get'
  })
}

// 查询具体信息
export function getTypeData(data){
  return request({
    url:'/store/productBrand/' + data,
    method:'get'
  })
}

// 新增品牌
export function addTypeData(data){
  return request({
    url:'/store/productBrand',
    method:'post',
    data:data
  })
}

export function uploadFile(data) {
  return request({
    url: '/v1/communal/files/scopes/video/attachment/actions/upload',
    method: 'post',
    async: false,
    cache: false,
    processData: false,// 告诉axios不要去处理发送的数据(重要参数)
    contentType: false,   // 告诉axios不要去设置Content-Type请求头
    data: data
  })
}

// 修改品牌数据
export function updateTypeData(data){
  return request({
    url:'/store/productBrand',
    method:'PUT',
    data:data
  })
}

// 删除品牌数据
export function delTypeData(data){
  return request({
    url:'/store/productBrand/' + data,
    method:'DELETE'
  })
}

// arrtree
export function arrtree(){
  return request({
    url:'/store/typeData/treeSelectProd',
    method:'get'
  })
}


