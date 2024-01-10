<template>
  <div class="app-container home">
	  <div class="homeleft">
		   <div ref="mabox" id="mabox" style="width: 100%;height: 300px;margin-bottom: 50px;" v-hasPermi="['store:lineChart:chart']"></div>
		   <div ref="maboxtwo" id="maboxtwo" style="width: 100%;height: 300px;margin-bottom: 50px;" v-hasPermi="['store:productContrast:columnar']"></div>
		   <div ref="maboxthree"  id="maboxthree" style="width: 100%;height: 300px;margin-bottom: 50px;" v-hasPermi="['store:inWarehouseProductMoney:columnar']"></div>
		   <div ref="maboxfour"  id="maboxfour" style="width: 100%;height: 300px;margin-bottom: 50px;" v-hasPermi="['store:outWarehouseProduct:columnar']"></div>
		   <div ref="maboxfive" id="maboxfive" style="width: 100%;height: 300px;margin-bottom: 50px;" v-hasPermi="['store:inWarehouseMoney:columnar']"></div>
	  </div>
	  <div class="homeright">
		  <div v-hasPermi="['store:earlyWarning:list']" ref="teee"  id="teee">
		  <h4 style="text-align: center;width: 100%;">库存预警</h4>
		  <el-table :data="List">
		  	<el-table-column label="产品名称" align="center" prop="productName" />
		  	<el-table-column label="库存数量" align="center" prop="inventoryQuantity" />
		  	<el-table-column label="可用数量" align="center" prop="usableQuantity" >
		  	  <template slot-scope="scope">
		  		  <span style="color: red;">{{scope.row.usableQuantity}}</span>
		  	  </template>
		  	</el-table-column>
		  	  <el-table-column label="预警数量" align="center" prop="inventoryAlert" />
		  	<el-table-column label="carg" align="center" prop="carg" />
		  </el-table>
		  <pagination v-show="total>0" :total="total"
		  	:page.sync="pageNum" :limit.sync="pageSize" @pagination="earlyWarning" 
		  	style="bottom:5px;" />
			  </div>
			<div v-hasPermi="['store:order:list']" id="tr">
				<h4 style="text-align: center;width: 100%;">工单</h4>
				<el-table :data="ordertable">
					<el-table-column label="易道订单号" align="center" prop="orderSn" :show-overflow-tooltip="true"/>
					<el-table-column label="客户姓名" align="center" prop="userName" :show-overflow-tooltip="true"/>
					<el-table-column label="客户电话" align="center" prop="mobile":show-overflow-tooltip="true" />
					<el-table-column label="车牌号" align="center" prop="carNo" :show-overflow-tooltip="true"/>
					<el-table-column label="客户类型" align="center" prop="userTypeName" :show-overflow-tooltip="true"/>
					<!-- <el-table-column label="商品名称" align="center" prop="productName" :show-overflow-tooltip="true"/> -->
					<!-- <el-table-column label="更换部位" align="center" prop="changePart" :show-overflow-tooltip="true"/> -->
					<el-table-column label="服务预约时间" align="center" prop="appointmentTime" :show-overflow-tooltip="true"/>
					<el-table-column label="订单状态" align="center" prop="orderStatus" :show-overflow-tooltip="true">
					  <template slot-scope="scope">
						  {{scope.row.orderStatus | statu}}
					  </template>
					</el-table-column>
				</el-table>
				<pagination v-show="orders.total>0" :total="orders.total"
					:page.sync="orders.pageNum" :limit.sync="orders.pageSize"  @pagination="getordertable"
					style="bottom:5px;" />
			</div>
			 
	  </div>
	 <!-- <el-dialog title="库存预警" :visible.sync="outtable" width="89%" append-to-body>
	  	
	  	<span slot="footer" class="dialog-footer">
	  		<el-button @click="outtable=false">取 消</el-button>
	  	  </span>
	  </el-dialog> -->
  
  </div>
</template>

<script>
	import {earlyWarningState, earlylist} from '@/api/index'
	import { annual, outWarehouseContrast, inWarehouseProductAmount, currentMonthSales, inmoneypicture, orderlist } from "@/api/busine";
	import * as echarts from 'echarts';
