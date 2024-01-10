import request from '@/utils/request'
import requestt from '@/utils/request2'


// 查询租户管理列表
export function listTenant(query) {
  return request({
    url: '/system/tenant/list',
    method: 'get',
    params: query
  })
}

// 查询租户管理详细
export function getTenant(infoId) {
  return request({
    url: '/system/tenant/' + infoId,
    method: 'get'
  })
}

// 新增租户管理
export function addTenant(data) {
  return request({
    url: '/system/tenant',
    method: 'post',
    data: data
  })
}

// 修改租户管理
export function updateTenant(data) {
  return request({
    url: '/system/tenant',
    method: 'put',
    data: data
  })
}

// 删除租户管理
export function delTenant(infoId) {
  return request({
    url: '/system/tenant/' + infoId,
    method: 'delete'
  })
}

// 禁用租户管理
export function delnt(data) {
  return request({
    url: '/system/tenant/',
    method: 'PUT',
    data:data
  })
}

// 导出租户管理
export function exportTenant(query) {
  return request({
    url: '/system/tenant/export',
    method: 'get',
    params: query
  })
}


// 门店管理
// 门店列表
export function grounlist(data){
	return requestt({
		url:'/store/warehouse/list',
		method:'GET',
		params:data
	})
}
// 添加门店
export function postgrounlist(data){
	return requestt({
		url:'/store/warehouse',
		method:'post',
		data:data
	})
}

// 获取门店详情
export function grounpinfo(data){
	return requestt({
		url:'/store/warehouse/' + data,
		method:'get'
	})
}

// 修改门店信息
export function updategrounp(data){
	return requestt({
		url:'/store/warehouse',
		method:'PUT',
		data:data
	})
}

// 删除门店
export function detelgrouno(data){
	return requestt({
		url:'/store/warehouse/' + data,
		method:'DELETE'
	})
}

// 新增门店
export function addshopcode(data){
	return request({
		url:'/system/tenant/addShopCode',
		method:'post',
		data:data
	})
}
