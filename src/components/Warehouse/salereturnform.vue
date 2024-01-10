<template>
	<el-form ref="addform" :model="addform" :rules="rules" label-width="100px">
		<p v-if="!buttontext" style="padding-left: 30px;margin-top:-20px;">单号: {{addform.orderNo}}</p>
		<div class="formtop">
			 <div v-if="!look" style="display: flex;flex-wrap: wrap;">
			<el-form-item label="往来客户" prop="supplierName">
				<el-select placeholder="请输入往来客户" v-model="addform.customerId" @change="supplierNamechange($event)"   filterable>
					<el-option :label="item.name" :value="item.customerId"
						v-for="(item,index) in kehu" :key="item.customerId" />
				</el-select>
			</el-form-item>
			<el-form-item label="业务门店" prop="chuku">
				<el-select 
				placeholder="请输入门店名称" 
				v-model="addform.storeId" 
				filterable
				@change="warechange($event)">
					<el-option :label="item.warehouseName" :value="item.warehouseId" v-for="(item,index) in dictList" :key="item.warehouseId" />
				</el-select>
			</el-form-item>
			<el-form-item label="业务员" prop="cons">
				<el-select  placeholder="请输入业务员" v-model="addform.cons" @change="supp" filterable>
					<el-option :label="item.userName" :value="`${item.userId},${item.userName}`"
						v-for="(item,index) in userlist" :key="item.userId" />
				</el-select>
			</el-form-item>
			<el-form-item label="车牌号" prop="plateNumber">
				<el-input v-model="addform.plateNumber"  placeholder="请输入车牌号" clearable size="small" />
			</el-form-item>
			<el-form-item label="配送方式" prop="delivery">
				<el-select placeholder="请输选择配送方式" clearable v-model="addform.delivery">
					<el-option  v-for="(dict,index) in dict.type.delivery_method" :key="index"
						:label="dict.label" :value="dict.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="结算方式" prop="paymentTerms">
				<el-select placeholder="请输选择结算方式" clearable v-model="addform.paymentTerms">
					<el-option v-for="(dict,index) in dict.type.paymentTerms" :key="index" :label="dict.label"
						:value="dict.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="备注" prop="remark">
				<el-input placeholder="请输入备注" v-model="addform.remark" :disabled="look"></el-input>
			</el-form-item>
			</div>
			<div v-if="look" class="infodatap">
				<p style="margin-left: 10px;">往来客户：{{addform.customer}}</p>
				<p style="margin-left: 10px;">业务门店：{{addform.storeName}}</p>
				<p style="margin-left: 10px;">业务员：{{addform.constructionWork}}</p>
				<p style="margin-left: 10px;">车牌号：{{addform.plateNumber}}</p>
				 <p style="margin-left: 10px;display: flex;">结算方式：<dict-tag :options="dict.type.paymentTerms" :value="addform.paymentTerms"/></p> 
				 <p style="margin-left: 10px;display: flex;">配送方式：<dict-tag :options="dict.type.delivery_method" :value="addform.delivery"/></p> 
				<p style="margin-left: 10px;">备注：{{addform.remark}}</p>
			</div>
		</div>
		<div class="formcenter">
			<el-table :data="tab" height="250" v-if="!look" @row-click="cahnridao">
				<el-table-column label="选择项" width="70">
					<template slot-scope="scope">
						<el-radio v-model="tableRadio" :label="scope.row" @change="cahnridao">&nbsp;</el-radio>
					</template>
				</el-table-column>
				<el-table-column label="库位" align="center" prop="positionCode" />
				<el-table-column label="产品名称" align="center" prop="productName">
				</el-table-column>
				<el-table-column label="数量" align="center" prop="usableQuantity">
					<template slot-scope="scope">
						<span style="color:red;">{{scope.row.usableQuantity}}</span>
					</template>
				</el-table-column>
				<el-table-column label="单价" align="center" prop="price" />
			</el-table>
			<pagination v-if="!look" v-show="serprofrom.total>0" :total="serprofrom.total"
				:page.sync="serprofrom.pageNum" :limit.sync="serprofrom.pageSize" @pagination="serfrom"
				style="bottom:5px;" />
			<p class="line" v-if="!look"></p>
			<div class="formcendov" v-if="!look">
				<el-form-item label="数量" prop="quantity">
					<el-input v-model="addshowform.quantity" type="number" size="small" />
				</el-form-item>
				<el-form-item label="单价" prop="price">
					<el-input size="mini" type="number" v-model="addshowform.price"  @input="fochange"/>
				</el-form-item>
				<el-form-item label="金额" prop="totalPrice">
					<el-input size="mini" type="number" v-model="addshowform.totalPrice"  @input="fochange" disabled/>
				</el-form-item>
				<el-form-item label="退货说明" prop="remark">
					<el-input size="mini" v-model="addshowform.remark" />
				</el-form-item>
				<el-form-item>
					<p style="display: flex;">
						<el-button size="mini" type="text" @click="subone">加入清单</el-button>
						<el-button size="mini" type="text" style="color: red;" @click="subtwo">清除列表</el-button>
					</p>
				</el-form-item>
			</div>
			<p class="line" v-if="!look"></p>
			<el-table :data="selectedtable" height="250">
				<el-table-column label="产品名称" align="center" prop="productName" />
				<el-table-column label="库位" align="center" prop="positionCode" />
				<el-table-column label="数量" align="center" prop="quantity" />
				<el-table-column label="单价" align="center" prop="price" />
				<el-table-column label="总金额" align="center" prop="totalPrice" />
				<el-table-column label="退货说明" align="center" prop="remark" width="100px">
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
			<div  v-if="!look" style="text-align: center;margin-top: 20px;">
				<el-button size="mini" type="primary"  v-if="buttontext && addform.status!=1"  icon="el-icon-shopping-cart-full" @click="subthree(0)">暂存</el-button>
				<el-button size="mini" type="primary"  v-if="!buttontext && addform.status!=1" icon="el-icon-shopping-cart-full" @click="subfour(0)">暂存</el-button>
				<el-button size="mini" type="primary" icon="el-icon-shopping-cart-full" v-if="buttontext"
					@click="subthree(1)">确认退货</el-button>
				<el-button size="mini" type="primary" icon="el-icon-shopping-cart-full" v-if="!buttontext"
					@click="subfour(1)">确认修改退货</el-button>
			</div>
		</div>
		<!-- 修改中的修改 -->
		<el-dialog title="编辑" :visible.sync="openfrom" width="40%" append-to-body :before-close="clo">
			<el-form ref="openfromdata" :model="openfromdata"  :rules="ruless"  label-width="80px">
				<el-form-item label="数量" prop="quantity">
					<input type="number" v-model="openfromdata.quantity">
				</el-form-item>
				<el-form-item label="单价" prop="price">
					<input type="number" v-model="openfromdata.price">
				</el-form-item>
				<el-form-item label="退货说明" prop="remark">
					<input v-model="openfromdata.remark">
				</el-form-item>
				<el-button size="mini" type="primary" @click="cherkopenform">修改</el-button>
				<el-button size="mini"  @click="clo">取消</el-button>
			</el-form>
		</el-dialog>
	</el-form>
