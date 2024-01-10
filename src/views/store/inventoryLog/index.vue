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
      <el-form-item label="业务类型(出库，入库、退货)" prop="busType">
        <el-select v-model="queryParams.busType" placeholder="请选择业务类型(出库，入库、退货)" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="业务来源单号" prop="busCode">
        <el-input
          v-model="queryParams.busCode"
          placeholder="请输入业务来源单号"
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
          v-hasPermi="['store:inventoryLog:add']"
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
          v-hasPermi="['store:inventoryLog:edit']"
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
          v-hasPermi="['store:inventoryLog:remove']"
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
          v-hasPermi="['store:inventoryLog:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="inventoryLogList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="inventoryLogId" />
      <el-table-column label="carg码" align="center" prop="carg" />
      <el-table-column label="产品名称" align="center" prop="productName" />
      <el-table-column label="门店编码" align="center" prop="warehouseCode" />
      <el-table-column label="门店名称" align="center" prop="warehouseName" />
      <el-table-column label="业务类型(出库，入库、退货)" align="center" prop="busType" />
      <el-table-column label="业务来源单号" align="center" prop="busCode" />
      <el-table-column label="增减类型(i-增加，d-减少)" align="center" prop="incDecType" />
      <el-table-column label="增减单价" align="center" prop="incDecPrice" />
      <el-table-column label="增减量" align="center" prop="incDecQuantity" />
      <el-table-column label="前值" align="center" prop="beforeQuantity" />
      <el-table-column label="后值" align="center" prop="afterQuantity" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['store:inventoryLog:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:inventoryLog:remove']"
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

    <!-- 添加或修改库存日志对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="库存表id" prop="inventoryId">
          <el-input v-model="form.inventoryId" placeholder="请输入库存表id" />
        </el-form-item>
        <el-form-item label="产品id" prop="productId">
          <el-input v-model="form.productId" placeholder="请输入产品id" />
        </el-form-item>
        <el-form-item label="carg码" prop="carg">
          <el-input v-model="form.carg" placeholder="请输入carg码" />
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
        <el-form-item label="门店名称" prop="warehouseName">
          <el-input v-model="form.warehouseName" placeholder="请输入门店名称" />
        </el-form-item>
        <el-form-item label="业务类型(出库，入库、退货)" prop="busType">
          <el-select v-model="form.busType" placeholder="请选择业务类型(出库，入库、退货)">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="业务来源单号" prop="busCode">
          <el-input v-model="form.busCode" placeholder="请输入业务来源单号" />
        </el-form-item>
        <el-form-item label="业务id" prop="busId">
          <el-input v-model="form.busId" placeholder="请输入业务id" />
        </el-form-item>
        <el-form-item label="增减类型(i-增加，d-减少)" prop="incDecType">
          <el-select v-model="form.incDecType" placeholder="请选择增减类型(i-增加，d-减少)">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="增减单价" prop="incDecPrice">
          <el-input v-model="form.incDecPrice" placeholder="请输入增减单价" />
        </el-form-item>
        <el-form-item label="增减量" prop="incDecQuantity">
          <el-input v-model="form.incDecQuantity" placeholder="请输入增减量" />
        </el-form-item>
        <el-form-item label="前值" prop="beforeQuantity">
          <el-input v-model="form.beforeQuantity" placeholder="请输入前值" />
        </el-form-item>
        <el-form-item label="后值" prop="afterQuantity">
          <el-input v-model="form.afterQuantity" placeholder="请输入后值" />
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
import { listInventoryLog, getInventoryLog, delInventoryLog, addInventoryLog, updateInventoryLog, exportInventoryLog } from "@/api/store/inventoryLog";

export default {
  name: "InventoryLog",
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
      // 库存日志表格数据
      inventoryLogList: [],
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
        busType: null,
        busCode: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询库存日志列表 */
    getList() {
      this.loading = true;
      listInventoryLog(this.queryParams).then(response => {
        this.inventoryLogList = response.rows;
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
        inventoryLogId: null,
        inventoryId: null,
        productId: null,
        carg: null,
        productName: null,
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null,
        busType: null,
        busCode: null,
        busId: null,
        incDecType: null,
        incDecPrice: null,
        incDecQuantity: null,
        beforeQuantity: null,
        afterQuantity: null,
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
      this.ids = selection.map(item => item.inventoryLogId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加库存日志";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const inventoryLogId = row.inventoryLogId || this.ids
      getInventoryLog(inventoryLogId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改库存日志";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.inventoryLogId != null) {
            updateInventoryLog(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInventoryLog(this.form).then(response => {
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
      const inventoryLogIds = row.inventoryLogId || this.ids;
      this.$modal.confirm('是否确认删除库存日志编号为"' + inventoryLogIds + '"的数据项？').then(function() {
        return delInventoryLog(inventoryLogIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有库存日志数据项？').then(() => {
        this.exportLoading = true;
        return exportInventoryLog(queryParams);
      }).then(response => {
        this.$download.name(response.msg);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
