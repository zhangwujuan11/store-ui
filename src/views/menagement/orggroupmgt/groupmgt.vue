<template>
  <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
           <el-form-item label="租户名称" prop="shopName">
             <el-input
               v-model="queryParams.name"
               placeholder="请输入租户名称"
               clearable
               size="small"
               @keyup.enter.native="handleQuery"
             />
           </el-form-item>
          <el-form-item label="商户代码" prop="shopCode">
             <el-input
               v-model="queryParams.shopCode"
               placeholder="请输入商户代码"
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
               type="primary"
               plain
               icon="el-icon-plus"
               size="mini"
               @click="handleAdd"
               v-hasPermi="['system:tenant:add']"
             >新增</el-button>
			<!-- <el-button
			   type="primary"
			   plain
			   icon="el-icon-plus"
			   size="mini"
			   @click="handleAddshop"
			   v-hasPermi="['system:tenant:add']"
			 >新增易道门店</el-button> -->
           </el-col>
           <el-col :span="1.5">
           </el-col>
           <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
         </el-row>
         <el-table v-loading="loading" :data="tenantList" @selection-change="handleSelectionChange">
           <el-table-column label="租户名称" align="center" prop="name"  show-overflow-tooltip :min-width="150"/>
           <el-table-column label="商户代码" align="center" prop="shopCode"  show-overflow-tooltip :min-width="150"/>
           <el-table-column label="易道门店编码" align="center" prop="ydShopCode"  show-overflow-tooltip :min-width="150"/>
           <el-table-column label="联系地址" align="center" prop="address"  show-overflow-tooltip :min-width="180"/>
           <el-table-column label="联系人" align="center" prop="contact" />
           <el-table-column label="状态" align="center" >
             <template slot-scope="scope">
               {{scope.row.status | shopType}}
             </template>
           </el-table-column>
           <el-table-column label="商户类型" align="center" >
             <template slot-scope="scope">
               {{scope.row.shopType | status}}
             </template>
           </el-table-column>
           <el-table-column label="备注" align="center" prop="remark"  show-overflow-tooltip :min-width="150"/>
           <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
             <template slot-scope="scope">
               <el-button
                 size="mini"
                 type="text"
                 icon="el-icon-edit"
                 @click="handleUpdate(scope.row)"
                 v-hasPermi="['system:tenant:edit']"
               >修改</el-button>
               <el-button
			   v-if="scope.row.status == '0'"
                 size="mini"
                 type="text"
                 style="color: red;"
                 icon="el-icon-delete"
                 @click="handleDelete(scope.row)"
                 v-hasPermi="['system:tenant:remove']"
               >禁用</el-button>
			   <el-button
			   v-if="scope.row.status == '1'"
			     size="mini"
			     type="text"
			     icon="el-icon-setting"
			     @click="handleopen(scope.row)"
			     v-hasPermi="['system:tenant:remove']"
			   >启用</el-button>
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
		 <!-- 新增易道大咖门店 -->
		 <el-dialog :title="title" :visible.sync="opshop" width="380px" append-to-body :close-on-click-modal="false">
		   <el-form ref="form" :model="shopform" label-width="80px">
		     <el-form-item label="门店编码" prop="shopCode">
		       <el-input v-model="shopform.shopCode" placeholder="请输入门店编码" maxlength="30"/>
		     </el-form-item>
		   </el-form>
		   <div slot="footer" class="dialog-footer">
		     <el-button type="primary" @click="submitshopForm">确 定</el-button>
		     <el-button @click="cancelshop">取 消</el-button>
		   </div>
		 </el-dialog>
		 
		 
         <!-- 添加或修改租户管理对话框 -->
         <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body :close-on-click-modal="false">
           <el-form ref="form" :model="form" :rules="rules" label-width="120px">
             <el-form-item label="租户名称" prop="name">
               <el-input v-model="form.name" placeholder="请输入商户名称" maxlength="30"/>
             </el-form-item>
             <el-form-item label="联系人" prop="contact">
               <el-input v-model="form.contact" placeholder="请输入联系人"  maxlength="30"/>
             </el-form-item>
             <el-form-item label="电话" prop="phone">
               <el-input v-model="form.phone" placeholder="请输入电话" />
             </el-form-item>
             <el-form-item label="商户编码" prop="shopCode">
               <el-input v-model="form.shopCode" placeholder="请输入商户编码" />
             </el-form-item>
           <el-form-item label="易道门店编码" prop="ydShopCode">
             <el-input v-model="form.ydShopCode" placeholder="请输入易道门店编码" maxlength="30" :disabled="ischange"/>
           </el-form-item>
             <el-form-item label="商户全称" prop="fullName">
               <el-input v-model="form.fullName" placeholder="请输入商户全称" />
             </el-form-item>
             <el-form-item label="商户类型" prop="shopType">
                 <el-select v-model="form.shopType" placeholder="请选择">
                   <el-option label="一级商户" value="1"></el-option>
                   <el-option label="普通商户" value="2"></el-option>
                 </el-select>
             </el-form-item>
             <el-form-item label="联系地址" prop="address">
               <v-distpicker
                :province="form.province"
                :city="form.city"
                :area="form.zoneId"
               @province="onChangeProvince"
               @city="onChangeCity"
               @area="onChangeArea"></v-distpicker>
                <el-input v-model="form.address" placeholder="请输入具体地址" style="margin-top: 10px;"/>
             </el-form-item>

             <el-form-item label="管理员" prop="userName">
               <el-input v-if="!form.id" v-model="form.userName" placeholder="请输入要创建的管理员用户名" />
               <span v-else>{{ form.userName }}</span>
               <span style="color: darkred;font-size: 12px;">默认密码为该商户创建后的手机号码</span>
             </el-form-item>
				<el-form-item label="商户logo" prop="logoSrc">
					<el-upload
					ref="upload"
					  :action='baseurl'
					  list-type="picture-card"
					   :file-list="fileList"
					  :show-file-list="true"
					  :on-success="handleAvatarSuccess"
					   :limit="1"
					   :on-remove="handleRemove"
					   :on-exceed="outfun"
					   :before-upload="handleBeforeUpload"
					   accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PBG,.GIF"
					  :headers="headers">
					    <i slot="default" class="el-icon-plus"></i>
					    <div slot="file" slot-scope="{file}">
					      <img class="el-upload-list__item-thumbnail"
					        :src="form.logoSrc" alt=""
					      >
					      <span class="el-upload-list__item-actions">
					        <span
					          class="el-upload-list__item-delete"
					          @click="handleRemove(file)"
					        >
					          <i class="el-icon-delete"></i>
					        </span>
					      </span>
					    </div>
					</el-upload>
				</el-form-item>		 
						 
             <el-form-item label="备注" prop="remark">
               <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
             </el-form-item>
           </el-form>
           <div slot="footer" class="dialog-footer">
             <el-button type="primary" @click="submitForm">确 定</el-button>
             <el-button @click="cancel">取 消</el-button>
           </div>
         </el-dialog>
  </div>
