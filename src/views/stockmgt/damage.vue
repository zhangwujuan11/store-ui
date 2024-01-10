<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="单据编号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入单据编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
    <!--  <el-form-item label="门店编码" prop="warehouseCode">
        <el-input
          v-model="queryParams.warehouseCode"
          placeholder="请输入门店编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="门店名称" prop="storeName">
        <el-input
          v-model="queryParams.storeName"
          placeholder="请输入门店名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="暂存" value="0" />
          <el-option label="提交" value="1" />
          <el-option label="出库" value="3" />
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
          v-hasPermi="['store:damage:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="inWarehouseList">
      <el-table-column label="单号" align="center" prop="orderNo" />
      <el-table-column label="门店名称" align="center" prop="storeName" />
      <el-table-column label="经办人" align="center" prop="constructionWork" />
      <el-table-column label="责任单位" align="center" prop="customer" />
      <el-table-column label="状态" align="center" prop="status">
		  <template slot-scope="scope">
		      <span>{{scope.row.status |status}}</span>
		    </template>
		</el-table-column>
      <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip :min-width="150"/>
      <el-table-column label="操作" align="center" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button
		  v-if="scope.row.status != 3"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['store:damage:edit']"
          >修改</el-button>
          <el-button
		  v-if="scope.row.status != 3"
            size="mini"
            type="text"
			style="color: red;"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:damage:remove']"
          >删除</el-button>
		  <el-button
		  v-if="scope.row.status == 1"
		    size="mini"
		    type="text"
		    icon="el-icon-s-check"
				@click="audit(scope.row)"
		    v-hasPermi="['store:damage:audit']"
		  >审核通过</el-button>
		  <el-button size="mini" type="text" icon="el-icon-takeaway-box"
		  	v-hasPermi="['store:damage:print']" @click="goprint(scope.row)">打印</el-button>
			<el-button
			  size="mini"
			  type="text"
			  icon="el-icon-view"
			@click="lookdata(scope.row)"
			>查看详情</el-button>
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

    <!-- 添加或修改报损对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="90%" :close-on-click-modal="false">
		 <p v-if="addform.orderNo" style="margin-top: 0;font-weight: bold;font-size:18;">单号：{{addform.orderNo}}</p>
		<el-form ref="addform" :model="addform" :rules="rules" label-width="80px">
		 <div class="formtop">
			 <div v-if="!look" style="display: flex;">
			 	<el-form-item label="门店" prop="warehouseId">
			 	  <el-select
			 	  placeholder="请输入门店名称" 
			 	 v-model="addform.warehouseId"
			 	   filterable
			 		@change="warehouseNamechange($event)">
			 	    <el-option :label="item.warehouseName"
			 	    	:value="item.warehouseId"
			 	    	v-for="(item,index) in dictList" :key="item.warehouseId" />
			 	  </el-select>
			 	</el-form-item>
			 	<el-form-item label="业务员" prop="cons">
			 		<el-select  placeholder="请输入业务员"  v-model="addform.cons" @change="supp" filterable>
			 			<el-option :label="item.userName" :value="`${item.userId},${item.userName}`"
			 				v-for="(item,index) in userlist" :key="item.userId" />
			 		</el-select>
			 	</el-form-item>
			 	<el-form-item label="责任人" prop="customerUser">
			 	  <el-input v-model="addform.customerUser"  placeholder="请输入责任人"></el-input>
			 	</el-form-item>
			 	<el-form-item label="责任单位" prop="supplierName">
			 	  <el-select
			 	  v-model="addform.supplierName" @change="supplierNamechange"   filterable
			 	  >
					<el-option :label="item.name" :value="`${item.customerId},${item.name}`"
						v-for="(item,index) in kehu" :key="item.customerId" />
			 	  </el-select>
			 	</el-form-item>
			 	<el-form-item label="备注" prop="remark">
			 	 <el-input   v-model="addform.remark"></el-input>
			 	</el-form-item>
			 </div>
			 <div v-if="look" class="infodatap">
				<p style="margin-left: 10px;">门店：{{addform.storeName}}</p>
				<p style="margin-left: 10px;">业务员：{{addform.constructionWork}}</p>
				<p style="margin-left: 10px;">责任人：{{addform.customerUser}}</p>
				<p style="margin-left: 10px;">责任单位：{{addform.customer}}</p>
				<p style="margin-left: 10px;">备注：{{addform.remark}}</p>
			</div>
			</div>
		 <div class="formcenter">
			 <p class="line" v-if="!look"></p>
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
				 <el-form-item label="分类" prop="delivery">
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
				          	<el-radio v-model="tableRadio" :label="scope.row" @change="cahnridao">&nbsp;</el-radio>
				          </template>
				    </el-table-column>
				   <el-table-column label="库存" align="center" prop="usableQuantity">
				   <template slot-scope="scope">
				   	<span style="color:red;">{{scope.row.usableQuantity}}</span>
				   </template>
				   </el-table-column>
				    <el-table-column label="库位名称" align="center" prop="positionCode" />
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
			  <p class="line"  v-if="!look"></p>
			  <div class="formcendov" v-if="!look">
				  <el-form-item label="数量" prop="quantity">
				    <el-input
				       v-model="addshowform.quantity"
					   type="number"
				      size="small"
				    />
				  </el-form-item>
				  <el-form-item label="库位" prop="positionCode">
				    <el-input size="mini"  v-model="addshowform.positionCode"/>
				  </el-form-item>
				  <el-form-item label="单价" prop="price">
				    <el-input size="mini"  type="number" v-model="addshowform.price"/>
				  </el-form-item>
				  <el-form-item label="金额" prop="conum">
				    <el-input size="mini"  type="number" disabled
					 v-model="addshowform.conum"/>
				  </el-form-item>
				  <el-form-item>
					  <p style="display: flex;">
						 <el-button size="mini" type="text" @click="subone">加入清单</el-button>
						 <el-button size="mini" type="text" style="color: red;"  @click="subtwo">清除列表</el-button> 
					  </p>
				  </el-form-item>
			  </div>
			   <p class="line"></p>
			   <el-table :data="selectedtable" height="250">
			     <el-table-column label="库位" align="center" prop="positionCode" />
				 <el-table-column label="产品名称" align="center" prop="productName" />
			     <el-table-column label="数量" align="center" prop="quantity" />
			     <el-table-column label="单价" align="center" prop="price" />
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
			   <div v-if="!look" style="text-align: center;margin-top: 20px;"> 
				   <el-button size="mini" type="primary"  v-if="!addform.orderNo && addform.status!=1"  icon="el-icon-shopping-cart-full" @click="subthree(0)">暂存</el-button>
				   <el-button size="mini" type="primary"  v-if="addform.orderNo && addform.status!=1" icon="el-icon-shopping-cart-full" @click="putgrom(0)">暂存</el-button>
				   <el-button v-if="!addform.orderNo" size="mini" type="primary"  icon="el-icon-shopping-cart-full"   @click="subthree(1)">保存报损单</el-button>
				   <el-button  v-if="addform.orderNo" size="mini" type="primary"  icon="el-icon-shopping-cart-full"   @click="putgrom(1)">确认修改报损单</el-button>
			   </div>
		 </div>
      </el-form>
    </el-dialog>
	<!-- 修改中的修改 -->
	<el-dialog title="编辑" :visible.sync="openfrom" width="40%" :before-close="clo" :close-on-click-modal="false">
		<el-form ref="openfromdata" :model="openfromdata" :rules="ruless" label-width="80px">
			 <el-form-item label="数量" prop="quantity">
			 	<input type="number" v-model="openfromdata.quantity">
			 </el-form-item>
			 <el-form-item label="单价" prop="price">
			 	<input type="number" v-model="openfromdata.price">
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
	
	
	<!-- 打印 -->
	<el-dialog  :visible.sync="printbox" width="760px" :close-on-click-modal="false">
		<div class='preview_content2' id="print" ref="print" style="width:100%;">
			<div style="display: flex;justify-content: space-between;">
				<div style="width: calc( 100% - 100px);">
					<div style="display: flex;justify-content: space-between;align-items: center;width:100%;">
						<img :src="porinttable.logoSrc" style="width: 115px;height: 48px;">
						<h4 style="width: calc( 100% - 50px );text-align: center;font-weight: 800;font-size: 16px;">{{porinttable.storeName}}</h4>
					</div>
					<div style="display: flex;justify-content: space-between;align-items: center;width:100%;">
						<h4 style="width: 20%;margin: 2px 0;font-size: 13px;">{{porinttable.orderNo}}</h4>
						<p style="width: 80%;text-align:center;margin: 2px 0;">报损单</p>
					</div>
					<div style="display: flex;justify-content: space-between;align-items: center;width:100%;">
						<span>客户：{{porinttable.customer}}</span>
						<span>报损单日期：{{ parseTime(porinttable.createTime, '{y}-{m}-{d}') }}</span>
					</div>
				</div>
				<div>
					<img :src="porinttable.storeQrCode" style="width: 50px;height: 50px;">
				</div>
			</div>
			<div>
				<!-- <el-table :data="porinttable.detailList" style="width:100%;border:1px solid #ccc;" border  id="printrable">
					<el-table-column label="编号" align="center" type="index" />
					<el-table-column label="carg" align="center" prop="carg" />
					<el-table-column label="产品" align="center" prop="productName" />
					<el-table-column label="库位" align="center" prop="positionCode" />
					<el-table-column label="单位" align="center" prop="unit" />
					<el-table-column label="总数量" align="center" prop="quantity" />
					<el-table-column label="单价" align="center" prop="price" />
					<el-table-column label="金额" align="center"  prop="totalPrice" />
				</el-table> -->
				<table border="0" cellspacing="0" style="width: 100%;" id="printrable">
					<th>编号</th>
					<th>carg</th>
					<th>产品</th>
					<th>库位</th>
					<th>单位</th>
					<th>总数量</th>
					<th>单价</th>
					<th>金额</th>
					<tr v-for="(item,index) in porinttable.detailList" :key="index">
						<td>{{index + 1}}</td>
						<td>{{item.carg}}</td>
						<td>{{item.productName}}</td>
						<td>{{item.positionCode}}</td>
						<td>{{item.unit}}</td>
						<td>{{item.quantity}}</td>
						<td>{{item.price}}</td>
						<td>{{item.totalPrice}}</td>
					</tr>
				</table>
				<p style="border:1px solid black;margin: 0;padding:5px 10px;border-top: 0;">
					<span style="margin-right: 50px;">产品合计：{{porinttable.productAmount}}</span>
					<span>合计金额：{{porinttable.totalAmountInWords}}</span>
				</p>
				<p style="border:1px solid black;margin: 0;padding:5px 10px;border-top: 0;">备注：{{porinttable.remark}}</p>
			</div>
			<p  style="display: flex;justify-content: left;align-items: center;">
				<span style="display: block;width: 70%;">订货电话：{{porinttable.orderPhoneNumber}}</span> 
				<span>制单人：{{porinttable.createBy}}</span>
			</p>
			<p style="display: flex;justify-content: left;align-items: center;">
				<span style="display: block;width: 70%;">订货地址：{{porinttable.orderingAddress}}</span> 
				<span>收货人（签字）：</span>
			</p>
		</div>
		<el-button type='primary' size="large" v-print="printObj" style="width: 150px"> 打印</el-button>
	</el-dialog>
  </div>
