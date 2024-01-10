<template>
  <div class="app-container">
         <el-form :model="queryParams" ref="queryParams" :inline="true" v-show="showSearch" label-width="68px">
           <el-form-item label="客户名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入客户名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
           </el-form-item>
		   <el-form-item label="电话" prop="phone">
		    <el-input
		      v-model="queryParams.phone"
		      placeholder="请输入电话"
		      clearable
		      size="small"
		      @keyup.enter.native="handleQuery"
		    />
		   </el-form-item>
           <el-form-item label="地址" prop="customerAddress">
            <el-input
              v-model="queryParams.customerAddress"
              placeholder="请输入地址"
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
               v-hasPermi="['store:customer:add']"
             >新增</el-button>
           </el-col>
           <el-col :span="1.5">
              <el-button
                type="danger"
                plain
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
                v-hasPermi="['store:customer:remove']"
              >删除</el-button>
            </el-col>
			 <el-col :span="1.5">
			    <el-button
			 	 type="info"
			 	 plain
			 	 icon="el-icon-upload"
			 	 size="mini"
				 v-hasPermi="['store:customer:import']"
			 	 @click="mportdata"
			    >导入客户</el-button>
			  </el-col>
           <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
         </el-row>

         <el-table v-loading="loading" :data="typeDataList" @selection-change="handleSelectionChange">
           <el-table-column type="selection" width="55" align="center" />
           <el-table-column label="名称"  align="center" prop="name" />
           <el-table-column label="简称" align="center" prop="shorterName" />
           <el-table-column label="信用度" align="center" prop="credit" />
           <el-table-column label="销售折扣" align="center" prop="salesRate" />
           <el-table-column label="电话"  align="center" prop="phone" />
           <el-table-column label="地址" align="center" prop="customerAddress" />
           <el-table-column label="状态" align="center" prop="status">
				<template slot-scope="scope">
					{{scope.row.status | status}}
				</template>
			</el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" />
           <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
             <template slot-scope="scope">
               <el-button
                 size="mini"
                 type="text"
                 icon="el-icon-edit"
                 @click="handleUpdate(scope.row)"
                 v-hasPermi="['store:typeData:edit']"
               >修改</el-button>
               <el-button
                 size="mini"
                 type="text"
                 icon="el-icon-delete"
                 style="color: red;"
                 @click="handleDelete(scope.row)"
                 v-hasPermi="['store:typeData:remove']"
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


    <!-- 添加或修改基础参数数据对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="80%" append-to-body>
     <el-form ref="form" :model="form" :rules="rules" label-width="80px">
			 <div class="fromflex">
       <el-form-item label="名称" prop="name">
         <el-input v-model="form.name" placeholder="请输入名称" />
       </el-form-item>
       <el-form-item label="简称" prop="shorterName">
         <el-input v-model="form.shorterName" placeholder="请输入简称" />
       </el-form-item>
       <el-form-item label="主营" prop="principal">
         <el-input v-model="form.principal" placeholder="请输入主营" />
       </el-form-item>
       <el-form-item label="信用度" prop="credit">
         <el-input v-model="form.credit" placeholder="请输入信用度" />
       </el-form-item>
       <el-form-item label="销售折扣" prop="salesRate">
         <el-input v-model="form.salesRate" placeholder="请输入销售折扣" />
		 <span style="color: red;font-size: 12px;">0.1为1折</span>
       </el-form-item>
       <el-form-item label="电话" prop="phone">
         <el-input v-model="form.phone" placeholder="请输入电话" />
       </el-form-item>
       <el-form-item label="地址" prop="customerAddress">
         <el-input v-model="form.customerAddress" placeholder="请输入地址" />
       </el-form-item>
       <el-form-item label="银行" prop="customerBank">
         <el-input v-model="form.customerBank" placeholder="请输入银行" />
       </el-form-item>
       <el-form-item label="银行卡号" prop="customerBankAccount">
         <el-input v-model="form.customerBankAccount" placeholder="请输入银行卡号" />
       </el-form-item>
       <el-form-item label="分类" prop="classifyId">
          <el-select v-model="form.classifyId" placeholder="请选择">
             <el-option
               v-for="item in optionone"
               :key="item.customerClassifyId"
               :label="item.classifyName"
               :value="item.customerClassifyId">
             </el-option>
           </el-select>
       </el-form-item>
       <el-form-item label="客户参数" prop="storeCustomerParamIdList">
           <el-select v-model="op1" placeholder="网点小区">
              <el-option
                v-for="item in optionxiaoqu"
                :key="item.paramId"
                :label="item.paramName"
                :value="item.paramId">
              </el-option>
            </el-select>

            <el-select v-model="op2" placeholder="网点大区">
               <el-option
                 v-for="item in optiondaqu"
                 :key="item.paramId"
                 :label="item.paramName"
                 :value="item.paramId">
               </el-option>
             </el-select>

             <el-select v-model="op3" placeholder="市县">
               <el-option
                 v-for="item in optionxianqu"
                 :key="item.paramId"
                 :label="item.paramName"
                 :value="item.paramId">
               </el-option>
              </el-select>
              <el-select v-model="op4" placeholder="省份">
                 <el-option
                   v-for="item in optionshenqu"
                   :key="item.paramId"
                   :label="item.paramName"
                   :value="item.paramId">
                 </el-option>
               </el-select>
               <el-select v-model="op5" placeholder="片区">
                 <el-option
                   v-for="item in  optionpianqu"
                   :key="item.paramId"
                   :label="item.paramName"
                   :value="item.paramId">
                 </el-option>
                </el-select>
                <el-select v-model="op6" placeholder="客户状态">
                   <el-option
                     v-for="item in  optionzhuantai"
                     :key="item.paramId"
                     :label="item.paramName"
                     :value="item.paramId">
                   </el-option>
                 </el-select>
                 <el-select v-model="op7" placeholder="业绩分类">
                   <el-option
                     v-for="item in optionfenlei"
                     :key="item.paramId"
                     :label="item.paramName"
                     :value="item.paramId">
                   </el-option>
                  </el-select>
       </el-form-item>
       <el-form-item label="状态">
         <el-radio-group v-model="form.status">
           <el-radio label="0" checked>正常</el-radio>
           <el-radio label="1">禁用</el-radio>
         </el-radio-group>
       </el-form-item>
       <el-form-item label="备注" prop="remark">
         <el-input v-model="form.remark" placeholder="请输入备注" />
       </el-form-item>
			  </div>
     </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
	
	
	<!--客户导入对话框 -->
	<el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
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
		     <el-button
		  	 type="warning"
		  	 plain
		  	 icon="el-icon-download"
		  	 size="mini"
		  	 @click="download"
		     >下载模板</el-button>
	    <el-button type="primary" @click="submitFileForm">确 定</el-button>
	    <el-button @click="upload.open = false">取 消</el-button>
	  </div>
	</el-dialog>
  </div>
