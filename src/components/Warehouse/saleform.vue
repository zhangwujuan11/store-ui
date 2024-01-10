<template>
	<el-form ref="addform" :model="addform" :rules="rules" label-width="100px">
		<p v-if="!buttontext" style="padding-left: 30px;margin-top:-20px;">单号: {{addform.orderNo}}</p>
		<div class="formtop">
			<div v-if="!look" style="display: flex;flex-wrap: wrap;">
			<el-form-item label="业务门店" prop="storeName">
				<el-select 
				placeholder="请输入门店名称" 
				v-model="addform.storeId"
				filterable
				@change="warehouseNamechange($event)">
					<el-option :label="item.warehouseName" :value="item.warehouseId"  v-for="(item,index) in dictList" :key="item.warehouseId" />
				</el-select>
			</el-form-item>
			<el-form-item label="往来客户" prop="supplierName">
				<el-select placeholder="请输入往来客户" clearable v-model="addform.supplierName" @change="supplierNamechange" filterable>
				<el-option :label="item.name":value="`${item.customerId},${item.name}`"  v-for="(item,index) in kehu" :key="item.customerId" /> 
				</el-select>
			</el-form-item>
			<el-form-item label="业务员" prop="cons">
				<el-select  placeholder="请输入业务员" clearable v-model="addform.cons" @change="supp" filterable>
					<el-option :label="item.userName" :value="`${item.userId},${item.userName}`"
						v-for="(item,index) in userlist" :key="item.userId" />
				</el-select>
			</el-form-item>
			<el-form-item label="票据类型" prop="billType">
				<el-select  placeholder="请选择单据类型" clearable v-model="addform.billType" filterable>
					<el-option label="普通发票" value="0" />
					<el-option label="其他" value="1" />
					<el-option label="指定物流" value="2" />
					<el-option label="其他备注" value="4" />
				</el-select>
			</el-form-item>
			<el-form-item label="票据名称" prop="billName">
				<el-input placeholder="请输入票据名称" v-model="addform.billName" ></el-input>
			</el-form-item>
			<el-form-item label="包装方式" prop="packagingMethod">
				<el-select placeholder="请输选择包装方式"  clearable v-model="addform.packagingMethod">
					<el-option v-for="(dict,index) in dict.type.packagingMethod" :key="index"
						:label="dict.label" :value="dict.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="配送方式" prop="delivery">
				<el-select placeholder="请输选择配送方式" clearable v-model="addform.delivery">
					<el-option  v-for="(dict,index) in dict.type.delivery_method" :key="index"
						:label="dict.label" :value="dict.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="车牌号" prop="delivery">
				<el-input v-model="addform.plateNumber"></el-input>
			</el-form-item>
			<el-form-item label="结算方式" prop="paymentTerms">
				<el-select placeholder="请输选择结算方式"  clearable v-model="addform.paymentTerms">
					<el-option v-for="(dict,index) in dict.type.paymentTerms" :key="index" :label="dict.label"
						:value="dict.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="价格方式" prop="priceMode">
				<el-select placeholder="请输选择价格方式" clearable v-model="addform.priceMode">
					<el-option v-for="(dict,index) in dict.type.priceMode" :key="index" :label="dict.label"
						:value="dict.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="备注" prop="remark">
				<el-input placeholder="请输入备注" v-model="addform.remark" ></el-input>
			</el-form-item>
			</div>
			<div v-if="look" class="infodatap">
				<p style="margin-left:20px;">业务门店：{{addform.storeName}}</p>
				<p style="margin-left: 20px;">往来客户：{{addform.customer}}</p>
				<p style="margin-left: 20px;">业务员：{{addform.constructionWork}}</p>
				<p style="margin-left: 20px;">票据类型：{{addform.billType | billType}}</p>
				<p style="margin-left: 20px;">票据名称：{{addform.billName}}</p>
				<p style="margin-left: 20px;display: flex;">包装方式：<dict-tag :options="dict.type.packagingMethod" :value="addform.packagingMethod"/></p>
				<p style="margin-left:20px;display: flex;">配送方式：<dict-tag :options="dict.type.delivery_method" :value="addform.delivery"/></p>
				<p style="margin-left: 20px;display: flex;">价格方式：<dict-tag :options="dict.type.priceMode" :value="addform.priceMode"/></p>
				<p style="margin-left: 20px;display: flex;">结算方式：<dict-tag :options="dict.type.paymentTerms" :value="addform.paymentTerms"/></p> 
				<p style="margin-left: 20px;">备注：{{addform.remark}}</p>
			</div>
		</div>
		<div class="formcenter">
			<p class="line"></p>
			<div class="formcen" v-if="!look">
				<el-form-item label="carg码" prop="carg">
					<el-input v-model="serprofrom.carg" placeholder="请输入carg码" clearable size="small" />
				</el-form-item>
				<el-form-item label="产品名称" prop="productName">
					<el-input v-model="serprofrom.productName" placeholder="请输入产品名称" clearable size="small" />
				</el-form-item>
				<el-form-item label="分类" prop="classify">
					<el-select placeholder="请选择分类" clearable v-model="serprofrom.classify">
						<el-option  v-for="(dict,index) in dict.type.classification" :key="index"
							:label="dict.label" :value="dict.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="拼音查找" prop="pinyin">
				  <el-input
					v-model="serprofrom.pinyin"
					placeholder="请输入拼音"
					clearable
					size="small"
					@keyup.enter.native="handleQuery"
				  />
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="serfrom">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button v-if="buttontext" type="success" icon='el-icon-refresh' @click="gochangecwadd">预计转销售</el-button>
				</el-form-item>
			</div>
			<el-table :data="tab" height="250" v-if="!look" @row-click="cahnridao">
				<el-table-column label="选择项" width="80">
					<template slot-scope="scope">
						<el-radio v-model="tableRadio" :label="scope.row" @change="cahnridao">&nbsp;</el-radio>
					</template>
				</el-table-column>
				<el-table-column label="库存" align="center" prop="usableQuantity">
					<template slot-scope="scope">
						<span style="color:red;">{{scope.row.usableQuantity}}</span>
					</template>
				</el-table-column>
				<el-table-column label="库位" align="center" prop="positionCode" />
				<el-table-column label="carg" align="center" prop="carg" />
				<el-table-column label="产品名称" align="center" prop="productName">
				</el-table-column>
				<el-table-column label="分类" align="center" prop="classify">
					<template slot-scope="scope">
							<dict-tag :options="dict.type.classification" :value="scope.row.classify"/>
						</template>
					</el-table-column>
				<el-table-column label="门店编码" align="center" prop="warehouseCode" />
				<el-table-column label="门店名字" align="center" prop="warehouseName" />
				<el-table-column label="供应商编码" align="center" prop="vendorCode" />
				<el-table-column label="供应商名称" align="center" prop="vendorName" />
				<el-table-column label="单价" align="center" prop="price" />
			</el-table>
			<pagination v-if="!look" v-show="serprofrom.total>0" :total="serprofrom.total"
				:page.sync="serprofrom.pageNum" :limit.sync="serprofrom.pageSize" @pagination="serfrom"
				style="bottom:5px;" />
			<p class="line" v-if="!look"></p>
			<div class="formcendov" v-if="!look">
				<el-form  :model="addshowform"  label-width="100px" style="display: flex;">
				<el-form-item label="数量" prop="quantity">
					<el-input v-model="addshowform.quantity" type="number" size="small" />
				</el-form-item>
				<el-form-item label="库位" prop="positionCode">
					<el-input size="mini" v-model="addshowform.positionCode" disabled />
				</el-form-item>
				<el-form-item label="单价" prop="price">
					<el-input size="mini" type="number" v-model="addshowform.price" @input="fochange"/>
				</el-form-item>
				<el-form-item label="金额" prop="totalPrice">
					<el-input size="mini" type="number" v-model="addshowform.totalPrice"  @input="fochange" disabled/>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input size="mini" v-model="addshowform.remark" />
				</el-form-item>
				<el-form-item>
					<p style="display: flex;">
						<el-button size="mini" type="text" @click="subone">加入清单</el-button>
						<el-button size="mini" type="text" style="color: red;" @click="subtwo">清除列表</el-button>
					</p>
				</el-form-item>
				</el-form>
			</div>
			<p class="line" v-if="!look"></p>

			<el-table :data="selectedtable" height="250">
				<el-table-column label="产品名称" align="center" prop="productName" />
				<el-table-column label="库位" align="center" prop="positionCode" />
				<el-table-column label="carg" align="center" prop="carg" />
				<el-table-column label="数量" align="center" prop="quantity" />
				<el-table-column label="单价" align="center" prop="price" />
				<el-table-column label="总金额" align="center" prop="totalPrice" />
				<el-table-column label="备注" align="center" prop="remark" width="100px">
					<template slot-scope="scope" >
						<span :title="scope.row.remark"
							style=" display: -webkit-box;text-overflow: ellipsis;overflow: hidden;-webkit-line-clamp: 2;-webkit-box-orient: vertical;white-space: pre-line;">
							{{ scope.row.remark}}
						</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" v-if="!look" class-name="small-padding fixed-width">
					<template slot-scope="scope">
						<el-button size="mini" type="text" icon="el-icon-edit" @click="opform(scope.row,scope.$index)"
							v-hasPermi="['store:typeData:edit']">修改</el-button>
						<el-button size="mini" type="text" icon="el-icon-delete"  style="color: red;"
							@click="detelett(scope.$index)">删除</el-button>

					</template>
				</el-table-column>
			</el-table>
			<div v-if="!look" style="margin-top: 20px;text-align: center;">
				<el-button size="mini" type="primary"  v-if="buttontext && addform.status!=1"  icon="el-icon-shopping-cart-full" @click="subthree(0)">暂存</el-button>
				<el-button size="mini" type="primary"  v-if="!buttontext && addform.status!=1" icon="el-icon-shopping-cart-full" @click="subfour(0)">暂存</el-button>
				<el-button size="mini" type="primary" icon="el-icon-shopping-cart-full" v-if="buttontext"
					@click="subthree(1)">确认出库</el-button>
				<el-button size="mini" type="primary" icon="el-icon-shopping-cart-full" v-if="!buttontext"
					@click="subfour(1)">确认修改出库</el-button>
			</div>
		</div>
		<!-- 修改中的修改 -->
		<el-dialog title="编辑" :visible.sync="openfrom" width="40%" append-to-body :before-close="clo">
			<el-form ref="openfromdata" :model="openfromdata" :rules="ruless" label-width="80px">
				<el-form-item label="数量" prop="quantity">
					<input type="number" v-model="openfromdata.quantity">
				</el-form-item>
				<el-form-item label="单价" prop="price">
					<input type="number" v-model="openfromdata.price">
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<input v-model="openfromdata.remark">
				</el-form-item>
				<el-button size="mini" type="primary" @click="cherkopenform">修改</el-button>
				<el-button size="mini" @click="clo">取消</el-button>
			</el-form>
		</el-dialog>
		<!-- 预计转销售 -->
		<el-dialog title="预计转销售" :visible.sync="outtable" width="89%" append-to-body>
			<el-table :data="outWarehouseList"  v-if="!look">
				<el-table-column label="选择项" width="80">
					<template slot-scope="scope">
						<el-radio v-model="outtableRadio" :label="scope.row" :disabled="scope.row.status==4">&nbsp;</el-radio>
					</template>
				</el-table-column>
				<el-table-column label="单据状态" align="center" prop="status" >
				  <template slot-scope="scope">
					  {{scope.row.status |  status}}
				  </template>
				</el-table-column>
				  <el-table-column label="单号" align="center" prop="orderNo" />
				<el-table-column label="开单日期" align="center" prop="createTime" />
				 <el-table-column label="客户名称" align="center" prop="customer" />
				 <el-table-column label="车牌号" align="center" prop="plateNumber" />
				<el-table-column label="车主姓名" align="center" prop="carOwnerName" />
				<el-table-column label="联系电话" align="center" prop="phoneNumber" />
				<el-table-column label="配送方式" align="center" prop="delivery">
				  <template slot-scope="scope">
					<dict-tag :options="dict.type.delivery_method" :value="scope.row.delivery"/>
				  </template>
				</el-table-column>
				<el-table-column label="结算方式" align="center" prop="paymentTerms">
				  <template slot-scope="scope">
					<dict-tag :options="dict.type.paymentTerms" :value="scope.row.paymentTerms"/>
				  </template>
				</el-table-column>
				<el-table-column label="产品合计" align="center" prop="productAmount"/>
				 <el-table-column label="接车人" align="center" prop="constructionWork"/>
				<el-table-column label="制单人" align="center" prop="createBy"/>  
				  <el-table-column label="备注" align="center" prop="remark" />
			</el-table>
			<pagination v-show="outqueryParams.total>0" :total="outqueryParams.total"
				:page.sync="outqueryParams.pageNum" :limit.sync="outqueryParams.pageSize" @pagination="gochangecwadd"
				style="bottom:5px;" />
			<span slot="footer" class="dialog-footer">
				<el-button @click="outtable=false">取 消</el-button>
				<el-button type="primary" @click="outcahnridao">确 定</el-button>
			  </span>
		</el-dialog>
	</el-form>