</template>

<script>
import { listUser,updatebenefit, addInWarehouse,shelveUser } from "@/api/store/inWarehouse";
import {damagelist,damageadd,damagedetel,damageinfo,damageaudit,damageuodate} from "@/api/stockmgt";
import {groulist, infoinventory} from "@/api/crmgroupmgt";
import {grounlist} from "@/api/system/tenant";
import { listInventory, printouthose } from "@/api/store/inventory";

export default {
  name: "InWarehouse",
   dicts: ['paymentTerms', 'delivery_method', "packagingMethod", "priceMode","classification"],
  filters:{
	  paymentTerms(e){
		  if(e == 1){
			  return '现金付款'
		  }else if(e== 2){
			  return '银行转账'
		  }else{
			  return '挂账' 
		  }
	  },
	  orderCategory(e){
		  if(e == "1"){
			  return '常规报损'
		  }else{
			  return "采购报损"
		  }
	  },
	  status(e){
		  if(e == 1){
			  return '提交'
		  }else if(e==0){
			  return '暂存'
		  }else if(e== 3){
			  return "出库"
		  }
	  }
  },
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
      // 报损表格数据
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
        storeName:null,
        status: null,
      },
	  tableRadio:{
		  price:0,
		  productId:null,
		  productName:null,
		  positionCode:null,
		  inventoryId:null,
	  },
      // 表单参数
      form: {},
	  addform:{
	  	status: "0",//状态(0保存，1审核报损)
		warehouseName:null,
		paymentTerms: "4", 
		cons:null,
		customer:null,
		customerId:null,
		supplierName:null,
		customerUser:null,
		warehouseId:null
	  },
      // 表单校验
      rules: {
		 // warehouseId: [{ required: true, message: '请选择门店', trigger: 'blur' }], 
	  },
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
	  addshowform:{//表单暂时数据
		positionCode:''
	  },
	  openfrom:false,
	  openfromdata:{},
	  ruless:{
		 quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }], 
		 price: [{ required: true, message: '请输入金额', trigger: 'blur' }]
	  },
	  openfromdataindex:null,
	  userlist:[],//指派人员列表
	  userlistfrom:false,
	  userRadios:{},//选中的指派员
	  userinwareid:null,//指派的库id
	  suerli:{
		  pageNum:1,
		  pageSize:10
	  },
	  lis:{},
	  look:false,
	  userlist: [], //经办人
	  kehu:[],//客户
	  // 打印
	  	printObj: {
	            id: 'print',
	            popTitle: ' ', // 打印的标题
	            extraCss: ' ', // 打印可引入外部的一个 css 文件
	            beforeEntryIframe () {
	              const cells = document.querySelectorAll('.cell')
	              for (let k7 = 0; k7 < cells.length; k7++) {
	                const cell = cells[k7]
	                // 在这里添加样式只是修改了打印的样式，不会污染原页面的样式
	                // 为了让表格中的内容自动换行，不需要的话可以删掉
	                cell.style.whiteSpace = 'pre-wrap' 
	    
	              }
	            }
	          },
	  
	  porinttable:[],
	  printbox:false,
	  infodata:{}
    };
  },
  created() {
    this.getList();
	// this.serfrom()
  },
  methods: {
	  // 产品查询
	  serfrom(){
		  listInventory(this.serprofrom).then(res=>{
			  this.tab=res.data.items
			  this.serprofrom.total=res.data.total
			  this.tableRadio=null
		  })
	  },
	  // 往来责任单位
	  supplierNamechange(val) {
	  	let [id, name] = val.split(',')
	  	this.addform.customer = name
	  	this.addform.customerId = id
	  	this.$forceUpdate()
	  },
	  // 处理门店数据
	  warehouseNamechange(val) {
	  	// `${item.warehouseId},${item.warehouseName},${item.warehouseCode}`
	  	this.dictList.map(item=>{
	  		if(item.warehouseId == val){
	  			this.addform.storeName=item.warehouseName
	  			this.addform.storeId = item.warehouseId
	  			this.serprofrom.warehouseId = item.warehouseId
	  			this.$forceUpdate()
	  			this.serfrom()
	  			this.subtwo()
	  		}
	  	})
	  	// let [id, name, code] = val.split(',')
	  	// this.addform.warehouseId = id
	  	// this.addform.warehouseName = name
	  },
	  // 业务员数据
	  supp(val) {
	  	let [id, name] = val.split(',')
	  	this.addform.constructionWork = name
	  	this.addform.constructionWorkId = id
	  	this.$forceUpdate()
	  },
    /** 查询列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeShelveDate && '' != this.daterangeShelveDate) {
        this.queryParams.params["beginShelveDate"] = this.daterangeShelveDate[0];
        this.queryParams.params["endShelveDate"] = this.daterangeShelveDate[1];
      }
		this.queryParams.orderCategory=3
      damagelist(this.queryParams).then(response => {
        this.inWarehouseList = response.data.items;
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
		this.addshowform={//表单暂时数据
			price:'',
			positionCode:''
		}
		this.addform={
			orderNo:null,
			paymentTerms:null
		}
	  this.tableRadio=null
      this.resetForm("addform");
	  this.selectedtable=[]
	  this.serprofrom.classify=null
	  this.serprofrom.pinyin=null
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
	/** 新增按钮操作 */
	handleAdd(){
		this.reset();
		// 经办人
		listUser({
			pageNum: 1,
			pageSize: 1000
		}).then(res => {
			this.userlist = res.rows
		})
		// 往来客户获取
		groulist().then(res => {
			this.kehu = res.data.items
		})
		grounlist().then(res=>{
			this.dictList=res.data.items
			this.addform.storeName=res.data.items[0].warehouseName
			this.addform.storeId = res.data.items[0].warehouseId
			this.addform.warehouseId=res.data.items[0].warehouseId
			this.serprofrom.warehouseId = res.data.items[0].warehouseId
			this.serfrom()
		})
		// warehouseNamechange(val) {
		// 	this.dictList.map(item=>{
		// 		if(item.warehouseId == val){
		// 			this.addform.storeName=item.warehouseName
		// 			this.addform.storeId = item.warehouseId
		// 			this.serprofrom.warehouseId = item.warehouseId
		// 			this.$forceUpdate()
		// 			this.serfrom()
		// 			this.subtwo()
		// 		}
		// 	})
		// },
		
		
		
		
		
		this.selectedtable.pop()
	    this.open = true;
	    this.title = "添加报损单";
		this.tab=[]
		this.look=false
		this.serprofrom.total=0
	},
	/** 修改按钮操作 */
	handleUpdate(row) {
		this.infodata=row
		this.reset();
	  // 经办人
	  listUser({
	  	pageNum: 1,
	  	pageSize: 1000
	  }).then(res => {
	  	this.userlist = res.rows
	  })
	  // 往来客户获取
	  groulist().then(res => {
	  	this.kehu = res.data.items
	  })
	  this.selectedtable.pop()
	  const inWarehouseId = row.outWarehouseId
	  damageinfo(inWarehouseId).then(response => {
	    this.addform = response.data;
		this.addform.warehouseId=this.addform.storeId
		if(this.addform.customerId != null){
			this.addform.supplierName=this.addform.customerId+','+this.addform.customer
		}else{
			this.addform.supplierName=''
		}
		if(this.addform.constructionWorkId != null){
			this.addform.cons=this.addform.constructionWorkId+','+  this.addform.constructionWork
		}else{
			this.addform.cons=''
		}
		this.selectedtable=this.addform.detailList
	    this.open = true;
		this.look=false
		this.title = "修改报损单";
		this.serprofrom.warehouseId=this.addform.storeId
		this.serfrom()
	  });
	},
	lookdata(row){
		this.reset();
		this.selectedtable.pop()
		const inWarehouseId = row.outWarehouseId
		damageinfo(inWarehouseId).then(response => {
		  this.addform = response.data;
		this.addform.warehouseName=this.addform.storeId+',' + this.addform.storeName
		this.addform.supplierName=this.addform.customerId+','+this.addform.customer 
		this.addform.cons=this.addform.constructionWorkId+','+  this.addform.constructionWork
		this.selectedtable=this.addform.detailList
		  this.open = true;
		 this.title = "报损单详情";
		 this.look=true
		});
	},
	
	// 临时表单
	cahnridao(record,index){
		this.tableRadio=record
		this.addshowform.price=this.tableRadio.price
		this.addshowform.productId=this.tableRadio.productId
		this.addshowform.productName=this.tableRadio.productName
		this.addshowform.positionCode=this.tableRadio.positionCode
		this.addshowform.inventoryId=this.tableRadio.inventoryId
	},
	// 加入清单
	subone(){
		if(this.addshowform.quantity<=0 || this.addshowform.quantity == undefined){
			this.$message.error("请填写正确的数量")
			return false
		}else if(!this.addshowform.productId){
			this.$message.error("请选择产品")
			return false
		}else if(!this.addshowform.positionCode){
			this.$message.error("请输库位")
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
						price:'',
						productId:null,
						productName:null,
						remark:null
					}
					this.tableRadio=null
				}
			}else{
				this.selectedtable.push(this.addshowform)
				this.addshowform={//表单暂时数据
					price:'',
					productId:null,
					productName:null,
					remark:null
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
	// 保存报损单
	subthree( sta ){
		this.addform.detailList=this.selectedtable
		if(this.addform.detailList.length == 0){
			this.$message.error("报损信单息不完整")
		}else{
			this.$refs['addform'].validate(valid => {
			  if (valid) {
					this.addform.status=sta
				damageadd(this.addform).then(res=>{
					if(res.code == 200){
						if(sta == 0){
							this.$message.success("暂存成功")
						}else{
							this.$message.success("报损单添加成功")
						}
						this.open=false
						this.getList()
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const inWarehouseIds = row.outWarehouseId
      this.$modal.confirm('是否确认删除单号为"' + inWarehouseIds + '"的数据项？').then(function() {
        return damagedetel(inWarehouseIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
	
	// 修改数据
	opform(i,index){
		this.openfromdataindex=index
		this.openfromdata=i
		this.lis=JSON.stringify(i)
		this.openfrom=true
		// 获取当前产品库存
		infoinventory(i.inventoryId).then(res=>{
			if(res.code == 200){
				if (this.addform.outWarehouseId == undefined) {
					this.kucunnum =res.data.usableQuantity
				}else{
					this.kucunnum =res.data.usableQuantity + Number(JSON.parse(this.lis).quantity)  
				}
			}
		})
	},
	clo(){
		if (this.addform.outWarehouseId == undefined) {
			this.$set(this.selectedtable, this.openfromdataindex, JSON.parse(this.lis));
		} else {
			this.$set( this.addform.detailList, this.openfromdataindex, JSON.parse(this.lis));
		}
		this.openfrom=false
	},
	// 修改中的修改
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
			  if(this.addform.outWarehouseId == undefined){
			  	this.selectedtable[this.openfromdataindex].price=this.openfromdata.price
			  	this.selectedtable[this.openfromdataindex].quantity=this.openfromdata.quantity
			  	 this.openfrom=false
			  }else{
			  		this.addform.detailList[this.openfromdataindex].price=this.openfromdata.price
			  		this.addform.detailList[this.openfromdataindex].quantity=this.openfromdata.quantity
			  		 this.openfrom=false
			  }
		  } else {
			  if (this.addform.outWarehouseId == undefined) {
			  		this.$set(this.selectedtable, this.openfromdataindex, JSON.parse(this.lis));
			  } else {
			  		this.$set( this.addform.detailList, this.openfromdataindex, JSON.parse(this.lis));
			  }
				return false;
			}
		  })
	},
	putgrom(sta){
		this.addform.status=sta
		damageuodate(this.addform).then(res=>{
			if(res.code == 200){
				if(sta == 0){
					this.$modal.msgSuccess("暂存成功")
				}else{
					this.$modal.msgSuccess("修改成功")
				}
				 this.open=false
				 this.openfrom=false
				 this.getList()
			}else{
				this.$message.error(res.message)
			}
		})
	},
	// 审核
	audit(i){
		this.$modal.confirm('是否确认通过订单号为"' + i.orderNo + '"的审核？').then(function() {
		  return damageaudit({
			outWarehouseId:i.outWarehouseId
			  })
		}).then(() => {
		  this.getList();
		  this.$modal.msgSuccess("审核通过成功");
		}).catch(() => {});
	},
	// 打印
	goprint(i){
		printouthose(i.outWarehouseId).then(res=>{
			this.porinttable=res.data
			this.printbox=true
		})
	}
	// 指定上架人
	// updauser(val){
	// 	this.userinwareid=val.inWarehouseId
	// 	listUser(this.suerli).then(res=>{
	// 		this.userlist=res.rows
	// 		this.userlistfrom=true
	// 		this.suerli.total=res.total
	// 	})
	// },
	// 提交指派人
	// subuser(){
	// 	shelveUser({
	// 		"shelveUser": this.userRadios.userName, //上架人
	// 		"shelveBy":  this.userRadios.userId, //上架人id
	// 		"inWarehouseId":this.userinwareid//报损id
	// 	}).then(res=>{
	// 		if(res.code == 200){
	// 		this.$modal.msgSuccess("指派成功")
	// 			 this.userlistfrom=false
	// 			 this.getList()
	// 		}else{
	// 			this.$message.error(res.message)
	// 		}
	// 	})
	// }
  },
  watch:{
	 'addshowform.quantity'(val){
		 this.addshowform.conum=Math.floor(Number(val)*this.addshowform.price* 100)/100
	 },
	 'addshowform.price'(val){
		  this.addshowform.conum=Math.floor(val*Number(this.addshowform.quantity) * 100)/100
	 },
  }
};
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
	/* 打印 */
	#print{
		font-size: 13px;
	}
	#print table{
		border: 1px solid black;
		border-right: 0;
		margin-top: 10px;
	}
	#print td{
		text-align: center;
		border-right: 1px solid black;
		border-top: 1px solid black;
	}
	#print th{
		border-right: 1px solid black;
	}
	  {
	    margin-left: 0px;
	  }
</style>
