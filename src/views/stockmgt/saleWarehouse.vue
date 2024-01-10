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
	 <el-form-item label="单据日期"  prop="documentDate">
	   <el-date-picker
	   placeholder="请选择单据日期"
	     v-model="queryParams.documentDate"
	     size="small"
	     style="width: 240px"
	     value-format="yyyy-MM-dd"
	     type="date"
	   ></el-date-picker>
	 </el-form-item>
	 <el-form-item label="车牌"  prop="plateNumber">
	 <el-input
	   v-model="queryParams.plateNumber"
	   placeholder="请输入车牌"
	   clearable
	   size="small"
	   @keyup.enter.native="handleQuery"
	 />
	 </el-form-item>
	 <el-form-item label="往来客户"  prop="storeName">
	 <el-input
	   v-model="queryParams.customer"
	   placeholder="请输入客户名称"
	   clearable
	   size="small"
	   @keyup.enter.native="handleQuery"
	 />
	 </el-form-item>
	 <el-form-item label="状态" prop="status">
	   <el-select
	   placeholder="请输选状态"
	   clearable
	   v-model="queryParams.status"
	   >
	     <el-option label="已提交" value="1"/>
		 <el-option label="暂存" value="0"/>
		 <el-option label="出库" value="3"/>
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
          v-hasPermi="['store:outWarehouseSales:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['store:outWarehouseSales:remove']"
        >删除</el-button>
      </el-col>
	  <el-col :span="1.5">
		  <el-button
		    type="info"
		    plain
		    icon="el-icon-upload2"
		    size="mini"
		    @click="handleImport"
		    v-hasPermi="['store:outWarehouseSales:import']"
		  >历史数据导入</el-button>
	  </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="inWarehouseList" @selection-change="handleSelectionChange" >
      <el-table-column type="selection" width="55" align="center" />
	  <el-table-column label="单据状态" align="center" prop="status" >
		  <template slot-scope="scope">
			  {{scope.row.status |  status}}
		  </template>
	  </el-table-column>
      <el-table-column label="单号" align="center" prop="orderNo"  show-overflow-tooltip :min-width="150"/>
	  <el-table-column label="单据日期" align="center" prop="createTime"  show-overflow-tooltip :min-width="180"/>
	  <el-table-column label="门店名称" align="center" prop="storeName"  show-overflow-tooltip :min-width="150"/>
	  <el-table-column label="往来客户" align="center" prop="customer" />
	  <el-table-column label="票据类型" align="center" prop="billType">
	    <template slot-scope="scope">
			<span>{{ scope.row.billType | billType}}</span>
		  </template>
	   </el-table-column>
	   <el-table-column label="包装方式" align="center" prop="packagingMethod">
		   <template slot-scope="scope">
			 <dict-tag :options="dict.type.packagingMethod" :value="scope.row.packagingMethod"/>
		   </template>
	   </el-table-column>
	   <el-table-column label="配送方式" align="center">
	   		   <template slot-scope="scope">
	   			 <dict-tag :options="dict.type.delivery_method" :value="scope.row.delivery"/>
	   		   </template>
	   </el-table-column>
	   <el-table-column label="结算方式" align="center" prop="paymentTerms">
	   		  <template slot-scope="scope">
	   		  	  <dict-tag :options="dict.type.paymentTerms" :value="scope.row.paymentTerms"/>
	   		  </template>
	    </el-table-column>
	    <el-table-column label="制单人" align="center" prop="createBy"/>  
	 <el-table-column label="备注" align="center" prop="remark"  show-overflow-tooltip :min-width="150"/>   
      <el-table-column label="操作" align="center"  fixed="right" width="300">
        <template slot-scope="scope">
          <el-button
		  v-if="scope.row.status != '3'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['store:outWarehouseSales:edit']"
          >修改</el-button>
          <el-button
		  v-if="scope.row.status != '3'"
            size="mini"
            type="text"
			style="color: red;"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:outWarehouseSales:remove']"
          >删除</el-button>
		  <el-button
		   v-if="scope.row.status != '3' && scope.row.status != '0'"
		    size="mini"
		    type="text"
		    icon="el-icon-s-check"
		  	@click="audit(scope.row)"
		    v-hasPermi="['store:outWarehouseSales:audit']"
		  >审核通过</el-button>
		  <el-button size="mini" type="text" icon="el-icon-takeaway-box"
		  	v-hasPermi="['store:outWarehouseSales:print']" @click="goprint(scope.row)">打印1</el-button>
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
	 <el-dialog :title="title" :visible.sync="$store.state.app.salewareopen" width="90%" :close-on-click-modal="false">
	 <Setfrom :sondata="sondata" :buttontext="buttontext" @transfer="getUser" :look='look'></Setfrom>
	 </el-dialog>

   <!-- 打印1 -->
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
   					<p style="width: 80%;text-align:center;margin: 2px 0;">销售开单</p>
   				</div>
   				<div style="display: flex;justify-content: space-between;align-items: center;width:100%;">
   					<span>客户：{{porinttable.customer}}</span>
   					<span>销售开单日期：{{ parseTime(porinttable.createTime, '{y}-{m}-{d}') }}</span>
   				</div>
   			</div>
   			<div>
   				<img :src="porinttable.storeQrCode" style="width: 50px;height: 50px;">
   			</div>
   		</div>
   		<div>
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
						销售开单
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
   						<span style="font-size: 18px;font-weight: bold;">销售开单</span>
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
   
   
   
   <!-- 导入对话框 -->
   <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
	  <el-select
	  placeholder="请选择门店名称" 
	  v-model="storeId"
	   filterable
	  >
	    <el-option :label="item.warehouseName" :value="item.warehouseId"  v-for="(item,index) in dictList" :key="item.warehouseId" />
	  </el-select>
     <el-upload
       ref="upload"
       :limit="1"
       accept=".xlsx, .xls"
       :headers="upload.headers"
       :action="upload.url +'?storeId=' +  storeId"
       :disabled="upload.isUploading"
       :on-progress="handleFileUploadProgress"
       :on-success="handleFileSuccess"
       :auto-upload="false"
       drag
     >
       <i class="el-icon-upload"></i>
       <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
       <div class="el-upload__tip text-center" slot="tip">
         <span>仅允许导入xls、xlsx格式文件。</span>
         <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
       </div>
     </el-upload>
     <div slot="footer" class="dialog-footer">
       <el-button type="primary" @click="submitFileForm">确 定</el-button>
       <el-button @click="upload.open = false">取 消</el-button>
     </div>
   </el-dialog>
  </div>
