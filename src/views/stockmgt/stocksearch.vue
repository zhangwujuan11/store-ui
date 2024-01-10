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
      <el-form-item label="门店编码" prop="warehouseCode">
        <el-input
          v-model="queryParams.warehouseCode"
          placeholder="请输入门店编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="门店名称" prop="warehouseName">
        <el-input
          v-model="queryParams.warehouseName"
          placeholder="请输入门店名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
     <el-form-item label="供应商" prop="vendorCode">
       <!-- <el-input
          v-model="queryParams.vendorCode"
          placeholder="请输入供应商编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        /> -->
		<el-select placeholder="请选择供应商" clearable v-model="queryParams.vendorCode">
			<el-option  v-for="(dict,index) in gongyings" :key="index"
				:label="dict.supplierName" :value="dict.supplierCode" />
		</el-select>
      </el-form-item>
	  <el-form-item label="分类" prop="classify">
	  	<el-select placeholder="请选择分类" clearable v-model="queryParams.classify">
	  		<el-option  v-for="(dict,index) in dict.type.classification" :key="index"
	  			:label="dict.label" :value="dict.value" />
	  	</el-select>
	  </el-form-item>
      <!-- <el-form-item label="供应商名称" prop="vendorName"> -->
       <!-- <el-input
          v-model="queryParams.vendorName"
          placeholder="请输入供应商名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        /> -->
      <!-- </el-form-item> -->
      <el-form-item label="状态" prop="valid">
        <el-select v-model="queryParams.valid" placeholder="请选择状态" clearable size="small">
          <el-option label="有效" value="1" />
          <el-option label="失效" value="2" />
          <el-option label="全部" value="3" />
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
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-upload2"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['store:inventory:export']"
        >导出</el-button>
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
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="inventoryList">
      <el-table-column label="carg" align="center" prop="carg" show-overflow-tooltip :min-width="150" />
      <el-table-column label="产品名称" align="center" prop="productName" show-overflow-tooltip :min-width="350">
			<template slot-scope="scope">
				<span @click="goinfo(scope.row.productId)" style="color: blue;cursor: pointer;text-decoration:underline solid blue;">{{scope.row.productName}}</span>
			</template>
	</el-table-column>
	<el-table-column label="参考量" align="center" prop="inventoryQuantity" />
	<el-table-column label="可用量" align="center" prop="usableQuantity" />
	<el-table-column label="占用数量" align="center" prop="occupyQuantity" />
      <el-table-column label="门店编码" align="center" prop="warehouseCode" />
      <el-table-column label="门店名称" align="center" prop="warehouseName"  show-overflow-tooltip :min-width="180"/>
      <el-table-column label="分类" align="center" prop="classify" />
	 <el-table-column label="库位" align="center" prop="positionCode" />
      <el-table-column label="供应商编码" align="center" prop="vendorCode" show-overflow-tooltip :min-width="200"/>
      <el-table-column label="供应商名称" align="center" prop="vendorName" show-overflow-tooltip :min-width="200"/>
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column label="单价" align="center" prop="price" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150" fixed="right">
        <template slot-scope="scope">
         <el-button
            size="mini"
            type="text"
            icon="el-icon-share"
			v-if="scope.row.usableQuantity > 0"
            @click="addsharefun(scope.row)"
            v-hasPermi="['store:share:add']"
          >分享库存</el-button>
			<el-button
			   size="mini"
			   type="text"
			   icon="el-icon-tickets"
				  v-hasPermi="['store:queryInventory:query']"
			   @click="serdata(scope.row)"
			 >进/出货明细</el-button>
			 <el-button
			    size="mini"
			    type="text"
			    icon="el-icon-tickets"
			    @click="handleUpdate(scope.row)"
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

    <!-- 日志 -->
    <el-dialog title="日志" :visible.sync="open" width="90%" append-to-body :close-on-click-modal="false">
		<el-table :data="looktable" >
		  <el-table-column label="carg" align="center" prop="carg" />
		  <el-table-column label="产品名称" align="center" prop="productName" />
		  <el-table-column label="类型" align="center" prop="busTypeDes" />
		  <el-table-column label="单号" align="center" prop="busCode" />
		   <el-table-column label="前值" align="center" prop="beforeQuantity" />
		  <el-table-column label="增减量" align="center" prop="incDecQuantity">
			  <template slot-scope="scope">
					 {{scope.row.incDecType | incDecType}} {{scope.row.incDecQuantity}}
				  </template>
			  </el-table-column>
		  <el-table-column label="后值" align="center" prop="afterQuantity" />
		  <el-table-column label="操作用户" align="center" prop="createBy" />
		  <el-table-column label="操作时间" align="center" prop="createTime" />
		</el-table>
		<pagination
		  v-show="lookdata.total>0"
		  :total="lookdata.total"
		  :page.sync="lookdata.pageNum"
		  :limit.sync="lookdata.pageSize"
		  @pagination="getloogtable"
		/>
    </el-dialog>
	
	<!-- 最近进出货信息 -->
	<el-dialog title="销售信息" :visible.sync="saledata" width="90%" append-to-body  :close-on-click-modal="false">
		<p>
			时段销售：
			<el-date-picker
			  v-model="daterangeEstimatedDelivery"
			  size="small"
			  style="width: 240px"
			  value-format="yyyy-MM-dd"
			  type="daterange"
			  range-separator="-"
			  start-placeholder="开始日期"
			  end-placeholder="结束日期"
			></el-date-picker>
		</p>
		 
		<el-table :data="houseonedata" >
		  <el-table-column label="销售日期" align="center" prop="auditTime" />
		  <el-table-column label="客户" align="center" prop="customer" />
		  <el-table-column label="本厂编码" align="center" prop="factoryCode" />
		   <el-table-column label="产品名称" align="center" prop="productName" />
		  <el-table-column label="数量" align="center" prop="quantity"></el-table-column>
		  <el-table-column label="单价" align="center" prop="price" />
		  <el-table-column label="金额" align="center" prop="totalPrice" />
		  <el-table-column label="门店" align="center" prop="storeName" />
		  <el-table-column label="车型" align="center" prop="motorcycleType" />
		  <el-table-column label="库位" align="center" prop="positionCode" />
		</el-table>
		<pagination
		  v-show="houseone.total>0"
		  :total="houseone.total"
		  :page.sync="houseone.pageNum"
		  :limit.sync="houseone.pageSize"
		  @pagination="serdata"
		/>
		 <p class="line"></p>
		<el-table :data="housetwodata" >
		  <el-table-column label="进货日期" align="center" prop="auditTime" />
		  <el-table-column label="供应商" align="center" prop="vendorName" />
		  <el-table-column label="原厂件号" align="center" prop="partNumber" />
		  <el-table-column label="本厂编码" align="center" prop="factoryCode" />
		   <el-table-column label="产品名称" align="center" prop="productName" />
		  <el-table-column label="数量" align="center" prop="receivalQuantity"></el-table-column>
		  <el-table-column label="单价" align="center" prop="price" />
		  <el-table-column label="分类" align="center" prop="classify">
				<template slot-scope="scope">
					  <dict-tag :options="dict.type.classification" :value="scope.row.classify"/>
				</template>
			</el-table-column>
		  <el-table-column label="厂家" align="center" prop="productManufacturer" />
		  <el-table-column label="库位" align="center" prop="position" />
		  <el-table-column label="折率" align="center" prop="discountRate" />
		  <el-table-column label="折后单价" align="center" prop="discountedUnitPrice" />
		  </el-table>
		<pagination
		  v-show="housetwo.total>0"
		  :total="housetwo.total"
		  :page.sync="housetwo.pageNum"
		  :limit.sync="housetwo.pageSize"
		  @pagination="serdatatwo"
		/>
	</el-dialog>
	
	<!-- 新增共享 -->
	<el-dialog title="共享库存" :visible.sync="sharedata" width="30%" append-to-body  :close-on-click-modal="false">
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
	<!-- 导入对话框 -->
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
			icon="el-icon-download"
			size="mini"
			:loading="exportLoading"
			@click="muexport"
			v-hasPermi="['store:share:export']"
			>模板下载</el-button>  
		  </p>
		  <div slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="submitFileForm">确 定</el-button>
		    <el-button @click="upload.open = false">取 消</el-button>
		  </div>
		</el-dialog>
  </div>
