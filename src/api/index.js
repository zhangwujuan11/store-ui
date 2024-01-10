import request from '@/utils/request2'

// 监听是否有库存预警
export function earlyWarningState(){
	return request({
		url:'/store/inventory/earlyWarningState',
		method:'get'
	})
}

// 预警信息列表
export function earlylist(data){
	return request({
		url:'store/inventory/earlyWarning',
		method:'get',
		params:data
	})
}