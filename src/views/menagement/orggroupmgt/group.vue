<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
			<el-form-item label="门店名称" prop="warehouseName">
				<el-input v-model="queryParams.warehouseName" placeholder="请输入门店名称" clearable size="small" />
			</el-form-item>
			<el-form-item label="门店编码" prop="warehouseCode">
				<el-input v-model="queryParams.warehouseCode" placeholder="请输入门店编码" clearable size="small" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
				<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>
		<el-row :gutter="10" class="mb8">
			<el-col :span="1.5">
				<el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
					v-hasPermi="['store:warehouse:add']">新增</el-button>
			</el-col>
			<el-col :span="1.5">
			</el-col>
			<right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
		</el-row>
		<el-table v-loading="loading" :data="tenantList" @selection-change="handleSelectionChange">
           <!-- <el-table-column label="小区域" align="center" prop="tenantId" /> --> 
			<el-table-column label="门店名称" align="center" prop="warehouseName" />
			<el-table-column label="门店编码" align="center" prop="warehouseCode" />
			<el-table-column label="门店管理员" align="center" prop="warehouseAdmin" />
			<el-table-column label="管理员电话" align="center" prop="adminPhone" />
			<el-table-column label="门店电话" align="center" prop="warehousePhone" />
			<el-table-column label="门店地址" align="center" prop="detailedAddress" />
			<el-table-column label="状态" align="center">
				<template slot-scope="scope">
					{{scope.row.status | shopType}}
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" class-name="small-padding fixed-width"  fixed="right" width="180">
				<template slot-scope="scope">
					<el-button size="mini" type="text" icon="el-icon-paperclip" @click="power(scope.row)"
						v-hasPermi="['store:userWarehouse:add']">权限</el-button>
					<el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
						v-hasPermi="['store:warehouse:edit']">修改</el-button>
					<el-button size="mini" type="text" style="color: red;" icon="el-icon-delete"
						@click="handleDelete(scope.row)" v-hasPermi="['store:warehouse:remove']">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
			@pagination="getList" />
		<!-- 添加或修改租户管理对话框 -->
		<el-dialog :title="title" :visible.sync="open" width="60%" append-to-body :close-on-click-modal="false">
			<el-form ref="form" :model="form" :rules="rules" label-width="120px">
				<el-form-item label="门店编码" prop="warehouseCode">
					<el-input v-model="form.warehouseCode" placeholder="请输入门店编码" />
				</el-form-item>
				<el-form-item label="门店名称" prop="warehouseName">
					<el-input v-model="form.warehouseName" placeholder="请输入门店名称" />
				</el-form-item>
				<el-form-item label="门店电话" prop="warehousePhone">
					<el-input v-model="form.warehousePhone" placeholder="请输入门店电话" />
				</el-form-item>
				<el-form-item label="门店管理员" prop="warehouseAdmin">
					<el-input v-model="form.warehouseAdmin" placeholder="请输入要创建的管理员用户名" />
				</el-form-item>
				<el-form-item label="管理员电话" prop="adminPhone">
					<el-input v-model="form.adminPhone" placeholder="请输入管理员电话" />
				</el-form-item>
				<el-form-item label="联系地址" prop="detailedAddress">
					<v-distpicker :province="form.province" :city="form.city" :area="form.area"
						@province="onChangeProvince" @city="onChangeCity" @area="onChangeArea"></v-distpicker>
					<el-input v-model="form.detailedAddress" placeholder="请输入具体地址" style="margin-top: 10px;" />
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="form.status">
						<el-radio label="0" checked>正常</el-radio>
						<el-radio label="1">禁用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="图片二维码" prop="storeQrCode">
					<el-upload
					ref="upload"
					  :action='baseurl'
					  list-type="picture-card"
					   :file-list="fileList"
					  :show-file-list="true"
					  :on-success="handleAvatarSuccess"
					   :limit="1"
					   :on-remove="handleRemove"
					   :on-exceed="outfun"
					   :before-upload="handleBeforeUpload"
					    accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PBG,.GIF"
					  :headers="headers">
					    <i slot="default" class="el-icon-plus"></i>
					    <div slot="file" slot-scope="{file}">
					      <img class="el-upload-list__item-thumbnail"
					        :src="form.storeQrCode" alt=""
					      >
					      <span class="el-upload-list__item-actions">
					        <span
					          class="el-upload-list__item-delete"
					          @click="handleRemove(file)"
					        >
					          <i class="el-icon-delete"></i>
					        </span>
					      </span>
					    </div>
					</el-upload>
				</el-form-item>
				
				<el-form-item label="商户logo" prop="logoSrc">
					<el-upload
					ref="uploadtwo"
					  :action='baseurl'
					  list-type="picture-card"
					   :file-list="fileListtwo"
					  :show-file-list="true"
					  :on-success="handleAvatarSuccesstwo"
					   :limit="1"
					   :on-remove="handleRemovetwo"
					   :on-exceed="outfun"
					   :before-upload="handleBeforeUploadtwo"
					    accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PBG,.GIF"
					  :headers="headers">
					    <i slot="default" class="el-icon-plus"></i>
					    <div slot="file" slot-scope="{file}">
					      <img class="el-upload-list__item-thumbnail"
					        :src="form.logoSrc" alt=""
					      >
					      <span class="el-upload-list__item-actions">
					        <span
					          class="el-upload-list__item-delete"
					          @click="handleRemovetwo(file)"
					        >
					          <i class="el-icon-delete"></i>
					        </span>
					      </span>
					    </div>
					</el-upload>
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
		<!-- 权限分配 -->
		<el-dialog title="权限分配" :visible.sync="powertdilog" width="50%" append-to-body :close-on-click-modal="false">
			<el-form ref="form" :model="powerdata" :rules="powerdatarules" label-width="120px">
				<el-form-item label="用户" prop="userIdList">
					<el-select
					 placeholder="请选择用户" 
					 v-model="powerdata.userIdList"
					  filterable
					  multiple
					 >
					 <el-option :label="item.userName" :value="item.userId"
					 	v-for="(item,index) in userlist" :key="item.userId" />
					 </el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="powesub">确 定</el-button>
				<el-button @click="powertdilog=false">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import {grounlist,postgrounlist,grounpinfo,updategrounp,detelgrouno,listTenant,getTenant,delTenant,addTenant,updateTenant,exportTenant,delnt} from "@/api/system/tenant";
	import { listAll, userWarehouse, sendWarehouseuserid } from "@/api/store/inventory";
	import {listUser} from "@/api/store/inWarehouse";
	import { getToken } from "@/utils/auth";
	export default {
		name: "Tenant",
		filters: {
			status(e) {
				if (e == 1) {
					return "一级门店"
				} else {
					return "普通门店"
				}
			},
			shopType(e) {
				if (e == 0) {
					return "启用"
				} else {
					return "禁用"
				}
			}
		},
		data() {
			const addressValidator = (rule, value, callback) => {
			    if (!this.form.province || !this.form.city || !this.form.area || !this.form.detailedAddress) {
			      callback(new Error('地址不能为空'))
			    } else {
			      callback()
			    }
			  }
			return {
				form: {
					"warehouseType": "0",
					"warehouseCategory": null, //门店类别
					"status": '0'
				},
				tee: "",
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
				// 租户管理表格数据
				tenantList: [],
				// 弹出层标题
				title: "",
				// 是否显示弹出层
				open: false,
				// 查询参数
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					remarks: null,
					tenantId: null,
					contact: null,
					phone: null,
					name: null,
					userId: null
				},
				// 表单校验
				rules: {
					adminPhone: [
						{required: true,message: "管理员电话不能为空",trigger: "blur"},
						// {
						//    pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
						//    message: "输入正确的手机号",
						//    trigger: "blur",
						// }
						],
					warehouseCode: [{
						required: true,
						message: "门店编码不能为空",
						trigger: "blur"
					},
					{
					   pattern: /^[A-Za-z0-9]+$/,
					   message: "仅限（字母，数字）",
					   trigger: "blur",
					}],
					warehouseName: [{
						required: true,
						message: "门店名称不能为空",
						trigger: "blur"
					}],
					warehousePhone: [{
						required: true,
						message: "门店电话不能为空",
						trigger: "blur"
					}
					// ,
					// {
					//    pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
					//    message: "输入正确的手机号",
					//    trigger: "blur",
					// },
					],
					detailedAddress: [{
						required: true,
						message: "地址不能为空",
						trigger: "blur",
						validator: addressValidator
					}],
					storeQrCode: [{
						required: true,
						message: "图片二维码不能为空",
						trigger: "blur"
					}],
				},
				powerdata:{
					warehouseId:'',
					userIdList:[]
				},
				powertdilog:false,
				powerdatarules:{
					userIdList: [{
						required: true,
						message: "用户不能为空",
						trigger: "blur"
					}],
				},
				userlist:[],
				 baseurl: process.env.VUE_APP_BASE_API + '/common/upload',
				 headers: {
				   Authorization: "Bearer " + getToken(),
				 },
				 fileList:[],
				 fileListtwo:[]
			}
		},
		mounted() {
			this.getList();
			listUser({
				pageNum: 1,
				pageSize: 1000
			}).then(res => {
				this.userlist = res.rows
			})
		},
		methods: {
			// 区
			onChangeProvince(province) {
				this.form.province = province.value
				this.form.city =null
				this.form.area =null
			},
			onChangeCity(city) {
				this.form.city = city.value
				this.form.area = null
			},
			onChangeArea(area) {
				this.form.area = area.value
			},
			/** 查询租户管理列表 */
			getList() {
				this.loading = true;
				listAll(this.queryParams).then(response => {
					this.tenantList = response.data.items;
					this.total = response.data.total;
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
					"warehouseType": "0",
					"warehouseCategory": 0, //门店类别
					"status": '0',
					"storeQrCode":'',
				};
				this.fileList=[]
				
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
				this.ids = selection.map(item => item.id)
				this.single = selection.length !== 1
				this.multiple = !selection.length
			},
			/** 新增按钮操作 */
			handleAdd() {
				this.reset();
				this.open = true;
				this.title = "添加门店";
			},
			/** 修改按钮操作 */
			handleUpdate(row) {
				this.reset();
				const id = row.warehouseId
				this.fileList=[]
				grounpinfo(id).then(response => {
					this.form = response.data;
					this.title = "修改门店信息";
					this.fileList.push({
					          'url': this.form.brandImg
					        })
					this.$nextTick(() => {
						this.open = true;
					})
				});
			},
			/** 提交按钮 */
			submitForm() {
				this.$refs["form"].validate(valid => {
					if (valid) {
						if (this.form.warehouseId != null) {
							updategrounp(this.form).then(response => {
								this.$modal.msgSuccess("修改成功");
								this.open = false;
								this.getList();
							});
						} else {
							postgrounlist(this.form).then(response => {
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
				const infoIds = row.warehouseId
				this.$modal.confirm('是否确认删除商户管理编号为"' + row.warehouseName + '"的数据项？').then(function() {
					return detelgrouno(infoIds);
				}).then(() => {
					this.getList();
					this.$modal.msgSuccess("删除成功");
				}).catch(() => {});
			},
			/** 导出按钮操作 */
			handleExport() {
				const queryParams = this.queryParams;
				this.$modal.confirm('是否确认导出所有商户管理数据项？').then(() => {
					this.exportLoading = true;
					return exportTenant(queryParams);
				}).then(response => {
					this.$download.name(response.msg);
					this.exportLoading = false;
				}).catch(() => {});
			},
			
			// 权限分配
			power(i){
				sendWarehouseuserid(i.warehouseId).then(res=>{
					this.powerdata.userIdList=res.data
					this.powerdata.warehouseId=i.warehouseId
					this.powertdilog=true
				})
				
			},
			// 权限提交
			powesub(){
				userWarehouse(this.powerdata).then(res=>{
					if(res.code == 200){
						this.$modal.msgSuccess("操作成功");
						this.powertdilog=false
						this.getList()
					}
				})
			},
			
			
			
			
			// 上传前loading加载
			handleBeforeUpload(file) {
			   let isImg = file.type.indexOf("image") > -1;
			  if (!isImg) {
			    this.$modal.msgError(`文件格式不正确, 请上传${this.fileType.join("/")}图片格式文件!`);
			    return false;
			  }
			  if (this.fileSize) {
			    const isLt = file.size / 1024 / 1024 < this.fileSize;
			    if (!isLt) {
			      this.$modal.msgError(`上传图片大小不能超过 ${this.fileSize} MB!`);
			      return false;
			    }
			  }
			},
			   // 上传成功回调
			   handleAvatarSuccess(res, file) {
			     if (res.code === 200) {
			       this.showlist=true
			       this.form.storeQrCode=res.url
			     }
			   },
			   // 删除图片
			   handleRemove(file, fileList){
			      this.$refs["upload"].clearFiles()
				  this.form.storeQrCode=null
			   },
			   // 超出限制
			   outfun(files, fileList){
			     this.$message('只能上传一张图片')
			   },
			   
			   
			   
			   
			   // 上传前loading加载
			   handleBeforeUploadtwo(file) {
			      let isImg = file.type.indexOf("image") > -1;
			     if (!isImg) {
			       this.$modal.msgError(`文件格式不正确, 请上传${this.fileType.join("/")}图片格式文件!`);
			       return false;
			     }
			     if (this.fileSize) {
			       const isLt = file.size / 1024 / 1024 < this.fileSize;
			       if (!isLt) {
			         this.$modal.msgError(`上传图片大小不能超过 ${this.fileSize} MB!`);
			         return false;
			       }
			     }
			   },
			   // 上传成功回调
			   handleAvatarSuccesstwo(res, file) {
			     if (res.code === 200) {
			       // this.showlist=true
			       this.form.logoSrc=res.url
			     }
			   },
			   // 删除图片
			   handleRemovetwo(file, fileList){
			      this.$refs["uploadtwo"].clearFiles()
			   	  this.form.logoSrc=null
			   },
			   // 超出限制
			   outfuntwo(files, fileList){
			     this.$message('只能上传一张图片')
			   },
		},
		watch:{
			// 分配关闭
			powertdilog(val){
				if(!val){
					this.powerdata.warehouseId=''
					this.powerdata.userIdList=[]
				}
			},
		}
	};
</script>
<style scoped>
	.maincon {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: space-between;
	}

	.leftbox {
		padding: 10px 10px 0 0px;
		width: 199px;
		box-sizing: border-box;
	}

	.rightbox {
		width: calc(100% - 200px);
	}

	/deep/.el-form-item__label {
		font-size: 12px;
	}

	/deep/.el-radio-group {
		margin-bottom: 12px;
		padding-left: 12px;
		box-sizing: border-box;
	}

	.formtitle {
		padding-left: 15px;
		box-sizing: border-box;
	}

	/deep/.el-radio {
		margin-right: 10px;
	}

	.distpicker-address-wrapper {
		display: flex;
		justify-content: left;
		align-items: center;
	}

	/deep/.distpicker-address-wrapper select {
		font-size: 14px !important;
	}
	  {
	    margin-left: 0px;
	  }
</style>