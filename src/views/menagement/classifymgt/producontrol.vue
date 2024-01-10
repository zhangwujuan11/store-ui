<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="carg码" prop="carg">
        <el-input
          v-model="queryParams.carg"
          placeholder="请输入carg码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产品名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入产品名称"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="本厂编码" prop="factoryCode">
        <el-input
          v-model="queryParams.factoryCode"
          placeholder="请输入本厂编码"
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
          v-hasPermi="['store:product:add']"
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
          v-hasPermi="['store:product:remove']"
        >删除</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="productList">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column label="id" align="center" prop="productId" /> -->
      <el-table-column label="carg码" align="center" prop="carg"  show-overflow-tooltip :min-width="150"/>
      <el-table-column label="产品名称" align="center" prop="name"  show-overflow-tooltip :min-width="320"/>
      <el-table-column label="工艺图纸" align="center" prop="technologyImg" />
      <el-table-column label="车型" align="center" prop="motorcycleType"  show-overflow-tooltip :min-width="150"/>
	  <el-table-column label="类型" align="center" prop="classify">
		  <template slot-scope="scope">
		  	  <dict-tag :options="dict.type.classification" :value="scope.row.classify"/>
		  </template>
	  </el-table-column>
      <el-table-column label="长度" align="center" prop="prodLength" />
      <el-table-column label="中高" align="center" prop="risingFalling" />
      <el-table-column label="对角" align="center" prop="diagonal" />
      <el-table-column label="零售价" align="center" prop="retailPrice" />
      <el-table-column label="本厂编码" align="center" prop="factoryCode"  show-overflow-tooltip :min-width="150"/>
      <el-table-column label="原厂件号" align="center" prop="partNumber"  show-overflow-tooltip :min-width="150"/>
      <el-table-column label="颜色" align="center" prop="prodColour" />
      <el-table-column label="彩带" align="center" prop="coloredRibbon" />
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column label="库存预警" align="center" prop="inventoryAlert" />
      < <el-table-column label="状态" align="center" prop="status" >
              <template slot-scope="scope">
                {{scope.row.status | shopType}}
              </template>
              </el-table-column>
      <el-table-column label="产品备注" align="center" prop="remark"  show-overflow-tooltip :min-width="150"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" >
        <template slot-scope="scope">
          <el-button
		  v-if="scope.row.tenantId == tid"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['store:product:edit']"
          >修改</el-button>
          <el-button
		  v-if="scope.row.tenantId == tid"
            size="mini"
            type="text"
            style="color: red;"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:product:remove']"
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

    <!-- 添加或修改产品信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="80%" append-to-body  :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
		<div class="fromflex">
        <el-form-item label="carg码" prop="carg">
          <el-input v-model="form.carg" placeholder="请输入carg码" :disabled="hsproud"/>
        </el-form-item>
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入产品名称":disabled="hsproud" />
        </el-form-item>
        <el-form-item label="工艺图纸" prop="technologyImg">
          <el-input v-model="form.technologyImg" placeholder="请输入工艺图纸" :disabled="hsproud"/>
        </el-form-item>
        <el-form-item label="品牌" prop="productBrandId">
          <el-select v-model="form.productBrandId" placeholder="请选择" @change="sercartupe" :disabled="hsproud">
             <el-option
               v-for="item in pinoptions"
               :key="item.productBrandId"
               :label="item.brandName"
               :value="item.productBrandId">
             </el-option>
           </el-select>
         </el-form-item>
		 <el-form-item label="分类" prop="classify">
		   <el-select placeholder="请选择分类" clearable v-model="form.classify">
		   	<el-option  v-for="(dict,index) in dict.type.classification" :key="index"
		   		:label="dict.label" :value="dict.value" />
		   </el-select>
		  </el-form-item>
		 
        <el-form-item label="车型" prop="motorcycleType" v-if="cheoption != null">
          <el-select v-model="form.motorcycleId" placeholder="请选择" @change="sercartupe" :disabled="hsproud">
             <el-option
               v-for="item in cheoption"
               :key="item.productBrandId"
               :label="item.brandName"
               :value="item.productBrandId">
             </el-option>
           </el-select>
        </el-form-item>
        <el-form-item label="长度" prop="prodLength">
          <el-input v-model="form.prodLength" placeholder="请输入长度" :disabled="hsproud"/>
        </el-form-item>
        <el-form-item label="宽度" prop="prodWidth">
          <el-input v-model="form.prodWidth" placeholder="请输入宽度" :disabled="hsproud"/>
        </el-form-item>
        <el-form-item label="中高" prop="risingFalling">
          <el-input v-model="form.risingFalling" placeholder="请输入中高" :disabled="hsproud"/>
        </el-form-item>
        <el-form-item label="对角" prop="diagonal">
          <el-input v-model="form.diagonal" placeholder="请输入对角" :disabled="hsproud"/>
        </el-form-item>
        <el-form-item label="零售价" prop="retailPrice">
          <el-input v-model="form.retailPrice" placeholder="请输入零售价" :disabled="hsproud"/>
        </el-form-item>
        <el-form-item label="本厂编码" prop="factoryCode">
          <el-input v-model="form.factoryCode" placeholder="请输入本厂编码" :disabled="hsproud"/>
        </el-form-item>
        <el-form-item label="原厂件号" prop="partNumber">
          <el-input v-model="form.partNumber" placeholder="请输入原厂件号":disabled="hsproud" />
        </el-form-item>
        <el-form-item label="颜色" prop="prodColour">
          <el-input v-model="form.prodColour" placeholder="请输入颜色" :disabled="hsproud"/>
        </el-form-item>
        <el-form-item label="彩带" prop="coloredRibbon">
          <el-input v-model="form.coloredRibbon" placeholder="请输入彩带" :disabled="hsproud"/>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入单位" :disabled="hsproud"/>
        </el-form-item>
        <el-form-item label="库存预警" prop="inventoryAlert">
          <el-input v-model="form.inventoryAlert" placeholder="请输入库存预警" :disabled="hsproud"/>
        </el-form-item>
        <el-form-item label="供应商" prop="suppliers">
           <el-select v-model="form.suppliers" multiple placeholder="请选择" :disabled="hsproud">
              <el-option
                v-for="item in putoptions"
                :key="item.supplierId"
                :label="item.supplierName"
                :value="item.supplierId">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="产品参数">
           <el-cascader
		   :disabled="hsproud"
             :options="canoptions"
              :props="{ multiple: true }"
             v-model="selechoose"
             placeholder="请选择"
             filterable
           ></el-cascader>
        </el-form-item>
       <el-form-item label="状态">
         <el-radio-group v-model="form.status":disabled="hsproud">
            <el-radio label="0" >启用</el-radio>
           <el-radio label="1">禁用</el-radio>
         </el-radio-group>
       </el-form-item>
        <el-form-item label="产品备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" :disabled="hsproud"/>
        </el-form-item>
		</div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" :disabled="hsproud">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listProduct, getProduct, delProduct, addProduct, updateProduct, exportProduct } from "@/api/store/product";
