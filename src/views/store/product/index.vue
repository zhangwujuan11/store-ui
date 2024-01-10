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
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工艺图纸" prop="technologyImg">
        <el-input
          v-model="queryParams.technologyImg"
          placeholder="请输入工艺图纸"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车型" prop="motorcycleType">
        <el-select v-model="queryParams.motorcycleType" placeholder="请选择车型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="本厂编码" prop="factoryCode">
        <el-input
          v-model="queryParams.factoryCode"
          placeholder="请输入本厂编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="原厂件号" prop="partNumber">
        <el-input
          v-model="queryParams.partNumber"
          placeholder="请输入原厂件号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="请选择字典生成" value="" />
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
          v-hasPermi="['store:product:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['store:product:edit']"
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
          v-hasPermi="['store:product:remove']"
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
          v-hasPermi="['store:product:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="productList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="productId" />
      <el-table-column label="carg码" align="center" prop="carg" />
      <el-table-column label="产品名称" align="center" prop="name" />
      <el-table-column label="工艺图纸" align="center" prop="technologyImg" />
      <el-table-column label="车型" align="center" prop="motorcycleType" />
      <el-table-column label="长度" align="center" prop="prodLength" />
      <el-table-column label="中高" align="center" prop="risingFalling" />
      <el-table-column label="对角" align="center" prop="diagonal" />
      <el-table-column label="零售价" align="center" prop="retailPrice" />
      <el-table-column label="本厂编码" align="center" prop="factoryCode" />
      <el-table-column label="原厂件号" align="center" prop="partNumber" />
      <el-table-column label="颜色" align="center" prop="prodColour" />
      <el-table-column label="彩带" align="center" prop="coloredRibbon" />
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column label="库存预警" align="center" prop="inventoryAlert" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="产品备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['store:product:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
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
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="carg码" prop="carg">
          <el-input v-model="form.carg" placeholder="请输入carg码" />
        </el-form-item>
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="工艺图纸" prop="technologyImg">
          <el-input v-model="form.technologyImg" placeholder="请输入工艺图纸" />
        </el-form-item>
        <el-form-item label="车型" prop="motorcycleType">
          <el-select v-model="form.motorcycleType" placeholder="请选择车型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="长度" prop="prodLength">
          <el-input v-model="form.prodLength" placeholder="请输入长度" />
        </el-form-item>
        <el-form-item label="宽度" prop="prodWidth">
          <el-input v-model="form.prodWidth" placeholder="请输入宽度" />
        </el-form-item>
        <el-form-item label="中高" prop="risingFalling">
          <el-input v-model="form.risingFalling" placeholder="请输入中高" />
        </el-form-item>
        <el-form-item label="对角" prop="diagonal">
          <el-input v-model="form.diagonal" placeholder="请输入对角" />
        </el-form-item>
        <el-form-item label="零售价" prop="retailPrice">
          <el-input v-model="form.retailPrice" placeholder="请输入零售价" />
        </el-form-item>
        <el-form-item label="本厂编码" prop="factoryCode">
          <el-input v-model="form.factoryCode" placeholder="请输入本厂编码" />
        </el-form-item>
        <el-form-item label="原厂件号" prop="partNumber">
          <el-input v-model="form.partNumber" placeholder="请输入原厂件号" />
        </el-form-item>
        <el-form-item label="颜色" prop="prodColour">
          <el-input v-model="form.prodColour" placeholder="请输入颜色" />
        </el-form-item>
        <el-form-item label="彩带" prop="coloredRibbon">
          <el-input v-model="form.coloredRibbon" placeholder="请输入彩带" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="库存预警" prop="inventoryAlert">
          <el-input v-model="form.inventoryAlert" placeholder="请输入库存预警" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="产品备注" prop="remark">
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
import { listProduct, getProduct, delProduct, addProduct, updateProduct, exportProduct } from "@/api/store/product";

export default {
  name: "Product",
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
      form: {},
      // 表单校验
      rules: {
        carg: [
          { required: true, message: "carg码不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "产品名称不能为空", trigger: "blur" }
        ],
        technologyImg: [
          { required: true, message: "工艺图纸不能为空", trigger: "blur" }
        ],
        retailPrice: [
          { required: true, message: "零售价不能为空", trigger: "blur" }
        ],
        factoryCode: [
          { required: true, message: "本厂编码不能为空", trigger: "blur" }
        ],
        partNumber: [
          { required: true, message: "原厂件号不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询产品信息列表 */
    getList() {
      this.loading = true;
      listProduct(this.queryParams).then(response => {
        this.productList = response.rows;
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
      this.open = true;
      this.title = "添加产品信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const productId = row.productId || this.ids
      getProduct(productId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改产品信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
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
