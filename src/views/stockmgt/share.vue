<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="carg" prop="carg">
        <el-input
          v-model="queryParams.carg"
          placeholder="请输入carg"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产品名称" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入产品名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="库位编码" prop="positionCode">
        <el-input
          v-model="queryParams.positionCode"
          placeholder="请输入库位编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
			<el-form-item label="分类" prop="delivery">
				<el-select placeholder="请选择分类" clearable v-model="queryParams.classify">
					<el-option  v-for="(dict,index) in dict.type.classification" :key="index"
						:label="dict.label" :value="dict.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="拼音查找" prop="pinyin">
			  <el-input
				v-model="queryParams.pinyin"
				placeholder="请输入拼音"
				clearable
				size="small"
				@keyup.enter.native="handleQuery"
			  />
			</el-form-item>
      <el-form-item label="门店名字" prop="warehouseName">
        <el-input
          v-model="queryParams.warehouseName"
          placeholder="请输入门店名字"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
     <!-- <el-form-item label="供应商编码" prop="vendorCode">
        <el-input
          v-model="queryParams.vendorCode"
          placeholder="请输入供应商编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="供应商名称" prop="vendorName">
        <el-input
          v-model="queryParams.vendorName"
          placeholder="请输入供应商名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
	  <el-col :span="1.5">
	    <el-button
	  	type="info"
	  	plain
		icon="el-icon-download"
	  	size="mini"
	  	:loading="exportLoading"
	  	@click="handleImport"
	  	v-hasPermi="['store:share:import']"
	    >导入</el-button>
	  </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="inWarehouseList">
      <el-table-column label="carg" align="center" prop="carg" show-overflow-tooltip :min-width="150"  />
      <el-table-column label="产品名称" align="center" prop="productName"  show-overflow-tooltip :min-width="350"/>
      <el-table-column label="门店名字" align="center" prop="warehouseName"  show-overflow-tooltip :min-width="150"/>
      <el-table-column label="库位编码" align="center" prop="positionCode"  show-overflow-tooltip :min-width="150"/>
      <el-table-column label="供应商名称" align="center" prop="vendorName"  show-overflow-tooltip :min-width="150"/>
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column label="分类" align="center" prop="classify">
			<template slot-scope="scope">
					<dict-tag :options="dict.type.classification" :value="scope.row.classify"/>
			</template>
		</el-table-column>
      <!-- <el-table-column label="总价" align="center" prop="sumPrice" /> -->
      <!-- <el-table-column label="参考量" align="center" prop="usableQuantity" /> -->
      <!-- <el-table-column label="可用量" align="center" prop="usableQuantity" /> -->
      <!-- <el-table-column label="占用量" align="center" prop="occupyQuantity" /> -->
      <el-table-column label="分享数量" align="center" prop="shareQuantity" />
      <el-table-column label="创建时间" align="center" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
     <!-- <el-table-column label="状态" align="center" prop="status">
		  <template slot-scope="scope">
		      <span>{{scope.row.status |status}}</span>
		    </template>
		</el-table-column> -->
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button
		  v-if="tid == scope.row.tenantId"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['store:share:edit']"
          >修改</el-button>
          <el-button
		    v-if="tid == scope.row.tenantId"
            size="mini"
            type="text"
			style="color: red;"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:share:remove']"
          >删除</el-button>
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

   <!-- 修改共享 -->
   <el-dialog title="修改共享" :visible.sync="sharedata" width="30%" append-to-body :close-on-click-modal="false">
   	 <el-form :model="sharefrom" ref="sharefrom" label-width="90px">
   	   <el-form-item label="共享数量">
   	     <el-input
   	       v-model="sharefrom.shareQuantity"
   	       placeholder="请输入共享数量"
   	       clearable
   	       size="small"
   	      type="number"
   	     />
   	   </el-form-item>
   	   <el-form-item>
   	     <el-button type="primary" size="mini" @click="shareto">共享</el-button>
   	     <el-button  size="mini" @click="sharedata=false">取消</el-button>
   	   </el-form-item>
   	 </el-form>
   </el-dialog>
