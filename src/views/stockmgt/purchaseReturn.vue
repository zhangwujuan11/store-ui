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
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
           <el-option label="暂存" value="0" />
		   <el-option label="待审核" value="1" />
			<el-option label="完成" value="2" />
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
          v-hasPermi="['store:purchaseReturn:add']"
        >新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
		   style="color: red;"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['store:purchaseReturn:remove']"
        >删除</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="inWarehouseList">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="单号" align="center" prop="orderNo" show-overflow-tooltip :min-width="190"/>
      <el-table-column label="结算方式" align="center" prop="paymentTerms">
		  <template slot-scope="scope">
		  	  <dict-tag :options="dict.type.paymentTerms" :value="scope.row.paymentTerms"/>
		  </template>
	  </el-table-column>
      <el-table-column label="单据类别" align="center" prop="orderCategory">
		  <template slot-scope="scope">
		  	{{scope.row.orderCategory | orderCategory}}
		  </template>
	  </el-table-column>
      <el-table-column label="供应商编码" align="center" prop="vendorCode" show-overflow-tooltip :min-width="100"/>
      <el-table-column label="供应商名称" align="center" prop="vendorName" show-overflow-tooltip :min-width="150"/>
      <el-table-column label="门店编码" align="center" prop="warehouseCode" show-overflow-tooltip :min-width="100"/>
      <el-table-column label="门店名称" align="center" prop="warehouseName" show-overflow-tooltip :min-width="150"/>
      <el-table-column label="总价" align="center" prop="totalPrice" />
      <el-table-column label="状态" align="center" prop="status">
		  <template slot-scope="scope">
		      <span>{{scope.row.status |status}}</span>
		    </template>
		</el-table-column>
      <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip :min-width="150"/>
      <el-table-column label="操作" align="center"  fixed="right" width="200">
        <template slot-scope="scope">
          <el-button
		  v-if="scope.row.status != 2"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['store:purchaseReturn:edit']"
          >修改</el-button>
          <el-button
		  v-if="scope.row.status != 2"
            size="mini"
            type="text"
			style="color: red;"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:purchaseReturn:remove']"
          >删除</el-button>
		  <el-button
		  v-if="scope.row.status != 2"
		    size="mini"
		    type="text"
		    icon="el-icon-s-check"
				@click="audit(scope.row)"
		    v-hasPermi="['store:purchaseReturn:audit']"
		  >审核通过</el-button>
		  <el-button size="mini" type="text" icon="el-icon-takeaway-box"
		  	v-hasPermi="['store:purchaseReturn:print']" @click="goprint(scope.row)">打印</el-button>
		  <el-button
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
    <!-- 添加或修改退货对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="90%"  :close-on-click-modal="false">
		 <p v-if="addform.orderNo" style="margin-top: 0;font-weight: bold;font-size:18;">单号：{{addform.orderNo}}</p>
      <el-form ref="addform" :model="addform" :rules="rules" label-width="80px">
		 <div class="formtop">
			  <div v-if="!look" style="display: flex;">
			 <el-form-item label="门店" prop="warehouseName">
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
			 <el-form-item label="供应商" prop="vendorName">
			   <el-select
			   placeholder="请输入供应商" 
			   v-model="addform.vendorName"
			   @change="supplierNamechange"
			    filterable
			   >
			     <el-option :label="item.supplierName" :value="`${item.supplierId},${item.supplierName},${item.supplierCode}`"  v-for="(item,index) in supplist" :key="item.supplierId" />
			   </el-select>
			 </el-form-item>
			 <el-form-item label="结算方式" prop="paymentTerms">
			   <el-select
			   placeholder="请输选择结算方式" 
			   v-model="addform.paymentTerms"
			   >
			     <el-option v-for="(dict,index) in dict.type.paymentTerms" :key="index"
			     	:label="dict.label" :value="dict.value" />
			   </el-select>
			 </el-form-item>
			 <el-form-item label="备注" prop="remark">
			  <el-input v-model="addform.remark"></el-input>
			 </el-form-item>
			 </div>
			 <div v-if="look" class="infodatap">
				 <p style="margin-left: 10px;">门店：{{addform.warehouseName}}</p>
				 <p style="margin-left: 10px;">供应商：{{addform.vendorName}}</p>
				 <p style="margin-left: 10px;display: flex;">结算方式：<dict-tag :options="dict.type.paymentTerms" :value="addform.paymentTerms"/></p> 
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
				  <el-table  :data="tab" height="250"  v-if="!look"  @row-click="cahnridao">
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
			  <div class="formcendov" v-if="!look">
				  <el-form-item label="数量" prop="receivalQuantity">
				    <el-input
				       v-model="addshowform.receivalQuantity"
					   type="number"
				      size="small"
				    />
				  </el-form-item>
				  <el-form-item label="单价" prop="price">
				    <el-input size="mini"  type="number" v-model="addshowform.price"  @input="fochange"/>
				  </el-form-item>
				  <el-form-item label="备注" prop="remark">
				    <el-input size="mini" v-model="addshowform.remark"/>
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
				   <el-table-column label="库位" align="center" prop="position" />
				    <el-table-column label="carg" align="center" prop="carg" />
				    <el-table-column label="产品名称" align="center" prop="productName" />
				    <el-table-column label="数量" align="center" prop="receivalQuantity" />
				    <el-table-column label="单价" align="center" prop="price" />
				    <el-table-column label="总金额" align="center">
						 <template slot-scope="scope">
							 {{ scope.row.receivalQuantity * scope.row.price }}
						 </template>
					</el-table-column>>
				    <el-table-column label="备注" align="center" prop="remark" />
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
				 <el-button size="mini" type="primary"  v-if="addform.orderNo && addform.status!=1" icon="el-icon-shopping-cart-full" @click="subfour(0)">暂存</el-button>
				   <el-button v-if="!addform.orderNo" size="mini" type="primary"  icon="el-icon-shopping-cart-full"   @click="subthree(1)">保存退货单</el-button>
				   <el-button  v-if="addform.orderNo" size="mini" type="primary"  icon="el-icon-shopping-cart-full"   @click="subfour(1)">确认修改退货单</el-button>
			   </div>
		 </div>
      </el-form>
    </el-dialog>
	<!-- 修改中的修改 -->
	<el-dialog title="编辑" :visible.sync="openfrom" width="40%" :before-close="clo" :close-on-click-modal="false">
		<el-form ref="openfromdata" :model="openfromdata" :rules="ruless" label-width="80px">
			 <el-form-item label="数量" prop="receivalQuantity">
			 	<input type="number" v-model="openfromdata.receivalQuantity">
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
	<!-- 打印 -->
	<el-dialog  :visible.sync="printbox" width="760px" :close-on-click-modal="false">
		<div class='preview_content2' id="print" ref="print" style="width:100%;">
			<div style="display: flex;justify-content: space-between;">
				<div style="width: calc( 100% - 100px);">
					<div style="display: flex;justify-content: space-between;align-items: center;width:100%;">
						<img :src="porinttable.logoSrc" style="width: 115px;height: 48px;">
						<h4 style="width: calc( 100% - 50px );text-align: center;font-weight: 800;font-size: 16px;">{{porinttable.warehouseName}}</h4>
					</div>
					<div style="display: flex;justify-content: space-between;align-items: center;width:100%;">
						<h4 style="width: 20%;margin: 2px 0;font-size: 13px;">{{porinttable.orderNo}}</h4>
						<p style="width: 80%;text-align:center;margin: 2px 0;">采购退货单</p>
					</div>
					<div style="display: flex;justify-content: space-between;align-items: center;width:100%;">
						<span>供应商：{{porinttable.vendorName}}</span>
						<span>采购退货单日期：{{ parseTime(porinttable.createTime, '{y}-{m}-{d}') }}</span>
					</div>
				</div>
			</div>
			<div>
				<!-- <el-table :data="porinttable.storeInWarehouseDetailBoList" style="width:100%;border:1px solid #ccc;" border  id="printrable">
					<el-table-column label="编号" align="center" type="index" />
					<el-table-column label="carg" align="center" prop="carg" />
					<el-table-column label="产品" align="center" prop="productName" />
					<el-table-column label="库位" align="center" prop="position" />
					<el-table-column label="单位" align="center" prop="unit" />
					<el-table-column label="折率" align="center" prop="discountRate" />
					<el-table-column label="总数量" align="center" prop="receivalQuantity" />
					<el-table-column label="单价" align="center" prop="price" />
					<el-table-column label="金额" align="center"  prop="totalPrice" />
				</el-table> -->
				<table border="0" cellspacing="0" style="width: 100%;">
					<th>编号</th>
					<th>carg</th>
					<th>产品</th>
					<th>库位</th>
					<th>单位</th>
					<th>总数量</th>
					<th>单价</th>
					<th>金额</th>
					<tr v-for="(item,index) in porinttable.storeInWarehouseDetailBoList" :key="index">
						<td>{{index + 1}}</td>
						<td>{{item.carg}}</td>
						<td>{{item.productName}}</td>
						<td>{{item.position}}</td>
						<td>{{item.unit}}</td>
						<td>{{item.receivalQuantity}}</td>
						<td>{{item.price}}</td>
						<td>{{item.totalPrice}}</td>
					</tr>
				</table>
				<p style="border:1px solid black;margin: 0;padding:5px 10px;border-top: 0;">
					<span style="margin-right: 50px;">产品合计：{{porinttable.totalPrice}}</span>
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
import { listInWarehouse, getInWarehouse, delInWarehousess } from "@/api/store/inWarehouse";
import { purreturn, updatepurreturn, checkourreturn} from "@/api/stockmgt";
import {grounlist} from "@/api/system/tenant";
import { supplierlist, infoinventory } from "@/api/crmgroupmgt";
import {listInventory, printinhose} from "@/api/store/inventory";

