<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="盘点单号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入盘点单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="保存" :value="0" />
		  <el-option label="分析库存完成" :value="1" />
		  <el-option label="完成" :value="2" />
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
          @click="mportdata"
          v-hasPermi="['store:taking:import']"
        >导入盘点</el-button>
      </el-col>
    <!--  <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['store:taking:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['store:taking:remove']"
        >删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['store:taking:export']"
        >导出门店库存</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="takingList">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column label="id" align="center" prop="storeTakingId" /> -->
      <el-table-column label="盘点单号" align="center" prop="orderNo" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="状态" align="center" prop="status">
		  <template slot-scope="scope">
			  {{scope.row.status | status}}
		  </template>
	  </el-table-column>
      <el-table-column label="创建人" align="center" prop="createBy" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
	  <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip :min-width="150"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width"  fixed="right">
        <template slot-scope="scope">
          <el-button
			v-if="scope.row.status == 0" 
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['store:taking:edit']"
          >修改</el-button>
          <el-button
		  v-if="scope.row.status == 0" 
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
			 style="color: red;"
            v-hasPermi="['store:taking:remove']"
          >删除</el-button>
		  <el-button
		  v-if="scope.row.status != 2"
		    size="mini"
		    type="text"
		    icon="el-icon-takeaway-box"
		    @click="analysis(scope.row)"
		    v-hasPermi="['store:taking:analysis']"
		  >分析盘点数据</el-button>
		  <el-button
		  v-if="scope.row.status == 1"
		    size="mini"
		    type="text"
		    icon="el-icon-document-checked"
		    @click="generateStore(scope.row)"
		    v-hasPermi="['store:taking:generateStore']"
		  >生成出入库单子</el-button>
		  <el-button
		    size="mini"
		    type="text"
		    icon="el-icon-document-checked"
		    @click="look(scope.row)"
		  >操作日志</el-button>
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

    <!-- 修改盘点对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="80%" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="盘点单号" prop="orderNo">
          <el-input v-model="form.orderNo" placeholder="请输入盘点单号" disabled/>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" :disabled="!detaildata"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入内容" :disabled="!detaildata"/>
        </el-form-item>
		<el-table :data="form.takingDetailList">
		<el-table-column label="门店名称" align="center" prop="warehouseName" />
		  <el-table-column label="商家名称" align="center" prop="vendorName" />
		  <el-table-column label="carg" align="center" prop="carg" />
		<el-table-column label="产品名称" align="center" prop="productName" />
		<el-table-column label="单位" align="center" prop="unit" />
		  <el-table-column label="库存数量" align="center" prop="inventoryQuantity" />
		  <el-table-column label="单价" align="center" prop="price" />
		  <el-table-column label="状态" align="center" prop="status">
			  <template slot-scope="scope">
				  {{scope.row.status | type}}
			  </template>
		  </el-table-column>
		  <el-table-column label="备注" align="center" prop="remark">
		  <template slot-scope="scope">
			  <el-input v-if="detaildata" v-model="scope.row.remark"></el-input>
			   <span  v-if="!detaildata">{{scope.row.remark}}</span>
		  </template>
		</el-table-column>
		  <el-table-column label="库位" align="center" prop="positionCode" width="120">
			  <template slot-scope="scope">
				  <el-input v-if="detaildata" v-model="scope.row.positionCode"></el-input>
				  <span v-if="!detaildata">{{scope.row.positionCode}}</span>
			  </template>
		  </el-table-column>
		  <el-table-column label="盘点数量" align="center" prop="quantity">
			  <template slot-scope="scope">
				  <el-input v-if="detaildata" v-model="scope.row.quantity" type="number"></el-input>
				   <span v-if="!detaildata">{{scope.row.quantity}}</span>
			  </template>
			</el-table-column>
		</el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm"  v-if="detaildata">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
	
	<!-- 盘点导入 -->
	<el-dialog title="盘点数据导入" :visible.sync="upload.open" width="400px" append-to-body :close-on-click-modal="false">
	  <el-upload
	    ref="upload"
	    :limit="1"
	    accept=".xlsx, .xls"
	    :headers="upload.headers"
	    :action="upload.url"
	    :disabled="upload.isUploading"
	    :on-progress="handleFileUploadProgress"
	    :on-success="handleFileSuccess"
	    :auto-upload="false"
	    drag
	  >
	    <i class="el-icon-upload"></i>
	    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
	    <div class="el-upload__tip text-center" slot="tip">
	      <span>仅允许导入xls、xlsx格式文件。</span>
	    </div>
	  </el-upload>
	  <div slot="footer" class="dialog-footer">
	    <el-button type="primary" @click="submitFileForm">确 定</el-button>
	    <el-button @click="upload.open = false">取 消</el-button>
	  </div>
	</el-dialog>
  </div>
</template>
<script>
import { listTaking, getTaking, delTaking, addTaking, updateTaking, exportTaking, takinganalysis, takinggenerateStore } from "@/api/store/taking";
import { getToken } from "@/utils/auth";
export default {
  name: "Taking",
  filters:{
	  status(e){
		  if(e == 0){
			  return '保存'
		  }else if(e == 1){
			  return '分析库存完成'
		  }else if(e == 2){
			  return '完成'
		  }
	  },
	  type(e){
		  if(e=='0'){
			  return '待分析'
		  }else if(e=='1'){
			  return '盘盈'
		  }else if(e=='2'){
			   return '盘亏'
		  }else if(e=='3'){
			   return '正常'
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
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 盘点表格数据
      takingList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNo: null,
        title: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        orderNo: [
          { required: true, message: "盘点单号不能为空", trigger: "blur" }
        ],
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态(0保存，1分析库存完成，2完成不能为空", trigger: "blur" }
        ],
      },
	  // 用户导入参数
	  upload: {
	    open: false,
	    title: "",
	    headers: { Authorization: "Bearer " + getToken() },
	    url: process.env.VUE_APP_BASE_API + "/v1/store/taking/importData"
	  },
	  
	  selectedtable:[],
	  detaildata:true
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询盘点列表 */
    getList() {
      this.loading = true;
      listTaking(this.queryParams).then(response => {
        this.takingList = response.data.items;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        storeTakingId: null,
        orderNo: null,
        title: null,
        status: "0",
        remark: null,
        tenantId: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      };
      this.resetForm("form");
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
	
	
	
	// 添加
 // 文件上传中处理
 handleFileUploadProgress(event, file, fileList) {
   this.upload.isUploading = true;
 },
 // 文件上传成功处理
 handleFileSuccess(response, file, fileList) {
   this.upload.open = false;
   this.upload.isUploading = false;
   this.$refs.upload.clearFiles();
   this.$alert(response.data , { dangerouslyUseHTMLString: true });
   this.getList();
 },
 
 // 导入按钮
 mportdata(){
 	this.upload.open = true;
 },
 // 提交上传文件
 submitFileForm() {
   this.$refs.upload.submit();
 },
 
 // 分析盘点数据
analysis(i){
	 this.loading = true;
	takinganalysis({
		"storeTakingId": i.storeTakingId
	}).then(res=>{
		this.$modal.msgSuccess("分析成功");
		this.loading = false;
		 this.getList();
	})
},

// 生成出入库单子
generateStore(i){
	this.loading = true;
	takinggenerateStore({
		"storeTakingId": i.storeTakingId
	}).then(res=>{
		this.$modal.msgSuccess("生成出入库单子成功");
		this.loading = false;
		 this.getList();
	})
},
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const storeTakingId = row.storeTakingId
      getTaking(storeTakingId).then(response => {
        this.form = response.data;
        this.open = true;
		 this.detaildata=true
        this.title = "修改盘点";
      });
    },
	
	// 查看详情
	look(i){
	this.reset();
	const storeTakingId = i.storeTakingId
	getTaking(storeTakingId).then(response => {
	  this.form = response.data;
	  this.detaildata=false
	  this.open = true;
	  this.title = "盘点详情";
	});	
	},
	
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
            updateTaking(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const storeTakingIds = row.storeTakingId || this.ids;
      this.$modal.confirm('是否确认删除盘点编号为"' + storeTakingIds + '"的数据项？').then(function() {
        return delTaking(storeTakingIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.$modal.confirm('是否确认导出门店库存？').then(() => {
        this.exportLoading = true;
        return exportTaking();
      }).then(response => {
        this.$download.name(response.data);
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
