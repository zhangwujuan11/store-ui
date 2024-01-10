import request from '@/utils/request2'

// 查询盘点列表
export function listTaking(query) {
  return request({
    url: '/store/taking/list',
    method: 'get',
    params: query
  })
}
// 导出门店库存
export function exportTaking() {
  return request({
    url: 'store/inventory/exportStocktaking',
    method: 'get'
  })
}


// 查询盘点详细
export function getTaking(storeTakingId) {
  return request({
    url: '/store/taking/' + storeTakingId,
    method: 'get'
  })
}
// 修改盘点
export function updateTaking(data) {
  return request({
    url: '/store/taking',
    method: 'put',
    data: data
  })
}
// 删除盘点
export function delTaking(storeTakingId) {
  return request({
    url: '/store/taking/' + storeTakingId,
    method: 'delete'
  })
}

// 分析
export function takinganalysis(data){
	return request({
		url:'/store/taking/analysis',
		method: 'POST',
		data:data
	})
}

// 生成
export function takinggenerateStore(data){
return request({
		url:'/store/taking/generateStore',
		method: 'POST',
		data:data
	})
}
