export default {
  name: "Index",
  filters:{
	  statu(e){
		 if(e==99){
			 return '待派单'
		 }else if(e == 100){
			 return '待接单'
		 }else if(e == 101){
			 return '已接单'
		 }else if(e == 102){
			 return '审核中'
		 }else if(e == 103){
			 return '已取消'
		 }else if(e == 104){
			 return '已完成'
		 }else if(e == 105){
			 return '拒绝接单'
		 }else if(e==106){
			 return '不通过'
		 }else if(e == 107){
			 return '不通过'
		 }
	  }
  },
  data() {
    return {
      // 版本号
      version: "3.7.0",
	  outtable:false,
	  List:[],
	  total:0,
	  pageSize:10,
	  pageNum:0,
	  setInt: null,
	  date:'',
	  orders:{
		  pageNum:1,
		  pageSize:10,
		  total:0
	  },
	  ordertable:[]
    };
  },
  mounted() {
	  this.earlyWarning()
	  // this.setInt =  setInterval(() => {
	  //    this.earlyWarning()
	  // }, 60000)
	  let date = new Date();
	  let year = date.getFullYear();
	  let month = date.getMonth()+1;
	  this.date= year +'-' +  month
	  this.getList()
	  this.getordertable()
  },
  // beforeDestory() {
  //     clearInterval(this.setInt)
  //   },
//离开页面清除定时器失效问题
//  beforeRouteLeave (to, from, next) {
//     clearInterval(this.setInt)
//     next()
// },

  methods: {
	//ws
	earlyWarning(){
		if(document.getElementById('teee')){
			earlyWarningState().then(res=>{
				if(res.data == false){
					earlylist({
						pageNum:this.pageNum,
						pageSize:this.pageSize
					}).then(responst=>{
						this.List=responst.data.items
						this.total=responst.data.total
						this.outtable=true
					})
				}else{
					this.outtable=false
				}
			})
		}
	},
	/** 查询移库/调拨列表 */
	  getList() {
	  this.loading = true;
	  this.ydatas=[]
	  if(document.getElementById('mabox')){
		  annual({}).then(res=>{
		  		  this.rchartdaya=res.data
		  			this.rchartdaya.series.map(item=>{
		  				this.ydatas.push(item.name)
		  				item.type= 'line'
		  			})
		  			this.initChart(this.$refs.mabox,this.ydatas, this.rchartdaya,"出库销售统计");
		  })
	  }
	  if(document.getElementById('maboxtwo')){
		  outWarehouseContrast().then(response=>{
		  		  let twodata=response.data
		  		  let twodatay=[]
		  		  twodata.series.map(items=>{
		  		  	twodatay.push(items.name)
		  		  	items.type= 'bar'
		  			items.barWidth= "30%"
		  		  })
		  		 this.initCharttwo(this.$refs.maboxtwo,twodatay,twodata,"本月出库产品去年今年对比"); 
		  })
	  }
	 if(document.getElementById('maboxthree')){
		 inWarehouseProductAmount({date:this.date}).then(respo=>{
		 		  let twodata=respo.data
		 		  let twodatay=[]
		 		  twodata.series.map(items=>{
		 		  	twodatay.push(items.name)
		 		  	items.type= 'bar'
		 			items.barWidth= "30%"
		 		  })
		 		 this.initCharttwo(this.$refs.maboxthree,twodatay,twodata,"本月入库明细汇总"); 
		 })
	 }
	  if(document.getElementById('maboxfour')){
		  currentMonthSales({date:this.date}).then(respo=>{
		  		  let twodata=respo.data
		  		  let twodatay=[]
		  		  twodata.series.map(items=>{
		  		  	twodatay.push(items.name)
		  		  	items.type= 'bar'
		  			items.barWidth= "30%"
		  		  })
		  		 this.initCharttwo(this.$refs.maboxfour,twodatay,twodata,"本月入库产品销售额统计"); 
		  })
	  }
	  if(document.getElementById('maboxfive')){
		  inmoneypicture({date:this.date}).then(respo=>{
		  		  let twodata=respo.data
		  		  let twodatay=[]
		  		  twodata.series.map(items=>{
		  		  	twodatay.push(items.name)
		  		  	items.type= 'bar'
		  			items.barWidth= "30%"
		  		  })
		  		 this.initCharttwo(this.$refs.maboxfive,twodatay,twodata,"本月入库金额统计"); 
		  })
	  }
	  this.loading = false;
	  },
	// 折线图
	initChart(box,datas,datax,text) {
	  this.chart = echarts.init(box)
	  this.chart.setOption({
		  title: {
		      text: text
		    },
		    tooltip: {
		      trigger: 'axis'
		    },
		    legend: {
		      data:datas
		    },
		    grid: {
		      left: '3%',
		      right: '4%',
		      bottom: '3%',
		      containLabel: true
		    },
		    toolbox: {
				   right: '35',
				   feature: {
				     saveAsImage: {},
				   }
		    },
		    xAxis: {
		      type: 'category',
		      boundaryGap: true,
		      data:datax.xaxis.data
		    },
		    yAxis: {
		      type: 'value'
		    },
		    series:datax.series
	    
	  })
	},
	
	// 柱状图
	initCharttwo(box,datas,datax,text) {
	  this.chart = echarts.init(box)
	  this.chart.setOption({
		  title: {
		      text: text
		    },
		    tooltip: {
				appendToBody : true
			},
		    legend: {
		      data:datas
		    },
		    xAxis: {
		      type: 'category',
		      data:datax.xaxis.data
		    },
		    yAxis: {
		      type: 'value'
		    },
		    series:datax.series
	  })
	},
	
	// 工单
	getordertable(){
		if(document.getElementById('tr')){
			orderlist(this.orders).then(e=>{
				  this.ordertable=e.data.items
				  this.orders.total=e.data.total
			})
		}
	}
  },
  // watch:{
	 //  '$route.path'(val){
		//   if(val == '/index'){
		// 	this.earlyWarning()
		// 	this.setInt =  setInterval(() => {
		// 		this.earlyWarning()
		// 	}, 5000)  
		//   }
	 //  }
  // }
};
</script>

<style scoped>
	.home{
		width: 100%;
		height: 100%;
		display: flex;
	}
	.homeleft{
		width: 65%;
	}
	.homeright{
		width: 35%;
		/* border-left: 1px solid #ccc; */
		height: 100%;
	}
	.homeright ul{
		padding: 0;
	}
	.homeright ul, li{
		list-style: none;
		width: 100%;
	}
	.homeright  li{
		display: flex;
		justify-content: space-between;
		padding: 5px 25px;
		font-size: 14px;
		color: #606266;
	}
	/deep/.pagination-container .el-pagination{
		width: 100%;
	}
	/deep/.pagination-container{
		margin-bottom: 70px;
	}
</style>

