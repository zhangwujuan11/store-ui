<template>
  <div class="app-container">
	  <div ref="mabox" style="width: 100%;height: 300px;margin-bottom: 50px;"></div>
		<el-form :model="outqueryParams" ref="queryForm" :inline="true"  label-width="68px">
		  <el-form-item label="月份" prop="status">
		    <el-date-picker
		         v-model="outqueryParams.date"
		         type="month"
				  format="yyyy - MM"
				   value-format="yyyy-MM"
		         placeholder="选择月">
		       </el-date-picker>
		  </el-form-item>
		  <el-form-item>
		    <el-button type="primary" icon="el-icon-search" size="mini" @click="getList">搜索</el-button>
		  </el-form-item>
		</el-form>
    <el-row :gutter="10" class="mb8">
     <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['store:inWarehouseAmount:export']"
        >导出</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="inventoryTransferList">
		<el-table-column label="门店名称" align="center" prop="name" />
		<el-table-column label="入库金额" align="center" prop="money" />
    </el-table>
	<pagination v-show="outqueryParams.total>0" :total="outqueryParams.total"
		:page.sync="outqueryParams.pageNum" :limit.sync="outqueryParams.pageSize" @pagination="getList"
		style="bottom:5px;" />
  </div>
</template>

<script>
import { isticallist, inmoneypicture, exportisticallist } from "@/api/busine";
import * as echarts from 'echarts';
export default {
	filters:{
		  orderCategory(e){
			  if(e == "1"){
				  return '常规入库'
			  }else{
				  return "采购入库"
			  }
		  },
		  status(e){
			  if(e == 1){
				  return '待审核'
			  }else if(e==0){
				  return '保存'
			  }else if(e== 2){
				  return "入库"
			  }
		  }
	},
  data() {
    return {
      // 遮罩层
      loading: true,
      exportLoading: false,
	  outqueryParams:{
		  total:0,
		  pageNum:1,
		  pageSize:10,
		  date:''
	  },
      // 移库/调拨表格数据
      inventoryTransferList: [],
      // 查询参数
	  rchartdaya:[],
	  ydatas:[]
    };
  },
  mounted() {
	  let date = new Date();
	  let year = date.getFullYear();
	  let month = date.getMonth()+1;
	  this.outqueryParams.date= year +'-' +  month
  	 this.getList();
  },
  methods: {
    /** 查询移库/调拨列表 */
    getList() {
      this.loading = true;
	  this.ydatas=[]
	  isticallist(this.outqueryParams).then(res=>{
		  this.inventoryTransferList=res.data.items
			this.outqueryParams.total=res.data.total
		   this.loading = false;
	  })
	  inmoneypicture({"date":this.outqueryParams.date}).then(response=>{
	    this.rchartdaya=response.data
	  	this.rchartdaya.series.map(item=>{
	  		this.ydatas.push(item.name)
	  		item.type= 'bar'
			item.barWidth= "30%"
	  	})
	  	 this.initChart();
	  })
    },
	// 折线图
	initChart() {
	  this.chart = echarts.init(this.$refs.mabox)
	  this.chart.setOption({
		  title: {
		      text: '入库金额'
		    },
		    tooltip: {},
		    legend: {
		      data:this.ydatas
		    },
		    xAxis: {
		      type: 'category',
		      data:this.rchartdaya.xaxis.data
		    },
		    yAxis: {
		      type: 'value'
		    },
		    series:this.rchartdaya.series
	  })
	},
	/** 导出按钮操作 */
	handleExport() {
	  this.$modal.confirm('是否确认导出所有入库汇总数据？').then(() => {
	    this.exportLoading = true;
	    return exportisticallist({"date":this.outqueryParams.date});
	  }).then(response => {
	    this.$download.name(response.data);
	    this.exportLoading = false;
	  }).catch(() => {});
	},
  }
}
</script>
