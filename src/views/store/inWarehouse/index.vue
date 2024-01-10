<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="单号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="结算方式(1现金付款 2银行转账,挂账)" prop="paymentTerms">
        <el-input
          v-model="queryParams.paymentTerms"
          placeholder="请输入结算方式(1现金付款 2银行转账,挂账)"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单据类别" prop="orderCategory">
        <el-input
          v-model="queryParams.orderCategory"
          placeholder="请输入单据类别"
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
      <el-form-item label="上架人" prop="shelveBy">
        <el-input
          v-model="queryParams.shelveBy"
          placeholder="请输入上架人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上架人名称" prop="shelveUser">
        <el-input
          v-model="queryParams.shelveUser"
          placeholder="请输入上架人名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上架时间">
        <el-date-picker
          v-model="daterangeShelveDate"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
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
          v-hasPermi="['store:inWarehouse:add']"
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
          v-hasPermi="['store:inWarehouse:edit']"
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
          v-hasPermi="['store:inWarehouse:remove']"
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
          v-hasPermi="['store:inWarehouse:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="inWarehouseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="入库id" align="center" prop="inWarehouseId" />
      <el-table-column label="单号" align="center" prop="orderNo" />
      <el-table-column label="结算方式(1现金付款 2银行转账,挂账)" align="center" prop="paymentTerms" />
      <el-table-column label="单据类别" align="center" prop="orderCategory" />
      <el-table-column label="供应商编码" align="center" prop="vendorCode" />
      <el-table-column label="供应商名称" align="center" prop="vendorName" />
      <el-table-column label="门店编码" align="center" prop="warehouseCode" />
      <el-table-column label="门店名称" align="center" prop="warehouseName" />
      <el-table-column label="总价" align="center" prop="totalPrice" />
      <el-table-column label="上架人" align="center" prop="shelveBy" />
      <el-table-column label="上架人名称" align="center" prop="shelveUser" />
      <el-table-column label="上架时间" align="center" prop="shelveDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.shelveDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态(0正常，1禁用)" align="center" prop="status" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['store:inWarehouse:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:inWarehouse:remove']"
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

    <!-- 添加或修改入库对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="结算方式(1现金付款 2银行转账,挂账)" prop="paymentTerms">
          <el-input v-model="form.paymentTerms" placeholder="请输入结算方式(1现金付款 2银行转账,挂账)" />
        </el-form-item>
        <el-form-item label="单据类别" prop="orderCategory">
          <el-input v-model="form.orderCategory" placeholder="请输入单据类别" />
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
        <el-form-item label="门店id" prop="warehouseId">
          <el-input v-model="form.warehouseId" placeholder="请输入门店id" />
        </el-form-item>
        <el-form-item label="门店编码" prop="warehouseCode">
          <el-input v-model="form.warehouseCode" placeholder="请输入门店编码" />
        </el-form-item>
        <el-form-item label="门店名称" prop="warehouseName">
          <el-input v-model="form.warehouseName" placeholder="请输入门店名称" />
        </el-form-item>
        <el-form-item label="总价" prop="totalPrice">
          <el-input v-model="form.totalPrice" placeholder="请输入总价" />
        </el-form-item>
        <el-form-item label="上架人" prop="shelveBy">
          <el-input v-model="form.shelveBy" placeholder="请输入上架人" />
        </el-form-item>
        <el-form-item label="上架人名称" prop="shelveUser">
          <el-input v-model="form.shelveUser" placeholder="请输入上架人名称" />
        </el-form-item>
        <el-form-item label="上架时间" prop="shelveDate">
          <el-date-picker clearable size="small"
            v-model="form.shelveDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择上架时间">
          </el-date-picker>
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
import { listInWarehouse, getInWarehouse, delInWarehouse, addInWarehouse, updateInWarehouse, exportInWarehouse } from "@/api/store/inWarehouse";

export default {
  name: "InWarehouse",
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
      // 入库表格数据
      inWarehouseList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 备注时间范围
      daterangeShelveDate: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNo: null,
        paymentTerms: null,
        orderCategory: null,
        vendorCode: null,
        vendorName: null,
        warehouseCode: null,
        warehouseName: null,
        shelveBy: null,
        shelveUser: null,
        shelveDate: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        paymentTerms: [
          { required: true, message: "结算方式(1现金付款 2银行转账,挂账)不能为空", trigger: "blur" }
        ],
        orderCategory: [
          { required: true, message: "单据类别不能为空", trigger: "blur" }
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
        warehouseId: [
          { required: true, message: "门店id不能为空", trigger: "blur" }
        ],
        warehouseCode: [
          { required: true, message: "门店编码不能为空", trigger: "blur" }
        ],
        warehouseName: [
          { required: true, message: "门店名称不能为空", trigger: "blur" }
        ],
        totalPrice: [
          { required: true, message: "总价不能为空", trigger: "blur" }
        ],
        shelveBy: [
          { required: true, message: "上架人不能为空", trigger: "blur" }
        ],
        shelveUser: [
          { required: true, message: "上架人名称不能为空", trigger: "blur" }
        ],
        shelveDate: [
          { required: true, message: "上架时间不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询入库列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeShelveDate && '' != this.daterangeShelveDate) {
        this.queryParams.params["beginShelveDate"] = this.daterangeShelveDate[0];
        this.queryParams.params["endShelveDate"] = this.daterangeShelveDate[1];
      }
      listInWarehouse(this.queryParams).then(response => {
        this.inWarehouseList = response.rows;
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
        inWarehouseId: null,
        orderNo: null,
        paymentTerms: null,
        orderCategory: null,
        vendorId: null,
        vendorCode: null,
        vendorName: null,
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null,
        totalPrice: null,
        shelveBy: null,
        shelveUser: null,
        shelveDate: null,
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
      this.daterangeShelveDate = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.inWarehouseId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加入库";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const inWarehouseId = row.inWarehouseId || this.ids
      getInWarehouse(inWarehouseId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改入库";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.inWarehouseId != null) {
            updateInWarehouse(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInWarehouse(this.form).then(response => {
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
      const inWarehouseIds = row.inWarehouseId || this.ids;
      this.$modal.confirm('是否确认删除入库编号为"' + inWarehouseIds + '"的数据项？').then(function() {
        return delInWarehouse(inWarehouseIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有入库数据项？').then(() => {
        this.exportLoading = true;
        return exportInWarehouse(queryParams);
      }).then(response => {
        this.$download.name(response.msg);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