</template>

<script>
import { listTenant, getTenant, delTenant, addTenant, updateTenant, exportTenant, delnt, addshopcode } from "@/api/system/tenant";
import { getToken } from "@/utils/auth";

export default {
  name: "Tenant",
  
  filters:{
    status(e){
      if(e == 1){
        return "一级商户"
      }else{
        return "普通商户"
      }
    },
    shopType(e){
      if(e == 0){
        return "启用"
      }else{
        return "禁用"
      }
    }
  },
  data() {
	  const addressValidator = (rule, value, callback) => {
	      if (!this.form.province || !this.form.city || !this.form.zoneId || !this.form.address) {
	        callback(new Error('地址不能为空'))
	      } else {
	        callback()
	      }
	    }
    return {
      form:{
		name:null,
		contact:null,
		phone:null,
		shopCode:null,
		shopName:null,
		fullName:null,
		shopType:null,
		province:null,
		city:null,
		zoneId:null,
		address:null,
		userName:null,
		remark:null,
			},
	// 表单校验
	rules: {
	  contact: [
	    { required: true, message: "联系人不能为空", trigger: "blur" }
	  ],
	  phone: [
	    { required: true, message: "电话不能为空", trigger: "blur" },
		{
		   pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
		   message: "输入正确的手机号",
		   trigger: "blur",
		},
	  ],
	  name: [
	    { required: true, message: "商户名称不能为空", trigger: "blur" }
	  ],
	  shopCode: [
	    { required: true, message: "商户编码不能为空", trigger: "blur" },
		{
		   pattern: /^[A-Za-z0-9]+$/,
		   message: "仅限（字母，数字）",
		   trigger: "blur",
		},
	  ],
	  ydShopCode:[
		  { required: true, message: "易道门店编码不能为空", trigger: "blur" },
		  {
		     pattern: /^[A-Za-z0-9]+$/,
		     message: "仅限（字母，数字）",
		     trigger: "blur",
		  }
	  ],
	  shopName: [
	    { required: true, message: "商户名称不能为空", trigger: "blur" }
	  ],
	  fullName: [
	    { required: true, message: "商户全称不能为空", trigger: "blur" }
	  ],
	  address:[
	     { required: true,validator: addressValidator, trigger: 'blur' }
	  ],
	  shopType:[
	    { required: true, message: "商户类型不能为空", trigger: "blur" }
	  ],
	  userName: [
	    { required: true, message: "管理员不能为空", trigger: "blur" },
		{
		   pattern: /^[a-zA-Z0-9_-]{4,16}$/,
		   message: "仅限4到16位（字母，数字，下划线，减号）",
		   trigger: "blur",
		},
	  ],
	  logoSrc:[
	    { required: true, message: "商户logo不能为空", trigger: "change" }
	  ],
	},
	ischange:false,
      tee:"",
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
      // 租户管理表格数据
      tenantList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        remarks: null,
        tenantId: null,
        contact: null,
        phone: null,
        name: null,
        userId: null
      },
	  baseurl: process.env.VUE_APP_BASE_API + '/common/upload',
	  headers: {
	    Authorization: "Bearer " + getToken(),
	  },
	  fileList:[],
	  opshop:false,
	  shopform:{
		  shopCode:''
	  }
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 区
    onChangeProvince(province){
        this.form.province = province.value
		this.form.city =null
		this.form.zoneId =null
    },
    onChangeCity(city){
		this.form.city = city.value  
		this.form.zoneId =null
	},
    onChangeArea(area){
		this.form.zoneId = area.value
	},
    /** 查询租户管理列表 */
    getList() {
      this.loading = true;
      listTenant(this.queryParams).then(response => {
        this.tenantList = response.rows;
        this.total = response.total;
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
        id: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null,
        remarks: null,
        tenantId: null,
        contact: null,
        phone: null,
        name: null,
        userName: null,
        userId: null,
		logoSrc:null
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
	  this.ischange=false
      this.open = true;
      this.title = "添加商户管理";
	  this.handleRemove()
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
	  this.ischange=true
      const id = row.id || this.ids
	  this.fileList=[]
      getTenant(id).then(response => {
        this.form = response.data;
        this.title = "修改商户管理";
		this.fileList.push({
		          'url': this.form.logoSrc
		        })
        this.$nextTick(()=>{
          this.open = true;
        })
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTenant(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTenant(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const infoIds = row.id || this.ids;
      this.$modal.confirm('是否确认禁用商户名称为"' + row.name + '"的数据项？').then(function() {
        row.status="1"
        return delnt(row);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("禁用成功");
      }).catch(() => {});
    },
	// 启用
	handleopen(row){
		const infoIds = row.id || this.ids;
		this.$modal.confirm('是否确认启用商户名称为"' + row.name + '"的数据项？').then(function() {
		  row.status="0"
		  return delnt(row);
		}).then(() => {
		  this.getList();
		  this.$modal.msgSuccess("启用成功");
		}).catch(() => {});
	},
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有商户管理数据项？').then(() => {
        this.exportLoading = true;
        return exportTenant(queryParams);
      }).then(response => {
        this.$download.name(response.msg);
        this.exportLoading = false;
      }).catch(() => {});
    },
	
	// 上传前loading加载
	handleBeforeUpload(file) {
	  if (this.fileSize) {
	    const isLt = file.size / 1024 / 1024 < this.fileSize;
	    if (!isLt) {
	      this.$modal.msgError(`上传头像图片大小不能超过 ${this.fileSize} MB!`);
	      return false;
	    }
	  }
	},
	   // 上传成功回调
	   handleAvatarSuccess(res, file) {
	     if (res.code === 200) {
	       this.showlist=true
	       this.form.logoSrc=res.url
	     }
	   },
	   // 删除图片
	   handleRemove(file, fileList){
	     this.$refs["upload"].clearFiles()
		this.form.logoSrc=null
	   },
	   // 超出限制
	   outfun(files, fileList){
	     this.$message('只能上传一张图片')
	   },
	   
	   
	   // 新增易道大咖门店
	   handleAddshop(){
		   this.opshop=true
	   },
	   cancelshop(){
		this.opshop=false
		shopform.shopCode=''
	   },
	   submitshopForm(){
		   addshopcode(this.shopform).then(res=>{
			   if(res.code == 200){
				   this.opshop=false
				    this.$modal.msgSuccess("新增成功");
					shopform.shopCode=''
			   }else{
				   this.opshop=false
				    this.$modal.msgError(res.message);
					shopform.shopCode=''
			   }
		   }).catch(()=>{
			   this.opshop=false
			 shopform.shopCode=''
		   })
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
  .distpicker-address-wrapper{
    display: flex;
    justify-content: left;
    align-items: center;
  }
/deep/.distpicker-address-wrapper select{
  font-size: 14px !important;
}
  {
	    margin-left: 0px;
	  }
</style>