</template>

<script>
import { listOutWarehouse, historydownlode } from "@/api/store/outWarehouse";
import { getToken } from "@/utils/auth";
import { salelist, delsalelist, checksaleware } from "@/api/stockmgt";
import { printouthose, printouthosetwo } from "@/api/store/inventory";
import {grounlist} from "@/api/system/tenant";
import Setfrom from "@/components/Warehouse/saleform.vue"

export default {
  dicts: ['paymentTerms','delivery_method',"packagingMethod","classification"],
  filters:{
	  billType(e){
		  if(e == 0){
			  return '普通发票'
		  }else if(e==1){
			  return '其他'
		  }else if(e==2){
			  return '指定物流'
		  }else{
			  return '其他备注'
		  }
	  },
	  status(e){
		  if(e == 1){
			  return '已提交'
		  }else if(e==0){
			  return '暂存'
		  }else if(e== 3){
			  return '出库'
		  }
	  }
  },
  components:{
	  Setfrom
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
	oeders:[],
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
		plateNumber:''
      },
	  dictList:[],//门店列表
	  // 用户导入参数
	  upload: {
	    // 是否显示弹出层（用户导入）
	    open: false,
	    // 弹出层标题（用户导入）
	    title: "",
	    // 是否禁用上传
	    isUploading: false,
	    // 是否更新已经存在的用户数据
	    // 设置上传的请求头部
	    headers: { Authorization: "Bearer " + getToken() },
	    // 上传的地址
	    url: process.env.VUE_APP_BASE_API + "/v1/store/outWarehouseSales/importData"
	  },
	  
	  // 修改表单的数据
	  sondata:null,
	  buttontext:true,
	  look:false,
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
	  // 打印2
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
	  storeId:'',
	  printboxytwo:false,
	  printboxythree:false
    };
  },
  created() {
    this.getList();
	// 门店获取
	grounlist().then(res=>{
		this.dictList=res.data.items
	})
  },
  methods: {
    /** 查询入库列表 */
    getList() {
      this.loading = true;
      salelist(this.queryParams).then(response => {
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
	/** 新增按钮操作 */
	handleAdd(){
	    this.$store.state.app.salewareopen=true
	    this.title = "新增销售开单";
		this.buttontext = true
		this.look=false
		this.sondata=null
	},
	/** 修改按钮操作 */
	handleUpdate(row) {
	  const outWarehouseId = row.outWarehouseId
	  this.sondata=outWarehouseId
	  this.$nextTick(()=>{
	  	this.$store.state.app.salewareopen=true
		this.buttontext = false
		this.title = "修改销售开单";
		this.look=false
	  })
	},
	lookdata(row){
		const outWarehouseId = row.outWarehouseId
		this.sondata=outWarehouseId
		this.$nextTick(()=>{
			this.$store.state.app.salewareopen=true
				this.buttontext = false
				this.title = "销售开单详情";
				this.look=true
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
	  this.oeders = selection.map(item => item.orderNo)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const inWarehouseIds = row.outWarehouseId || this.ids;
	  const abc=row.orderNo || this.oeders
      this.$modal.confirm('是否确认删除单号为"' + abc + '"的数据项？').then(function() {
        return delsalelist(inWarehouseIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
	
	// 子组件接收值
	getUser(msg){
		this.sondata=msg
	},
	// 审核
	audit(i){
		this.$modal.confirm('是否确认通过订单号为"' + i.orderNo + '"的审核？').then(function() {
		  return checksaleware({
			  "outWarehouseId":  i.outWarehouseId, //主键id
			  "orderNo": i.orderNo //单号
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
			console.log(this.porinttable)
			this.printbox=true
		})
	},
	goprinttwo(i){
		printouthosetwo(i.outWarehouseId).then(res=>{
			this.porinttable=res.data
			this.printboxytwo=true
		})
	},
	
	
	/** 导入按钮操作 */
	handleImport() {
	  this.upload.title = "历史数据导入";
	  this.upload.open = true;
	},
	/** 下载模板操作 */
	importTemplate() {
	  historydownlode().then(response => {
	    this.$download.name(response.data);
	  });
	},
	// 文件上传中处理
	handleFileUploadProgress(event, file, fileList) {
	  this.upload.isUploading = true;
	},
	// 文件上传成功处理
	handleFileSuccess(response, file, fileList) {
	  this.upload.open = false;
	  this.upload.isUploading = false;
	  this.$refs.upload.clearFiles();
	  this.$alert(response.message, "导入结果", { dangerouslyUseHTMLString: true });
	  this.getList();
	},
	// 提交上传文件
	submitFileForm() {
		if(!this.storeId){
			this.$message("请先选择门店")
			return false
		}else{
			this.$refs.upload.submit();
		}
	},
	
  }
 
};
</script>
<style scoped>
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
	   /deep/.el-table__body{
		   table-layout: auto;
		   border-collapse: separate;
	   }
		 .dict {
		 		 margin: 0;
		 		  
		 }
</style>