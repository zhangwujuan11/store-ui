<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="编码" prop="supplierCode">
        <el-input
          v-model="queryParams.supplierCode"
          placeholder="请输入编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="名称" prop="supplierName">
        <el-input
          v-model="queryParams.supplierName"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系电话号" prop="telephone">
        <el-input
          v-model="queryParams.telephone"
          placeholder="请输入联系电话号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="供应商类型" prop="typeCode">
        <el-input
          v-model="queryParams.typeCode"
          placeholder="请输入供应商类型"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="简称" prop="simpleName">
        <el-input
          v-model="queryParams.simpleName"
          placeholder="请输入简称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="纳税人识别号" prop="nsrsbh">
        <el-input
          v-model="queryParams.nsrsbh"
          placeholder="请输入纳税人识别号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开户行" prop="bankName">
        <el-input
          v-model="queryParams.bankName"
          placeholder="请输入开户行"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="银行账号" prop="bankNo">
        <el-input
          v-model="queryParams.bankNo"
          placeholder="请输入银行账号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input
          v-model="queryParams.address"
          placeholder="请输入地址"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="logo" prop="logo">
        <el-input
          v-model="queryParams.logo"
          placeholder="请输入logo"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="负责人" prop="contactsName">
        <el-input
          v-model="queryParams.contactsName"
          placeholder="请输入负责人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="负责电话" prop="contactsMobile">
        <el-input
          v-model="queryParams.contactsMobile"
          placeholder="请输入负责电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="负责人微信号" prop="contactsWx">
        <el-input
          v-model="queryParams.contactsWx"
          placeholder="请输入负责人微信号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="负责邮箱" prop="contactsEmail">
        <el-input
          v-model="queryParams.contactsEmail"
          placeholder="请输入负责邮箱"
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
          v-hasPermi="['store:supplier:add']"
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
          v-hasPermi="['store:supplier:edit']"
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
          v-hasPermi="['store:supplier:remove']"
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
          v-hasPermi="['store:supplier:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="supplierList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编码" align="center" prop="supplierCode" />
      <el-table-column label="名称" align="center" prop="supplierName" />
      <el-table-column label="联系电话号" align="center" prop="telephone" />
      <el-table-column label="供应商类型" align="center" prop="typeCode" />
      <el-table-column label="简称" align="center" prop="simpleName" />
      <el-table-column label="纳税人识别号" align="center" prop="nsrsbh" />
      <el-table-column label="开户行" align="center" prop="bankName" />
      <el-table-column label="银行账号" align="center" prop="bankNo" />
      <el-table-column label="地址" align="center" prop="address" />
      <el-table-column label="logo" align="center" prop="logo" />
      <el-table-column label="负责人" align="center" prop="contactsName" />
      <el-table-column label="负责电话" align="center" prop="contactsMobile" />
      <el-table-column label="负责人微信号" align="center" prop="contactsWx" />
      <el-table-column label="负责邮箱" align="center" prop="contactsEmail" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['store:supplier:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:supplier:remove']"
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

    <!-- 添加或修改供应商对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="供应商id" prop="supplierId">
          <el-input v-model="form.supplierId" placeholder="请输入供应商id" />
        </el-form-item>
        <el-form-item label="编码" prop="supplierCode">
          <el-input v-model="form.supplierCode" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="名称" prop="supplierName">
          <el-input v-model="form.supplierName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="联系电话号" prop="telephone">
          <el-input v-model="form.telephone" placeholder="请输入联系电话号" />
        </el-form-item>
        <el-form-item label="供应商类型" prop="typeCode">
          <el-input v-model="form.typeCode" placeholder="请输入供应商类型" />
        </el-form-item>
        <el-form-item label="简称" prop="simpleName">
          <el-input v-model="form.simpleName" placeholder="请输入简称" />
        </el-form-item>
        <el-form-item label="纳税人识别号" prop="nsrsbh">
          <el-input v-model="form.nsrsbh" placeholder="请输入纳税人识别号" />
        </el-form-item>
        <el-form-item label="开户行" prop="bankName">
          <el-input v-model="form.bankName" placeholder="请输入开户行" />
        </el-form-item>
        <el-form-item label="银行账号" prop="bankNo">
          <el-input v-model="form.bankNo" placeholder="请输入银行账号" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="logo" prop="logo">
          <el-input v-model="form.logo" placeholder="请输入logo" />
        </el-form-item>
        <el-form-item label="负责人" prop="contactsName">
          <el-input v-model="form.contactsName" placeholder="请输入负责人" />
        </el-form-item>
        <el-form-item label="负责电话" prop="contactsMobile">
          <el-input v-model="form.contactsMobile" placeholder="请输入负责电话" />
        </el-form-item>
        <el-form-item label="负责人微信号" prop="contactsWx">
          <el-input v-model="form.contactsWx" placeholder="请输入负责人微信号" />
        </el-form-item>
        <el-form-item label="负责邮箱" prop="contactsEmail">
          <el-input v-model="form.contactsEmail" placeholder="请输入负责邮箱" />
        </el-form-item>
        <el-form-item label="状态">
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
import { listSupplier, getSupplier, delSupplier, addSupplier, updateSupplier, exportSupplier } from "@/api/store/supplier";

