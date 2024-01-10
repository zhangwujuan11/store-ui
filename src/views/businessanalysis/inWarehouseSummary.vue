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
          v-hasPermi="['store:inWarehouse:export']"
        >导出</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="inventoryTransferList">
		<el-table-column label="单号" align="center" prop="orderNo" />
		<!-- <el-table-column label="结算方式" align="center" prop="paymentTerms">
				  <template slot-scope="scope">
				  	<dict-tag :options="dict.type.paymentTerms" :value="scope.row.paymentTerms"/>
				  </template>
		</el-table-column> -->
		<el-table-column label="单据类别" align="center" prop="orderCategory">
				  <template slot-scope="scope">
				  	{{scope.row.orderCategory | orderCategory}}
				  </template>
		</el-table-column>
		<el-table-column label="产品名称" align="center" prop="productName" />
		<el-table-column label="crag" align="center" prop="carg" />
		<el-table-column label="价格" align="center" prop="price" />
		<el-table-column label="数量" align="center" prop="receivalQuantity" />
		<el-table-column label="供应商编码" align="center" prop="vendorCode" />
		<el-table-column label="供应商名称" align="center" prop="vendorName" />
		<el-table-column label="门店编码" align="center" prop="warehouseCode" />
		<el-table-column label="门店名称" align="center" prop="warehouseName" />
		<el-table-column label="折率" align="center" prop="discountRate" />
		<el-table-column label="创建时间" align="center" prop="createTime" width="180">
		  <template slot-scope="scope">
		    <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
		  </template>
		</el-table-column>
		<el-table-column label="状态" align="center" prop="status">
				  <template slot-scope="scope">
				      <span>{{scope.row.status |status}}</span>
				    </template>
				</el-table-column>
    </el-table>
	<pagination v-show="outqueryParams.total>0" :total="outqueryParams.total"
		:page.sync="outqueryParams.pageNum" :limit.sync="outqueryParams.pageSize" @pagination="getList"
		style="bottom:5px;" />
  </div>
</template>

<script>
import { inWarehouseSummary, inWarehouseProductAmount, exportinWarehouseSummary } from "@/api/busine";
import * as echarts from 'echarts';
export default {
	dicts: ['paymentTerms'],
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
	  inWarehouseSummary(this.outqueryParams).then(res=>{
		  this.inventoryTransferList=res.data.items
			this.outqueryParams.total=res.data.total
		   this.loading = false;
	  })
	  inWarehouseProductAmount({"date":this.outqueryParams.date}).then(response=>{
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
		      text: '入库明细汇总'
		    },
		    tooltip: {},
		    legend: {
		      data:this.ydatas
		    },
		    // grid: {
		    //   left: '3%',
		    //   right: '4%',
		    //   bottom: '3%',
		    //   containLabel: true
		    // },
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

    // /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
	/** 导出按钮操作 */
	handleExport() {
	  this.$modal.confirm('是否确认导出所有入库汇总数据？').then(() => {
	    this.exportLoading = true;
	    return exportinWarehouseSummary();
	  }).then(response => {
	    this.$download.name(response.data);
	    this.exportLoading = false;
	  }).catch(() => {});
	},
  }
}
</script>
