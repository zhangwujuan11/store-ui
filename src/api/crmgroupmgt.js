import request from '@/utils/request2'

export function trredata(){
  return request({
    url:'/store/customerClassify/treeSelect',
    method:'get'
  })
}

// 客户分类列表
export function listTypeData (data){
  return request({
    url:'/store/customerClassify/list',
    method:'get',
    params:data
  })
}

// 添加客户分类
export function addTypeData(data){
  return request({
    url:'/store/customerClassify',
    method:'post',
    data:data
  })
}

// 修改客户分类
export function updateTypeData(data){
  return request({
    url:'/store/customerClassify',
    method:'PUT',
    data:data
  })
}

// 客户管理列表
export function groulist(data){
  return request({
    url:'/store/customer/list',
    method:'get',
    params:data
  })
}

//新增客户
export function addcustermar(data){
  return request({
    url:'/store/customer',
    method:'post',
    data:data
  })
}

// 客户详情
export function grouinfo(data){
  return request({
    url:'/store/customer/' + data,
    method:'get'
  })
}

// 修改客户信息
export function updatamaster(data){
  return request({
    url:'/store/customer',
    method: 'put',
    data:data
  })
}

// 客户删除
export function detelmaster(data){
  return request({
    url:'/store/customer/'+ data,
    method:'DELETE'
  })
}

// 供应商列表（过滤）
export function supplierlist(data){
  return request({
    url:'/store/supplier/list',
    method:'get',
    params:data
  })
}

// 供应商列表（全部）
export function supplierlistall(data){
	return request({
	  url:'/store/supplier/listAll',
	  method:'get',
	  params:data
	})
}
// 查询供应商详细
export function getSupplier(supplierId) {
  return request({
    url: '/store/supplier/' + supplierId,
    method: 'get'
  })
}

// 新增供应商
export function addSupplier(data) {
  return request({
    url: '/store/supplier',
    method: 'post',
    data: data
  })
}

// 修改供应商
export function updateSupplier(data) {
  return request({
    url: '/store/supplier',
    method: 'put',
    data: data
  })
}

// 删除供应商
export function delSupplier(supplierId) {
  return request({
    url: '/store/supplier/' + supplierId,
    method: 'delete'
  })
}

// 导出供应商
export function exportSupplier(query) {
  return request({
    url: '/store/supplier/export',
    method: 'get',
    params: query
  })
}

// 客户参数选择下拉框
export function selecanshu(data){
  return request({
    url:'/store/typeData/listAll?typeId=' + data,
    method:'get'
  })
}

// 参数选择下拉框
export function selecanoption(data){
  return request({
    url:'/store/typeData/listAll?typeId=' + data,
    method:'get'
  })
}

// 客户导入模板
export function downcuster(data){
	return request({
		url:'/store/customer/importTemplate',
		method:'get'
	})
}

// 库存明细
export function infoinventory (id){
	return request({
		url:'/store/inventory/' + id,
		method:'get'
	})
}