import { supplierlist ,selecanoption} from "@/api/crmgroupmgt";
import { listTypeData, arrtree,getTypeData } from "@/api/menagement";

export default {
  name: "Product",
  dicts: ["classification"],
  filters:{
    shopType(e){
      if(e == 0){
        return "启用"
      }else{
        return "禁用"
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
      // 产品信息表格数据
      productList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        carg: null,
        name: null,
        technologyImg: null,
        motorcycleType: null,
        factoryCode: null,
        partNumber: null,
        status: null,
      },
      // 表单参数
      form: {
        status:'0',
		
      },
      // 表单校验
      rules: {
        carg: [
          { required: true, message: "carg码不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "产品名称不能为空", trigger: "blur" }
        ],
		prodLength:[{ 
			pattern: /^(0|([1-9][0-9]*))(\.[\d]{1,2})?$/,
			message: "格式不正确",
			trigger: "blur"}],
		prodWidth:[{ 
			pattern: /^(0|([1-9][0-9]*))(\.[\d]{1,2})?$/,
			message: "格式不正确",
			trigger: "blur"}],
		risingFalling:[{ 
			pattern:/^(0|([1-9][0-9]*))(\.[\d]{1,2})?$/,
			message: "格式不正确",
			trigger: "blur"}],
		diagonal:[{ 
			pattern:/^(0|([1-9][0-9]*))(\.[\d]{1,2})?$/,
			message: "格式不正确",
			trigger: "blur"}],
        // technologyImg: [
        //   { required: true, message: "工艺图纸不能为空", trigger: "blur" }
        // ],
        retailPrice: [
          { required: true, message: "零售价不能为空", trigger: "blur" },
		  {
		  	pattern:/^(0|([1-9][0-9]*))(\.[\d]{1,2})?$/,
		  	message: "格式不正确",
		  	trigger: "blur"}
        ],
        // factoryCode: [
        //   { required: true, message: "本厂编码不能为空", trigger: "blur" }
        // ],
        // partNumber: [
        //   { required: true, message: "原厂件号不能为空", trigger: "blur" }
        // ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
		inventoryAlert: [
          { required: true, message: "库存预警不能为空", trigger: "blur" },
		  {
		  	pattern:/^[+]{0,1}(\d+)$/,
		  	message: "格式不正确",
		  	trigger: "blur"}
        ],
      },
      putoptions:[],//供应商
      canoptions:[],//参数
        pinoptions:[],//品牌
        selechoose:[],//参数
        cheoption:null,
		hsproud:false,//表单是否可操作
		tid:''
    };
  },
  created() {
    this.getList();
		
		let hasid=this.$route.query.id
		if(hasid){
			getProduct(hasid).then(response => {
			  this.form = response.data;
			  this.open = true;
			  this.title = "产品信息";
			  let arr=[]
					let seleinfo= this.form.storeProductParamRelList
					if(seleinfo){
						for(let i=0;i<seleinfo.length;i++){
						 arr[i]=[]
							arr[i].push(seleinfo[i].typeId,seleinfo[i].paramId)
							}
						this.selechoose=arr
					}
						
			});
			this.hsproud=true
		}else{
			this.hsproud=false
		}
	this.tid=localStorage.getItem('tid')
   
  },
  methods: {
    /** 查询产品信息列表 */
    getList() {
      this.loading = true;
      listProduct(this.queryParams).then(response => {
        this.productList = response.data.items;
        this.total = response.data.total;
        this.loading = false;
      });
    },

    // 品牌选择时，获取车型
    sercartupe(){
      getTypeData(this.form.productBrandId).then(res=>{
        listTypeData({parentId:res.data.parentId,type:1}).then(datas=>{
          this.cheoption=datas.data.items
        })
      })
    },


    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        productId: null,
        carg: null,
        name: null,
        technologyImg: null,
        motorcycleType: null,
        prodLength: null,
        prodWidth: null,
        risingFalling: null,
        diagonal: null,
        retailPrice: null,
        factoryCode: null,
        partNumber: null,
        prodColour: null,
        coloredRibbon: null,
        unit: null,
        inventoryAlert: null,
        status: "0",
        remark: null,
        tenantId: null,
        delFlag: null,
        revision: null,
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.productId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
	  this.hsproud=false
      this.open = true;
      this.selechoose=[]
      this.title = "添加产品信息";
			
			listTypeData({type:0}).then(res=>{
			  this.pinoptions=res.data.items
			})
			supplierlist({status:0}).then(res=>{
			  this.putoptions=res.data.items
			})
			arrtree().then(res=>{
			  let list=res.data
			  for(let i=0;i<list.length;i++){
			    if(list[i].children == null){
			      list[i].disabled=true
			    }
			  }
			   this.canoptions=list
			})
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
		listTypeData({type:0}).then(res=>{
		  this.pinoptions=res.data.items
		})
		supplierlist({status:0}).then(res=>{
		  this.putoptions=res.data.items
		})
		arrtree().then(res=>{
		  let list=res.data
		  for(let i=0;i<list.length;i++){
		    if(list[i].children == null){
		      list[i].disabled=true
		    }
		  }
		   this.canoptions=list
		})
		this.hsproud=false
      this.reset();
      this.selechoose=[]
      const productId = row.productId
      getProduct(productId).then(response => {
        this.form = response.data;
		console.log(this.form)
        this.open = true;
        this.title = "修改产品信息";
        let arr=[]
		let seleinfo= this.form.storeProductParamRelList
		if(seleinfo){
			for(let i=0;i<seleinfo.length;i++){
			 arr[i]=[]
				arr[i].push(seleinfo[i].typeId,seleinfo[i].paramId)
			}
			this.selechoose=arr
		}
      });
    },
    /** 提交按钮 */
    submitForm() {
		console.log(this.selechoose)
    this.form.productParams=[]
      for(let i=0;i<this.selechoose.length;i++){
        this.form.productParams.push(this.selechoose[i][1])
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.productId != null) {
            updateProduct(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addProduct(this.form).then(response => {
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
      const productIds = row.productId || this.ids;
      this.$modal.confirm('是否确认删除产品信息编号为"' + productIds + '"的数据项？').then(function() {
        return delProduct(productIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有产品信息数据项？').then(() => {
        this.exportLoading = true;
        return exportProduct(queryParams);
      }).then(response => {
        this.$download.name(response.msg);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
<style scoped>
	.fromflex{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	.fromflex .el-form-item{
		width: 48%;
	}
	  {
	    margin-left: 0px;
	  }
</style>
