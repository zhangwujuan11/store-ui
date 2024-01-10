<template>
  <div class="app-container">
	  <div ref="mabox" style="width: 100%;height: 300px;margin-bottom: 50px;"></div>
 <!--   <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="120px">
      <el-form-item label="移入门店名称" prop="inTenantName">
        <el-input
          v-model="queryParams.inTenantName"
          placeholder="请输入移入门店名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
     <el-form-item label="单据编号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入单据编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单据类型" prop="orderType">
        <el-select v-model="queryParams.orderType" placeholder="请选择单据类型" clearable size="small">
          <el-option label="移库" value="1" />
		  <el-option label="调拨" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="经办人" prop="agentUser">
        <el-input
          v-model="queryParams.agentUser"
          placeholder="请输入经办人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="保存" value="0" />
		   <el-option label="完成" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery" >重置</el-button>
      </el-form-item>
    </el-form> -->

    <el-row :gutter="10" class="mb8">
     <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['store:reportForms:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="inventoryTransferList">
		<el-table-column label="月份" align="center" prop="month" />
		<el-table-column label="今年销售额" align="center" prop="salesRevenueThisYear" />
		<el-table-column label="去年销售额" align="center" prop="lastYearsSales" />
    </el-table>
  </div>
</template>

<script>
import { annual, annualMonthlyReport, exportInventory } from "@/api/busine";

// import echarts from 'echarts'
import * as echarts from 'echarts';
export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      exportLoading: false,
      // 总条数
      total: 0,
      // 移库/调拨表格数据
      inventoryTransferList: [],
      // 查询参数
	  rchartdaya:[],
	  ydatas:[]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询移库/调拨列表 */
    getList() {
      this.loading = true;
	  this.ydatas=[]
	  annual().then(res=>{
		  this.rchartdaya=res.data
			this.rchartdaya.series.map(item=>{
				this.ydatas.push(item.name)
				item.type= 'line'
			})
			 this.initChart();
			 annualMonthlyReport().then(res=>{
				 this.inventoryTransferList=res.data
			 })
		   this.loading = false;
	  })
    },
	// 折线图
	initChart() {
	  this.chart = echarts.init(this.$refs.mabox)
	  this.chart.setOption({
		  title: {
		      text: '出库销售统计'
		    },
		    tooltip: {
		      trigger: 'axis'
		    },
		    legend: {
		      data:this.ydatas
		    },
		    grid: {
		      left: '3%',
		      right: '4%',
		      bottom: '3%',
		      containLabel: true
		    },
		    toolbox: {
		      feature: {
		        saveAsImage: {}
		      }
		    },
		    xAxis: {
		      type: 'category',
		      boundaryGap: false,
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
	  this.$modal.confirm('是否确认导出所有库存数据项？').then(() => {
	    this.exportLoading = true;
	    return exportInventory();
	  }).then(response => {
	    this.$download.name(response.data);
	    this.exportLoading = false;
	  }).catch(() => {});
	},
  }
}
</script>