<!-- 分享模板导入对话框 -->
	<el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body :close-on-click-modal="false">
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
	  <p style="width: 100%;text-align: center;">
		<el-button
		type="primary"
		plain
		icon="el-icon-upload2"
		size="mini"
		:loading="exportLoading"
		@click="muexport"
		v-hasPermi="['store:share:export']"
		>分享模板下载</el-button>  
	  </p>
	  <div slot="footer" class="dialog-footer">
	    <el-button type="primary" @click="submitFileForm">确 定</el-button>
	    <el-button @click="upload.open = false">取 消</el-button>
	  </div>
	</el-dialog>
  </div>
</template>
<script>
import { sharelist,updatashare, delshare } from "@/api/store/inWarehouse";
import {grounlist} from "@/api/system/tenant";
import { getToken } from "@/utils/auth";
import { muexports } from "@/api/store/inventory";
import { supplierlist } from "@/api/crmgroupmgt";
import { listProduct } from "@/api/store/product";
import { printinhose } from "@/api/store/inventory";

export default {
  name: "InWarehouse",
   dicts: ['paymentTerms', 'delivery_method', "packagingMethod", "priceMode","classification"],
  filters:{
	  status(e){
		  if(e == 1){
			  return '禁用'
		  }else if(e==0){
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
        shelveDate: null,
        status: null,
		positionCode:null,
		productName:null,
		carg:null
      },
	  tableRadio:{
		  retailPrice:0,
		  carg:null,
		  productId:null,
		  name:null
	  },
      // 表单参数
      form: {},
	  addfrom:{},
      // 表单校验
      rules: {
		 warehouseName: [{ required: true, message: '请选择门店', trigger: 'blur' }], 
		 vendorName: [{ required: true, message: '请选择供应商', trigger: 'blur' }], 
		 paymentTerms: [{ required: true, message: '请选择结算方式', trigger: 'blur' }]
	  },
	  isShow:true,
	  dictList:[],//门店列表
	  supplist:[],//门店列表
	  serprofrom:{
		  pageNum:1,
		  pageSize:10,
		  total:0,
		  name:null,
		  factoryCode:null,
		  carg:null
	  },//产品查询表单
	 upload: {
	   // 是否显示弹出层（用户导入）
	   open: false,
	   // 弹出层标题（用户导入）
	   title: "",
	   // 是否禁用上传
	   isUploading: false,
	   // 设置上传的请求头部
	   headers: { Authorization: "Bearer " + getToken() },
	   // 上传的地址
	   url: process.env.VUE_APP_BASE_API + "/v1/store/inventory/importData"
	 },
	  openfrom:false,
	  openfromdata:{},
	  rulesaddshowform:{
		   discountRate: [ {
		  	pattern:/^((0.[1-9]{1})|(([1-9]{1})(.\d{1})?))$/,
		  	message: "格式不正确",
		  	trigger: "blur"}], 
	  },
	  ruless:{
		 receivalQuantity: [{ required: true, message: '请输入数量', trigger: 'blur' }], 
		 price: [{ required: true, message: '请输入金额', trigger: 'blur' }]
	  },
	  openfromdataindex:null,
	  userlist:[],//指派人员列表
	  userlistfrom:false,
	  userRadios:'',//选中的指派员
	  userinwareid:null,//指派的库id
	  suerli:{
		  pageNum:1,
		  pageSize:10
	  },
	  lis:{},
	  porinttable:[],
	  printbox:false,
	  infodata:{},
	  look:false,
	  tid:true,
	  sharedata:false,
	  sharefrom:{
		  shareQuantity:null,
		  inventoryId:'',
		  inventoryShareId:''
	  },
	  usenum:null
    };
  },
  created() {
    this.getList();
	this.tid=localStorage.getItem('tid')
  },
  methods: {
	  // 产品查询
	  serfrom(){
		  listProduct(this.serprofrom).then(res=>{
			  this.tab=res.data.items
			  this.serprofrom.total=res.data.total
			  this.tableRadio=null
		  })
	  },
    /** 查询入库列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeShelveDate && '' != this.daterangeShelveDate) {
        this.queryParams.params["beginShelveDate"] = this.daterangeShelveDate[0];
        this.queryParams.params["endShelveDate"] = this.daterangeShelveDate[1];
      }
		this.queryParams.orderCategory=1
		sharelist(this.queryParams).then(response => {
        this.inWarehouseList = response.data.items;
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
		this.addshowform={//表单暂时数据
			discountRate:1,
			price:null
		}
		this.addform={
			paymentTerms:null
		}
      this.warehouseName=''//未处理的门店数据
      this.supplierName=''
	  this.tableRadio=null
      this.resetForm("addform");
	  this.selectedtable=[]
	  this.serprofrom.carg=null
	   this.serprofrom.name=null
	   this.serprofrom.factoryCode=null
	   this.serfrom()
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
	/** 修改分享 */
	handleUpdate(i){
		this.sharefrom.shareQuantity=null
		this.sharefrom.inventoryId=i.inventoryId
		this.sharefrom.inventoryShareId=i.inventoryShareId
		this.usenum=i.usableQuantity + i.shareQuantity
		this.sharedata=true
	},
	/** 提交修改分享 */
	shareto(){
		let reg=/^\d+$/
		if(this.sharefrom.shareQuantity>this.usenum){
			this.$message.error("可用数量不足")
			return false
		}else if(!reg.test(this.sharefrom.shareQuantity)){
			this.$message.error("数量必须为大于零的整数")
			return false
		} else{
			updatashare(this.sharefrom).then(res=>{
				if(res.code == 200){
					this.$modal.msgSuccess("分享成功")
					this.sharedata=false
					this.getList()
				}else{
					this.$message.error(res.message)
				}
			})
		}
	},
		/** 删除按钮操作 */
		handleDelete(row) {
		  const inWarehouseIds = row.inventoryShareId
		  this.$modal.confirm('是否确认删除产品名称为"' + row.productName + '"的数据项？').then(function() {
		    return delshare(inWarehouseIds);
		  }).then(() => {
		    this.getList();
		    this.$modal.msgSuccess("删除成功");
		  }).catch(() => {});
		},
	// 分享模板导出
	muexport(){
		const queryParams = this.queryParams;
		this.$modal.confirm('是否确认下载分享模板？').then(() => {
		  this.exportLoading = true;
		  return muexports(queryParams);
		}).then(response => {
		  this.$download.name(response.data);
		  this.exportLoading = false;
		}).catch(() => {});
	},
	// 分享模板导入
	handleImport(){
		this.upload.title = "分享模板导入";
		this.upload.open = true;
	},
	// 文件上传中处理
	handleFileUploadProgress(event, file, fileList) {
	  this.upload.isUploading = true;
	},
	// 文件上传成功处理
	handleFileSuccess(response, file, fileList) {
	  this.upload.open = false;
	  this.upload.isUploading = false;
	  this.$refs.upload.clearFiles();
	  this.$alert(response.data || response.msg , { dangerouslyUseHTMLString: true });
	  this.getList();
	},
	// 提交上传文件
	submitFileForm() {
	  this.$refs.upload.submit();
	}
  },
};
</script>
<style scoped>
	.formtop{
		display: flex;
		justify-content:left;
	}
	.formcen{
		display: flex;
		justify-content: left;
	}
	.line{
		border-bottom: 1px solid #ccc;
	}
	.formcendov{
		display: flex;
		justify-content: left;
		align-items: center;
	}
	/deep/.formcendov .el-form-item__label{
		width: 50px !important;
		padding-right: 3px !important;
	}
	/deep/.formcendov .el-form-item--medium .el-form-item__content{
		margin-left: 50px !important;
	}
	.infodatap{
		display: flex;
		justify-content:space-between;
		flex-wrap: wrap;
	}
	.infodatap p{
		width: 45%;
		margin: 3px 0;
	}
	/* 打印 */
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