export default {
  name: "Supplier",
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
      // 供应商表格数据
      supplierList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        supplierCode: null,
        supplierName: null,
        telephone: null,
        typeCode: null,
        simpleName: null,
        nsrsbh: null,
        bankName: null,
        bankNo: null,
        address: null,
        logo: null,
        contactsName: null,
        contactsMobile: null,
        contactsWx: null,
        contactsEmail: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        supplierId: [
          { required: true, message: "供应商id不能为空", trigger: "blur" }
        ],
        supplierCode: [
          { required: true, message: "编码不能为空", trigger: "blur" }
        ],
        supplierName: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        telephone: [
          { required: true, message: "联系电话号不能为空", trigger: "blur" }
        ],
        typeCode: [
          { required: true, message: "供应商类型不能为空", trigger: "blur" }
        ],
        simpleName: [
          { required: true, message: "简称不能为空", trigger: "blur" }
        ],
        nsrsbh: [
          { required: true, message: "纳税人识别号不能为空", trigger: "blur" }
        ],
        bankName: [
          { required: true, message: "开户行不能为空", trigger: "blur" }
        ],
        bankNo: [
          { required: true, message: "银行账号不能为空", trigger: "blur" }
        ],
        address: [
          { required: true, message: "地址不能为空", trigger: "blur" }
        ],
        logo: [
          { required: true, message: "logo不能为空", trigger: "blur" }
        ],
        contactsName: [
          { required: true, message: "负责人不能为空", trigger: "blur" }
        ],
        contactsMobile: [
          { required: true, message: "负责电话不能为空", trigger: "blur" }
        ],
        contactsWx: [
          { required: true, message: "负责人微信号不能为空", trigger: "blur" }
        ],
        contactsEmail: [
          { required: true, message: "负责邮箱不能为空", trigger: "blur" }
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
    /** 查询供应商列表 */
    getList() {
      this.loading = true;
      listSupplier(this.queryParams).then(response => {
        this.supplierList = response.rows;
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
        supplierId: null,
        supplierCode: null,
        supplierName: null,
        telephone: null,
        typeCode: null,
        simpleName: null,
        nsrsbh: null,
        bankName: null,
        bankNo: null,
        address: null,
        logo: null,
        contactsName: null,
        contactsMobile: null,
        contactsWx: null,
        contactsEmail: null,
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
      this.ids = selection.map(item => item.supplierId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加供应商";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const supplierId = row.supplierId || this.ids
      getSupplier(supplierId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改供应商";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.supplierId != null) {
            updateSupplier(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSupplier(this.form).then(response => {
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
      const supplierIds = row.supplierId || this.ids;
      this.$modal.confirm('是否确认删除供应商编号为"' + supplierIds + '"的数据项？').then(function() {
        return delSupplier(supplierIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有供应商数据项？').then(() => {
        this.exportLoading = true;
        return exportSupplier(queryParams);
      }).then(response => {
        this.$download.name(response.msg);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
