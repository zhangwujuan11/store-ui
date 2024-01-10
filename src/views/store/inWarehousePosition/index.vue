<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
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
      <el-form-item label="库位编码" prop="positionCode">
        <el-input
          v-model="queryParams.positionCode"
          placeholder="请输入库位编码"
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
          v-hasPermi="['store:inWarehousePosition:add']"
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
          v-hasPermi="['store:inWarehousePosition:edit']"
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
          v-hasPermi="['store:inWarehousePosition:remove']"
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
          v-hasPermi="['store:inWarehousePosition:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="inWarehousePositionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="inWarehousePositionId" />
      <el-table-column label="门店编码" align="center" prop="warehouseCode" />
      <el-table-column label="门店名称" align="center" prop="warehouseName" />
      <el-table-column label="库位编码" align="center" prop="positionCode" />
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
            v-hasPermi="['store:inWarehousePosition:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:inWarehousePosition:remove']"
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

    <!-- 添加或修改入库库位对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="入库id" prop="inWarehouseDelId">
          <el-input v-model="form.inWarehouseDelId" placeholder="请输入入库id" />
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
        <el-form-item label="库位id" prop="positionId">
          <el-input v-model="form.positionId" placeholder="请输入库位id" />
        </el-form-item>
        <el-form-item label="库位编码" prop="positionCode">
          <el-input v-model="form.positionCode" placeholder="请输入库位编码" />
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
import { listInWarehousePosition, getInWarehousePosition, delInWarehousePosition, addInWarehousePosition, updateInWarehousePosition, exportInWarehousePosition } from "@/api/store/inWarehousePosition";

export default {
  name: "InWarehousePosition",
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
      // 入库库位表格数据
      inWarehousePositionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        warehouseCode: null,
        warehouseName: null,
        positionCode: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        inWarehouseDelId: [
          { required: true, message: "入库id不能为空", trigger: "blur" }
        ],
        warehouseId: [
          { required: true, message: "门店id不能为空", trigger: "blur" }
        ],
        warehouseCode: [
          { required: true, message: "门店编码不能为空", trigger: "blur" }
        ],
        warehouseName: [
          { required: true, message: "门店名称不能为空", trigger: "blur" }
        ],
        positionId: [
          { required: true, message: "库位id不能为空", trigger: "blur" }
        ],
        positionCode: [
          { required: true, message: "库位编码不能为空", trigger: "blur" }
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
    /** 查询入库库位列表 */
    getList() {
      this.loading = true;
      listInWarehousePosition(this.queryParams).then(response => {
        this.inWarehousePositionList = response.rows;
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
        inWarehousePositionId: null,
        inWarehouseDelId: null,
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null,
        positionId: null,
        positionCode: null,
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
      this.ids = selection.map(item => item.inWarehousePositionId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加入库库位";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const inWarehousePositionId = row.inWarehousePositionId || this.ids
      getInWarehousePosition(inWarehousePositionId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改入库库位";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.inWarehousePositionId != null) {
            updateInWarehousePosition(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInWarehousePosition(this.form).then(response => {
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
      const inWarehousePositionIds = row.inWarehousePositionId || this.ids;
      this.$modal.confirm('是否确认删除入库库位编号为"' + inWarehousePositionIds + '"的数据项？').then(function() {
        return delInWarehousePosition(inWarehousePositionIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有入库库位数据项？').then(() => {
        this.exportLoading = true;
        return exportInWarehousePosition(queryParams);
      }).then(response => {
        this.$download.name(response.msg);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