</template>

<script>
import { groulist,grouinfo,listTypeData, selecanshu, addcustermar, updatamaster, detelmaster, downcuster } from "@/api/crmgroupmgt";
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
        paramName: null,
      },
      // 表单参数
      form: {
        status:'0'
      },
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
	  upload: {
	    open: false,
	    title: "",
	    headers: { Authorization: "Bearer " + getToken() },
	    url: process.env.VUE_APP_BASE_API + "/v1/store/customer/importData"
	  },
    }
  },
  created() {
    this.getList();
    this.getseleone()
     // 客户参数
    selecanshu(47).then(res=>{
      this.optionxiaoqu=res.data
    })
    selecanshu(46).then(res=>{
      this.optiondaqu=res.data
    })
    selecanshu(45).then(res=>{
      this.optionxianqu=res.data
    })
    selecanshu(44).then(res=>{
      this.optionshenqu=res.data
    })
    selecanshu(43).then(res=>{
      this.optionpianqu=res.data
    })
    selecanshu(42).then(res=>{
      this.optionzhuantai=res.data
    })
    selecanshu(41).then(res=>{
      this.optionfenlei=res.data
    })
  },
  methods: {
    // 分类下拉框
    getseleone(){
      listTypeData().then(res=>{
        this.optionone=res.data.items
      })
    },




    /** 查询基础参数数据列表 */
    getList() {
      this.loading = true;
      groulist(this.queryParams).then(response => {
        this.typeDataList = response.data.items;
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
        status:'0'
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
      this.resetForm("queryParams");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.customerId)
	  this.orders= selection.map(item => item.name)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.isbale=false
      this.open = true;
      this.title = "添加客户";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
       this.isbale=true
        grouinfo(row.customerId).then(res=>{
          this.form=res.data
          this.open = true;
          this.title = "修改客户";
        })
    },
    /** 提交按钮 */
    submitForm() {
      this.form.storeCustomerParamIdList=[]
      this.form.storeCustomerParamIdList.push(this.op1,this.op2,this.op3,this.op4,this.op5,this.op6,this.op7)
      let r = this.form.storeCustomerParamIdList.filter(function (s) {
          return s && s.trim();
      })
      this.form.storeCustomerParamIdList=r
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.customerId != null) {
            updatamaster(this.form).then(response => {
              if(response.code == 200){
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }else{
                this.$modal.msgSuccess(response.message);
              }
            });
          } else {
            addcustermar(this.form).then(response => {
              if(response.code == 200){
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }else{
                 this.$modal.msgSuccess(response.message);
              }

            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const paramIds = row.customerId || this.ids;
	  const abc= row.name || this.orders;
      this.$modal.confirm('是否确认删除名称为"' + abc + '"的数据项？').then(function() {
        return detelmaster(paramIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
	
	// 下载模板
	download(){
		downcuster().then(res=>{
			this.$download.name(res.data)
		})
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
	  this.$alert(response.message , { dangerouslyUseHTMLString: true });
	  this.getList();
	},
	
	// 导入客户
	mportdata(){
		this.upload.title = "客户导入";
		this.upload.open = true;
	},
	// 提交上传文件
	submitFileForm() {
	  this.$refs.upload.submit();
	},
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
