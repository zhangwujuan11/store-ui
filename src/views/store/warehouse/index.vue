<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="编码" prop="warehouseCode">
        <el-input
          v-model="queryParams.warehouseCode"
          placeholder="请输入编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="名称" prop="warehouseName">
        <el-input
          v-model="queryParams.warehouseName"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="门店管理员" prop="warehouseAdmin">
        <el-input
          v-model="queryParams.warehouseAdmin"
          placeholder="请输入门店管理员"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="管理员电话" prop="adminPhone">
        <el-input
          v-model="queryParams.adminPhone"
          placeholder="请输入管理员电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="门店电话" prop="warehousePhone">
        <el-input
          v-model="queryParams.warehousePhone"
          placeholder="请输入门店电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型(0 门店，1库区，2货架，3库位) 预留" prop="warehouseType">
        <el-select v-model="queryParams.warehouseType" placeholder="请选择类型(0 门店，1库区，2货架，3库位) 预留" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="门店类别" prop="warehouseCategory">
        <el-input
          v-model="queryParams.warehouseCategory"
          placeholder="请输入门店类别"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="门店地址" prop="warehouseAddress">
        <el-input
          v-model="queryParams.warehouseAddress"
          placeholder="请输入门店地址"
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
          v-hasPermi="['store:warehouse:add']"
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
          v-hasPermi="['store:warehouse:edit']"
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
          v-hasPermi="['store:warehouse:remove']"
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
          v-hasPermi="['store:warehouse:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="warehouseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="warehouseId" />
      <el-table-column label="编码" align="center" prop="warehouseCode" />
      <el-table-column label="名称" align="center" prop="warehouseName" />
      <el-table-column label="门店管理员" align="center" prop="warehouseAdmin" />
      <el-table-column label="管理员电话" align="center" prop="adminPhone" />
      <el-table-column label="门店电话" align="center" prop="warehousePhone" />
      <el-table-column label="类型(0 门店，1库区，2货架，3库位) 预留" align="center" prop="warehouseType" />
      <el-table-column label="门店类别" align="center" prop="warehouseCategory" />
      <el-table-column label="门店地址" align="center" prop="warehouseAddress" />
      <el-table-column label="状态(0正常，1禁用)" align="center" prop="status" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['store:warehouse:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:warehouse:remove']"
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

    <!-- 添加或修改门店管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="编码" prop="warehouseCode">
          <el-input v-model="form.warehouseCode" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="名称" prop="warehouseName">
          <el-input v-model="form.warehouseName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="门店管理员" prop="warehouseAdmin">
          <el-input v-model="form.warehouseAdmin" placeholder="请输入门店管理员" />
        </el-form-item>
        <el-form-item label="管理员电话" prop="adminPhone">
          <el-input v-model="form.adminPhone" placeholder="请输入管理员电话" />
        </el-form-item>
        <el-form-item label="门店电话" prop="warehousePhone">
          <el-input v-model="form.warehousePhone" placeholder="请输入门店电话" />
        </el-form-item>
        <el-form-item label="类型(0 门店，1库区，2货架，3库位) 预留" prop="warehouseType">
          <el-select v-model="form.warehouseType" placeholder="请选择类型(0 门店，1库区，2货架，3库位) 预留">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="门店类别" prop="warehouseCategory">
          <el-input v-model="form.warehouseCategory" placeholder="请输入门店类别" />
        </el-form-item>
        <el-form-item label="门店地址" prop="warehouseAddress">
          <el-input v-model="form.warehouseAddress" placeholder="请输入门店地址" />
        </el-form-item>
        <el-form-item label="省id" prop="provinceId">
          <el-input v-model="form.provinceId" placeholder="请输入省id" />
        </el-form-item>
        <el-form-item label="省" prop="province">
          <el-input v-model="form.province" placeholder="请输入省" />
        </el-form-item>
        <el-form-item label="市id" prop="cityId">
          <el-input v-model="form.cityId" placeholder="请输入市id" />
        </el-form-item>
        <el-form-item label="市" prop="city">
          <el-input v-model="form.city" placeholder="请输入市" />
        </el-form-item>
        <el-form-item label="区id" prop="areaId">
          <el-input v-model="form.areaId" placeholder="请输入区id" />
        </el-form-item>
        <el-form-item label="区" prop="area">
          <el-input v-model="form.area" placeholder="请输入区" />
        </el-form-item>
        <el-form-item label="详细地址" prop="detailedAddress">
          <el-input v-model="form.detailedAddress" placeholder="请输入详细地址" />
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
import { listWarehouse, getWarehouse, delWarehouse, addWarehouse, updateWarehouse, exportWarehouse } from "@/api/store/warehouse";

export default {
  name: "Warehouse",
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
      // 门店管理表格数据
      warehouseList: [],
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
        warehouseAdmin: null,
        adminPhone: null,
        warehousePhone: null,
        warehouseType: null,
        warehouseCategory: null,
        warehouseAddress: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        warehouseCode: [
          { required: true, message: "编码不能为空", trigger: "blur" }
        ],
        warehouseName: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        warehouseType: [
          { required: true, message: "类型(0 门店，1库区，2货架，3库位) 预留不能为空", trigger: "change" }
        ],
        warehouseCategory: [
          { required: true, message: "门店类别不能为空", trigger: "blur" }
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
    /** 查询门店管理列表 */
    getList() {
      this.loading = true;
      listWarehouse(this.queryParams).then(response => {
        this.warehouseList = response.rows;
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
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null,
        warehouseAdmin: null,
        adminPhone: null,
        warehousePhone: null,
        warehouseType: null,
        warehouseCategory: null,
        warehouseAddress: null,
        provinceId: null,
        province: null,
        cityId: null,
        city: null,
        areaId: null,
        area: null,
        detailedAddress: null,
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
      this.ids = selection.map(item => item.warehouseId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加门店管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const warehouseId = row.warehouseId || this.ids
      getWarehouse(warehouseId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改门店管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.warehouseId != null) {
            updateWarehouse(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWarehouse(this.form).then(response => {
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
      const warehouseIds = row.warehouseId || this.ids;
      this.$modal.confirm('是否确认删除门店管理编号为"' + warehouseIds + '"的数据项？').then(function() {
        return delWarehouse(warehouseIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有门店管理数据项？').then(() => {
        this.exportLoading = true;
        return exportWarehouse(queryParams);
      }).then(response => {
        this.$download.name(response.msg);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
