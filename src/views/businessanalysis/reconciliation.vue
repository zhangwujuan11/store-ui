<template>
  <div class="app-container">
         <el-form :model="queryParams" ref="queryParams" :inline="true" v-show="showSearch" label-width="68px">
		   <el-form-item label="业务门店" prop="phone">
		    <el-input
		      v-model="queryParams.storeName"
		      placeholder="请输入业务门店"
		      clearable
		      size="small"
		      @keyup.enter.native="handleQuery"
		    />
		   </el-form-item>
          <el-form-item label="往来客户" prop="name">
            <el-input
              v-model="queryParams.customer"
              placeholder="请输入客户名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
           </el-form-item>
          <el-form-item label="日期">
            <el-date-picker
              v-model="daterangeEstimatedDelivery"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
          		 @change="changetime"
            ></el-date-picker>
          </el-form-item>
           <el-form-item>
             <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
             <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button> -->
           </el-form-item>
         </el-form>

         <el-row :gutter="10" class="mb8">
			 <el-col :span="1.5">
			    <el-button
			 	 type="primary"
			 	 plain
			 	 icon="el-icon-upload"
			 	 size="mini"
				 v-hasPermi="['store:customer:import']"
			 	 @click="mportdata"
			    >导出客户对账汇总</el-button>
			  </el-col>
			  <el-col :span="1.5">
			     <el-button
			  	 type="info"
			  	 plain
			  	 icon="el-icon-upload"
			  	 size="mini"
				 v-hasPermi="['store:customer:import']"
			  	 @click="handleExport"
			     >导出往来客户明细</el-button>
			   </el-col>
           <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
         </el-row>

         <el-table v-loading="loading" :data="typeDataList">
           <!-- <el-table-column type="selection" width="55" align="center" /> -->
           <el-table-column label="业务门店"  align="center" prop="storeName" />
           <el-table-column label="往来客户" align="center" prop="customer" width="200"/>
           <el-table-column label="累计销售金额" align="center" prop="saleAmount" />
           <el-table-column label="累计退货金额" align="center" prop="returnAmount" />
           <el-table-column label="总计"  align="center" prop="totalAmount" />
         </el-table>

         <pagination
           v-show="total>0"
           :total="total"
           :page.sync="queryParams.pageNum"
           :limit.sync="queryParams.pageSize"
           @pagination="getList"
         />


  </div>
</template>

<script>
import { reconciliation ,exportkehu, exportwagnlai} from "@/api/busine";
import { getToken } from "@/utils/auth";
export default {
  name: "TypeData",
	filters:{
		status(e){
			if(e == 0){
				return '正常'
			}else if(e == 1){
				return '禁用'
			}
		}
	},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
	  orders:[],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 基础参数数据表格数据
      typeDataList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        storeName: '',//业务门店，往来客户
		customer:''
      },
      // 表单参数
      form: {
        status:'0'
      },
	  daterangeEstimatedDelivery:[],
      // 表单校验
      rules: {
        classifyId: [
          { required: true, message: "分类不能为空", trigger: "blur" }
        ],
        credit: [
          { required: true, message: "信用度不能为空", trigger: "blur" },
			{
				pattern:/^[+]{0,1}(\d+)$/,
				message: "格式不正确,默认正整数",
				trigger: "blur"}
        ],
        customerAddress: [
          { required: true, message: "地址不能为空", trigger: "blur" }
        ],
        // customerBank: [
        //   { required: true, message: "银行不能为空", trigger: "blur" }
        // ],
    //     customerBankAccount: [
    //       { required: true, message: "银行卡不能为空", trigger: "blur" },
        // customerBankAccount: [
        //   { required: true, message: "银行卡不能为空", trigger: "blur" },
		  // {
		  //    pattern: /^([1-9]{1})(\d{14}|\d{18})$/,
		  //    message: "输入正确的银行卡号",
		  //    trigger: "blur",
		  // }
    //     ],
        // ],
      
        phone: [
          { required: true, message: "电话不能为空", trigger: "blur" }
        ],
        // principal: [
        //   { required: true, message: "主营不能为空", trigger: "blur" }
        // ],
        salesRate: [
          { required: true, message: "销售折扣不能为空", trigger: "blur" },
		  {
			pattern:/^(0|([1-9][0-9]*))(\.[\d]{1,2})?$/,
			message: "格式不正确",
			trigger: "blur"}
        ],
        shorterName: [
          { required: true, message: "简称不能为空", trigger: "blur" }
        ]
      },
      typeId:'',
      isbale:false,
      optionone:[],
      optionxiaoqu:[],
      optiondaqu:[],
      optionxianqu:[],
      optionshenqu:[],
      optionpianqu:[],
      optionzhuantai:[],
      optionfenlei:[],
      op1:'',
      op2:'',
      op3:'',
      op4:'',
      op5:'',
      op6:'',
      op7:'',
	  // 用户导入参数
	  // upload: {
	  //   open: false,
	  //   title: "",
	  //   headers: { Authorization: "Bearer " + getToken() },
	  //   url: process.env.VUE_APP_BASE_API + "/v1/store/customer/importData"
	  // },
    }
  },
  created() {
    this.getList();
  },
  methods: {
	  // 查询时间改变时
	  changetime(){
		  if(this.daterangeEstimatedDelivery){
			  this.queryParams.startDate=this.daterangeEstimatedDelivery[0]
			  this.queryParams.endDate=this.daterangeEstimatedDelivery[1]
		  }else{
			  this.queryParams.startDate=""
			  this.queryParams.endDate=""
		  }
	  },

    /** 查询基础参数数据列表 */
    getList() {
      this.loading = true;
      reconciliation(this.queryParams).then(response => {
        this.typeDataList = response.data.items;
        this.total = response.data.total
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryParams");
      this.handleQuery();
    },
	
	// 导出
	mportdata(){
		const queryParams = this.queryParams;
		queryParams.pageNum=1000000
		this.$modal.confirm('是否确认导出客户对账汇总数据？').then(() => {
		  return exportkehu(queryParams);
		}).then(response => {
		  this.$download.name(response.data);
		}).catch(() => {});
	},
	handleExport(){
		const queryParams = this.queryParams;
		queryParams.pageNum=1000000
		this.$modal.confirm('是否确认导出往来客户明细数据？').then(() => {
		  return exportwagnlai(queryParams);
		}).then(response => {
		  this.$download.name(response.data);
		}).catch(() => {});
	}
  }
};
</script>
<style scoped>
  .maincon{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
  }
  .leftbox{
    padding: 10px 10px 0 0px;
    width: 199px;
    box-sizing: border-box;
  }
  .rightbox{
    width: calc(100% - 200px);
  }
  /deep/.el-form-item__label{
    font-size: 12px;
  }
  /deep/.el-radio-group{
    margin-bottom: 12px;
    padding-left: 12px;
    box-sizing: border-box;
  }
  .formtitle{
    padding-left: 15px;
    box-sizing: border-box;
  }
  /deep/.el-radio{
    margin-right: 10px;
  }
	.fromflex{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	.fromflex .el-form-item{
		width: 48%;
	}
</style>
