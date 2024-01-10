import request from '@/utils/request2'
import request2 from '@/utils/request'

// 查询入库列表
export function listInWarehouse(query) {
  return request({
    url: '/store/inWarehouse/list',
    method: 'get',
    params: query
  })
}

// 查询入库详细
export function getInWarehouse(inWarehouseId) {
  return request({
    url: '/store/inWarehouse/' + inWarehouseId,
    method: 'get'
  })
}

// 新增入库
export function addInWarehouse(data) {
  return request({
    url: '/store/inWarehouse',
    method: 'post',
    data: data
  })
}

// 修改入库
export function updateInWarehouse(data) {
  return request({
    url: '/store/inWarehouse',
    method: 'put',
    data: data
  })
}

// 删除入库
export function delInWarehouse(inWarehouseId) {
  return request({
    url: '/store/inWarehouse/' + inWarehouseId,
    method: 'delete'
  })
}

// 删除采购退货单
export function delInWarehousess(inWarehouseId){
	return request({
	  url: '/store/inWarehouse/delete/' + inWarehouseId,
	  method: 'delete'
	})
}

// 导出入库
export function exportInWarehouse(query) {
  return request({
    url: '/store/inWarehouse/export',
    method: 'get',
    params: query
  })
}
// 门店管理-新增入库
export function addinWarehouse(data){
	return request({
		url:'/store/inWarehouse',
		method:'post',
		data:data
	})
}

// 修改入库信息
export function updatainWarehouse(data){
	return request({
		url:'/store/inWarehouse',
		method:'put',
		data:data
	})
}
// 审核
export function checkaudit(data){
	return request({
		url:'/store/inWarehouse/audit',
		method:'post',
		data:{
			"inWarehouseId":data
			}
	})
}

// 指派用户人员列表
export function listUser (data){
	return request2({
		url:'/system/user/storeUserlist',
		method:'get',
		params:data
	})
}
// 指派
export function shelveUser (data){
	return request({
		url:'store/inWarehouse/shelveUser',
		method:'post',
		data:data
	})
}




// 报溢单

// 报溢单添加
export function benefit(data){
	return request({
		url:'/store/benefit',
		method:'post',
		data:data
	})
}

// 报溢单审核
export function checkbenefit(data){
	return request({
		url:'/store/benefit/audit',
		method:'post',
		data:data
	})
}
// 报溢单修改
export function updatebenefit(data){
	return request({
		url:'/store/benefit',
		method:'put',
		data:data
	})
}


// 库存共享列表
export function sharelist (data){
	return request({
		url:'/store/share/list',
		method:'get',
		params:data
	})
}
// 新增共享
export function addshare(data){
	return request({
		url:'/store/share',
		method:'POST',
		data:data
	})
}

// 修改共享
export function updatashare(data){
	return request({
		url:'/store/share',
		method:'put',
		data:data
	})
}

// 删除共享
export function delshare(data){
	return request({
		url:'/store/share/' + data,
		method:'delete'
	})
}

// 新增库位查询需求
export function addserchku(data){
	return request({
		url:'/store/common/inventory/' + data.wid + '/' + data.pid,
		// url:'/store/common/inventory/1684862542247211009/1687127957878894594',
		method:'get'
	})
}