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
           <el-form-item label="品牌名称" prop="brandName">
            <el-input
              v-model="queryParams.brandName"
              placeholder="请输入品牌名称"
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
               v-hasPermi="['store:productBrand:add']"
             >新增</el-button>
           </el-col>
        <!--  <el-col :span="1.5">
             <el-button
               type="danger"
               plain
               icon="el-icon-delete"
               size="mini"
               :disabled="multiple"
               @click="handleDelete"
               v-hasPermi="['store:productBrand:remove']"
             >删除</el-button> -->
           </el-col>
           <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
         </el-row>

         <el-table v-loading="loading" :data="typeDataList">
           <!-- <el-table-column type="selection" width="55" align="center" /> -->
           <el-table-column label="类型" align="center" >
             <template slot-scope="scope">
               {{scope.row.type | type}}
             </template>
           </el-table-column>
           <el-table-column label="编码" align="center" prop="brandCode" />
           <el-table-column label="名称" align="center" prop="brandName" />
           <el-table-column label="图片" align="center" prop="brandImg">
             <template slot-scope="scope">
               <img v-if="scope.row.brandImg" class="tableing" :src="scope.row.brandImg" alt="">
             </template>
           </el-table-column>
           <el-table-column label="状态" align="center" >
             <template slot-scope="scope">
               {{scope.row.status | shopType}}
             </template>
           </el-table-column>
            <el-table-column label="创建人" align="center" prop="createBy" />
             <el-table-column label="修改人" align="center" prop="updateBy" />
              <el-table-column label="创建时间" align="center" prop="createTime"  show-overflow-tooltip :min-width="180"/>
           <el-table-column label="备注" align="center" prop="remark" />
           <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
             <template slot-scope="scope">
               <el-button
                 size="mini"
                 type="text"
                 icon="el-icon-edit"
                 @click="handleUpdate(scope.row)"
				  v-if="scope.row.parentId != null"
                 v-hasPermi="['store:productBrand:edit']"
               >修改</el-button>
               <el-button
                 size="mini"
                 type="text"
                 style="color: red;"
                 icon="el-icon-delete"
				 v-if="scope.row.parentId != null"
                 @click="handleDelete(scope.row)"
                 v-hasPermi="['store:productBrand:remove']"
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
        <el-form-item label="类型" prop="brandCode">
          <el-radio-group v-model="form.type" :disabled="typechange">
             <el-radio label="0">品牌</el-radio>
            <el-radio label="1">车型</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.type == '0' " label="品牌编码" prop="brandCode">
          <el-input v-model="form.brandCode" placeholder="请输入品牌编码"/>
        </el-form-item>
        <el-form-item v-if="form.type == '0' "  label="品牌名称" prop="brandName">
            <el-input v-model="form.brandName" placeholder="请输入品牌名称"/>
        </el-form-item>

        <el-form-item v-if="form.type == '1' " label="车型编码" prop="brandCode">
          <el-input v-model="form.brandCode" placeholder="请输入车型编码"/>
        </el-form-item>
        <el-form-item v-if="form.type == '1' "  label="车型名称" prop="brandName">
            <el-input v-model="form.brandName" placeholder="请输入车型名称"/>
        </el-form-item>
        <el-form-item label="图片" prop="">
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
            :headers="headers">
              <i slot="default" class="el-icon-plus"></i>
              <!-- <div  slot="file" slot-scope="{file}">
                <img  class="el-upload-list__item-thumbnail"
                  :src="form.brandImg" alt=""
                >
                <span   class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                  >
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div> -->
          </el-upload> 
		  <!-- <UploadImage></UploadImage>-->
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
import { listTypeData, trredata, getTypeData, addTypeData, uploadFile, updateTypeData,delTypeData, exportTypeData} from "@/api/menagement";
import { getToken } from "@/utils/auth";
import UploadImage from '../../../components/Upload/uploadImage'
export default {
  name: "TypeData",
  components: {UploadImage},
  filters:{
    shopType(e){
      if(e == 0){
        return "启用"
      }else{
        return "禁用"
      }
    },
    type(e){
      if(e == "1"){
        return "车型"
      }else{
        return "品牌"
      }
    }
  },
  data() {
    return {
      baseurl: process.env.VUE_APP_BASE_API + '/common/upload',
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
        type:'0'
      },
      // 表单校验
      rules: {
        brandCode: [
          { required: true, message: "品牌编码不能为空", trigger: "blur" }
        ],
        brandName: [
          { required: true, message: "品牌名称不能为空", trigger: "blur" }
        ]
      },
      paramType:'',
      imageUrl:'',
      headers: {
        Authorization: "Bearer " + getToken(),
      },
       showlist: true,
       typeid:'',
       fileList:[],
       typechange:false
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
         this.isparams=false
         this.typeid=data.id
         this.queryParams.parentId=data.id
         this.getList()
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
          type:'0',
          brandCode:'',
          parentId:this.typeid,
          brandImg:null,
          brandName:'',
          remark:""
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
      this.queryParams.parentId=null
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.productBrandId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.fileList=[]
      this.showlist=false
      this.typechange=false
      this.open = true;
      this.title = "添加基础参数数据";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
       this.fileList=[]
       this.showlist=true
       this.typechange=true
      const paramId = row.productBrandId || this.ids
      getTypeData(paramId).then(response => {
        this.form = response.data;
		if(this.form.brandImg){
			this.fileList.push({
			          'url': this.form.brandImg
			        })
					
		}
       
        this.open = true;
        this.title = "修改品牌数据";
      });
    },



  // 上传前loading加载
  handleBeforeUpload(file) {
     let isImg = file.type.indexOf("image") > -1;
    if (!isImg) {
      this.$modal.msgError(`文件格式不正确, 请上传${this.fileType.join("/")}图片格式文件!`);
      return false;
    }
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
         this.form.brandImg=res.url
       }
     },
     // 删除图片
     handleRemove(file, fileList){
        this.$refs["upload"].clearFiles()
				this.form.brandImg=''
				this.fileList=[]
     },
     // 超出限制
     outfun(files, fileList){
       this.$message('只能上传一张图片')
     },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.productBrandId != null) {
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
      const paramIds = row.productBrandId || this.ids;
	  console.log(paramIds.toString())
      this.$modal.confirm('是否确认删除基础参数数据编号为"' + paramIds + '"的数据项？').then(function() {
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
   .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .upimg{
      width:50px;
      height: 50px;
    }
    .tableing{
      width: 25px;
      height: 25px;
    }
		  {
		    margin-left: 0px;
		  }
</style>
