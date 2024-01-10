<template>
  <div class="app-container">
    <div class="maincon">
      <div class="leftbox">
        <el-tree
        :data="data"
        :props="defaultProps"
        :default-expand-all="true"
        :highlight-current="true"
        @node-click="handleNodeClick"></el-tree>
      </div>
       <div class="rightbox">
         <el-form :model="queryParams" ref="queryParams" :inline="true" @submit.native.prevent v-show="showSearch" label-width="68px">
           <el-form-item label="名称" prop="paramName">
            <el-input
              v-model="queryParams.paramName"
              placeholder="请输入名称"
              clearable
              size="small"
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
               :disabled="isparams"
               v-hasPermi="['store:typeData:add']"
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
               v-hasPermi="['store:typeData:remove']"
             >删除</el-button>
           </el-col>
           <el-col :span="1.5">
             <el-button
               type="warning"
               plain
               icon="el-icon-download"
               size="mini"
               :loading="exportLoading"
               @click="handleExport"
               v-hasPermi="['store:typeData:export']"
             >导出</el-button>
           </el-col>
           <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
         </el-row>

         <el-table v-loading="loading" :data="typeDataList" @selection-change="handleSelectionChange">
           <el-table-column type="selection" width="55" align="center" />
           <el-table-column label="参数名称" align="center" prop="paramType" />
           <el-table-column label="编号" align="center" prop="paramCode" />
           <el-table-column label="名称" align="center" prop="paramName" />
           <el-table-column label="备注" align="center" prop="remark" />
           <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
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
                 @click="handleDelete(scope.row)"
				 style="color:red"
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
       </div>


    <!-- 添加或修改基础参数数据对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="参数名称" prop="paramType" v-if="enabled" >
          <el-input v-model="form.paramType" placeholder="请输入参数名称" :disabled="enabled"/>
        </el-form-item>
        <el-form-item label="编号" prop="paramCode">
            <el-input v-model="form.paramCode" placeholder="请输入编号" :disabled="enabled"/>
        </el-form-item>
        <el-form-item label="名称" prop="paramName">
          <el-input v-model="form.paramName" placeholder="请输入名称" />
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
  </div>
</template>

<script>
import { listTypeData, getTypeData, delTypeData, addTypeData, updateTypeData, exportTypeData, trredata } from "@/api/store/typeData";

export default {
  name: "TypeData",
  data() {
    return {
		enabled:false,
      isparams:true,//是否可以新增
      // 树形菜单
       data:  [],
       defaultProps: {
              children: 'children',
              label: 'label'
            },
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
		paramType:null,
		paramCode:null,
		paramName:null,
		remark :null, 
	  },
      // 表单校验
      rules: {
        paramType: [
          { required: true, message: "参数名称不能为空", trigger: "blur" }
        ],
        paramCode: [
          { required: true, message: "编号不能为空", trigger: "blur" }
        ],
        paramName: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
      },
      paramType:'',
      typeId:''
    };
  },
  created() {
    this.getList();
    trredata().then(res=>{
      this.data=res.data
    })
  },
  methods: {
    // 树形菜单点击
     handleNodeClick(data) {
       this.queryParams.typeId=data.id
       this.getList()
       if(!data.children){
         this.isparams=false
         this.typeId=data.id
         this.paramType=data.name
       }else{
         this.isparams=true
       }
    },
    /** 查询基础参数数据列表 */
    getList() {
      this.loading = true;
      listTypeData(this.queryParams).then(response => {
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
        paramType:this. paramType,
        typeId:this.typeId
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
       this.queryParams.typeId=null
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.paramId)
	  this.orders =selection.map(item => item.paramCode)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
	  this.enabled=false
      this.title = "添加基础参数数据";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
	  this.enabled=true
      const paramId = row.paramId || this.ids
      getTypeData(paramId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改基础参数数据";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
			
          if (this.form.paramId != null) {
            this.form.typeId=this.typeId
            updateTypeData(this.form).then(response => {
              if(response.code == 200){
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }else{
               this.$modal.msgSuccess(response.message);
              }
            
            });
          } else {
            addTypeData(this.form).then(response => {
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
      const paramIds = row.paramId || this.ids;
	  const abc = row.paramCode || this.orders
      this.$modal.confirm('是否确认删除基础参数数据编号为"' + abc + '"的数据项？').then(function() {
        return delTypeData(paramIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有基础参数数据数据项？').then(() => {
        this.exportLoading = true;
        return exportTypeData(queryParams);
      }).then(response => {
        console.log(response)
        this.$download.name(response.data);
        this.exportLoading = false;
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
	  {
	    margin-left: 0px;
	  }
</style>