</template>

<script>
	import {grounlist} from "@/api/system/tenant";
	import {listInventory} from "@/api/store/inventory";
	import {supplierlist, groulist, infoinventory} from "@/api/crmgroupmgt";
	import {saleadd,saleinfo,saleupdate} from "@/api/stockmgt";
	import {listUser} from "@/api/store/inWarehouse";
	import { listOutWarehouse, getOutWarehouse } from "@/api/store/outWarehouse";
	export default {
		props: ['sondata', "buttontext", "look"],
		dicts: ['paymentTerms', 'delivery_method', "packagingMethod", "priceMode", "classification"],
		filters:{
		  status(e){
			  if(e == 1){
				  return '已提交'
			  }else if(e==0){
				  return '暂存'
			  }else if(e== 4){
				  return '已完成'
			  }
		  },
		  billType(e){
			  if(e=="0"){
				  return '普通发票'
			  }else if(e == '1'){
				  return '其他'
			  }else if(e== "2"){
				  return '指定物流'
			  }else if(e=='4'){
				  return '其他备注'
			  }
		  }
		},
		data() {
			return {
				addform: {
					orderType: '1',
					chuku:null,
					supplierName:null,
					packagingMethod:null,
					paymentTerms:null,
					priceMode:null,
					cons:null,
					remark:null,
					storeName:null,
					customer:null,
					constructionWork:null,
					billType:null,
					billName:null,
					delivery:null,
				},
				// 表单校验
				rules: {
					// storeName: [{
					// 	required: true,
					// 	message: '业务门店不能为空',
					// 	trigger: 'blur'
					// }],
					// supplierName: [{
					// 	required: true,
					// 	message: '往来客户不能为空',
					// 	trigger: 'blur'
					// }],
					// packagingMethod: [{
					// 	required: true,
					// 	message: '包装方式不能为空',
					// 	trigger: 'blur'
					// }],
					// paymentTerms: [{
					// 	required: true,
					// 	message: '结算方式不能为空',
					// 	trigger: 'blur'
					// }],
					// priceMode: [{
					// 	required: true,
					// 	message: '价格方式不能为空',
					// 	trigger: 'blur'
					// }],
					// cons: [{
					// 	required: true,
					// 	message: '业务员不能为空',
					// 	trigger: 'change'
					// }]
				},
				userlist: [], //经办人
				tableRadio:{ //选中的产品
					productName:null, //产品名称
					positionCode:null, //库位
					productId:null, //产品id
					inventoryId:null, //库存id
					price:null, //单价
					carg:null
				},
				isShow: true,
				dictList: [], //门店列表
				supplist: [], //门店列表
				serprofrom: {
					pageNum: 1,
					pageSize: 10,
					total: 0,
					carg:null,
					productName:null,
					classify:null,
					pinyin:null
				}, //产品查询表单
				tab: [], //产品table
				selectedtable: [], //清单table
				
				kehu: [], //客户
				addshowform: { //表单暂时数据
					price: null,
				},
				openfrom: false, //修改表单
				openfromdata: {}, //修改表单
				kucunnum: null, //当前出库单选中产品的库存
				
				
				// 预计转销售
				outtable:false,
				outqueryParams:{
					pageNum: 1,
					pageSize: 10,
					total: 0
				},
				outWarehouseList:[],
				outtableRadio:{},
				ruless:{
					 quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }], 
					 price: [{ required: true, message: '请输入金额', trigger: 'blur' }]
				},
				lis:{}
			}
		},
		created() {
			// 门店获取
			grounlist({
				pageNum: 1,
				pageSize: 1000,
			}).then(res => {
				this.dictList = res.data.items
			})

			// 往来客户获取
			groulist().then(res => {
				this.kehu = res.data.items
			})
			// this.serfrom()
			// 经办人
			listUser({
				pageNum: 1,
				pageSize: 1000
			}).then(res => {
				this.userlist = res.rows
			})
			this.reset()
			
			console.log(this.addform)
		},
		methods: {
			fochange(){
				this.$forceUpdate()
			},
			// 处理门店数据
			warehouseNamechange(val) {
				this.dictList.map(item=>{
					if(item.warehouseId == val){
						this.addform.storeName=item.warehouseName
						this.serprofrom.warehouseId = item.warehouseId
						this.$forceUpdate()
						this.serfrom()
						this.subtwo()
					}
				})
			},
			// 往来客户数据
			supplierNamechange(val) {
				let [id, name] = val.split(',')
				this.addform.customer = name
				this.addform.customerId = id
				this.$forceUpdate()
			},
			// 业务员数据
			supp(val) {
				let [id, name] = val.split(',')
				this.addform.constructionWork = name
				this.addform.constructionWorkId = id
				this.$forceUpdate()
			},
			// 产品查询
			serfrom() {
				listInventory(this.serprofrom).then(res => {
					this.tab = res.data.items
					this.serprofrom.total = res.data.total
					this.tableRadio ={ //选中的产品
						productName:null, //产品名称
						positionCode:null, //库位
						productId:null, //产品id
						inventoryId:null, //库存id
						price:null, //单价
						carg:null
					}
				})
			},


			// 表单重置
			reset() {
				this.supplierName = ''
				this.tableRadio={ //选中的产品
					productName:null, //产品名称
					positionCode:null, //库位
					productId:null, //产品id
					inventoryId:null, //库存id
					price:null, //单价
					carg:null
				}
				this.serprofrom={
					pageNum: 1,
					pageSize: 10,
					total: 0,
					carg:null,
					productName:null,
					classify:null,
					pinyin:null
				}
				this.selectedtable = []
				this.addform= {
					chuku:null,
					supplierName:null,
					packagingMethod:null,
					paymentTerms:null,
					priceMode:null,
					cons:null,
					remark:null,
					storeName:null,
					customer:null,
					constructionWork:null,
					billType:null,
					billName:null,
					delivery:null,
				}
			},


			// 临时表单
			cahnridao(record,index) {
				this.tableRadio=record
				this.addshowform.productName = this.tableRadio.productName //产品名称
				this.addshowform.positionCode = this.tableRadio.positionCode //库位
				this.addshowform.productId = this.tableRadio.productId //产品id
				this.addshowform.inventoryId = this.tableRadio.inventoryId //库存id
				this.addshowform.price = this.tableRadio.price //单价
				this.addshowform.carg = this.tableRadio.carg
			},
			// 加入清单
			subone() {
				if (Number(this.addshowform.quantity) <= 0 || this.addshowform.quantity == undefined) {
					this.$message.error("请填写正确的数量")
					return false
				} else if (!this.addshowform.productId) {
					this.$message.error("请选择产品")
					return false
				} else if (Number(this.addshowform.quantity) > Number(this.tableRadio.usableQuantity)) {
					this.$message.error("库存仅剩余" + this.tableRadio.usableQuantity + "！")
					this.addshowform.quantity = this.tableRadio.usableQuantity
					return false
				} else {
					if (this.selectedtable.length != 0) {
						let newArray = this.selectedtable.map((item) => {
							return item.inventoryId
						})
						if (newArray.indexOf(this.addshowform.inventoryId) != -1) {
							this.$message.error("产品已存在")
							return false
						} else {
							this.selectedtable.push(this.addshowform)
							this.addshowform = { //表单暂时数据
								inventoryId: null,
								productId: null,
								productName: null,
								remark: null,
								positionCode: null,
								price:0
							}
							this.tableRadio =null
						}
					} else {
						this.selectedtable.push(this.addshowform)
						this.addshowform = { //表单暂时数据
							inventoryId: null,
							productId: null,
							productName: null,
							remark: null,
							positionCode: null,
							price:0
						}
						this.tableRadio  =null
					}
				}

			},
			// 删除单个表单数据
			detelett(i) {
				this.selectedtable.splice(i, 1)
			},
			// 清除表单
			subtwo() {
				this.selectedtable.splice(0, this.selectedtable.length)
			},
			// 保存移库单
			subthree(sta) {
				this.addform.detailList = this.selectedtable
				if (this.addform.detailList.length == 0) {
					this.$message.error("销售开单信息不完整")
				} else {
					this.$refs['addform'].validate(valid => {
						if (valid) {
							this.addform.type = 3
							this.addform.state = 0
							this.addform.status = sta
							saleadd(this.addform).then(res => {
								if (res.code == 200) {
									if(sta == 0){
										this.$message.success("暂存成功成功")
									}else{
										this.$message.success("添加销售开单成功")
									}
									this.$store.state.app.salewareopen = false
									this.$parent.$parent.getList()
								} else {
									this.$message.error(res.message)
								}
							})
						} else {
							return false;
						}
					});
				}
			},
			/** 修改按钮操作 */
			// 修改数据
			opform(i, index) {
				this.openfromdataindex = index
				this.openfromdata = i
				this.lis=JSON.stringify(i)
				this.openfrom = true
				// 获取当前产品库存
				infoinventory(i.inventoryId).then(res=>{
					if(res.code == 200){
						if (this.addform.inventoryTransferId == undefined) {
							this.kucunnum =res.data.usableQuantity
						}else{
							this.kucunnum =res.data.usableQuantity +  JSON.parse(this.lis).quantity
						}
					}
				})
			},
			clo(){
				if (this.addform.inventoryTransferId == undefined) {
					this.$set(this.selectedtable, this.openfromdataindex, JSON.parse(this.lis));
				} else {
					this.$set( this.addform.detailList, this.openfromdataindex, JSON.parse(this.lis));
				}
				this.openfrom=false
			},
			// 出库单修改
			cherkopenform() {
				this.$refs['openfromdata'].validate(valid => {
				  if (valid) {
						if (Number(this.openfromdata.quantity) <= 0) {
							this.$message.error("请填写正确的数量")
							return false
						} else if (Number(this.openfromdata.quantity) > this.kucunnum) {
							this.$message.error("库存仅剩余" + this.kucunnum + "！")
							this.openfromdata.quantity = this.kucunnum
							return false
						}
						if (this.addform.inventoryTransferId == undefined) {
							this.selectedtable[this.openfromdataindex].position = this.openfromdata.position
							this.selectedtable[this.openfromdataindex].quantity = this.openfromdata.quantity
							this.selectedtable[this.openfromdataindex].totalPrice = Math.floor(Number(this.openfromdata.quantity) * Number(this.openfromdata.price)* 100)/100 
							this.selectedtable[this.openfromdataindex].remark = this.openfromdata.remark
							this.openfrom = false
						} else {
							this.addform.detailList[this.openfromdataindex].position = this.openfromdata.position
							this.addform.detailList[this.openfromdataindex].quantity = this.openfromdata.quantity
							this.selectedtable[this.openfromdataindex].remark = this.openfromdata.remark
							this.addform.detailList[this.openfromdataindex].totalPrice =  Math.floor(Number(this.openfromdata.quantity) * Number(this.openfromdata.price)* 100)/100 
							this.openfrom = false
						}  
				  }else {
						  if (this.addform.inventoryTransferId == undefined) {
								this.$set(this.selectedtable, this.openfromdataindex, JSON.parse(this.lis));
						  } else {
							  this.$set( this.addform.detailList, this.openfromdataindex, JSON.parse(this.lis));
						  }
							return false;
						}
				  })
				
				
				
				
			},
			//提交修改
			subfour(sta) {
				this.addform.detailList = this.selectedtable
				if (this.addform.detailList.length == 0) {
					this.$message.error("销售开单信息不完整")
				} else {
					this.$refs['addform'].validate(valid => {
						if (valid) {
							this.addform.state = 0
							this.addform.status = sta
							saleupdate(this.addform).then(res => {
								if (res.code == 200) {
									if(sta == 0){
										this.$modal.msgSuccess("暂存成功")
									}else{
										this.$modal.msgSuccess("修改成功")
									}
									this.$store.state.app.salewareopen = false
									this.openfrom = false
									this.$parent.$parent.getList()
								} else {
									this.$message.error(res.message)
								}
							})
						} else {
							return false;
						}
					});
				}
			},
			//预计转销售
			gochangecwadd() {
				this.outtable=true
				listOutWarehouse(this.outqueryParams).then(response => {
				  this.outWarehouseList = response.data.items;
				  this.outqueryParams.total = response.data.total;
				  this.loading = false;
				});
			},
			// 预计转销售确认
			outcahnridao(){
				
				let obj={}
				this.subtwo()
				getOutWarehouse(this.outtableRadio.outWarehouseId).then(response => {
					this.addform.predictId=response.outWarehouseId
					this.addform=response.data
					this.addform.supplierName = response.data.customerId + ',' + response.data.customer
					this.addform.chuku = response.data.storeId + ',' + response.data.storeName
					this.addform.cons = response.data.constructionWorkId + ',' + response.data.constructionWork
					this.serprofrom.warehouseId= response.data.storeId
					this.serfrom() 
					response.data.detailList.map(item=>{
						this.selectedtable.push(item)
					})
					this.outtable=false
					this.outtableRadio={}
				})
			}
			
		},
		watch: {
			'addshowform.quantity'(val) {
				this.addshowform.totalPrice = Math.floor( val * this.addshowform.price* 100)/100
				this.$forceUpdate()
			},
			'addshowform.price'(val) {
				this.addshowform.totalPrice = Math.floor( val * this.addshowform.quantity* 100)/100
				this.$forceUpdate()
			},

			'$store.state.app.salewareopen':{
				handler(val){
					if(!val){
						this.reset()
						this.$emit('transfer',null)
						this.tab=[]
						this.$forceUpdate()
					}
					grounlist().then(res => {
						this.addform.storeId = res.data.items[0].warehouseId
						this.addform.storeName = res.data.items[0].warehouseName
						this.serprofrom.warehouseId=res.data.items[0].warehouseId
						this.$forceUpdate()
						this.serfrom()
					})
				    },
					deep: true, // 深度监听
					immediate: true,//立即执行
			},
			sondata: {
				handler: function(val) {
					if (val != null) {
						saleinfo(val).then(response => {
							this.selectedtable = response.data.detailList
							this.addform = response.data
							this.addform.supplierName = response.data.customerId + ',' + response.data.customer
							// this.addform.chuku = response.data.storeId + ',' + response.data.storeName
							this.addform.cons = response.data.constructionWorkId + ',' + response.data.constructionWork
							this.serprofrom.warehouseId=response.data.storeId
							this.serfrom()
						})
						this.$forceUpdate()
					}
				},
				immediate: true
			}
		}
	}
</script>
<style scoped>
	.formtop {
		display: flex;
		justify-content: left;
		flex-wrap: wrap;
	}

	.formcen {
		display: flex;
		justify-content: left;
	}

	.line {
		border-bottom: 1px solid #ccc;
	}

	.formcendov {
		display: flex;
		justify-content: left;
		align-items: center;
	}

	/deep/.formcendov .el-form-item__label {
		width: 50px !important;
		padding-right: 3px !important;
	}

	/deep/.formcendov .el-form-item--medium .el-form-item__content {
		margin-left: 50px !important;
	}
	.infodatap{
		display: flex;
		justify-content:space-between;
		flex-wrap: wrap;
	}
	.infodatap p{
		width: 45%;
		margin: 3px 0;
	}
</style>