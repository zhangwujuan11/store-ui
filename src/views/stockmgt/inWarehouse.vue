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
	  <el-form-item label="单据日期"  prop="documentDate">
	   <el-date-picker
	     v-model="daterangeEstimatedDelivery"
	     size="small"
	     style="width: 240px"
	     value-format="yyyy-MM-dd"
	     type="daterange"
	     range-separator="-"
	     start-placeholder="开始日期"
	     end-placeholder="结束日期"
	   	 @change="changetime"
	   ></el-date-picker>
	  </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <!-- <el-option label="保存" value="0" /> -->
          <el-option label="提交" value="1" />
          <el-option label="入库" value="2" />
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
      <el-table-column label="供应商编码" align="center" prop="vendorCode" show-overflow-tooltip :min-width="150"/>
      <el-table-column label="供应商名称" align="center" prop="vendorName" show-overflow-tooltip :min-width="150"/>
      <el-table-column label="门店编码" align="center" prop="warehouseCode" show-overflow-tooltip :min-width="150"/>
      <el-table-column label="门店名称" align="center" prop="warehouseName" show-overflow-tooltip :min-width="150"/>
      <el-table-column label="总价" align="center" prop="totalPrice" />
      <el-table-column label="上架人" align="center" prop="shelveUser" show-overflow-tooltip :min-width="100"/>
      <el-table-column label="上架时间" align="center" prop="shelveDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.shelveDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
		  <template slot-scope="scope">
		      <span>{{scope.row.status |status}}</span>
		    </template>
		</el-table-column>
      <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip :min-width="150"/>
      <el-table-column label="操作" align="center"  fixed="right">
        <template slot-scope="scope">
          <el-button
		  v-if="scope.row.status != 2"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['store:inWarehouse:edit']"
          >修改</el-button>
          <el-button
		  v-if="scope.row.status != 2"
            size="mini"
            type="text"
			style="color: red;"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:inWarehouse:remove']"
          >删除</el-button>
		  <el-button
		  v-if="scope.row.status != 2"
		    size="mini"
		    type="text"
		    icon="el-icon-s-check"
				@click="audit(scope.row)"
		    v-hasPermi="['store:inWarehouse:audit']"
		  >审核通过</el-button>
			<el-button size="mini" type="text" icon="el-icon-takeaway-box"
				v-hasPermi="['store:inWarehouse:print']" @click="goprint(scope.row)">打印</el-button>
			<el-button
			  size="mini"
			  type="text"
			  icon="el-icon-position"
				@click="updauser(scope.row)"
			  v-hasPermi="['store:inWarehouse:shelveUser']"
			>指定上架人</el-button>
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

    <!-- 添加或修改入库对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="90%"  :close-on-click-modal="false">
		 <p v-if="addform.orderNo" style="margin-top: 0;font-weight: bold;font-size:18;">单号：{{addform.orderNo}}</p>
      <el-form ref="addform" :model="addform" :rules="rules" label-width="80px">
		 <div class="formtop">
			  <div v-if="!look" style="display: flex;">
			 <el-form-item label="门店" prop="warehouseName">
			   <el-select
			   placeholder="请输入门店名称" 
			   v-model="addform.warehouseName"
			    filterable
				@change="warehouseNamechange"
			   >
			     <el-option :label="item.warehouseName" :value="`${item.warehouseId},${item.warehouseName},${item.warehouseCode}`"  v-for="(item,index) in dictList" :key="item.warehouseId" />
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
				  <el-form-item label="产品名称" prop="name">
				    <el-input
				      v-model="serprofrom.name"
				      placeholder="请输入产品名称"
				      clearable
				      size="small"
				    />
				  </el-form-item>
				  <el-form-item label="本厂编码" prop="factoryCode">
				    <el-input
				      v-model="serprofrom.factoryCode"
				      placeholder="请输入本厂编码"
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
				          	<el-radio v-model="tableRadio" :label="scope.row" >&nbsp;</el-radio>
				          </template>
				    </el-table-column>
				    <el-table-column label="carg码" align="center" prop="carg" />
				    <el-table-column label="产品名称" align="center" prop="name" />
				    <el-table-column label="分类" align="center" prop="classify" />
				    <el-table-column label="工艺图纸" align="center" prop="technologyImg" />
				    <el-table-column label="车型" align="center" prop="motorcycleType" />
				    <el-table-column label="长度" align="center" prop="prodLength" />
				    <el-table-column label="中高" align="center" prop="risingFalling" />
				    <el-table-column label="对角" align="center" prop="diagonal" />
				    <el-table-column label="零售价" align="center" prop="retailPrice" />
				    <el-table-column label="本厂编码" align="center" prop="factoryCode" />
				    <el-table-column label="原厂件号" align="center" prop="partNumber" />
				    <el-table-column label="颜色" align="center" prop="prodColour" />
				    <el-table-column label="彩带" align="center" prop="coloredRibbon" />
				    <el-table-column label="单位" align="center" prop="unit" />
				    <el-table-column label="库存预警" align="center" prop="inventoryAlert" />
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
				 <el-form ref="addshowform" :model="addshowform" :rules="rulesaddshowform" label-width="80px"  style="display: flex;">
				  <el-form-item label="数量" prop="receivalQuantity">
				    <el-input
				       v-model="addshowform.receivalQuantity"
					   type="number"
				      size="small"
				    />
				  </el-form-item>
				  <el-form-item label="库位" prop="position">
				    <!-- <el-input size="mini"  v-model="addshowform.position"/> -->
					 <el-select v-model="addshowform.position" 	
						clearable
						filterable
						allow-create  
						placeholder="请选择" 
						 @blur.capture.native="Nameblur($event)"
						default-first-option>
						<el-option 
						v-for="(item, index) in List" 
						:key="index" 
						:label="item.positionCode"
						:value="item.positionCode" />
					  </el-select>
				  </el-form-item>
				  <el-form-item label="单价" prop="price">
				    <el-input size="mini"  type="number" v-model="addshowform.price" @input="fochange"/>
				  </el-form-item>
				  <el-form-item label="折率" prop="discountRate">
				    <el-input size="mini"  type="number" v-model="addshowform.discountRate" @input="fochange"/>
				  </el-form-item>
				  <el-form-item label="金额" prop="conum">
				    <el-input size="mini"  type="number" v-model="addshowform.conum" @input="fochange" disabled/>
				  </el-form-item>
				  <el-form-item>
					  <p style="display: flex;">
						 <el-button size="mini" type="text" @click="subone">加入清单</el-button>
						 <el-button size="mini" type="text" style="color: red;"  @click="subtwo">清除列表</el-button> 
					  </p>
				  </el-form-item>
				  </el-form>
			  </div>
			   <p class="line"></p>
			   
			   <el-table :data="selectedtable" height="250">
			     <el-table-column label="库位" align="center" prop="position" />
			     <el-table-column label="carg" align="center" prop="carg" />
				 <el-table-column label="产品名称" align="center" prop="productName" />
			     <el-table-column label="数量" align="center" prop="receivalQuantity" />
			     <el-table-column label="单价" align="center" prop="price" />
			     <el-table-column label="总金额" align="center" prop="conum" />
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
			   <div style="text-align: center;margin-top: 20px;" v-if="!look">
				   <el-button v-if="!addform.orderNo" size="mini" type="primary"  icon="el-icon-shopping-cart-full"   @click="subthree('addform')">保存入库单</el-button>
				   <el-button  v-if="addform.orderNo" size="mini" type="primary"  icon="el-icon-shopping-cart-full"   @click="subfour('addform')">确认修改入库单</el-button>
			   </div>
		 </div>
      </el-form>
    </el-dialog>
	<!-- 修改中的修改 -->
	<el-dialog title="编辑" :visible.sync="openfrom" width="40%"  :before-close="clo"  :close-on-click-modal="false">
		<el-form ref="openfromdata" :model="openfromdata" :rules="ruless" label-width="80px">
			 <el-form-item label="库位" prop="position">
				 <input type="text" v-model="openfromdata.position">
			 </el-form-item>
			 <el-form-item label="数量" prop="receivalQuantity">
			 	<input type="number" v-model="openfromdata.receivalQuantity">
			 </el-form-item>
			 <el-form-item label="单价" prop="price">
			 	<input type="number" v-model="openfromdata.price">
			 </el-form-item>
			 <div style="text-align: center;">
				<el-button
				   size="mini"
				   type="primary"
				   @click="cherkopenform"
				 >修改</el-button>
				 <el-button
				   size="mini"
				   @click="clo"
				 >取消</el-button> 
			 </div>
			
		</el-form>
	</el-dialog>
	<!-- 指派上架人 -->
	<el-dialog title="上架人" :visible.sync="userlistfrom" width="60%"  :close-on-click-modal="false">
		<el-table :data="userlist">
			<el-table-column  label="选择项" width="80" >
			      <template slot-scope="scope">
			      	<el-radio v-model="userRadios" :label="`${scope.row.userId},${scope.row.userName}`">&nbsp;</el-radio>
			      </template>
			</el-table-column>
		 <el-table-column label="用户编号" align="center" key="userId" prop="userId"/>
		 <el-table-column label="用户名称" align="center" key="userName" prop="userName" />
		 <el-table-column label="用户昵称" align="center" key="nickName" prop="nickName"/>
		 <el-table-column label="手机号码" align="center" key="phonenumber" prop="phonenumber" />
		</el-table>
		<pagination
		  v-show="suerli.total>0"
		  :total="suerli.total"
		  :page.sync="suerli.pageNum"
		  :limit.sync="suerli.pageSize"
		  @pagination="updauser"
		  style="bottom:5px;"
		/>
		<div slot="footer" class="dialog-footer">
		     <el-button
		        size="mini"
		        type="primary"
		        @click="subuser"
		      >确定</el-button>
		      <el-button
		        size="mini"
		        @click="userlistfrom=false"
		      >取消</el-button>
		</div>
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
						<p style="width: 80%;text-align:center;margin: 2px 0;">采购单</p>
					</div>
					<div style="display: flex;justify-content: space-between;align-items: center;width:100%;">
						<span>供应商：{{porinttable.vendorName}}</span>
						<span>采购单日期：{{ parseTime(porinttable.createTime, '{y}-{m}-{d}') }}</span>
					</div>
				</div>
				<!-- <div>
					<img :src="porinttable.storeQrCode" style="width: 50px;height: 50px;">
				</div> -->
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
					<th>折率</th>
					<th>总数量</th>
					<th>单价</th>
					<th>金额</th>
					<tr v-for="(item,index) in porinttable.storeInWarehouseDetailBoList" :key="index">
						<td>{{index + 1}}</td>
						<td>{{item.carg}}</td>
						<td>{{item.productName}}</td>
						<td>{{item.position}}</td>
						<td>{{item.unit}}</td>
						<td>{{item.discountRate}}</td>
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
import { listInWarehouse, getInWarehouse, delInWarehouse, addInWarehouse, updateInWarehouse, exportInWarehouse, addinWarehouse, updatainWarehouse, checkaudit, listUser, shelveUser, addserchku } from "@/api/store/inWarehouse";
import {grounlist} from "@/api/system/tenant";
import { supplierlist } from "@/api/crmgroupmgt";
import { listProduct } from "@/api/store/product";
import { printinhose } from "@/api/store/inventory";

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
			  return '常规入库'
		  }else{
			  return "采购入库"
		  }
	  },
	  status(e){
		  if(e == 1){
			  return '提交'
		  }else if(e== 2){
			  return "入库"
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
	  orders:[],
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
	  daterangeEstimatedDelivery:[],
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
		startDate:'',
		endDate:''
      },
	  tableRadio:{
		  retailPrice:0,
		  carg:null,
		  productId:null,
		  name:null
	  },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
		 warehouseName: [{ required: true, message: '请选择门店', trigger: 'blur' }], 
		 vendorName: [{ required: true, message: '请选择供应商', trigger: 'blur' }], 
		 paymentTerms: [{ required: true, message: '请选择结算方式', trigger: 'blur' }]
	  },
	  isShow:true,
	  dictList:[],//仓库列表
	  supplist:[],//仓库列表
	  serprofrom:{
		  pageNum:1,
		  pageSize:10,
		  total:0,
		  name:null,
		  factoryCode:null,
		  carg:null,
		  classify:null,
		  pinyin:null
	  },//产品查询表单
	  tab:[],//产品table
	  selectedtable:[],//清单table
	  addform:{
		  orderCategory:'1',//单据类型
		  status: "0",//状态(0保存，1审核入库)
	  },
	  warehouseName:'',//未处理的仓库数据
	  supplierName:'',//未处理的供应商数据
	  addshowform:{//表单暂时数据
		discountRate:1,
		conum:0
	  },
	  openfrom:false,
	  openfromdata:{},
	  rulesaddshowform:{
		   discountRate: [{
		  	pattern:/^((0.[1-9]{1})|(([1-9]{1})(.\d{1})?))$/,
		  	message: "格式不正确",
		  	trigger: "blur"}], 
	  },
	  ruless:{
		 receivalQuantity: [{ required: true, message: '请输入数量', trigger: 'blur' }], 
		 price: [{ required: true, message: '请输入金额', trigger: 'blur' }]
	  },
	  openfromdataindex:null,
	  userlist:[],//指派人员列表
	  userlistfrom:false,
	  userRadios:'',//选中的指派员
	  userinwareid:null,//指派的库id
	  suerli:{
		  pageNum:1,
		  pageSize:10
	  },
	  lis:{},
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
	  infodata:{},
	  look:false,
	  List:[]
    };
  },
  created() {
    this.getList();
  },
  methods: {
	   Nameblur(e) {
			this.$set(this.addshowform,'position',e.target.value)
	      },
	  
	  fochange(){
	  	this.$forceUpdate()
	  },
	  // 查询时间改变时
	  changetime(){
	  		  if(this.daterangeEstimatedDelivery){
	  			  this.queryParams.startDate=this.daterangeEstimatedDelivery[0]
	  			  this.queryParams.endDate=this.daterangeEstimatedDelivery[1]
	  		  }else{
	  			  this.queryParams.startDate=""
	  			  this.queryParams.endDate=""
	  		  }
	  },
	  // 产品查询
	  serfrom(){
		  this.serprofrom.status="0"
		  listProduct(this.serprofrom).then(res=>{
			  this.tab=res.data.items
			  this.serprofrom.total=res.data.total
			  this.tableRadio=null
		  })
	  },
	  
    /** 查询入库列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeShelveDate && '' != this.daterangeShelveDate) {
        this.queryParams.params["beginShelveDate"] = this.daterangeShelveDate[0];
        this.queryParams.params["endShelveDate"] = this.daterangeShelveDate[1];
      }
		this.queryParams.orderCategory=1
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
			discountRate:1,
			price:null
		}
		this.addform={
			orderNo:null,
			paymentTerms:null
		}
      this.warehouseName=''//未处理的仓库数据
      this.supplierName=''
	  this.tableRadio=null
      this.resetForm("addform");
	  this.selectedtable=[]
	  this.serprofrom.carg=null
	   this.serprofrom.name=null
	   this.serprofrom.factoryCode=null
	   this.serprofrom.classify=null
	   this.serprofrom.pinyin=null
	   this.serfrom()
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeShelveDate = [];
	 this.daterangeEstimatedDelivery=[]
	 this.queryParams.startDate=''
	 this.queryParams.endDate=''
      this.resetForm("queryForm");
      this.handleQuery();
    },
	/** 新增按钮操作 */
	handleAdd(){
		grounlist().then(res=>{
			this.dictList=res.data.items
		})
		supplierlist({status:0}).then(res=>{
			this.supplist=res.data.items
		})
		this.serfrom()
		this.reset();
		this.selectedtable.pop()
		this.look=false
	    this.open = true;
	    this.title = "添加入库";
	},
	/** 修改按钮操作 */
	handleUpdate(row) {
		this.infodata=row
		grounlist().then(res=>{
			this.dictList=res.data.items
		})
		supplierlist({status:0}).then(res=>{
			this.supplist=res.data.items
		})
		this.serfrom()
	  this.reset();
	  this.selectedtable.pop()
	  const inWarehouseId = row.inWarehouseId
	  getInWarehouse(inWarehouseId).then(response => {
	    this.addform = response.data;
		this.warehouseName=this.addform.warehouseId+',' + this.addform.warehouseName+',' + this.addform.warehouseCode
		this.supplierName=this.addform.vendorId+','+this.addform.vendorName+',' +this.addform.vendorCode
		this.selectedtable=this.addform.storeInWarehouseDetailBoList
		this.look=false
	    this.open = true;
	    this.title = "修改入库";
	  });
	},
	lookdata(row) {
		this.infodata=row
		grounlist().then(res=>{
			this.dictList=res.data.items
		})
		supplierlist({status:0}).then(res=>{
			this.supplist=res.data.items
		})
		this.serfrom()
	  this.reset();
	  this.selectedtable.pop()
	  const inWarehouseId = row.inWarehouseId
	  getInWarehouse(inWarehouseId).then(response => {
	    this.addform = response.data;
		this.warehouseName=this.addform.warehouseId+',' + this.addform.warehouseName+',' + this.addform.warehouseCode
		this.supplierName=this.addform.vendorId+','+this.addform.vendorName+',' +this.addform.vendorCode
		this.selectedtable=this.addform.storeInWarehouseDetailBoList
		this.title = "入库详情";
		this.look=true
	    this.open = true;
	  });
	},
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.inWarehouseId)
		this.orders= selection.map(item => item.orderNo)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
		/** 删除按钮操作 */
		handleDelete(row) {
		  const inWarehouseIds = row.inWarehouseId || this.ids;
		  const abc =row.orderNo || this.orders
		  this.$modal.confirm('是否确认删除单号为"' + abc + '"的数据项？').then(function() {
		    return delInWarehouse(inWarehouseIds);
		  }).then(() => {
		    this.getList();
		    this.$modal.msgSuccess("删除成功");
		  }).catch(() => {});
		},
	
	// 处理仓库数据
	warehouseNamechange(val){
		let [id,name,code] = val.split(',')
			this.addform.warehouseId = id
			this.addform.warehouseName = name
			this.addform.warehouseCode = code
			
	},
	// 处理供应商数据
	supplierNamechange(val){
		let [id,name,code] = val.split(',')
			this.addform.vendorId = id
			this.addform.vendorName = name
			this.addform.vendorCode = code
	},
	// 临时表单
	cahnridao(record,index){
		this.tableRadio=record
		this.addshowform.price=this.tableRadio.retailPrice
		this.addshowform.carg=this.tableRadio.carg
		this.addshowform.productId=this.tableRadio.productId
		this.addshowform.productName=this.tableRadio.name
		if(this.addform.warehouseId){
			// 新增需求
			addserchku({wid:this.addform.warehouseId,pid:this.addshowform.productId}).then(res=>{
				this.List=res.data
			})
		}
	},
	isgored(e){
		console.log(e)
	},
	// 加入清单
	subone(){
		if(this.addshowform.receivalQuantity<=0 || this.addshowform.receivalQuantity == undefined){
			this.$message.error("请填写正确的数量")
			return false
		}else if(!this.addshowform.productId){
			this.$message.error("请选择产品")
			return false
		}else if(!this.addshowform.position){
			this.$message.error("请输入库位")
			return false
		} else{
			if(this.selectedtable.length!=0){
				let newArray = this.selectedtable.map((item) => {
				    return item.position
				})
				// if(newArray.indexOf(this.addshowform.position) != -1 ){
				// 	this.$message.error("产品库位重复")
				// 	return false
				// }else{
				// 	this.selectedtable.push(this.addshowform)
				// 	this.addshowform={//表单暂时数据
				// 		DiscountRate:1 ,
				// 		price:null
				// 	}
				// 	this.tableRadio=null
				// }
				this.selectedtable.push(this.addshowform)
				this.addshowform={//表单暂时数据
					discountRate:1 ,
					price:0
				}
				this.tableRadio=null
			}else{
				this.selectedtable.push(this.addshowform)
				this.addshowform={//表单暂时数据
					discountRate:1,
					price:0
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
	// 保存入库单
	subthree( formName ){
		this.addform.storeInWarehouseDetailBoList=this.selectedtable
		if(this.addform.storeInWarehouseDetailBoList.length == 0){
			this.$message.error("入库信息不完整")
		}else{
			this.$refs['addform'].validate(valid => {
			  if (valid) {
					this.addform.orderCategory=1
					this.addform.status=1
				addinWarehouse(this.addform).then(res=>{
					if(res.code == 200){
						this.$message.success("入库成功")
						this.open=false
						this.reset()
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
	
	// 修改数据
	opform(i,index){
		this.openfromdataindex = index
		this.openfromdata = i
		this.lis=JSON.stringify(i)
		this.openfrom = true
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
			 if(this.addform.inWarehouseId == undefined){
			 	this.selectedtable[this.openfromdataindex].position=this.openfromdata.position
			 	this.selectedtable[this.openfromdataindex].price=this.openfromdata.price
			 	this.selectedtable[this.openfromdataindex].receivalQuantity=this.openfromdata.receivalQuantity
			 	this.openfrom=false
			 }else{
			 	if(this.openfromdata.price){
			 		this.addform.storeInWarehouseDetailBoList[this.openfromdataindex].position=this.openfromdata.position
			 		this.addform.storeInWarehouseDetailBoList[this.openfromdataindex].price=this.openfromdata.price
			 		this.addform.storeInWarehouseDetailBoList[this.openfromdataindex].receivalQuantity=this.openfromdata.receivalQuantity
			 	}
				 this.openfrom=false
			 }
		  } else {
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
	subfour(){
		this.addform.storeInWarehouseDetailBoList=this.selectedtable
		if(this.addform.storeInWarehouseDetailBoList.length == 0){
			this.$message.error("移库信息不完整")
		}else{
			this.$refs['addform'].validate(valid => {
			  if (valid) {
				updatainWarehouse(this.addform).then(res=>{
					if(res.code == 200){
						 this.$modal.msgSuccess("修改成功")
						 this.open=false
						 this.reset()
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
	
	
	
	// 审核
	audit(i){
		this.$modal.confirm('是否确认通过订单号为"' + i.orderNo + '"的审核？').then(function() {
		  return checkaudit(i.inWarehouseId)
		}).then(() => {
		  this.getList();
		  this.$modal.msgSuccess("审核通过成功");
		}).catch(() => {});
	},
	// 指定上架人
	updauser(val){
		this.userinwareid=val.inWarehouseId
		listUser(this.suerli).then(res=>{
			this.userlist=res.rows
			this.userlistfrom=true
			this.suerli.total=res.total
			this.userRadios=val.shelveBy+','+val.shelveUser
		})
		
		
	},
	// 提交指派人
	subuser(){
		let [id,name] = this.userRadios.split(',')
		shelveUser({
			"shelveUser":name, //上架人
			"shelveBy": id, //上架人id
			"inWarehouseId":this.userinwareid//入库id
		}).then(res=>{
			if(res.code == 200){
			this.$modal.msgSuccess("指派成功")
				 this.userlistfrom=false
				 this.getList()
			}else{
				this.$message.error(res.message)
			}
		})
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
  		 this.addshowform.conum=  Math.floor(val*this.addshowform.price * this.addshowform.discountRate* 100)/100
  	 },
  	 'addshowform.price'(val){
  		  this.addshowform.conum=  Math.floor(val*this.addshowform.receivalQuantity * this.addshowform.discountRate* 100)/100 
  	 },
  	 'addshowform.discountRate'(val){
  	 		this.addshowform.conum= Math.floor(val*this.addshowform.receivalQuantity * this.addshowform.price* 100)/100 
  	 }
  }
};
</script>
<style scoped>
	.formtop{
		display: flex;
		justify-content:left;
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
</style>
