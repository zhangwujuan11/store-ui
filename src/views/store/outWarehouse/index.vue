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
      <el-form-item label="单据类型" prop="orderType">
        <el-select v-model="queryParams.orderType" placeholder="请选择单据类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="车牌号" prop="plateNumber">
        <el-input
          v-model="queryParams.plateNumber"
          placeholder="请输入车牌号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="施工人员" prop="constructionWork">
        <el-input
          v-model="queryParams.constructionWork"
          placeholder="请输入施工人员"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="往来客户" prop="customer">
        <el-input
          v-model="queryParams.customer"
          placeholder="请输入往来客户"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系电话" prop="phoneNumber">
        <el-input
          v-model="queryParams.phoneNumber"
          placeholder="请输入联系电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="配送方式(0自提，1送货，2物流代收，3物流不代收)" prop="delivery">
        <el-input
          v-model="queryParams.delivery"
          placeholder="请输入配送方式(0自提，1送货，2物流代收，3物流不代收)"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="预计交货">
        <el-date-picker
          v-model="daterangeEstimatedDelivery"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="业务员" prop="salesperson">
        <el-input
          v-model="queryParams.salesperson"
          placeholder="请输入业务员"
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
      <el-form-item label="包装方式" prop="packaging">
        <el-input
          v-model="queryParams.packaging"
          placeholder="请输入包装方式"
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
          v-hasPermi="['store:outWarehouse:add']"
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
          v-hasPermi="['store:outWarehouse:edit']"
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
          v-hasPermi="['store:outWarehouse:remove']"
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
          v-hasPermi="['store:outWarehouse:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="outWarehouseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="outWarehouseId" />
      <el-table-column label="单号" align="center" prop="orderNo" />
      <el-table-column label="单据类型" align="center" prop="orderType" />
      <el-table-column label="车牌号" align="center" prop="plateNumber" />
      <el-table-column label="施工人员" align="center" prop="constructionWork" />
      <el-table-column label="往来客户" align="center" prop="customer" />
      <el-table-column label="联系电话" align="center" prop="phoneNumber" />
      <el-table-column label="配送方式(0自提，1送货，2物流代收，3物流不代收)" align="center" prop="delivery" />
      <el-table-column label="预计交货" align="center" prop="estimatedDelivery" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.estimatedDelivery, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务员" align="center" prop="salesperson" />
      <el-table-column label="结算方式(1现金付款 2银行转账,挂账)" align="center" prop="paymentTerms" />
      <el-table-column label="包装方式" align="center" prop="packaging" />
      <el-table-column label="状态(0正常，1禁用)" align="center" prop="status" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['store:outWarehouse:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:outWarehouse:remove']"
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

    <!-- 添加或修改出库对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="单号" prop="orderNo">
          <el-input v-model="form.orderNo" placeholder="请输入单号" />
        </el-form-item>
        <el-form-item label="单据类型" prop="orderType">
          <el-select v-model="form.orderType" placeholder="请选择单据类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="车牌号" prop="plateNumber">
          <el-input v-model="form.plateNumber" placeholder="请输入车牌号" />
        </el-form-item>
        <el-form-item label="施工人员" prop="constructionWork">
          <el-input v-model="form.constructionWork" placeholder="请输入施工人员" />
        </el-form-item>
        <el-form-item label="客户id" prop="customerId">
          <el-input v-model="form.customerId" placeholder="请输入客户id" />
        </el-form-item>
        <el-form-item label="往来客户" prop="customer">
          <el-input v-model="form.customer" placeholder="请输入往来客户" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="配送方式(0自提，1送货，2物流代收，3物流不代收)" prop="delivery">
          <el-input v-model="form.delivery" placeholder="请输入配送方式(0自提，1送货，2物流代收，3物流不代收)" />
        </el-form-item>
        <el-form-item label="预计交货" prop="estimatedDelivery">
          <el-date-picker clearable size="small"
            v-model="form.estimatedDelivery"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择预计交货">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="业务员" prop="salesperson">
          <el-input v-model="form.salesperson" placeholder="请输入业务员" />
        </el-form-item>
        <el-form-item label="结算方式(1现金付款 2银行转账,挂账)" prop="paymentTerms">
          <el-input v-model="form.paymentTerms" placeholder="请输入结算方式(1现金付款 2银行转账,挂账)" />
        </el-form-item>
        <el-form-item label="包装方式" prop="packaging">
          <el-input v-model="form.packaging" placeholder="请输入包装方式" />
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
import { listOutWarehouse, getOutWarehouse, delOutWarehouse, addOutWarehouse, updateOutWarehouse, exportOutWarehouse } from "@/api/store/outWarehouse";