</template>
<script>
	import {grounlist} from "@/api/system/tenant";
	import { groulist, infoinventory} from "@/api/crmgroupmgt";
	import { outBoundlist, addsalereturn, salereturninfo, updatasalereturn } from "@/api/stockmgt";
	import {listUser} from "@/api/store/inWarehouse";
	import { listOutWarehouse, getOutWarehouse } from "@/api/store/outWarehouse";
	export default {
		props: ['sondata', "buttontext", "look"],
		dicts: ['paymentTerms', 'delivery_method', "packagingMethod", "priceMode"],
		filters:{
		  status(e){
			  if(e == 1){
				  return '已出库'
			  }else if(e==0){
				  return '未审核'
			  }else if(e== 2){
				  return '待审核'
			  }
		  }
		},
		data() {
			return {
				addform: {
					supplierName:null,
					chuku:null,
					paymentTerms:null,
					priceMode:null,
					cons:null,
					delivery:null,
					plateNumber:null,
					remark:null
				},
				// 表单校验
				rules: {
					// chuku: [{
					// 	required: true,
					// 	message: '业务门店不能为空',
					// 	trigger: 'change'
					// }],
					// supplierName: [{
					// 	required: true,
					// 	message: '往来客户不能为空',
					// 	trigger: 'change'
					// }],
					paymentTerms: [{
						required: true,
						message: '结算方式不能为空',
						trigger: 'change'
					}],
					priceMode: [{
						required: true,
						message: '价格方式不能为空',
						trigger: 'change'
					}],
					cons: [{
						required: true,
						message: '业务员不能为空',
						trigger: 'change'
					}],
					delivery:[{
						required: true,
						message: '配送方式不能为空',
						trigger: 'change'
					}],
				},
				userlist: [], //经办人
				tableRadio: '', //选中的产品
				isShow: true,
				dictList: [], //门店列表
				supplist: [], //门店列表
				serprofrom: {
					pageNum: 1,
					pageSize: 10,
					total: 0,
					customerId:null
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
			// 经办人
			listUser({
				pageNum: 1,
				pageSize: 1000
			}).then(res => {
				this.userlist = res.rows
			})
			this.reset()
		},
		methods: {
			fochange(){
				this.$forceUpdate()
			},
			//客户购买列表查询
			serfrom() {
				outBoundlist(this.serprofrom).then(res => {
					this.tab = res.data.items
					this.serprofrom.total = res.data.total
					// if(res.data.total == 0){
					// 	this.subtwo()
					// }
				})
			},
			// 处理门店数据
			warechange(val) {
				// `${item.warehouseId},${item.warehouseName}`
				this.dictList.map(item=>{
					if(item.warehouseId == val){
						this.addform.storeName = item.warehouseName
						this.$forceUpdate()
						this.serprofrom.storeId=item.warehouseId
						this.serfrom()
					}
				})
			},
			// 往来客户数据
			supplierNamechange(val) {
				// `${item.customerId},${item.name}`
				this.subtwo()
				this.kehu.map(item=>{
					if(item.customerId == val){
						this.addform.customer = item.name
						this.$forceUpdate()
						this.serprofrom.customerId=item.customerId
						this.serfrom()
					}
				})
			},
			// 业务员数据
			supp(val) {
				let [id, name] = val.split(',')
				this.addform.constructionWork = name
				this.addform.constructionWorkId = id
				this.$forceUpdate()
			},

			// 表单重置
			reset() {
				this.addform={
					supplierName:null,
					chuku:null,
					paymentTerms:null,
					priceMode:null,
					cons:null,
					delivery:null,
					plateNumber:null,
					remark:null
				}
				this.supplierName = ''
				this.tableRadio = null
				this.selectedtable = []
				this.resetForm("addform");
			},
			// 临时表单
			cahnridao(record,index) {
				this.tableRadio=record
				this.addshowform.productName = this.tableRadio.productName //产品名称
				this.addshowform.positionCode = this.tableRadio.positionCode //库位
				this.addshowform.productId = this.tableRadio.productId //产品id
				this.addshowform.factoryCode= this.tableRadio.factoryCode //本厂编码
				this.addshowform.inventoryId = this.tableRadio.inventoryId //库存id
				this.addshowform.price = this.tableRadio.price //单价
				this.addshowform.motorcycleId = this.tableRadio.motorcycleId//车型id
				this.addshowform.motorcycleType = this.tableRadio.motorcycleType//车型
				this.addshowform.motorcycleType = this.tableRadio.motorcycleType//厂家名陈
				this.addshowform.outWarehouseDelId = this.tableRadio.outWarehouseDelId//唯一键
				this.addshowform.returnOriginalId = this.tableRadio.returnOriginalId//唯一键
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
					this.$message.error("总数量为" + this.tableRadio.usableQuantity + "！")
					this.addshowform.quantity = this.tableRadio.usableQuantity
					return false
				} else {
					if (this.selectedtable.length != 0) {
						let newArray = this.selectedtable.map((item) => {
							return item.outWarehouseDelId
						})
						if (newArray.indexOf(this.addshowform.outWarehouseDelId) != -1) {
							this.$message.error("产品已存在")
							return false
						} else {
							// delete this.addshowform.outWarehouseDelId
							this.selectedtable.push(this.addshowform)
							this.addshowform = { //表单暂时数据
								inventoryId: null,
								productId: null,
								productName: null,
								addshowform: null,
								positionCode: null,
								price:0
							}
							this.tableRadio = null
						}
					} else {
						this.selectedtable.push(this.addshowform)
						this.addshowform = { //表单暂时数据
							inventoryId: null,
							productId: null,
							productName: null,
							addshowform: null,
							positionCode: null,
							price:0
						}
						this.tableRadio = null
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
					this.$message.error("出库信息不完整")
				} else {
					this.$refs['addform'].validate(valid => {
						if (valid) {
							this.addform.type = 5
							this.addform.orderType = 1
							this.addform.status = sta
							addsalereturn(this.addform).then(res => {
								if (res.code == 200) {
									if(sta == 0){
										this.$message.success("暂存成功")
									}else{
										this.$message.success("添加出库成功")
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
					 	this.$message.error("总数量为" + this.kucunnum + "！")
					 	this.openfromdata.quantity = this.kucunnum
					 	return false
					 }
					 if (this.addform.inventoryTransferId == undefined) {
					 	this.selectedtable[this.openfromdataindex].position = this.openfromdata.position
					 	this.selectedtable[this.openfromdataindex].quantity = this.openfromdata.quantity
					 	this.selectedtable[this.openfromdataindex].totalPrice = Math.floor( Number(this.openfromdata.quantity)  * Number(this.openfromdata.price)* 100)/100 
					 	this.openfrom = false
					 } else {
					 	this.addform.detailList[this.openfromdataindex].position = this.openfromdata.position
					 	this.addform.detailList[this.openfromdataindex].quantity = this.openfromdata.quantity
					 	this.addform.detailList[this.openfromdataindex].totalPrice =Math.floor( Number(this.openfromdata.quantity)  * Number(this.openfromdata.price) * 100)/100 
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
					this.$message.error("退货信息不完整")
				} else {
					this.$refs['addform'].validate(valid => {
						if (valid) {
							this.addform.status = sta
							updatasalereturn(this.addform).then(res => {
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
		},
		watch: {
			'addshowform.quantity'(val) {//总价
				this.addshowform.totalPrice = Math.floor( val * this.addshowform.price * 100)/100
			},
			'addshowform.price'(val) {//单价
				this.addshowform.totalPrice = Math.floor(  val * this.addshowform.quantity * 100)/100
			},

			'$store.state.app.salewareopen':{
				handler(val){
				      if (!val) {
				      	this.reset()
				      	this.tab=[]
				      	this.serprofrom.total = 0
				      	this.$emit('transfer', null)
						groulist().then(res => {
							this.addform.customerId = res.data.items[0].customerId
							this.addform.customer = res.data.items[0].name
							this.$forceUpdate()
							this.serprofrom.customerId=res.data.items[0].customerId
							grounlist({
								pageNum: 1,
								pageSize: 1000,
							}).then(res => {
								this.addform.storeId = res.data.items[0].warehouseId
								this.addform.storeName = res.data.items[0].warehouseName
								this.$forceUpdate()
								this.serprofrom.storeId=res.data.items[0].warehouseId
								this.serfrom()
							})
						})
				      }else{
						 
					  }
					
				    },
					deep: true, // 深度监听
					immediate: true,//立即执行

			},
			sondata: {
				handler: function(val) {
					if (val != null) {
						salereturninfo(val).then(response => {
							this.selectedtable = response.data.detailList
							this.addform = response.data
							this.addform.supplierName = response.data.customerId + ',' + response.data.customer
							this.addform.cons = response.data.constructionWorkId + ',' + response.data.constructionWork
							this.serprofrom.customerId=response.data.customerId
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
		width:108px !important;
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