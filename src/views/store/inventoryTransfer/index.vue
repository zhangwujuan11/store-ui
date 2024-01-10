<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="移入门店编码" prop="inTenantCode">
        <el-input
          v-model="queryParams.inTenantCode"
          placeholder="请输入移入门店编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="移入门店名称" prop="inTenantName">
        <el-input
          v-model="queryParams.inTenantName"
          placeholder="请输入移入门店名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="移出门店编码" prop="outTenantCode">
        <el-input
          v-model="queryParams.outTenantCode"
          placeholder="请输入移出门店编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="移出门店名称" prop="outTenantName">
        <el-input
          v-model="queryParams.outTenantName"
          placeholder="请输入移出门店名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单据类型" prop="orderType">
        <el-select v-model="queryParams.orderType" placeholder="请选择单据类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="单据编号" prop="orderOn">
        <el-input
          v-model="queryParams.orderOn"
          placeholder="请输入单据编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="经办人" prop="agentUser">
        <el-input
          v-model="queryParams.agentUser"
          placeholder="请输入经办人"
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
          v-hasPermi="['store:inventoryTransfer:add']"
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
          v-hasPermi="['store:inventoryTransfer:edit']"
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
          v-hasPermi="['store:inventoryTransfer:remove']"
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
          v-hasPermi="['store:inventoryTransfer:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="inventoryTransferList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="inventoryTransferId" />
      <el-table-column label="移入门店编码" align="center" prop="inTenantCode" />
      <el-table-column label="移入门店名称" align="center" prop="inTenantName" />
      <el-table-column label="移出门店编码" align="center" prop="outTenantCode" />
      <el-table-column label="移出门店名称" align="center" prop="outTenantName" />
      <el-table-column label="单据类型" align="center" prop="orderType" />
      <el-table-column label="单据编号" align="center" prop="orderOn" />
      <el-table-column label="经办人" align="center" prop="agentUser" />
      <el-table-column label="状态(0正常，1禁用)" align="center" prop="status" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['store:inventoryTransfer:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:inventoryTransfer:remove']"
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

    <!-- 添加或修改移库/调拨对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="移入门店id" prop="inTenantId">
          <el-input v-model="form.inTenantId" placeholder="请输入移入门店id" />
        </el-form-item>
        <el-form-item label="移入门店编码" prop="inTenantCode">
          <el-input v-model="form.inTenantCode" placeholder="请输入移入门店编码" />
        </el-form-item>
        <el-form-item label="移入门店名称" prop="inTenantName">
          <el-input v-model="form.inTenantName" placeholder="请输入移入门店名称" />
        </el-form-item>
        <el-form-item label="移出门店id" prop="outTenantId">
          <el-input v-model="form.outTenantId" placeholder="请输入移出门店id" />
        </el-form-item>
        <el-form-item label="移出门店编码" prop="outTenantCode">
          <el-input v-model="form.outTenantCode" placeholder="请输入移出门店编码" />
        </el-form-item>
        <el-form-item label="移出门店名称" prop="outTenantName">
          <el-input v-model="form.outTenantName" placeholder="请输入移出门店名称" />
        </el-form-item>
        <el-form-item label="单据类型" prop="orderType">
          <el-select v-model="form.orderType" placeholder="请选择单据类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="单据编号" prop="orderOn">
          <el-input v-model="form.orderOn" placeholder="请输入单据编号" />
        </el-form-item>
        <el-form-item label="经办人id" prop="agentUid">
          <el-input v-model="form.agentUid" placeholder="请输入经办人id" />
        </el-form-item>
        <el-form-item label="经办人" prop="agentUser">
          <el-input v-model="form.agentUser" placeholder="请输入经办人" />
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
import { listInventoryTransfer, getInventoryTransfer, delInventoryTransfer, addInventoryTransfer, updateInventoryTransfer, exportInventoryTransfer } from "@/api/store/inventoryTransfer";

export default {
  name: "InventoryTransfer",
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
      // 移库/调拨表格数据
      inventoryTransferList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        inTenantCode: null,
        inTenantName: null,
        outTenantCode: null,
        outTenantName: null,
        orderType: null,
        orderOn: null,
        agentUser: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        inTenantId: [
          { required: true, message: "移入门店id不能为空", trigger: "blur" }
        ],
        inTenantCode: [
          { required: true, message: "移入门店编码不能为空", trigger: "blur" }
        ],
        inTenantName: [
          { required: true, message: "移入门店名称不能为空", trigger: "blur" }
        ],
        outTenantId: [
          { required: true, message: "移出门店id不能为空", trigger: "blur" }
        ],
        outTenantCode: [
          { required: true, message: "移出门店编码不能为空", trigger: "blur" }
        ],
        outTenantName: [
          { required: true, message: "移出门店名称不能为空", trigger: "blur" }
        ],
        orderType: [
          { required: true, message: "单据类型不能为空", trigger: "change" }
        ],
        orderOn: [
          { required: true, message: "单据编号不能为空", trigger: "blur" }
        ],
        agentUid: [
          { required: true, message: "经办人id不能为空", trigger: "blur" }
        ],
        agentUser: [
          { required: true, message: "经办人不能为空", trigger: "blur" }
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
    /** 查询移库/调拨列表 */
    getList() {
      this.loading = true;
      listInventoryTransfer(this.queryParams).then(response => {
        this.inventoryTransferList = response.rows;
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
        inventoryTransferId: null,
        inTenantId: null,
        inTenantCode: null,
        inTenantName: null,
        outTenantId: null,
        outTenantCode: null,
        outTenantName: null,
        orderType: null,
        orderOn: null,
        agentUid: null,
        agentUser: null,
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
      this.ids = selection.map(item => item.inventoryTransferId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加移库/调拨";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const inventoryTransferId = row.inventoryTransferId || this.ids
      getInventoryTransfer(inventoryTransferId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改移库/调拨";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.inventoryTransferId != null) {
            updateInventoryTransfer(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInventoryTransfer(this.form).then(response => {
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
      const inventoryTransferIds = row.inventoryTransferId || this.ids;
      this.$modal.confirm('是否确认删除移库/调拨编号为"' + inventoryTransferIds + '"的数据项？').then(function() {
        return delInventoryTransfer(inventoryTransferIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有移库/调拨数据项？').then(() => {
        this.exportLoading = true;
        return exportInventoryTransfer(queryParams);
      }).then(response => {
        this.$download.name(response.msg);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
