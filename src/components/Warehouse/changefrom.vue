<template>
	  <el-form ref="addform" :model="addform" :rules="rules" label-width="100px">
		   <p v-if="!buttontext" style="padding-left: 30px;margin-top:-20px;">移库单号:  {{addform.orderNo}}</p>
		 <div class="formtop">
			 <div v-if="!look" style="display: flex;flex-wrap: wrap;">
			 <el-form-item label="移出门店" prop="storeId">
			   <el-select
			   placeholder="请输出门店名称" 
			  v-model="addform.outWarehouseId"
			    filterable
			 	@change="warehouseNamechange($event)"
			   >
			     <el-option :label="item.warehouseName" :value="item.warehouseId"  v-for="(item,index) in dictList" :key="item.warehouseId" />
			   </el-select>
			 </el-form-item>
			<el-form-item label="移入门店" prop="ruku">
			   <el-select
			   placeholder="请输入门店名称" 
			   v-model="addform.ruku"
			    filterable
				@change="ware"
			   >
			     <el-option :label="item.warehouseName" :value="`${item.warehouseId},${item.warehouseName},${item.warehouseCode}`"  v-for="(item,index) in dictList" :key="index" />
			   </el-select>
			 </el-form-item>
			 <el-form-item label="经办人" prop="supplierName">
			   <el-select
			   placeholder="请输入经办人" 
			   v-model="addform.supplierName"
			   @change="supplierNamechange"
			    filterable
			   >
			     <el-option :label="item.userName" :value="`${item.userId},${item.userName}`"  v-for="(item,index) in userlist" :key="item.userId" />
			   </el-select>
			 </el-form-item>
			 <el-form-item label="单据类型" prop="orderType">
			   <el-select
			   placeholder="请选择单据类型" 
			   v-model="addform.orderType"
			   >
			     <el-option label="移库" :value="1" />
				  <el-option label="调拨" :value="2" />
			   </el-select>
			 </el-form-item>
			 <el-form-item label="备注" prop="remark">
			 	<el-input  placeholder="请输入备注" v-model="addform.remark" ></el-input>
			 </el-form-item>
			 </div>
			 <div v-if="look" class="infodatap">
			 	<p style="margin-left:20px;">移出门店：{{addform.outWarehouseName}}</p>
			 	<p style="margin-left: 20px;">移入门店：{{addform.inWarehouseName}}</p>
			 	<p style="margin-left: 20px;">经办人：{{addform.agentUser}}</p>
			 	<p style="margin-left: 20px;">单据类型：{{addform.orderType | orderType}}</p>
			 	<p style="margin-left: 20px;">备注：{{addform.remark}}</p>
			 </div>
			 
		 </div>
		 <div class="formcenter">
			 <p class="line"></p>
			  <div class="formcen"  v-if="!look">
				  <el-form-item label="carg码" prop="carg">
				    <el-input
				      v-model="serprofrom.carg"
				      placeholder="请输入carg码"
				      clearable
				      size="small"
				    />
				  </el-form-item>
				  <el-form-item label="产品名称" prop="productName">
				    <el-input
				      v-model="serprofrom.productName"
				      placeholder="请输入产品名称"
				      clearable
				      size="small"
				    />
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
				 </div>  
				  <el-table  :data="tab" height="250"  v-if="!look" @row-click="cahnridao">
				    <el-table-column  label="选择项" width="80">
				          <template slot-scope="scope">
				          	<el-radio v-model="tableRadio" :label="scope.row" >&nbsp;</el-radio>
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
					<el-table-column label="分类" align="center" prop="classify" />
					<el-table-column label="门店编码" align="center" prop="warehouseCode" />
					<el-table-column label="门店名字" align="center" prop="warehouseName" />
					<el-table-column label="供应商编码" align="center" prop="vendorCode" />
					<el-table-column label="供应商名称" align="center" prop="vendorName" />
					<el-table-column label="单价" align="center" prop="price" />
				  </el-table>
					<pagination
					 v-if="!look"
					  v-show="serprofrom.total>0"
					  :total="serprofrom.total"
					  :page.sync="serprofrom.pageNum"
					  :limit.sync="serprofrom.pageSize"
					  @pagination="serfrom"
					  style="bottom:5px;"
					/>
			  <p class="line" v-if="!look"></p>
			  <div class="formcendov"  v-if="!look">
				  <el-form-item label="数量" prop="quantity">
				    <el-input
				       v-model="addshowform.quantity"
					   type="number"
				      size="small"
				    />
				  </el-form-item>
				  <el-form-item label="新库位" prop="position">
				    <!-- <el-input size="mini"  v-model="addshowform.position" /> -->
					<el-select v-model="addshowform.position"
					@blur.capture.native="Nameblur($event)"
					 filterable clearable placeholder="请选择" 
					 allow-create default-first-option>
							<el-option 
							v-for="(item, index) in List" 
							:key="index" 
							:label="item.positionCode"
							:value="item.positionCode" />
					 </el-select>
				  </el-form-item>
				  <el-form-item label="备注" prop="remark">
				    <el-input size="mini"  v-model="addshowform.remark"/>
				  </el-form-item>
				  <el-form-item>
					  <p style="display: flex;">
						 <el-button size="mini" type="text" @click="subone">加入清单</el-button>
						 <el-button size="mini" type="text" style="color: red;"  @click="subtwo">清除列表</el-button> 
					  </p>
				  </el-form-item>
			  </div>
			   <p class="line" v-if="!look"></p>
			   <el-table :data="selectedtable" height="250">
				 <el-table-column label="产品名称" align="center" prop="productName" />
			     <el-table-column label="新库位" align="center" prop="position" />
				 <el-table-column label="旧库位" align="center" prop="oldPosition" />
			     <el-table-column label="carg" align="center" prop="carg" />
			     <el-table-column label="数量" align="center" prop="quantity" />
				   <el-table-column label="备注" align="center" prop="remark" width="100px">
				   <template slot-scope="scope" >
				   		<span :title="scope.row.remark" style=" display: -webkit-box;text-overflow: ellipsis;overflow: hidden;-webkit-line-clamp: 2;-webkit-box-orient: vertical;white-space: pre-line;">
				            {{ scope.row.remark}}
				        </span>
				       </template>
					   </el-table-column>
				 <el-table-column label="操作" align="center" class-name="small-padding fixed-width"  v-if="!look">
				   <template slot-scope="scope">
				    <el-button
				       size="mini"
				       type="text"
				       icon="el-icon-edit"
				       @click="opform(scope.row,scope.$index)"
				       v-hasPermi="['store:typeData:edit']"
				     >修改</el-button>
				     <el-button
				       size="mini"
				       type="text"
					    style="color: red;"
				       icon="el-icon-delete"
				       @click="detelett(scope.$index)"
				     >删除</el-button>
				   </template>
				 </el-table-column>
			   </el-table>
			   <div style="margin-top: 20px;text-align: center;" v-if="!look">
				  <el-button size="mini" type="primary" icon="el-icon-shopping-cart-full" v-if="buttontext"  @click="subthree('addform')">确认移库</el-button>
				  <el-button size="mini" type="primary" icon="el-icon-shopping-cart-full" v-if="!buttontext"  @click="subfour('addform')">确认修改移库</el-button> 
			   </div>
		 </div>
		 <!-- 修改中的修改 -->
		<el-dialog title="编辑" :visible.sync="openfrom" width="40%"  append-to-body :before-close="clo">
		 	<el-form ref="openfromdata" :model="openfromdata" :rules="ruless" label-width="80px">
		 		 <el-form-item label="数量" prop="quantity">
		 		 	<input type="number" v-model="openfromdata.quantity">
		 		 </el-form-item>
		 		 <el-form-item label="库位" prop="position">
		 		 	<input  v-model="openfromdata.position">
		 		 </el-form-item>
				 <el-form-item label="备注" prop="remark">
				 	<input  v-model="openfromdata.remark">
				 </el-form-item>
		 		 <el-button
		 		    size="mini"
		 		    type="primary"
		 		    @click="cherkopenform"
		 		  >修改</el-button>
		 		  <el-button
		 		    size="mini"
		 		    @click="clo"
		 		  >取消</el-button>
		 	</el-form>
		 </el-dialog>
	  </el-form>
