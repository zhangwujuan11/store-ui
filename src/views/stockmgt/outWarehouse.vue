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
     <el-form-item label="车牌号" prop="plateNumber">
       <el-input
         v-model="queryParams.plateNumber"
         placeholder="请输入车牌号"
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
     <el-form-item label="订单时间">
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
	 <el-form-item label="结算方式" prop="paymentTerms">
	   <el-select
	   placeholder="请输选择结算方式"
		clearable
	   v-model="queryParams.paymentTerms"
	   >
	     <el-option
	     v-for="(dict,index) in dict.type.paymentTerms"  
	     :key="index"
	     :label="dict.label"
	     :value="dict.value"/>
	    </el-select>
	 </el-form-item>
     <el-form-item label="状态" prop="status">
       <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
         <el-option label="提交" value="1" />
		 <el-option label="暂存" value="0" />
		 <el-option label="已完成" value="4" />
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
          type="danger"
          plain
		   style="color: red;"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['store:outWarehouse:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="inWarehouseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
	  <el-table-column label="单据状态" align="center" prop="status" >
		  <template slot-scope="scope">
			  {{scope.row.status |  status}}
		  </template>
	  </el-table-column>
      <el-table-column label="单号" align="center" prop="orderNo" show-overflow-tooltip :min-width="150"/>
	  <el-table-column label="开单日期" align="center" prop="createTime" show-overflow-tooltip :min-width="180"/>
	   <el-table-column label="客户名称" align="center" prop="customer" show-overflow-tooltip :min-width="150"/>
	   <el-table-column label="车牌号" align="center" prop="plateNumber" />
	  <el-table-column label="车主姓名" align="center" prop="carOwnerName" />
	  <el-table-column label="联系电话" align="center" prop="phoneNumber" show-overflow-tooltip :min-width="150"/>
	  <el-table-column label="配送方式" align="center" prop="delivery">
		  <template slot-scope="scope">
			<span>{{ scope.row.delivery | delivery}}</span>
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
      <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip :min-width="150"/>
      <el-table-column label="操作" align="center"  fixed="right">
        <template slot-scope="scope">
          <el-button
		  v-if="scope.row.status != 4"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['store:outWarehouse:edit']"
          >修改</el-button>
          <el-button
		   v-if="scope.row.status != 4"
            size="mini"
            type="text"
			style="color:red;"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:outWarehouse:remove']"
          >删除</el-button>
			<el-button size="mini" type="text" icon="el-icon-takeaway-box"
				v-hasPermi="['store:outWarehouse:print']" @click="goprint(scope.row)">打印1</el-button>
			<el-button size="mini" type="text" icon="el-icon-takeaway-box"
				v-hasPermi="['store:outWarehouseSales:print']" @click="goprinttwo(scope.row)">打印2</el-button>
			<el-button size="mini" type="text" icon="el-icon-takeaway-box"
				v-hasPermi="['store:outWarehouseSales:print']" @click="goprintthree(scope.row)">打印3</el-button>
				
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
	 <el-dialog :title="title" :visible.sync="$store.state.app.outwarehouseopen" width="90%" :close-on-click-modal="false">
		<Setfrom :sondata="sondata" :buttontext="buttontext" @transfer="getUser" :look='look'></Setfrom>
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
	 					<p style="width: 80%;text-align:center;margin: 2px 0;">预计开单</p>
	 				</div>
	 				<div style="display: flex;justify-content: space-between;align-items: center;width:100%;">
	 					<span>客户：{{porinttable.customer}}</span>
	 					<span>预计开单日期：{{ parseTime(porinttable.createTime, '{y}-{m}-{d}') }}</span>
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
	 <!-- 打印2 -->
	 <el-dialog  :visible.sync="printboxytwo" width="760px" :close-on-click-modal="false">
	 	<div class='preview_content2' id="printtwo" ref="printtwo" style="width:100%;">
	 		<div style="display: flex;justify-content: space-between;">
	 			<div style="width: calc( 100% - 100px);">
	 				<div style="text-align: center;">
	 					<img :src="porinttable.logoSrc" style="width: 115px;height: 48px;">
	 					<p style="width:100%;text-align:center;margin-top: 10px;font-size: 16px;">
	 						预计开单
	 						<span style="float: right;font-size: 12px;">【{{porinttable.storeName}}】</span>
	 					</p>
	 				</div>
	 				<div style="width:720px;display: flex;justify-content: space-between;align-items: end;">
	 					<div style="width:33.3%;display: flex;flex-direction: column;">
	 						<span>车牌号：{{porinttable.plateNumber}}</span>
	 						<span>联系电话：{{ porinttable.phoneNumber }}</span>
	 						<span style="display: flex;">配送方式：<dict-tag :options="dict.type.delivery_method" :value="porinttable.delivery"/></span>
	 						<!-- <span>接车人员：{{ porinttable.phoneNumber }}</span> -->
	 					</div>
	 					
	 					<div style="width:33.3%;display: flex;flex-direction: column;">
	 						<!-- <span>结算单位：{{porinttable.customer}}</span> -->
	 						<span>联系地址：{{ porinttable.contactAddress }}</span>
	 						<span>业务人员：{{ porinttable.constructionWork }}</span>
	 						<span style="display: flex;">结算方式：<dict-tag :options="dict.type.paymentTerms" :value="porinttable.paymentTerms"/></span>
	 					</div>
	 					
	 					
	 					<div style="width:33.3%;display: flex;flex-direction: column;">
	 						<span>单据号：{{ porinttable.orderNo }}</span>
	 						<span>单据日期：{{ parseTime(porinttable.documentDate, '{y}-{m}-{d}') }}</span>
	 					</div>
	 				</div>
	 				
	 			</div>
	 		</div>
	 		<div>
	 			<table border="0" cellspacing="0" style="width: 100%;min-height: 70px;" id="printrable">
	 				<th>零件编号</th>
	 				<th>本产编号</th>
	 				<th>产品名称</th>
	 				<th>分类</th>
	 				<th>数量</th>
	 				<th>单价</th>
	 				<th>金额</th>
	 				<th>库位</th>
	 				<tr v-for="(item,index) in porinttable.detailList" :key="index">
	 					<td>{{item.carg}}</td>
	 					<td>{{item.factoryCode}}</td>
	 					<td>{{item.productName}}</td>
	 					<td>{{item.classify}}</td>
	 					<td>{{item.quantity}}</td>
	 					<td>{{item.price}}</td>
	 					<td>{{item.totalPrice}}</td>
	 					<td>{{item.positionCode}}</td>
	 				</tr>
	 			</table>
	 			<p style="border:1px solid black;border-top:0;margin: 0;height: 28px;display: flex;line-height: 28px;justify-content: end;">
	 				<span style="border-left:1px solid black;display: block;height: 100%;padding:0 10px;">合计数量：{{porinttable.totalQuantity}}</span>
	 				<span style="border-left:1px solid black ;display: block;height: 100%;padding:0 10px;">合计金额：{{porinttable.productAmount}}</span>
	 			</p>
	 			<p style="border:1px solid black;margin: 0;padding:5px 10px;border-top: 0;">摘要：{{porinttable.remark}}</p>
	 		</div>
	 		<p  style="display: flex;justify-content: left;align-items: flex-start;">
	 			<span>制单：{{porinttable.createBy}}</span>
	 			<span style="margin-left: 10px;">地址：{{porinttable.orderingAddress}}</span>
	 			<span style="margin-left: 10px;">电话：{{porinttable.orderPhoneNumber}}</span> 
	 			
	 		</p>
	 		<p style="display: flex;justify-content: end;align-items: center;margin-top: 35px;">
	 			<span style="display: block;width: 30%;border-bottom: 1px solid black;">客户确认签字：</span>
	 			<span style="display: block;width: 30%;border-bottom: 1px solid black;margin-left: 10px;">接车人签字：</span>
	 		</p>
	 	</div>
	 	<el-button type='primary' size="large" v-print="printObjtwo" style="width: 150px"> 打印</el-button>
	 </el-dialog>
	 
	 <!-- 打印3 -->
	 <el-dialog  :visible.sync="printboxythree" width="760px" :close-on-click-modal="false">
	 	<div class='preview_content2' id="printthree" ref="printthree" style="width:100%;">
	 		<div style="display: flex;justify-content: space-between;">
	 			<div style="width: calc( 100% - 100px);">
	 				<div style="display: flex;justify-content:left;">
	 					<img :src="porinttable.logoSrc" style="width: 115px;height: 48px;">
	 					<p style="width:100%;text-align:center;margin-top: 10px;font-size: 16px;">
	 						<span style="font-size: 18px;font-weight: bold;">预计开单</span>
	 					</p>
						 <!-- <barcode :code="barcodeData" :type="barcodeType" :options="barcodeOptions"></barcode> -->
	 				</div>
	 				<div style="width:720px;display: flex;justify-content: space-between;align-items: end;">
	 					<div style="width:33.3%;display: flex;flex-direction: column;">
							<span>客户名称：{{porinttable.customer}}</span>
	 						<span>车牌号：{{porinttable.plateNumber}}</span>
	 						<span>客户地址：{{ porinttable.contactAddress }}</span>
	 					</div>
	 					
	 					<div style="width:33.3%;display: flex;flex-direction: column;">
	 						<span>车型：{{ porinttable.vehicleModel }}</span>
	 						<span>电话：{{ porinttable.phoneNumber }}</span>
	 					</div>
	 					
	 					
	 					<div style="width:33.3%;display: flex;flex-direction: column;">
	 						<span>单号：{{ porinttable.orderNo }}</span>
	 						<span>日期：{{ parseTime(porinttable.documentDate, '{y}-{m}-{d}') }}</span>
	 					</div>
	 				</div>
	 				
	 			</div>
	 		</div>
	 		<div>
	 			<table border="0" cellspacing="0" style="width: 100%;min-height: 70px;" id="printrable">
	 				<th>零件编号</th>
	 				<th>本产编号</th>
	 				<th>产品名称</th>
	 				<th>分类</th>
	 				<th>数量</th>
	 				<th>单价</th>
	 				<th>金额</th>
	 				<th>库位</th>
	 				<tr v-for="(item,index) in porinttable.detailList" :key="index">
	 					<td>{{item.carg}}</td>
	 					<td>{{item.factoryCode}}</td>
	 					<td>{{item.productName}}</td>
	 					<td>{{item.classify}}</td>
	 					<td>{{item.quantity}}</td>
	 					<td>{{item.price}}</td>
	 					<td>{{item.totalPrice}}</td>
	 					<td>{{item.positionCode}}</td>
	 				</tr>
	 			</table>
	 			<p style="border:1px solid black;border-top:0;margin: 0;height: 28px;display: flex;line-height: 28px;justify-content: end;">
	 				<span style="border-left:1px solid black;display: block;height: 100%;padding:0 10px;">合计数量：{{porinttable.totalQuantity}}</span>
	 				<span style="border-left:1px solid black ;display: block;height: 100%;padding:0 10px;">合计金额：{{porinttable.productAmount}}</span>
	 			</p>
	 			<p style="border:1px solid black;margin: 0;padding:5px 10px;border-top: 0;">摘要：{{porinttable.remark}}</p>
	 		</div>
	 		<p  style="display: flex;justify-content: left;align-items: flex-start;">
	 			<span>销售：{{porinttable.storeName}}</span>
	 			<span style="margin-left: 10px;">地址：{{porinttable.orderingAddress}}</span>
	 			<span style="margin-left: 10px;">电话：{{porinttable.orderPhoneNumber}}</span> 
	 		</p>
			<div  style="display: flex;justify-content: left;align-items: flex-start;">
				<span>开单：{{porinttable.createBy}}</span>
				<p style="display: flex;margin-left: 10px;" class="dict"> 配送：<dict-tag :options="dict.type.delivery_method" :value="porinttable.delivery"/></p>
				<p style="display: flex;margin-left: 10px;" class="dict">结算：<dict-tag :options="dict.type.paymentTerms" :value="porinttable.paymentTerms"/></p>
			</div>
	 		<p style="display: flex;justify-content: end;align-items: center;margin-top: 35px;">
	 			<span style="display: block;width: 30%;border-bottom: 1px solid black;">客户确认签字：</span>
	 		</p>
	 	</div>
	 	<el-button type='primary' size="large" v-print="printObjthree" style="width: 150px"> 打印</el-button>
	 </el-dialog>
  </div>
</template>

<script>
import { listOutWarehouse, delOutWarehouse } from "@/api/store/outWarehouse";
import Setfrom from "@/components/Warehouse/setfrom.vue"
import { printouthose, printouthosetwo } from "@/api/store/inventory";
// import Barcode from 'vue-barcode';
export default {
  name: "InWarehouse",
  dicts: ['priceMode','delivery_method','paymentTerms', "classification"],
  filters:{
	  delivery(e){
		  if(e == 0){
			  return '自提'
		  }else if(e== 1){
			  return '送货'
		  }else if(e == 2){
			  return '物流代收' 
		  }else if(e== 3){
			  return "物流不代收"
		  }
	  },
	  paymentTerms(e){
		  if(e == "1"){
			  return '现金'
		  }else  if(e == "2"){
			   return '挂账'
		  }else{ 
			  return "挂账"
		  }
	  },
	  status(e){
		  if(e == 1){
			  return '提交'
		  }else if(e==0){
			  return '暂存'
		  }else if(e == 4){
				return '已完成'
			}
	  }
  },
  components:{
	  Setfrom,
	  // Barcode
  },
  data() {
    return {
		// 条形码
		 barcodeData: '1234567890', // 这里是你想要生成的条形码数据
		      barcodeType: 'code128', // 条形码类型，例如 'code128'
		      barcodeOptions: {
		        width: 2,
		        height: 60,
		        displayValue: true,
		        fontSize: 12,
		        fontOptions: 'bold',
		      },
		
		
		
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
	  daterangeEstimatedDelivery:[],
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
		plateNumber:null,
		customer:null,
		phoneNumber:null,
      },
	  // 修改表单的数据
	  sondata:null,
	  buttontext:true,
	   look:false,
	   printboxythree:false,
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
	   // 打印2
		printObjtwo: {
			id: 'printtwo',
			popTitle: ' ', // 打印的标题
			extraCss: ' ', // 打印可引入外部的一个 css 文件
			beforeEntryIframe () {
			  const cells = document.querySelectorAll('.cell')
			  for (let k7 = 0; k7 < cells.length; k7++) {
				const cell = cells[k7]
				cell.style.whiteSpace = 'pre-wrap' 
	
			  }
			}
		  },
	   // 打印3
		printObjthree: {
			id: 'printthree',
			popTitle: ' ', // 打印的标题
			extraCss: ' ', // 打印可引入外部的一个 css 文件
			beforeEntryIframe () {
			  const cells = document.querySelectorAll('.cell')
			  for (let k7 = 0; k7 < cells.length; k7++) {
				const cell = cells[k7]
				cell.style.whiteSpace = 'pre-wrap' 
	
			  }
			}
		  },
	   porinttable:[],
	   printbox:false,
	   printboxytwo:false
    };
  },
  created() {
    this.getList();
		
  },
  methods: {
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
    /** 查询入库列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeShelveDate && '' != this.daterangeShelveDate) {
        this.queryParams.params["beginShelveDate"] = this.daterangeShelveDate[0];
        this.queryParams.params["endShelveDate"] = this.daterangeShelveDate[1];
      }
      listOutWarehouse(this.queryParams).then(response => {
        this.inWarehouseList = response.data.items;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeShelveDate = [];
	  this.daterangeEstimatedDelivery=null
	  this.changetime()
      this.resetForm("queryForm");
      this.handleQuery();
    },
	/** 新增按钮操作 */
	handleAdd(){
	    this.$store.state.app.outwarehouseopen=true
	    this.title = "新增出库";
		this.buttontext = true
		this.look=false
	},
	/** 修改按钮操作 */
	handleUpdate(row) {
	  const outWarehouseId = row.outWarehouseId
	  this.sondata=outWarehouseId
	  this.$nextTick(()=>{
	  	this.$store.state.app.outwarehouseopen=true
	  	this.title = "修改出库";
		this.buttontext = false
		this.look=false
	  })
	},
	
	lookdata(row){
		const outWarehouseId = row.outWarehouseId
		this.sondata=outWarehouseId
		this.$nextTick(()=>{
			this.$store.state.app.outwarehouseopen=true
			this.title = "出库详情";
			this.buttontext = false
			this.look=true
			 })
	},
	
	
	goprinttwo(i){
		printouthosetwo(i.outWarehouseId).then(res=>{
			this.porinttable=res.data
			this.printboxytwo=true
		})
	},
	
	goprintthree(i){
		printouthosetwo(i.outWarehouseId).then(res=>{
			this.porinttable=res.data
			this.printboxythree=true
		})
	},
	
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.outWarehouseId)
	  this.orders= selection.map(item => item.orderNo)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const inWarehouseIds = row.outWarehouseId || this.ids;
	  const abc=row.orderNo || this.orders
      this.$modal.confirm('是否确认删除单号为"' + abc + '"的数据项？').then(function() {
        return delOutWarehouse(inWarehouseIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
	
	// 子组件接收值
	getUser(msg){
		this.sondata=msg
	},
	// 打印
	goprint(i){
		printouthose(i.outWarehouseId).then(res=>{
			this.porinttable=res.data
			this.printbox=true
		})
	}
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
	#print,#printtwo,#printthree{
		font-size: 13px;
	}
	#print table,#printtwo table,#printthree table{
		border: 1px solid black;
		border-right: 0;
		margin-top: 10px;
	}
	#print td,#printtwo td,#printthree td{
		text-align: center;
		border-right: 1px solid black;
		border-top: 1px solid black;
	}
	#print th,#printtwo th,#printthree th{
		border-right: 1px solid black;
	}
	  .dict {
		 margin: 0;
		  
	  }
</style>
