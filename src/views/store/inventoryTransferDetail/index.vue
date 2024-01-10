<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="门店编码" prop="outWarehouseCode">
        <el-input
          v-model="queryParams.outWarehouseCode"
          placeholder="请输入门店编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="门店名称" prop="outWarehouseName">
        <el-input
          v-model="queryParams.outWarehouseName"
          placeholder="请输入门店名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="门店编码" prop="inWarehouseCode">
        <el-input
          v-model="queryParams.inWarehouseCode"
          placeholder="请输入门店编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="门店名称" prop="inWarehouseName">
        <el-input
          v-model="queryParams.inWarehouseName"
          placeholder="请输入门店名称"
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
      <el-form-item label="carg" prop="carg">
        <el-input
          v-model="queryParams.carg"
          placeholder="请输入carg"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态(0正常，1禁用)" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态(0正常，1禁用)" clearable size="small">
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
          v-hasPermi="['store:inventoryTransferDetail:add']"
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
          v-hasPermi="['store:inventoryTransferDetail:edit']"
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
          v-hasPermi="['store:inventoryTransferDetail:remove']"
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
          v-hasPermi="['store:inventoryTransferDetail:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="inventoryTransferDetailList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="移库明细id" align="center" prop="inventoryTransferDelId" />
      <el-table-column label="门店编码" align="center" prop="outWarehouseCode" />
      <el-table-column label="门店名称" align="center" prop="outWarehouseName" />
      <el-table-column label="门店编码" align="center" prop="inWarehouseCode" />
      <el-table-column label="门店名称" align="center" prop="inWarehouseName" />
      <el-table-column label="产品名称" align="center" prop="productName" />
      <el-table-column label="carg" align="center" prop="carg" />
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column label="数量" align="center" prop="quantity" />
      <el-table-column label="状态(0正常，1禁用)" align="center" prop="status" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['store:inventoryTransferDetail:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:inventoryTransferDetail:remove']"
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

    <!-- 添加或修改移库/调拨明细对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="移库单id" prop="inventoryTransferId">
          <el-input v-model="form.inventoryTransferId" placeholder="请输入移库单id" />
        </el-form-item>
        <el-form-item label="门店id" prop="outWarehouseId">
          <el-input v-model="form.outWarehouseId" placeholder="请输入门店id" />
        </el-form-item>
        <el-form-item label="门店编码" prop="outWarehouseCode">
          <el-input v-model="form.outWarehouseCode" placeholder="请输入门店编码" />
        </el-form-item>
        <el-form-item label="门店名称" prop="outWarehouseName">
          <el-input v-model="form.outWarehouseName" placeholder="请输入门店名称" />
        </el-form-item>
        <el-form-item label="门店id" prop="inWarehouseId">
          <el-input v-model="form.inWarehouseId" placeholder="请输入门店id" />
        </el-form-item>
        <el-form-item label="门店编码" prop="inWarehouseCode">
          <el-input v-model="form.inWarehouseCode" placeholder="请输入门店编码" />
        </el-form-item>
        <el-form-item label="门店名称" prop="inWarehouseName">
          <el-input v-model="form.inWarehouseName" placeholder="请输入门店名称" />
        </el-form-item>
        <el-form-item label="产品id" prop="productId">
          <el-input v-model="form.productId" placeholder="请输入产品id" />
        </el-form-item>
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="carg" prop="carg">
          <el-input v-model="form.carg" placeholder="请输入carg" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input v-model="form.quantity" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="状态(0正常，1禁用)">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
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
import { listInventoryTransferDetail, getInventoryTransferDetail, delInventoryTransferDetail, addInventoryTransferDetail, updateInventoryTransferDetail, exportInventoryTransferDetail } from "@/api/store/inventoryTransferDetail";

export default {
  name: "InventoryTransferDetail",
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
      // 移库/调拨明细表格数据
      inventoryTransferDetailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        outWarehouseCode: null,
        outWarehouseName: null,
        inWarehouseCode: null,
        inWarehouseName: null,
        productName: null,
        carg: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        inventoryTransferId: [
          { required: true, message: "移库单id不能为空", trigger: "blur" }
        ],
        outWarehouseId: [
          { required: true, message: "门店id不能为空", trigger: "blur" }
        ],
        outWarehouseCode: [
          { required: true, message: "门店编码不能为空", trigger: "blur" }
        ],
        outWarehouseName: [
          { required: true, message: "门店名称不能为空", trigger: "blur" }
        ],
        inWarehouseId: [
          { required: true, message: "门店id不能为空", trigger: "blur" }
        ],
        inWarehouseCode: [
          { required: true, message: "门店编码不能为空", trigger: "blur" }
        ],
        inWarehouseName: [
          { required: true, message: "门店名称不能为空", trigger: "blur" }
        ],
        productId: [
          { required: true, message: "产品id不能为空", trigger: "blur" }
        ],
        productName: [
          { required: true, message: "产品名称不能为空", trigger: "blur" }
        ],
        carg: [
          { required: true, message: "carg不能为空", trigger: "blur" }
        ],
        unit: [
          { required: true, message: "单位不能为空", trigger: "blur" }
        ],
        quantity: [
          { required: true, message: "数量不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态(0正常，1禁用)不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询移库/调拨明细列表 */
    getList() {
      this.loading = true;
      listInventoryTransferDetail(this.queryParams).then(response => {
        this.inventoryTransferDetailList = response.rows;
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
        inventoryTransferDelId: null,
        inventoryTransferId: null,
        outWarehouseId: null,
        outWarehouseCode: null,
        outWarehouseName: null,
        inWarehouseId: null,
        inWarehouseCode: null,
        inWarehouseName: null,
        productId: null,
        productName: null,
        carg: null,
        unit: null,
        quantity: null,
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
      this.ids = selection.map(item => item.inventoryTransferDelId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加移库/调拨明细";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const inventoryTransferDelId = row.inventoryTransferDelId || this.ids
      getInventoryTransferDetail(inventoryTransferDelId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改移库/调拨明细";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.inventoryTransferDelId != null) {
            updateInventoryTransferDetail(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInventoryTransferDetail(this.form).then(response => {
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
      const inventoryTransferDelIds = row.inventoryTransferDelId || this.ids;
      this.$modal.confirm('是否确认删除移库/调拨明细编号为"' + inventoryTransferDelIds + '"的数据项？').then(function() {
        return delInventoryTransferDetail(inventoryTransferDelIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有移库/调拨明细数据项？').then(() => {
        this.exportLoading = true;
        return exportInventoryTransferDetail(queryParams);
      }).then(response => {
        this.$download.name(response.msg);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
