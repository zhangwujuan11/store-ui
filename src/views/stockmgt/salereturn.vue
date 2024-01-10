<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
     <el-form-item label="单据编号" prop="orderNo">
       <el-input
         v-model="queryParams.orderNo"
         placeholder="请输入单据编号"
         clearable
         size="small"
         @keyup.enter.native="handleQuery"
       />
     </el-form-item>
	 <el-form-item label="单据日期"  prop="documentDate">
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
	 <el-form-item label="状态" prop="status">
	   <el-select
	   placeholder="请输选状态"
	   clearable
	   v-model="queryParams.status"
	   >
	   <el-option label="暂存" value="0"/>
		 <el-option label="已提交" value="1"/>
		 <el-option label="入库" value="2"/>
	    </el-select>
	 </el-form-item>
     <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['store:outWarehouseReturn:add']"
        >新增</el-button>
      </el-col>
     <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['store:outWarehouseReturn:remove']"
        >删除</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="inWarehouseList">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
	  <el-table-column label="单据状态" align="center" prop="status" >
		  <template slot-scope="scope">
			  {{scope.row.status |  status}}
		  </template>
	  </el-table-column>
      <el-table-column label="单号" align="center" prop="orderNo" show-overflow-tooltip :min-width="150"/>
	  <el-table-column label="单据日期" align="center" prop="documentDate"  :min-width="150"/>
	  <el-table-column label="门店名称" align="center" prop="storeName" show-overflow-tooltip :min-width="100"/>
	  <el-table-column label="往来客户" align="center" prop="customer" show-overflow-tooltip :min-width="100"/>
	  <el-table-column label="票据类型" align="center" prop="billType">
	    <template slot-scope="scope">
			<span>{{ scope.row.billType | billType}}</span>
		  </template>
	   </el-table-column>
	 <!--  <el-table-column label="包装方式" align="center" prop="packagingMethod">
		   <template slot-scope="scope">
			 <dict-tag :options="dict.type.packagingMethod" :value="scope.row.packagingMethod"/>
		   </template>
	   </el-table-column> -->
	   <el-table-column label="配送方式" align="center">
	   		   <template slot-scope="scope">
	   			 <dict-tag :options="dict.type.delivery_method" :value="scope.row.delivery"/>
	   		   </template>
	   </el-table-column>
	   <el-table-column label="结算方式" align="center" prop="paymentTerms">
	   		  <template slot-scope="scope">
	   		  	  <dict-tag :options="dict.type.paymentTerms" :value="scope.row.paymentTerms"/>
	   		  </template>
	    </el-table-column>
	    <el-table-column label="制单人" align="center" prop="createBy"/>  
	 <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip :min-width="150"/>   
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width"  fixed="right" width="200">
        <template slot-scope="scope">
          <el-button
		  v-if="scope.row.status != '2'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['store:outWarehouseReturn:edit']"
          >修改</el-button>
          <el-button
		  v-if="scope.row.status != '2'"
            size="mini"
            type="text"
			style="color: red;"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:outWarehouseReturn:remove']"
          >删除</el-button>
		  <el-button
		   v-if="scope.row.status != '2'"
		    size="mini"
		    type="text"
		    icon="el-icon-s-check"
		  	@click="audit(scope.row)"
		    v-hasPermi="['store:outWarehouseReturn:audit']"
		  >审核通过</el-button>
		  <el-button size="mini" type="text" icon="el-icon-takeaway-box"
		  	v-hasPermi="['store:outWarehouseReturn:print']" @click="goprint(scope.row)">打印</el-button>
		  <el-button
		    size="mini"
		    type="text"
		    icon="el-icon-view"
		  @click="lookdata(scope.row)"
		  >查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
	 <!-- 添加或修改入库对话框 -->
	 <el-dialog :title="title" :visible.sync="$store.state.app.salewareopen" width="90%" :close-on-click-modal="false">
	 <Setfrom :sondata="sondata" :buttontext="buttontext" @transfer="getUser" :look='look'></Setfrom>
	 </el-dialog>

   <!-- 打印 -->
   <el-dialog  :visible.sync="printbox" width="760px" :close-on-click-modal="false">
   	<div class='preview_content2' id="print" ref="print" style="width:100%;">
   		<div style="display: flex;justify-content: space-between;">
   			<div style="width: calc( 100% - 100px);">
   				<div style="display: flex;justify-content: space-between;align-items: center;width:100%;">
   					<img :src="porinttable.logoSrc" style="width: 115px;height: 48px;">
   					<h4 style="width: calc( 100% - 50px );text-align: center;font-weight: 800;font-size: 16px;">{{porinttable.storeName}}</h4>
   				</div>
   				<div style="display: flex;justify-content: space-between;align-items: center;width:100%;">
   					<h4 style="width: 20%;margin: 2px 0;font-size: 13px;">{{porinttable.orderNo}}</h4>
   					<p style="width: 80%;text-align:center;margin: 2px 0;">销售退货单</p>
   				</div>
   				<div style="display: flex;justify-content: space-between;align-items: center;width:100%;">
   					<span>客户：{{porinttable.customer}}</span>
   					<span>销售退货日期：{{ parseTime(porinttable.createTime, '{y}-{m}-{d}') }}</span>
   				</div>
   			</div>
   			<div>
   				<img :src="porinttable.storeQrCode" style="width: 50px;height: 50px;">
   			</div>
   		</div>
   		<div>
   			<!-- <el-table :data="porinttable.detailList" style="width:100%;"   id="printrable">
   				<el-table-column label="编号" align="center" type="index" />
   				<el-table-column label="carg" align="center" prop="carg" />
   				<el-table-column label="产品" align="center" prop="productName" />
   				<el-table-column label="库位" align="center" prop="positionCode" />
   				<el-table-column label="单位" align="center" prop="unit" />
   				<el-table-column label="总数量" align="center" prop="quantity" />
   				<el-table-column label="单价" align="center" prop="price" />
   				<el-table-column label="金额" align="center"  prop="totalPrice" />
   			</el-table> -->
			<table border="0" cellspacing="0" style="width: 100%;" id="printrable">
				<th>编号</th>
				<th>carg</th>
				<th>产品</th>
				<th>库位</th>
				<th>单位</th>
				<th>总数量</th>
				<th>单价</th>
				<th>金额</th>
				<tr v-for="(item,index) in porinttable.detailList" :key="index">
					<td>{{index + 1}}</td>
					<td>{{item.carg}}</td>
					<td>{{item.productName}}</td>
					<td>{{item.positionCode}}</td>
					<td>{{item.unit}}</td>
					<td>{{item.quantity}}</td>
					<td>{{item.price}}</td>
					<td>{{item.totalPrice}}</td>
				</tr>
			</table>
   			<p style="border:1px solid black;margin: 0;padding:5px 10px;border-top: 0;">
   				<span style="margin-right: 50px;">产品合计：{{porinttable.productAmount}}</span>
   				<span>合计金额：{{porinttable.totalAmountInWords}}</span>
   			</p>
   			<p style="border:1px solid black;margin: 0;padding:5px 10px;border-top: 0;">备注：{{porinttable.remark}}</p>
   		</div>
   		<p  style="display: flex;justify-content: left;align-items: center;">
   			<span style="display: block;width: 70%;">订货电话：{{porinttable.orderPhoneNumber}}</span> 
   			<span>制单人：{{porinttable.createBy}}</span>
   		</p>
   		<p style="display: flex;justify-content: left;align-items: center;">
   			<span style="display: block;width: 70%;">订货地址：{{porinttable.orderingAddress}}</span> 
   			<span>收货人（签字）：</span>
   		</p>
   	</div>
   	<el-button type='primary' size="large" v-print="printObj" style="width: 150px"> 打印</el-button>
   </el-dialog>
   
  </div>
