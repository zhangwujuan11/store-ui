import request from '@/utils/request2'


export function annual(){
	return request({
	  url:'/store/statisticalChart/annualMonthlySales',
	  method:'get'
	})
}

export function annualMonthlyReport(data){
	return request({
		url:'/store/statisticalChart/annualMonthlyReport',
		method:'get'
	})
}

export function exportInventory(data){
	return request({
		url:'/store/statisticalChart/export',
		method:'get'
	})
}

// 入库明细汇总

export function inWarehouseSummary(data){
	return request({
		url:'/store/inWarehouse/inWarehouseSummary',
		method:'GET',
		params:data
	})
}

// 入库明细导出
export function exportinWarehouseSummary(data){
	return request({
		url:'/store/inWarehouse/inWarehouseSummary/export',
		method:'get'
	})
}
// 单月入库产品金额图
export function inWarehouseProductAmount(data){
	return request({
		url:'/store/statisticalChart/inWarehouseProductAmount',
		method:'get',
		params:data
	})
}

// 产品销售额统计
export function currentMonthSales(data){
	return request({
		url:'/store/statisticalChart/currentMonthSales',
		method:'get',
		params:data
	})
}

// 入库金额统计
export function inmoneypicture(data){
	return request({
		url:'/store/statisticalChart/currentMonthInWarehouseMoney',
		method:'get',
		params:data
	})
}

// 本月出库产品去年今年对比
export function outWarehouseContrast(){
	return request({
		url:'/store/statisticalChart/outWarehouseContrast',
		method:'get'
	})
}

// 工单列表
export function orderlist(data){
	return request({
		url:'/store/order/list',
		method:'get',
		params:data
	})
}

// 产品销售额表
export function statisticallist(data){
	return request({
		url:'/store/statisticalChart/outWarehouseProductAmountChart',
		method:'get',
		params:data
	})
}
// 产品销售额导出
export function exportstatisticallist(data){
	return request({
		url:'/store/statisticalChart/outWarehouseProductExport',
		method:'get',
		params:data
	})
}

// 入库金额列表
export function isticallist(data){
	return request({
		url:'store/statisticalChart/inWarehouseProductAmountChart',
		method:'get',
		params:data
	})
}

// 入库金额列表导出
export function exportisticallist(data){
	return request({
		url:'/store/statisticalChart/inWarehouseProductAmountExport',
		method:'get',
		params:data
	})
}

// 客户对账
export function reconciliation(data){
	return request({
		url:'/store/businessAnalysis/customerReconciliationlist',
		method:'get',
		params:data
	})
}
// 导出客户对账汇总数据
export function exportkehu(data){
	return request({
		url:'/store/businessAnalysis/customerReconciliationExport',
		method:'get',
		params: data
	})
}
// 
export function exportwagnlai(data){
	return request({
		url:'/store/businessAnalysis/customerDetailExport',
		method:'get',
		params: data
	})
}