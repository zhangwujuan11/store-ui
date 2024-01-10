<template>
	  <el-form ref="addform" :model="addform" :rules="rules" label-width="100px">
		  <p  v-if="!buttontext" style="padding-left: 30px;margin-top:-20px;">预计开单号:  {{addform.orderNo}}</p>
		 <div class="formtop">
			 <div v-if="!look" style="display: flex;flex-wrap: wrap;">
			 <el-form-item label="门店" prop="storeName">
			   <el-select
			   placeholder="请输入门店名称" 
			   v-model="addform.storeId"
			    filterable
				@change="warehouseNamechange($event)"
			   >
			     <el-option :label="item.warehouseName" :value="item.warehouseId"  v-for="(item,index) in dictList" :key="item.warehouseId" />
			   </el-select>
			 </el-form-item>
			 <el-form-item label="往来客户" prop="customer">
			   <el-select
			   placeholder="请输入往来客户" 
			   v-model="supplierName"
			   @change="supplierNamechange"
			    filterable
			   >
			     <el-option :label="item.name" :value="`${item.customerId},${item.name}`"  v-for="(item,index) in kehu" :key="item.customerId" />
			   </el-select>
			 </el-form-item>
			 <el-form-item label="车主姓名" prop="carOwnerName">
				 <el-input   placeholder="请输入车主姓名"   v-model="addform.carOwnerName"></el-input>
			 </el-form-item>
			 <el-form-item label="车型" prop="vehicleModel">
			 		<el-input placeholder="请输入车型" v-model="addform.vehicleModel"></el-input>
			 </el-form-item>
			 <el-form-item label="车牌号" prop="plateNumber">
			 		<el-input placeholder="请输入车牌号" v-model="addform.plateNumber"></el-input>
			 </el-form-item>
			 <el-form-item label="联系电话" prop="phoneNumber">
			 		<el-input  placeholder="请输入联系电话"  v-model="addform.phoneNumber"></el-input>
			 </el-form-item>
			 <el-form-item label="备注" prop="remark">
			 		<el-input placeholder="请输入备注" v-model="addform.remark"></el-input>
			 </el-form-item>
			<el-form-item label="预约时间" prop="estimatedDelivery">
			 	<el-date-picker
			 	      v-model="addform.estimatedDelivery"
			 	      type="datetime"
					  format="yyyy-MM-dd HH:mm:ss"
					  :picker-options="pickerOptions"
			 	      placeholder="选择日期时间">
			 	    </el-date-picker>
			 </el-form-item>
			 <el-form-item label="价格方式" prop="priceMode">
			   <el-select
			   placeholder="请输选择价格方式" 
			   v-model="addform.priceMode"
			   >
			     <el-option v-for="(dict,index) in dict.type.priceMode"  
					:key="index"
				  :label="dict.label"
				  :value="dict.value"/>
			   </el-select>
			 </el-form-item>
			 <el-form-item label="接车人员" prop="cons">
					<el-select  placeholder="请输入业务员" clearable v-model="addform.cons" @change="supp" filterable>
						<el-option :label="item.userName" :value="`${item.userId},${item.userName}`"
							v-for="(item,index) in userlist" :key="item.userId" />
						<!-- <el-option :label="item.userName" :value="item.userName"  v-for="(item,index) in userlist" :key="item.userId" /> -->
					</el-select>
			 </el-form-item>
			 <el-form-item label="配送方式" prop="delivery">
			 	<el-select
			 	placeholder="请输选择配送方式" 
			 	v-model="addform.delivery"
			 	>
			 	  <el-option 
				  v-for="(dict,index) in dict.type.delivery_method"  
				  :key="index"
				  :label="dict.label"
				  :value="dict.value"/>
			 	</el-select>
			 </el-form-item>
			 <el-form-item label="结算方式" prop="paymentTerms">
			   <el-select
			   placeholder="请输选择结算方式" 
			   v-model="addform.paymentTerms"
			   >
			    <el-option
			    v-for="(dict,index) in dict.type.paymentTerms"  
			    :key="index"
			    :label="dict.label"
			    :value="dict.value"/>
			   </el-select>
			 </el-form-item>
			 </div>
			 
			 <div v-if="look" class="infodatap">
				 <p style="margin-left:20px;">业务门店：{{addform.storeName}}</p>
			 	<p style="margin-left: 20px;">往来客户：{{addform.customer}}</p>
			 	<p style="margin-left: 20px;">车主姓名：{{addform.carOwnerName}}</p>
			 	<p style="margin-left: 20px;">车牌号：{{addform.plateNumber}}</p>
			 	<p style="margin-left: 20px;">联系电话：{{addform.phoneNumber}}</p>
			 	<p style="margin-left: 20px;">预约时间：{{parseTime(addform.estimatedDelivery, '{y}-{m}-{d}')    }}</p>
			 	<p style="margin-left:20px;">接车人员：{{addform.constructionWork}}</p>
			 	 <p style="margin-left: 20px;display: flex;">价格方式：<dict-tag :options="dict.type.priceMode" :value="addform.priceMode"/></p> 
			 	 <p style="margin-left:20px;display: flex;">配送方式：<dict-tag :options="dict.type.delivery_method" :value="addform.delivery"/></p> 
			 	 <p style="margin-left: 20px;display: flex;">结算方式：<dict-tag :options="dict.type.paymentTerms" :value="addform.paymentTerms"/></p> 
				<p style="margin-left: 20px;">摘要：{{addform.remark}}</p>
			 </div>
		 </div>
		 <div class="formcenter">
			 <p class="line" ></p>
			  <div class="formcen" v-if="!look">
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
				  <el-form-item label="门店编码" prop="warehouseCode">
				    <el-input
				      v-model="serprofrom.warehouseCode"
				      placeholder="请输入门店编码"
				      clearable
				      size="small"
				    />
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
				  <el-table  :data="tab" height="250" v-if="!look"  @row-click="cahnridao">
				    <el-table-column  label="选择项" width="80">
				          <template slot-scope="scope">
				          	<el-radio v-model="tableRadio" :label="scope.row" @change="cahnridao">&nbsp;</el-radio>
				          </template>
				    </el-table-column>
					<el-table-column label="库存" align="center" prop="usableQuantity">
					<template slot-scope="scope">
						<span style="color:red;">{{scope.row.usableQuantity}}</span>
					</template>
					</el-table-column>
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
			  <div class="formcendov" v-if="!look">
				  <el-form-item label="数量" prop="quantity">
				    <el-input
				       v-model="addshowform.quantity"
					   type="number"
				      size="small"
				    />
				  </el-form-item>
				  <el-form-item label="库位" prop="positionCode">
				    <el-input size="mini"  v-model="addshowform.positionCode" disabled/>
				  </el-form-item>
				  <el-form-item label="单价" prop="price">
				    <el-input size="mini"  type="number" v-model="addshowform.price" @input="fochange"/>
				  </el-form-item>
				  <el-form-item label="备注" prop="remark" >
				     <el-input size="mini"  v-model="addshowform.remark"/>
				   </el-form-item>
				  <!-- <el-form-item label="折率" prop="DiscountRate">
				    <el-input size="mini"  type="number" v-model="addshowform.DiscountRate"/>
				  </el-form-item> -->
				  <el-form-item label="金额" prop="totalPrice">
				    <el-input size="mini"  type="number" v-model="addshowform.totalPrice" @input="fochange" disabled/>
				  </el-form-item>
				  <el-form-item>
					  <p style="display: flex;">
						 <el-button size="mini" type="text" @click="subone">加入清单</el-button>
						 <el-button size="mini" type="text" style="color: red;"  @click="subtwo">清除列表</el-button> 
					  </p>
				  </el-form-item>
			  </div>
			   <p class="line" v-if="!look" ></p>
			   <el-table :data="selectedtable" height="250">
				 <el-table-column label="产品名称" align="center" prop="productName" />
			     <el-table-column label="库位编号" align="center" prop="positionCode" />
			     <el-table-column label="carg" align="center" prop="carg" />
			     <el-table-column label="数量" align="center" prop="quantity" />
			     <el-table-column label="单价" align="center" prop="price" />
				  <el-table-column label="总金额" align="center" prop="totalPrice" />
				   <el-table-column label="备注" align="center" prop="remark" width="100px">
				   <template slot-scope="scope">
				   		<span :title="scope.row.remark" style=" display: -webkit-box;text-overflow: ellipsis;overflow: hidden;-webkit-line-clamp: 2;-webkit-box-orient: vertical;white-space: pre-line;">
				            {{ scope.row.remark}}
				        </span>
				       </template>
					   </el-table-column>
				 <el-table-column label="操作" align="center" class-name="small-padding fixed-width" v-if="!look">
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
				       icon="el-icon-delete"
					    style="color: red;"
				       @click="detelett(scope.$index)"
				     >删除</el-button>
				   </template>
				 </el-table-column>
			   </el-table>
			   <div v-if="!look" style="margin-top: 20px;text-align: center;">
				   <el-button size="mini" type="primary"  v-if="buttontext && addform.status!=1"  icon="el-icon-shopping-cart-full" @click="subthree(0)">暂存</el-button>
				   <el-button size="mini" type="primary"  v-if="!buttontext && addform.status!=1" icon="el-icon-shopping-cart-full" @click="subfour(0)">暂存</el-button>
				  <el-button size="mini" type="primary" icon="el-icon-sell"  v-if="buttontext"   @click="subthree(1)">保存出库单</el-button>
				  <el-button size="mini" type="primary" icon="el-icon-sell" v-if="!buttontext" @click="subfour(1)">确认修改出库单</el-button> 
			   </div>
		 </div>
		 <!-- 修改中的修改 -->
		<el-dialog title="编辑" :visible.sync="openfrom" width="40%"  append-to-body :before-close="clo">
		 	<el-form ref="openfromdata" :model="openfromdata" :rules="ruless" label-width="80px">
		 		 <el-form-item label="数量" prop="quantity">
		 		 	<input type="number" v-model="openfromdata.quantity">
		 		 </el-form-item>
		 		 <el-form-item label="单价" prop="price">
		 		 	<input type="number" v-model="openfromdata.price">
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
	import { listInventory } from "@/api/store/inventory";
	import {listUser} from "@/api/store/inWarehouse";
	import { supplierlist, groulist, infoinventory } from "@/api/crmgroupmgt";
	import { addOutWarehouse, getOutWarehouse, updateOutWarehouse } from "@/api/store/outWarehouse";
	export default{
		dicts: ['priceMode','delivery_method','paymentTerms', "classification"],
		props:['sondata',"buttontext","look"],
		data(){
			return{
				 pickerOptions: {
				                disabledDate(time) {
				                    return time.getTime() < Date.now() - 8.64e7;
				                }
				            },
				
				addform:{
					 carOwnerName:null,
					 phoneNumber:null,
					cons:null,
					 storeName:null,
					 vehicleModel:null,
					 paymentTerms:null,
					 plateNumber:null,
					 delivery:null,
					 remark:null,
					 customer:null,
					 estimatedDelivery:null,
					 constructionWork:null,
					 priceMode:null,
				},
				// 表单校验
				rules: {
					 cons: [{ required: true, message: '接车人员不能为空', trigger: 'blur' }], 
					 storeName: [{ required: true, message: '门店不能为空', trigger: 'blur' }], 
					 carOwnerName: [{ required: true, message: '车主不能为空', trigger: 'blur' }],
					 vehicleModel: [{ required: true, message: '车型不能为空', trigger: 'blur' }],
					 paymentTerms: [{ required: true, message: '结算方式不能为空', trigger: 'blur' }],
					 phoneNumber: [{ required: true, message: '联系电话不能为空', trigger: 'blur' }],
					 plateNumber: [{ required: true, message: '车牌号不能为空', trigger: 'blur' }],
					 delivery: [{ required: true, message: '配送方式不能为空', trigger: 'blur' }],
					 customer:[{ required: true, message: '往来客户不能为空', trigger: 'blur' }],
				},
				tableRadio:{
					price:null,//单价
					warehouseCode:null,//库位
					productId:null,//产品id
					productName:null,//产品名称
					carg:null,//carg
					inventoryId:null
				},//选中的产品
				isShow:true,
				dictList:[],//门店列表
				kehu:[],//往来客户列表
				supplist:[],//门店列表
				serprofrom:{
					  pageNum:1,
					  pageSize:10,
					  total:0,
					  carg:null,
					  name:null,
					  factoryCode:null,
					  classify:null,
					  pinyin:null
				},//产品查询表单
				tab:[],//产品table
				selectedtable:[],//清单table
				warehouseName:'',//未处理的门店数据
				supplierName:'',//未处理的供应商数据
				addshowform:{//表单暂时数据
					 price:0,
				},
				openfrom:false,//修改表单
				openfromdata:{},//修改表单
				kucunnum:null,//当前出库单选中产品的库存
				userlist: [], //接车元
				ruless:{
					 quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }], 
					 price: [{ required: true, message: '请输入金额', trigger: 'blur' }]
				},
				lis:{}
			}
		},
		created() {
			// 门店获取
			grounlist().then(res=>{
				this.dictList=res.data.items
			})
			// this.serfrom()
			// 往来客户获取
			groulist().then(res=>{
				this.kehu=res.data.items
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
		methods:{
				  
			fochange(){
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
			// 表单重置
			reset() {
				this.addform={
					 carOwnerName:null,
					 phoneNumber:null,
					cons:null,
					 storeName:null,
					 vehicleModel:null,
					 paymentTerms:null,
					 plateNumber:null,
					 delivery:null,
					 remark:null,
					 customer:null,
					 estimatedDelivery:null,
					 constructionWork:null,
					 priceMode:null,
				}
			  this.warehouseName=''//未处理的门店数据
			  this.supplierName=''
			  this.tableRadio.price=null//单价
			  this.tableRadio.warehouseCode=null//库位
			  this.tableRadio.productId=null//产品id
			  this.tableRadio.productName=null//产品名称
			  this.tableRadio.carg=null//carg
			  this.tableRadio.inventoryId=null
			  this.serprofrom={
			  		  pageNum:1,
			  		  pageSize:10,
			  		  carg:null,
			  		  name:null,
			  		  factoryCode:null,
			  		  total:0,
					  classify:null,
					  pinyin:null
			  }
			  this.selectedtable=[]
			  this.tab=[]
			 this.resetForm("addform");
			},
			// 处理门店数据
			warehouseNamechange(val){
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
			// 处理客户商数据
			supplierNamechange(val){
				let [id,name] = val.split(',')
					this.addform.customer = name
					this.addform.customerId = id
					this.$forceUpdate()
			},
			// 接车员数据
			supp(val) {
				let [id, name] = val.split(',')
				this.addform.constructionWork = name
				this.addform.constructionWorkId = id
				this.$forceUpdate()
			},
			// 临时表单
			cahnridao(record,index){
				this.tableRadio=record
				this.addshowform.price=this.tableRadio.price//单价
				this.addshowform.positionCode=this.tableRadio.warehouseCode//库位
				this.addshowform.productId=this.tableRadio.productId//产品id
				this.addshowform.productName=this.tableRadio.productName//产品名称
				this.addshowform.carg=this.tableRadio.carg//carg
				this.addshowform.inventoryId=this.tableRadio.inventoryId
			},
			// 加入清单
			subone(){
				if(Number(this.addshowform.quantity)<=0 || this.addshowform.quantity == undefined){
					this.$message.error("请填写正确的数量")
					return false
				}else if(!this.addshowform.productId){
					this.$message.error("请选择产品")
					return false
				}else if(!this.addshowform.positionCode){
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
								price:null,
								productId:null,
								productName:null,
								carg:null,
								remark:null
							}
							this.tableRadio={}
						}
					}else{
						this.selectedtable.push(this.addshowform)
						this.addshowform={//表单暂时数据
							price:0,
							productId:null,
							productName:null,
							carg:null,
							remark:null
						}
						this.tableRadio={}
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
			// 保存入库单
			subthree(sta){
				this.addform.detailList=this.selectedtable
				if(this.addform.detailList.length == 0){
					this.$message.error("预计开单信息不完整")
				}else{
					this.$refs['addform'].validate(valid => {
					  if (valid) {
						   this.addform.type= 1
						   this.addform.status=sta
						   console.log(this.addform)
						addOutWarehouse(this.addform).then(res=>{
							if(res.code == 200){
								if(sta == 0){
									this.$message.success("暂存成功")
								}else{
									this.$message.success("预计开单成功")
								}
								
								 this.$store.state.app.outwarehouseopen=false
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
						if (this.addform.inWarehouseId == undefined) {
							this.kucunnum =res.data.usableQuantity
						}else{
							this.kucunnum =res.data.usableQuantity +  JSON.parse(this.lis).quantity
						}
					}
				})
			},
			clo(){
				if (this.addform.inWarehouseId == undefined) {
					this.$set(this.selectedtable, this.openfromdataindex, JSON.parse(this.lis));
				} else {
					this.$set( this.addform.storeInWarehouseDetailBoList, this.openfromdataindex, JSON.parse(this.lis));
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
					 if(this.addform.inWarehouseId == undefined){
					 	this.selectedtable[this.openfromdataindex].price=this.openfromdata.price
					 	this.selectedtable[this.openfromdataindex].quantity=this.openfromdata.quantity
					 	this.selectedtable[this.openfromdataindex].totalPrice=this.openfromdata.quantity * this.openfromdata.price
					 	 this.openfrom=false
					 }else{
					 	if(this.openfromdata.price){
					 		this.addform.storeInWarehouseDetailBoList[this.openfromdataindex].price=this.openfromdata.price
					 		this.addform.storeInWarehouseDetailBoList[this.openfromdataindex].quantity=this.openfromdata.quantity
					 		this.addform.storeInWarehouseDetailBoList[this.openfromdataindex].totalPrice=this.openfromdata.quantity * this.openfromdata.price
					 	}
					 } 
				  }else {
						  if (this.addform.inWarehouseId == undefined) {
								this.$set(this.selectedtable, this.openfromdataindex, JSON.parse(this.lis));
						  } else {
							  this.$set( this.addform.storeInWarehouseDetailBoList, this.openfromdataindex, JSON.parse(this.lis));
						  }
							return false;
						}
				  })
				
				
				
				
			},
			//提交修改
			subfour(sta){
				this.addform.detailList=this.selectedtable
				if(this.addform.detailList.length == 0){
					this.$message.error("预计开单信息不完整")
				}else{
					this.$refs['addform'].validate(valid => {
					  if (valid) {
						  this.addform.type= 1
						   this.addform.status=sta
						updateOutWarehouse(this.addform).then(res=>{
							if(res.code == 200){
								if(sta == 0){
									this.$message.success("暂存成功")
								}else{
									this.$modal.msgSuccess("修改成功")
								}
								 this.$store.state.app.outwarehouseopen=false
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
			 'addshowform.quantity'(val){
				 this.addshowform.totalPrice=Math.floor(Number(val) * Number(this.addshowform.price)* 100)/100 
			 },
			 'addshowform.price'(val){
			 	this.addshowform.totalPrice=Math.floor(Number(val) * Number(this.addshowform.quantity)* 100)/100 
			 },
			 
			 '$store.state.app.outwarehouseopen':{
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
				   handler: function (val) {
					   if(val != null){
						   getOutWarehouse(val).then(response => {
						   		this.selectedtable=response.data.detailList
						   		this.addform=response.data
						   		this.supplierName=response.data.customerId + ',' + response.data.customer
						   		// this.warehouseName=response.data.storeId+ ','  + response.data.storeName
								this.serprofrom.warehouseId=response.data.storeId
								this.addform.cons=response.data.constructionWorkId + ','  + response.data.constructionWork
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
		justify-content: left;
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