</template>

<script>
import { listOutWarehouse } from "@/api/store/outWarehouse";
// import { salelist, delsalelist, checksaleware } from "@/api/stockmgt";
import { salereturnlist, salereturndetel, salereturncheck } from "@/api/stockmgt";
import { printouthose} from "@/api/store/inventory";

import Setfrom from "@/components/Warehouse/salereturnform.vue"

export default {
  dicts: ['paymentTerms','delivery_method',"packagingMethod"],
  filters:{
	  billType(e){
		  if(e == 0){
			  return '普通发票'
		  }else if(e==1){
			  return '其他'
		  }else if(e==2){
			  return '指定物流'
		  }else{
			  return '其他备注'
		  }
	  },
	  status(e){
		  if(e == 1){
			  return '已提交'
		  }else if(e== 2){
			  return '入库'
		  }else if(e == 0){
			  return '暂存'
		  }
	  }
  },
  components:{
	  Setfrom
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
      // 入库表格数据
      inWarehouseList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
	  daterangeEstimatedDelivery:[],
      // 备注时间范围
      daterangeShelveDate: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNo: null,
        paymentTerms: null,
        orderCategory: null,
        vendorCode: null,
        vendorName: null,
        warehouseCode: null,
        warehouseName: null,
        shelveBy: null,
        shelveUser: null,
        shelveDate: null,
        status: null,
		startDate:'',
		endDate:''
      },
	  // 修改表单的数据
	  sondata:null,
	  buttontext:true,
	  look:false,
	  // 打印
	  	printObj: {
	            id: 'print',
	            popTitle: ' ', // 打印的标题
	            extraCss: ' ', // 打印可引入外部的一个 css 文件
	            beforeEntryIframe () {
	              const cells = document.querySelectorAll('.cell')
	              for (let k7 = 0; k7 < cells.length; k7++) {
	                const cell = cells[k7]
	                // 在这里添加样式只是修改了打印的样式，不会污染原页面的样式
	                // 为了让表格中的内容自动换行，不需要的话可以删掉
	                cell.style.whiteSpace = 'pre-wrap' 
	    
	              }
	            }
	          },
	  
	  porinttable:[],
	  printbox:false
    };
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
    /** 查询入库列表 */
    getList() {
      this.loading = true;
      salereturnlist(this.queryParams).then(response => {
        this.inWarehouseList = response.data.items;
        this.total = response.data.total;
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
      this.daterangeShelveDate = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
	/** 新增按钮操作 */
	handleAdd(){
	    this.$store.state.app.salewareopen=true
	    this.title = "新增销售退货";
		this.buttontext = true
		this.look=false
	},
	/** 修改按钮操作 */
	handleUpdate(row) {
	  const outWarehouseId = row.outWarehouseId
	  this.sondata=outWarehouseId
	  this.$nextTick(()=>{
	  	this.$store.state.app.salewareopen=true
		this.buttontext = false
		this.title = "修改销售退货";
		this.look=false
	  })
	},
	// 查看详情
	lookdata(row){
		const outWarehouseId = row.outWarehouseId
		this.sondata=outWarehouseId
		this.$nextTick(()=>{
			this.$store.state.app.salewareopen=true
		this.buttontext = false
		this.title = "销售退货详情";
		this.look=true
		})
	},
	
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.outWarehouseId)
		this.orders = selection.map(item => item.orderNo)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const inWarehouseIds = row.outWarehouseId || this.ids;
	  const abc= row.orderNo || this.orders
      this.$modal.confirm('是否确认删除单号为"' + abc + '"的数据项？').then(function() {
        return salereturndetel(inWarehouseIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
	
	// 子组件接收值
	getUser(msg){
		this.sondata=msg
	},
	// 审核
	audit(i){
		this.$modal.confirm('是否确认通过订单号为"' + i.orderNo + '"的审核？').then(function() {
		  return salereturncheck({
			  "outWarehouseId":  i.outWarehouseId
			 })
		}).then(() => {
		  this.getList();
		  this.$modal.msgSuccess("审核通过成功");
		}).catch(() => {});
	},
	// 打印
	goprint(i){
		printouthose(i.outWarehouseId).then(res=>{
			this.porinttable=res.data
			this.printbox=true
		})
	}
  }
 
};
</script>
<style scoped>
	/* 打印 */
	/* /deep/#print .el-table .cell{
		padding-left: 0;
		padding-right: 0;
	}
	/deep/#print .el-table--medium .el-table__cell{
		padding: 0;
	}
	 /deep/ #printrable{
	        table-layout: auto !important;
			font-size: 12px;
	    }
	    /deep/ #printrable .el-table__header-wrapper .el-table__header{
	        width: 100% !important;
	    }
	    /deep/ #printrable .el-table__body-wrapper .el-table__body{
	        width: 100% !important;
	    }
	    /deep/ #pagetable  #printrable{
	        table-layout: fixed !important;
	    } */
		#print{
			font-size: 13px;
		}
		#print table{
			border: 1px solid black;
			border-right: 0;
			margin-top: 10px;
		}
		#print td{
			text-align: center;
			border-right: 1px solid black;
			border-top: 1px solid black;
		}
		#print th{
			border-right: 1px solid black;
		}
		  {
		    margin-left: 0px;
		  }
</style>