</template>

<script>
import { listInventoryall, exportInventory, look, information, purchase, muexporttow } from "@/api/store/inventory";
import { addshare } from "@/api/store/inWarehouse";
import { getToken } from "@/utils/auth";
import {supplierlistall} from "@/api/crmgroupmgt";
export default {
  name: "Inventory",
  dicts: ['sys_show_hide',"classification"],
  filters:{
	  busTypeDes(e){
		  if(e == 1){
			  return "入库"
		  }
	  },
	  incDecType(e){
		  if(e== "I"){
			  return "+"
		  }else if(e == "D"){
			  return "-"
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
      // 库存表格数据
      inventoryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
		valid:'3',
        carg: null,
        productName: null,
        warehouseCode: null,
        warehouseName: null,
        vendorCode: null,
        vendorName: null,
      },
	  lookdata:{
		  papgNUm:1,
		  pageSize:10
	  },
	  looktable:[],
	  saledata:false,
	  daterangeEstimatedDelivery:[],//销售情况日期
	  seri:{},
	  houseone:{
		  pageNum:1,
		  pageSize:10,
		  startDate:null,
		  endDate:null,
		  productId:null,
		  status:3,
		  total:0
	  },
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
	    url: process.env.VUE_APP_BASE_API + "/v1/store/inventory/importData?timestamp="  + new Date().getTime()
	  },
	  houseonedata:[],
	  housetwo:{
		pageNum:1,
		pageSize:10,
		startDate:null,
		endDate:null,
		productId:null,
		status:2,
		total:0  
	  },
	  housetwodata:[],
	 sharedata:false,
	 sharefrom:{
		 inventoryId:'',
		 shareQuantity:null
	 },
	 gongyings:[]
    };
  },
  created() {
    this.getList();
	supplierlistall().then(res=>{
		this.gongyings=res.data.items
		console.log(res)
	})
  },
  methods: {
    /** 查询库存列表 */
    getList() {
      this.loading = true;
      listInventoryall(this.queryParams).then(response => {
        this.inventoryList = response.data.items;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
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
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有库存数据项？').then(() => {
        this.exportLoading = true;
        return exportInventory(queryParams);
      }).then(response => {
        this.$download.name(response.data);
        this.exportLoading = false;
      }).catch(() => {});
    },
	
	// 查看日志
	handleUpdate(i){
		this.lookdata.inventoryId=i.inventoryId
		this.getloogtable()
		this.open=true
	},
	// 日志获取
	getloogtable(){
		look(this.lookdata).then(res=>{
			this.looktable=res.data.items
			this.lookdata.total=res.data.total
		})
	},
	goinfo(i){
		this.$router.push({
			path:'/menagement/classifymgt/producontrol',
			query:{
				id:i
			}
		})
	},
	// 最近进出货信息
	serdata(i){
		this.seri=i
		this.serdataone(i)
		this.serdatatwo(i)
		this.saledata=true
	},
	serdataone(i){
		this.houseone.inventoryId=i.inventoryId
		information(this.houseone).then(res=>{
			this.houseonedata=res.data.items
			this.houseone.total=res.data.total
		})
	},
	serdatatwo(i){
		this.housetwo.inventoryId=i.inventoryId
		purchase(this.housetwo).then(res=>{
			this.housetwodata=res.data.items
			this.housetwo.total=res.data.total
		})
	},
	// 新增分享
	addsharefun(i){
		this.sharefrom.inventoryId=i.inventoryId
		this.usenum=i.usableQuantity
		this.sharedata=true
	},
	shareto(){
		if(this.sharefrom.shareQuantity>this.usenum){
			this.$message.error("可用数量不足")
			return false
		}else{
			addshare(this.sharefrom).then(res=>{
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
	},
	// 分享模板导出
	muexport(){
		const queryParams = this.queryParams;
		this.$modal.confirm('是否确认下载库存模板？').then(() => {
		  this.exportLoading = true;
		  return muexporttow(queryParams);
		}).then(response => {
		  this.$download.name(response.data);
		  this.exportLoading = false;
		}).catch(() => {});
	},
	
  },
  watch:{
	  daterangeEstimatedDelivery(val){
		  if(val == null || val.length == 0){
			  this.houseone.startDate=null
			  this.houseone.endDate=null
			  this.housetwo.startDate=null
			  this.housetwo.endDate=null
		  }else{
			  this.houseone.startDate=val[0]
			  this.houseone.endDate=val[1]
			  this.serdataone(this.seri)
			  this.housetwo.startDate=val[0]
			  this.housetwo.endDate=val[1]
			  this.serdatatwo(this.seri)
		  }
		 
	  },
	  saledata(val){
		if(!val){
			this.daterangeEstimatedDelivery=[]
		}  
	  }
	 
  }
};
</script>
<style scoped>
	.line{
		border-bottom: 1px solid #ccc;
		margin: 30px 0;
	}

</style>