</template>

<script>
	import {grounlist} from "@/api/system/tenant";
	import { addserchku } from "@/api/store/inWarehouse";
	import { listInventory } from "@/api/store/inventory";
	import {groulist, infoinventory} from "@/api/crmgroupmgt";
	import { addInventoryTransfer, getInventoryTransfer,updateInventoryTransfer } from "@/api/store/inventoryTransfer";
	import { listUser } from "@/api/store/inWarehouse";
	export default{
		dicts: [ "classification"],
		props:['sondata',"buttontext","look" ],
		filters:{
			orderType(e){
				if(e == 1){
					return '移库'
				}else{
					return '调拨'
				}
			}
		},
		data(){
			return{
				addform:{
					orderType:1,
					chuku:null,
					ruku:null,
					supplierName:null,
					remark:null,
					outWarehouseName:null,
					outWarehouseId:null,
					outWarehouseCode:null,
					inWarehouseName:null,
					inWarehouseId:null,
					inWarehouseCode:null,
					agentUser :null,
					agentUid:null,
				},
				// 表单校验
				rules: {
					 chuku: [{ required: true, message: '移出库不能为空',  trigger: 'blur' }], 
					 ruku: [{ required: true, message: '移入库不能为空',  trigger: 'blur' }], 
					 supplierName: [{ required: true, message: '经办人不能为空',  trigger: 'blur'}], 
				},
				userlist:[],//经办人
				tableRadio:'',//选中的产品
				isShow:true,
				dictList:[],//门店列表
				supplist:[],//门店列表
				serprofrom:{
					  pageNum:1,
					  pageSize:10,
					  total:0,
					  classify:null,
					  pinyin:null
				},//产品查询表单
				tab:[],//产品table
				selectedtable:[],//清单table
				supplierName:'',//未处理的经办人数据
				addshowform:{//表单暂时数据
					 price:null,
					 position:null,
					 remark:null,
				},
				warehouse:'',//未处理的移入门店数据
				warehouseName2:'',//未处理的移出门店数据
				openfrom:false,//修改表单
				openfromdata:{},//修改表单
				kucunnum:null,//当前出库单选中产品的库存
				
				ruless:{
					 quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }], 
					 position: [{ required: true, message: '请输入库位', trigger: 'blur' }]
				},
				lis:{},
				List:[]
			}
		},
		created() {
			// 门店获取
			grounlist({
				pageNum:1,
				pageSize:1000,
			}).then(res=>{
				this.dictList=res.data.items
			})
			// this.serfrom()
			// 经办人
			listUser({
				pageNum:1,
				pageSize:1000
			}).then(res=>{
				this.userlist=res.rows
			})
			this.reset()
		},
		methods:{
			Nameblur(e) {
				this.$set(this.addshowform,'position',e.target.value)
			   },
			// 处理移出门店数据
			warehouseNamechange(val) {
				this.dictList.map(item=>{
					if(item.warehouseId == val){
						this.addform.outWarehouseName=item.warehouseName
						this.addform.outWarehouseCode = item.warehouseCode
						this.serprofrom.warehouseId=item.warehouseId
						this.$forceUpdate()
						this.serfrom()
						this.subtwo()
					}
				})
			},
			// warechange(val){
			// 	let [id,name,code] = val.split(',')
			// 	this.addform.outWarehouseName = name
			// 	this.addform.outWarehouseCode=code
			// 	this.selectedtable=[]
			// 	this.serprofrom.warehouseId=id
			// 	this.serfrom(this.addform.outWarehouseId)
			// },
			// 处理移入门店数据
			ware(val){
				let [id,name,code] = val.split(',')
				this.addform.inWarehouseName = name
				this.addform.inWarehouseId = id
				this.addform.inWarehouseCode=code
				this.$forceUpdate()
			},
			// 处理经办人数据
			supplierNamechange(val){
				let [id,name] = val.split(',')
				this.addform.agentUser = name
				this.addform.agentUid = id
				this.$forceUpdate()
			},
			// 产品查询
			serfrom(){
				listInventory(this.serprofrom).then(res=>{
					  this.tab=res.data.items
					  this.serprofrom.total=res.data.total
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
			fochange(){
				this.$forceUpdate()
			},
			// 表单重置
			reset() {
			  this.warehouse=''//未处理的门店数据
			  this.supplierName=''
			  this.warehouseName2=''
			  this.tableRadio=null
			  this.selectedtable=[]
				this.addform.orderType=1
				this.addform.chuku=null
				this.addform.ruku=null
				this.addform.supplierName=null
				this.addform.remark=null
				this.serprofrom= {//产品查询表单
					pageNum: 1,
					pageSize: 10,
					carg:null,
					productName:null,
					classify:null,
					pinyin:null
				}
			},
			// 临时表单
			cahnridao(record,index){
				this.tableRadio=record
				this.addshowform.productId=this.tableRadio.productId//产品id
				this.addshowform.productName=this.tableRadio.productName//产品名称
				this.addshowform.carg=this.tableRadio.carg//carg
				this.addshowform.inventoryId=this.tableRadio.inventoryId
				this.addshowform.oldPosition=this.tableRadio.positionCode
				if(this.addform.inWarehouseId){
					// 新增需求
					addserchku({wid:this.addform.inWarehouseId,pid:this.addshowform.productId}).then(res=>{
						this.List=res.data
					})
				}
			},
			// 加入清单
			subone(){
				if(Number(this.addshowform.quantity)<=0 || this.addshowform.quantity == undefined){
					this.$message.error("请填写正确的数量")
					return false
				}else if(!this.addshowform.productId){
					this.$message.error("请选择产品")
					return false
				}else if(!this.addshowform.position){
					this.$message.error("请输入库位")
					return false
				}else if(Number(this.addshowform.quantity)  > Number(this.tableRadio.usableQuantity)){
					this.$message.error("库存仅剩余" + this.tableRadio.usableQuantity +"！" )
					this.addshowform.quantity=this.tableRadio.usableQuantity 
					return false
				}else{
					if(this.selectedtable.length!=0){
						let newArray = this.selectedtable.map((item) => {
						    return item.inventoryId
						})
						if(newArray.indexOf(this.addshowform.inventoryId) != -1){
							this.$message.error("产品已存在")
							return false
						}else{
							this.selectedtable.push(this.addshowform)
							this.addshowform={//表单暂时数据
								inventoryId:null,
								productId:null,
								productName:null,
								carg:null,
								remark:null,
								oldPosition:null
							}
							this.tableRadio=null
						}
					}else{
						this.selectedtable.push(this.addshowform)
						this.addshowform={//表单暂时数据
							inventoryId:null,
							productId:null,
							productName:null,
							carg:null,
							remark:null,
							oldPosition:null
						}
						this.tableRadio=null
					}
				}
			},
			// 删除单个表单数据
			detelett(i){
				this.selectedtable.splice(i, 1)
			},
			// 清除表单
			subtwo(){
				this.selectedtable.splice(0, this.selectedtable.length)
			},
			// 保存移库单
			subthree( formName ){
				this.addform.transferDetailList=this.selectedtable
				if(this.addform.transferDetailList.length == 0){
					this.$message.error("移库信息不完整")
				}else{
					this.$refs['addform'].validate(valid => {
					  if (valid) {
						addInventoryTransfer(this.addform).then(res=>{
							if(res.code == 200){
								this.$message.success("移库成功")
								 this.$store.state.app.cahngewarehouseopen=false
								this.$parent.$parent.getList()
							}else{
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
			opform(i,index){
				this.openfromdataindex=index
				this.openfromdata=i
				this.lis=JSON.stringify(i)
				this.openfrom=true
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
					this.$set( this.addform.transferDetailList, this.openfromdataindex, JSON.parse(this.lis));
				}
				this.openfrom=false
			},
			// 出库单修改
			cherkopenform(){
				this.$refs['openfromdata'].validate(valid => {
				  if (valid) {
					  if(Number(this.openfromdata.quantity)<=0){
					  	this.$message.error("请填写正确的数量")
					  	return false
					  }else if(Number(this.openfromdata.quantity)  > this.kucunnum){
					  	this.$message.error("库存仅剩余" + this.kucunnum +"！" )
					  	this.openfromdata.quantity=this.kucunnum
					  	return false
					  }
					  if(this.addform.inventoryTransferId == undefined){
					  	this.selectedtable[this.openfromdataindex].position=this.openfromdata.position
					  	this.selectedtable[this.openfromdataindex].quantity=this.openfromdata.quantity
					  	this.openfrom=false
					  }else{
					  		this.addform.transferDetailList[this.openfromdataindex].position=this.openfromdata.position
					  		this.addform.transferDetailList[this.openfromdataindex].quantity=this.openfromdata.quantity
					  		this.openfrom=false
					  }
				  }else {
						  if (this.addform.inventoryTransferId == undefined) {
								this.$set(this.selectedtable, this.openfromdataindex, JSON.parse(this.lis));
						  } else {
							  this.$set( this.addform.transferDetailList, this.openfromdataindex, JSON.parse(this.lis));
						  }
							return false;
						}
				  })
			},
			//提交修改
			subfour(){
				this.addform.transferDetailList=this.selectedtable
				if(this.addform.transferDetailList.length == 0){
					this.$message.error("移库信息不完整")
				}else{
					this.$refs['addform'].validate(valid => {
					  if (valid) {
						updateInventoryTransfer(this.addform).then(res=>{
							if(res.code == 200){
								 this.$modal.msgSuccess("修改成功")
								 this.$store.state.app.cahngewarehouseopen=false
								 this.openfrom=false
								 this.$parent.$parent.getList()
							}else{
								this.$message.error(res.message)
							}
						})
					  } else {
						return false;
					  }
					});
				}
			}
		},
		watch:{
			'$store.state.app.cahngewarehouseopen':{
				handler(val){
					if(!val){
						this.reset()
						this.$emit('transfer',null)
						this.tab=[]
						this.$forceUpdate()
					}
					grounlist().then(res => {
						this.addform.outWarehouseName=res.data.items[0].warehouseName
						this.addform.outWarehouseCode = res.data.items[0].warehouseCode
						this.addform.outWarehouseId = res.data.items[0].warehouseId
						this.serprofrom.warehouseId=res.data.items[0].warehouseId
						this.$forceUpdate()
						this.serfrom()
					})
				    },
					deep: true, // 深度监听
					immediate: true,//立即执行
			},
			  sondata: {
				   handler: function (val) {
					   if(val != null){
						   getInventoryTransfer(val).then(response => {
						   		this.selectedtable=response.data.transferDetailList
						   		this.addform=response.data
						   		this.addform.supplierName=response.data.agentUid + ',' + response.data.agentUser
						   		this.addform.ruku= response.data.inWarehouseId+ ',' + response.data.inWarehouseName+ ','  + response.data.inWarehouseCode
								this.addform.chuku=response.data.outWarehouseId+ ',' + response.data.outWarehouseName+ ',' + response.data.outWarehouseCode
								this.serprofrom.warehouseId=response.data.outWarehouseId
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
	.formtop{
		display: flex;
		justify-content:left;
		flex-wrap: wrap;
	}
	.formcen{
		display: flex;
		justify-content: left;
	}
	.line{
		border-bottom: 1px solid #ccc;
	}
	.formcendov{
		display: flex;
		justify-content: left;
		align-items: center;
	}
	/deep/.formcendov .el-form-item__label{
		width: 50px !important;
		padding-right: 3px !important;
	}
	/deep/.formcendov .el-form-item--medium .el-form-item__content{
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