export default {
  name: "InWarehouse",
  dicts: ['paymentTerms', 'delivery_method', "packagingMethod", "priceMode", "classification"],
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
			  return '常规退货'
		  }else{
			  return "采购退货"
		  }
	  },
	  status(e){
		  if(e == 1){
			  return '待审核'
		  }else if(e==0){
			  return '暂存'
		  }else if(e== 2){
			  return "完成"
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
      // 退货表格数据
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
	  tableRadio:{
		  price:null,
		  productName:null,
		  inventoryId:null,
		  unit:null
	  },
	  lis:{},
      // 表单参数
      form: {},
	  addform:{
		  warehouseName:null,
		  vendorName:null,
		  paymentTerms:null,
		  warehouseId :null,
		  warehouseName:null,
		  warehouseCode:null,
		  vendorId:null,
		  vendorName:null,
		  vendorCode:null
	  },
      // 表单校验
      rules: {
		 // warehouseName: [{ required: true, message: '请选择门店', trigger: 'blur' }], 
		 vendorName: [{ required: true, message: '请选择供应商', trigger: 'blur' }], 
		 paymentTerms: [{ required: true, message: '请选择结算方式', trigger: 'blur' }],
	  },
	  isShow:true,
	  dictList:[],//门店列表
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
		discountRate:1  
	  },
	  openfrom:false,
	  openfromdata:{},
	  ruless:{
		 receivalQuantity: [{ required: true, message: '请输入数量', trigger: 'blur' }], 
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
	  look:false,
	  kucunnum:null,
	  infodata:{},
	  orders:[],
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
	  printbox:false
    };
  },
  created() {
    this.getList();
  },
  methods: {
	  fochange(){
	  	this.$forceUpdate()
	  },
	  // 库存查询
	  serfrom(){
		  listInventory(this.serprofrom).then(res=>{
			  this.tab=res.data.items
			  this.serprofrom.total=res.data.total
			  this.tableRadio=null
		  })
	  },
    /** 查询退货列表 */
    getList() {
      this.loading = true;
	  this.queryParams.orderCategory=2
      listInWarehouse(this.queryParams).then(response => {
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
			price:0
		}
		this.addform={
			orderNo:null,
			paymentTerms:null
		}
      this.warehouseName=''//未处理的门店数据
      this.supplierName=''
	  this.tableRadio=null 
      this.resetForm("addform");
	  this.selectedtable=[]
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
		grounlist().then(res => {
			this.dictList = res.data.items
			this.addform.warehouseId=res.data.items[0].warehouseId
			this.serprofrom.warehouseId = res.data.items[0].warehouseId
			this.serfrom()
			this.subtwo()
		})
		supplierlist({status:0}).then(res=>{
			this.supplist=res.data.items
		})
		this.selectedtable.pop()
		this.tab=[]
	    this.open = true;
		this.look=false
	    this.title = "添加退货";
	},
	// 处理门店数据
	warehouseNamechange(val){
		this.dictList.map(item=>{
			if(item.warehouseId == val){
				this.addform.warehouseName=item.warehouseName
				this.addform.warehouseCode = item.warehouseCode
				this.serprofrom.warehouseId = item.warehouseId
				this.$forceUpdate()
				this.serfrom()
				this.subtwo()
			}
		})
	},
	// 处理供应商数据
	supplierNamechange(val){
		let [id,name,code] = val.split(',')
			this.addform.vendorId = id
			this.addform.vendorName = name
			this.addform.vendorCode = code
			this.serprofrom.vendorId=id
			this.serfrom()
			this.subtwo()
	},
	/** 修改按钮操作 */
	handleUpdate(row) {
		this.infodata=row
	  this.reset();
	  grounlist().then(res=>{
	  	this.dictList=res.data.items
	  })
	  supplierlist({status:0}).then(res=>{
	  	this.supplist=res.data.items
	  })
	  this.selectedtable.pop()
	  const inWarehouseId = row.inWarehouseId
	  getInWarehouse(inWarehouseId).then(response => {
	    this.addform = response.data;
		this.warehouseName=this.addform.warehouseId+',' + this.addform.warehouseName+',' + this.addform.warehouseCode
		this.supplierName=this.addform.vendorId+','+this.addform.vendorName+',' +this.addform.vendorCode
		this.selectedtable=this.addform.storeInWarehouseDetailBoList
		this.serprofrom.warehouseId=this.addform.warehouseId
		this.serprofrom.vendorId=this.addform.vendorId
		this.serfrom()
	    this.open = true;
		this.look=false
		this.title = "修改退货";
	  });
	},
	lookdata(row){
		this.reset();
		this.selectedtable.pop()
		const inWarehouseId = row.inWarehouseId
		getInWarehouse(inWarehouseId).then(response => {
			this.addform = response.data;
			this.warehouseName=this.addform.warehouseId+',' + this.addform.warehouseName+',' + this.addform.warehouseCode
			this.supplierName=this.addform.vendorId+','+this.addform.vendorName+',' +this.addform.vendorCode
			this.selectedtable=this.addform.storeInWarehouseDetailBoList
			this.serprofrom.warehouseId=this.addform.warehouseId
			this.serprofrom.vendorId=this.addform.vendorId
			this.serfrom()
		    this.open = true;
		    this.title = "退货详情";
			this.look=true
		});
	},
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.inWarehouseId)
	  this.orders = selection.map(item => item.orderNo)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
	// 临时表单
	cahnridao(record,index){
		this.tableRadio=record
		this.addshowform.price=this.tableRadio.price
		this.addshowform.productName = this.tableRadio.productName //产品名称
		this.addshowform.inventoryId=this.tableRadio.inventoryId
		this.addshowform.unit=this.tableRadio.unit
		this.addshowform.inventoryId=this.tableRadio.inventoryId
		this.addshowform.position=this.tableRadio.positionCode
		this.addshowform.carg=this.tableRadio.carg
	},
	// 加入清单
	subone(){
		if(this.addshowform.receivalQuantity<=0 || this.addshowform.receivalQuantity == undefined){
			this.$message.error("请填写正确的数量")
			return false
		}else if(!this.addshowform.inventoryId){
			this.$message.error("请选择产品")
			return false
		}else if (Number(this.addshowform.receivalQuantity) > Number(this.tableRadio.usableQuantity)) {
					this.$message.error("库存仅剩余" + this.tableRadio.usableQuantity + "！")
					this.addshowform.receivalQuantity = this.tableRadio.usableQuantity
					return false
		}else{
			if (this.selectedtable.length != 0) {
				let newArray = this.selectedtable.map((item) => {
					return item.inventoryId
				})
				if (newArray.indexOf(this.addshowform.inventoryId) != -1) {
					
					this.$message.error("不能重复退货 ")
					return false
				} else {
					// delete this.addshowform.outWarehouseDelId
					this.selectedtable.push(this.addshowform)
					this.addshowform = { //表单暂时数据
						inventoryId: null,
						productId: null,
						productName: null,
						addshowform: null,
						position: null
					}
					this.tableRadio={}
				}
			}else{
				this.selectedtable.push(this.addshowform)
				this.addshowform = { //表单暂时数据
					inventoryId: null,
					productId: null,
					productName: null,
					addshowform: null,
					position: null
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const inWarehouseIds = row.inWarehouseId || this.ids;
	  const anc= row.orderNo || this.orders
      this.$modal.confirm('是否确认删除单号为"' + anc + '"的数据项？').then(function() {
        return delInWarehousess(inWarehouseIds);
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
		// if(this.tab!=null){
		// 	this.tab.map(item=>{
		// 		if(item.inventoryId == i.inventoryId){
		// 			if(item.usableQuantity != 0){
		// 				this.kucunnum = item.usableQuantity
		// 			}
		// 		}else{
		// 				this.kucunnum = i.receivalQuantity
		// 			}
		// 	})
		// }else{
		// 	this.kucunnum = i.receivalQuantity
		// }
		infoinventory(i.inventoryId).then(res=>{
			if(res.code == 200){
				if (this.addform.inWarehouseId == undefined) {
					this.kucunnum =res.data.usableQuantity
				}else{
					this.kucunnum =res.data.usableQuantity +  JSON.parse(this.lis).receivalQuantity
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
	// 提交修改
	cherkopenform(){
		this.$refs['openfromdata'].validate(valid => {
		  if (valid) {
			if(Number(this.openfromdata.receivalQuantity)<=0){
				this.$message.error("请填写正确的数量")
				return false
			}else if(Number(this.openfromdata.receivalQuantity)  > this.kucunnum){
				this.$message.error("库存仅剩余" + this.kucunnum +"！" )
				this.openfromdata.receivalQuantity=this.kucunnum
				return false
			}
			if(this.addform.inWarehouseId == undefined){
				this.selectedtable[this.openfromdataindex].price=this.openfromdata.price
				this.selectedtable[this.openfromdataindex].receivalQuantity=this.openfromdata.receivalQuantity
				 this.openfrom=false
			}else{
				this.addform.storeInWarehouseDetailBoList[this.openfromdataindex].price=this.openfromdata.price
				this.addform.storeInWarehouseDetailBoList[this.openfromdataindex].receivalQuantity=this.openfromdata.receivalQuantity
				this.openfrom=false
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
	// 保存退货单
	subthree( sta ){
		this.addform.storeInWarehouseDetailBoList=this.selectedtable
		if(this.addform.storeInWarehouseDetailBoList.length == 0){
			this.$message.error("退货信息不完整")
		}else{
			this.$refs['addform'].validate(valid => {
			  if (valid) {
				  this.addform.status=sta
				purreturn(this.addform).then(res=>{
					if(res.code == 200){
						if(sta == 0){
							this.$message.success("暂存成功")
						}else{
							this.$message.success("退货保存成功")
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
	//提交修改
		subfour(sta) {
				this.addform.storeInWarehouseDetailBoList = this.selectedtable
				if (this.addform.storeInWarehouseDetailBoList.length == 0) {
					this.$message.error("退货信息不完整")
				} else {
					this.$refs['addform'].validate(valid => {
						if (valid) {
							this.addform.status=sta
							updatepurreturn(this.addform).then(res => {
								if (res.code == 200) {
									if(sta == 0){
										this.$modal.msgSuccess("暂存成功")
									}else{
										this.$modal.msgSuccess("修改成功")
									}
									this.open=false
									this.openfrom = false
									this.getList()
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
	// 审核
	audit(i){
		this.$modal.confirm('是否确认通过订单号为"' + i.orderNo + '"的审核？').then(function() {
		  return checkourreturn(i.inWarehouseId)
		}).then(() => {
		  this.getList();
		  this.$modal.msgSuccess("审核通过成功");
		}).catch(() => {});
	},
	
	// 打印
	goprint(i){
		printinhose(i.inWarehouseId).then(res=>{
			this.porinttable=res.data
			this.printbox=true
		})
	}
  },
  watch:{
	 'addshowform.receivalQuantity'(val){
		 this.addshowform.conum=val*this.addshowform.price*this.addshowform.discountRate
	 },
	 'addshowform.price'(val){
		  this.addshowform.conum=val*this.addshowform.receivalQuantity*this.addshowform.discountRate
	 },
	 'addshowform.discountRate'(val){
	 		this.addshowform.conum=val*this.addshowform.receivalQuantity*this.addshowform.price
	 },
	 // tab(newval,old){
		//  if(newval != old){
		// 	 this.subtwo()
		//  }
	 // }
  }
};
</script>
<style scoped>
	.formtop{
		display: flex;
		justify-content: left;
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