export default {
  name: "OutWarehouse",
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
      // 出库表格数据
      outWarehouseList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 备注时间范围
      daterangeEstimatedDelivery: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNo: null,
        orderType: null,
        plateNumber: null,
        constructionWork: null,
        customer: null,
        phoneNumber: null,
        delivery: null,
        estimatedDelivery: null,
        salesperson: null,
        paymentTerms: null,
        packaging: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        orderNo: [
          { required: true, message: "单号不能为空", trigger: "blur" }
        ],
        orderType: [
          { required: true, message: "单据类型不能为空", trigger: "change" }
        ],
        plateNumber: [
          { required: true, message: "车牌号不能为空", trigger: "blur" }
        ],
        constructionWork: [
          { required: true, message: "施工人员不能为空", trigger: "blur" }
        ],
        customerId: [
          { required: true, message: "客户id不能为空", trigger: "blur" }
        ],
        customer: [
          { required: true, message: "往来客户不能为空", trigger: "blur" }
        ],
        phoneNumber: [
          { required: true, message: "联系电话不能为空", trigger: "blur" }
        ],
        delivery: [
          { required: true, message: "配送方式(0自提，1送货，2物流代收，3物流不代收)不能为空", trigger: "blur" }
        ],
        estimatedDelivery: [
          { required: true, message: "预计交货不能为空", trigger: "blur" }
        ],
        salesperson: [
          { required: true, message: "业务员不能为空", trigger: "blur" }
        ],
        paymentTerms: [
          { required: true, message: "结算方式(1现金付款 2银行转账,挂账)不能为空", trigger: "blur" }
        ],
        packaging: [
          { required: true, message: "包装方式不能为空", trigger: "blur" }
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
    /** 查询出库列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeEstimatedDelivery && '' != this.daterangeEstimatedDelivery) {
        this.queryParams.params["beginEstimatedDelivery"] = this.daterangeEstimatedDelivery[0];
        this.queryParams.params["endEstimatedDelivery"] = this.daterangeEstimatedDelivery[1];
      }
      listOutWarehouse(this.queryParams).then(response => {
        this.outWarehouseList = response.rows;
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
        outWarehouseId: null,
        orderNo: null,
        orderType: null,
        plateNumber: null,
        constructionWork: null,
        customerId: null,
        customer: null,
        phoneNumber: null,
        delivery: null,
        estimatedDelivery: null,
        salesperson: null,
        paymentTerms: null,
        packaging: null,
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
      this.daterangeEstimatedDelivery = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.outWarehouseId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加出库";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const outWarehouseId = row.outWarehouseId || this.ids
      getOutWarehouse(outWarehouseId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改出库";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.outWarehouseId != null) {
            updateOutWarehouse(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOutWarehouse(this.form).then(response => {
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
      const outWarehouseIds = row.outWarehouseId || this.ids;
      this.$modal.confirm('是否确认删除出库编号为"' + outWarehouseIds + '"的数据项？').then(function() {
        return delOutWarehouse(outWarehouseIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有出库数据项？').then(() => {
        this.exportLoading = true;
        return exportOutWarehouse(queryParams);
      }).then(response => {
        this.$download.name(response.msg);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
