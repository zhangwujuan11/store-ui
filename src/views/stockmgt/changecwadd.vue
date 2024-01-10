<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="120px">
      <el-form-item label="移入门店名称" prop="inWarehouseName">
        <el-input
          v-model="queryParams.inWarehouseName"
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
          <el-option label="移库" :value="1" />
		  <el-option label="调拨" :value="2" />
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
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['store:inventoryTransfer:add']"
        >新增</el-button>
      </el-col>
     <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['store:inventoryTransfer:edit']"
        >修改</el-button>
      </el-col> -->
    <!--  <el-col :span="1.5">
        <el-button
          type="danger"
          plain
			style="color: red;"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['store:inventoryTransfer:remove']"
        >删除</el-button>
      </el-col> -->
     <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['store:inventoryTransfer:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="inventoryTransferList">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
			<el-table-column label="单号" align="center" prop="orderNo" show-overflow-tooltip :min-width="150"/>
			<el-table-column label="单据类型" align="center" prop="orderType">
			  <template slot-scope="scope">
			  	<span>{{ scope.row.orderType | orderType}}</span>
			    </template>
			</el-table-column>
      <el-table-column label="移入门店编码" align="center" prop="inWarehouseCode"  show-overflow-tooltip :min-width="150"/>
      <el-table-column label="移入门店名称" align="center" prop="inWarehouseName"  show-overflow-tooltip :min-width="150"/>
	  <el-table-column label="移出门店编码" align="center" prop="outWarehouseCode"  show-overflow-tooltip :min-width="180"/>
      <el-table-column label="移出门店名称" align="center" prop="outWarehouseName"  show-overflow-tooltip :min-width="150"/>
      <el-table-column label="经办人" align="center" prop="agentUser" />
      <el-table-column label="状态" align="center" prop="status">
		  <template slot-scope="scope">
		    <span>{{ scope.row.status | status}}</span>
		  </template>
		</el-table-column>
		<el-table-column label="创建时间" align="center" prop="createTime"  show-overflow-tooltip :min-width="180"/>
      <el-table-column label="备注" align="center" prop="remark"  show-overflow-tooltip :min-width="150"/>
      <el-table-column label="操作" align="center" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button
		    v-if="scope.row.status == '0'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['store:inventoryTransfer:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
			 v-if="scope.row.status == '0'"
            @click="handleDelete(scope.row)"
			 style="color:red"
            v-hasPermi="['store:inventoryTransfer:remove']"
          >删除</el-button>
		<el-button
		 v-if="scope.row.status == '0'"
		  size="mini"
		  type="text"
		  icon="el-icon-s-check"
			@click="audit(scope.row)"
		  v-hasPermi="['store:inventoryTransfer:audit']"
		>审核通过</el-button>
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

    <!-- 添加或修改移库/调拨对话框 -->
    <el-dialog :title="title" :visible.sync="$store.state.app.cahngewarehouseopen" width="90%" append-to-body :close-on-click-modal="false">
      <Setfrom  :sondata="sondata" :buttontext="buttontext" @transfer="getUser" :look='look'></Setfrom>
    </el-dialog>
  </div>
</template>

<script>
import { listInventoryTransfer, delInventoryTransfer, checkaudit } from "@/api/store/inventoryTransfer";
import Setfrom from "@/components/Warehouse/changefrom.vue"
export default {
  name: "InventoryTransfer",
  filters:{
	  orderType(e){
		if(e == 1){
			return '移库'
		}else{
			return '调拨'
		}
	  },
	  status(e){
		  if(e == "1"){
			  return '完成'
		  }else if(e == '0'){
			  return '保存'
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
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 移库/调拨表格数据
      inventoryTransferList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        queryParams: null,
        orderType: null,
        orderNo: null,
        agentUser: null,
        status: null,
      },
	  sondata:null,
	  buttontext:true,
	  look:false,
	  orders:[]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询移库/调拨列表 */
    getList() {
      this.loading = true;
      listInventoryTransfer(this.queryParams).then(response => {
        this.inventoryTransferList = response.data.items;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.$store.state.app.cahngewarehouseopen = false;
      this.reset();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.inventoryTransferId)
	  this.orders = selection.map(item => item.orderNo)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$store.state.app.cahngewarehouseopen = true;
      this.title = "添加移库/调拨";
	  this.buttontext = true
	   this.look=false
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const inventoryTransferId = row.inventoryTransferId
	  this.sondata=inventoryTransferId
	  this.$store.state.app.cahngewarehouseopen = true;
	  this.buttontext = false
	  this.title = "修改移库/调拨";
	   this.look=false
    },
	lookdata(row){
		const inventoryTransferId = row.inventoryTransferId
		this.sondata=inventoryTransferId
		this.$store.state.app.cahngewarehouseopen = true;
		this.buttontext = false
		this.title = "移库/调拨详情";
		this.look=true
	},
	// 子组件接收值
	getUser(msg){
		this.sondata=msg
	},
	/** 删除按钮操作 */
	handleDelete(row) {
	  const inventoryTransferIds = row.inventoryTransferId || this.ids;
	  const abc =row.orderNo || this.orders;
	  this.$modal.confirm('是否确认删除移库/调拨编号为"' + abc + '"的数据项？').then(function() {
	    return delInventoryTransfer(inventoryTransferIds);
	  }).then(() => {
	    this.getList();
	    this.$modal.msgSuccess("删除成功");
	  }).catch(() => {});
	},
	
	// 审核
	audit(i){
		this.$modal.confirm('是否确认通过订单号为"' + i.orderNo + '"的审核？').then(function() {
		  return checkaudit(i.inventoryTransferId)
		}).then(() => {
		  this.getList();
		  this.$modal.msgSuccess("审核通过成功");
		}).catch(() => {});
	},
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有移库/调拨数据项？').then(() => {
        this.exportLoading = true;
        return exportInventoryTransfer(queryParams);
      }).then(response => {
        this.$download.name(response.msg);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
<style scoped>
	  {
	    margin-left: 0px;
	  }
</style>

