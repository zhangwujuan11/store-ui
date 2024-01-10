<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
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
      <el-form-item label="门店名字" prop="warehouseName">
        <el-input
          v-model="queryParams.warehouseName"
          placeholder="请输入门店名字"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="供应商编码" prop="vendorCode">
        <el-input
          v-model="queryParams.vendorCode"
          placeholder="请输入供应商编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="供应商名称" prop="vendorName">
        <el-input
          v-model="queryParams.vendorName"
          placeholder="请输入供应商名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态(0正常，1禁用)" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态(0正常，1禁用)" clearable size="small">
          <el-option
            v-for="dict in dict.type.sys_show_hide"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
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
          v-hasPermi="['store:inventory:add']"
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
          v-hasPermi="['store:inventory:edit']"
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
          v-hasPermi="['store:inventory:remove']"
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
          v-hasPermi="['store:inventory:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="inventoryList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="inventoryId" />
      <el-table-column label="carg" align="center" prop="carg" />
      <el-table-column label="产品名称" align="center" prop="productName" />
      <el-table-column label="门店编码" align="center" prop="warehouseCode" />
      <el-table-column label="门店名字" align="center" prop="warehouseName" />
      <el-table-column label="供应商编码" align="center" prop="vendorCode" />
      <el-table-column label="供应商名称" align="center" prop="vendorName" />
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column label="库存量" align="center" prop="inventoryQuantity" />
      <el-table-column label="可用量" align="center" prop="usableQuantity" />
      <el-table-column label="占用数量" align="center" prop="occupyQuantity" />
      <el-table-column label="单价" align="center" prop="price" />
      <el-table-column label="状态(0正常，1禁用)" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_show_hide" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['store:inventory:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:inventory:remove']"
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

    <!-- 添加或修改库存对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="产品id" prop="productId">
          <el-input v-model="form.productId" placeholder="请输入产品id" />
        </el-form-item>
        <el-form-item label="carg" prop="carg">
          <el-input v-model="form.carg" placeholder="请输入carg" />
        </el-form-item>
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="门店id" prop="warehouseId">
          <el-input v-model="form.warehouseId" placeholder="请输入门店id" />
        </el-form-item>
        <el-form-item label="门店编码" prop="warehouseCode">
          <el-input v-model="form.warehouseCode" placeholder="请输入门店编码" />
        </el-form-item>
        <el-form-item label="门店名字" prop="warehouseName">
          <el-input v-model="form.warehouseName" placeholder="请输入门店名字" />
        </el-form-item>
        <el-form-item label="供应商id" prop="vendorId">
          <el-input v-model="form.vendorId" placeholder="请输入供应商id" />
        </el-form-item>
        <el-form-item label="供应商编码" prop="vendorCode">
          <el-input v-model="form.vendorCode" placeholder="请输入供应商编码" />
        </el-form-item>
        <el-form-item label="供应商名称" prop="vendorName">
          <el-input v-model="form.vendorName" placeholder="请输入供应商名称" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="库存量" prop="inventoryQuantity">
          <el-input v-model="form.inventoryQuantity" placeholder="请输入库存量" />
        </el-form-item>
        <el-form-item label="可用量" prop="usableQuantity">
          <el-input v-model="form.usableQuantity" placeholder="请输入可用量" />
        </el-form-item>
        <el-form-item label="占用数量" prop="occupyQuantity">
          <el-input v-model="form.occupyQuantity" placeholder="请输入占用数量" />
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input v-model="form.price" placeholder="请输入单价" />
        </el-form-item>
        <el-form-item label="状态(0正常，1禁用)" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态(0正常，1禁用)">
            <el-option
              v-for="dict in dict.type.sys_show_hide"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
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
import { listInventory, getInventory, delInventory, addInventory, updateInventory, exportInventory } from "@/api/store/inventory";

export default {
  name: "Inventory",
  dicts: ['sys_show_hide'],
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
        carg: null,
        productName: null,
        warehouseCode: null,
        warehouseName: null,
        vendorCode: null,
        vendorName: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        productId: [
          { required: true, message: "产品id不能为空", trigger: "blur" }
        ],
        carg: [
          { required: true, message: "carg不能为空", trigger: "blur" }
        ],
        productName: [
          { required: true, message: "产品名称不能为空", trigger: "blur" }
        ],
        warehouseId: [
          { required: true, message: "门店id不能为空", trigger: "blur" }
        ],
        warehouseCode: [
          { required: true, message: "门店编码不能为空", trigger: "blur" }
        ],
        warehouseName: [
          { required: true, message: "门店名字不能为空", trigger: "blur" }
        ],
        positionId: [
          { required: true, message: "库位id(预留)不能为空", trigger: "blur" }
        ],
        positionCode: [
          { required: true, message: "库位编码(预留)不能为空", trigger: "blur" }
        ],
        vendorId: [
          { required: true, message: "供应商id不能为空", trigger: "blur" }
        ],
        vendorCode: [
          { required: true, message: "供应商编码不能为空", trigger: "blur" }
        ],
        vendorName: [
          { required: true, message: "供应商名称不能为空", trigger: "blur" }
        ],
        unit: [
          { required: true, message: "单位不能为空", trigger: "blur" }
        ],
        inventoryQuantity: [
          { required: true, message: "库存量不能为空", trigger: "blur" }
        ],
        usableQuantity: [
          { required: true, message: "可用量不能为空", trigger: "blur" }
        ],
        occupyQuantity: [
          { required: true, message: "占用数量不能为空", trigger: "blur" }
        ],
        price: [
          { required: true, message: "单价不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态(0正常，1禁用)不能为空", trigger: "change" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询库存列表 */
    getList() {
      this.loading = true;
      listInventory(this.queryParams).then(response => {
        this.inventoryList = response.rows;
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
        inventoryId: null,
        productId: null,
        carg: null,
        productName: null,
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null,
        positionId: null,
        positionCode: null,
        vendorId: null,
        vendorCode: null,
        vendorName: null,
        unit: null,
        inventoryQuantity: null,
        usableQuantity: null,
        occupyQuantity: null,
        price: null,
        status: null,
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
      this.ids = selection.map(item => item.inventoryId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加库存";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const inventoryId = row.inventoryId || this.ids
      getInventory(inventoryId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改库存";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.inventoryId != null) {
            updateInventory(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInventory(this.form).then(response => {
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
      const inventoryIds = row.inventoryId || this.ids;
      this.$modal.confirm('是否确认删除库存编号为"' + inventoryIds + '"的数据项？').then(function() {
        return delInventory(inventoryIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有库存数据项？').then(() => {
        this.exportLoading = true;
        return exportInventory(queryParams);
      }).then(response => {
        this.$download.name(response.msg);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
