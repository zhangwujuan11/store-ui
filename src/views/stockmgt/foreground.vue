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
	 <el-form-item label="客户名称"  prop="storeName">
	 <el-input
	   v-model="queryParams.storeName"
	   placeholder="请输入客户名称"
	   clearable
	   size="small"
	   @keyup.enter.native="handleQuery"
	 />
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
          v-hasPermi="['store:outWarehouseForeground:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="inWarehouseList">
      <el-table-column label="单号" align="center" prop="orderNo"  show-overflow-tooltip :min-width="150"/>
	  <el-table-column label="单据日期" align="center" prop="documentDate"  show-overflow-tooltip :min-width="150"/>
	  <el-table-column label="状态" align="center" prop="status">
		  <template slot-scope="scope">
				{{scope.row.status == 3? '已出库':'暂存'}}
		  </template>
	  </el-table-column>
	  <el-table-column label="门店名称" align="center" prop="storeName"  show-overflow-tooltip :min-width="150"/>
	  <el-table-column label="往来客户" align="center" prop="customer" />
	  <el-table-column label="车主姓名" align="center" prop="carOwnerName"/>
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
	  <el-table-column label="进厂日期" align="center" prop="enteringTheFactoryDate"  show-overflow-tooltip :min-width="180">
			<template slot-scope="scope">
	  	  		{{ parseTime(scope.row.enteringTheFactoryDate, '{y}-{m}-{d}') }}
	  	  	</template>
	  </el-table-column>
	  <el-table-column label="到期日期" align="center" prop="expirationDate"  show-overflow-tooltip :min-width="180">
		 <template slot-scope="scope">
		 	  		{{ parseTime(scope.row.expirationDate, '{y}-{m}-{d}') }}
		 	  	</template>
		 </el-table-column>
	  <el-table-column label="车辆类别" align="center" prop="vehicleCategory">
	    <template slot-scope="scope">
	    	  <dict-tag :options="dict.type.vehicleCategory" :value="scope.row.vehicleCategory"/>
	    </template>
	   </el-table-column>
	 <el-table-column label="备注" align="center" prop="remark"  show-overflow-tooltip :min-width="150"/>
	  <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
	    <template slot-scope="scope">
		 <el-button size="mini" type="text" icon="el-icon-takeaway-box"
			v-hasPermi="['store:outWarehouseForeground:print']" @click="goprint(scope.row)">打印1</el-button>
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
			<el-button
			v-if="scope.row.status != 4"
			  size="mini"
			  type="text"
			  icon="el-icon-edit"
			  @click="handleUpdate(scope.row)"
			  v-hasPermi="['store:outWarehouse:edit']"
			>修改</el-button>
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
	 <el-dialog :title="title" :visible.sync="salewareopen" width="90%" :close-on-click-modal="false">
		  <p v-if="addform.orderNo" style="margin-top: 0;font-weight: bold;font-size:18;">单号：{{addform.orderNo}}</p>
	 <el-form ref="addform" :model="addform" :rules="rules" label-width="100px">
	 	<div class="formtop" >
			<div v-if="!look" style="display: flex;flex-wrap: wrap;">
	 		<el-form-item label="业务门店" prop="storeId">
	 			<el-select
	 			placeholder="请输入门店名称"
	 			v-model="addform.storeId"
	 			filterable
	 			@change="warehouseNamechange($event)">
	 				<el-option :label="item.warehouseName" :value="item.warehouseId"  v-for="(item,index) in dictList" :key="item.warehouseId" />
	 			</el-select>
	 		</el-form-item>
			<el-form-item label="车牌号" prop="plateNumber">
				<el-input placeholder="请输入车牌号" v-model="addform.plateNumber"></el-input>
			</el-form-item>
	 		<el-form-item label="往来客户" prop="supplierName">
	 			<el-select placeholder="请输入往来客户" v-model="addform.supplierName" @change="supplierNamechange"   filterable>
	 				<el-option :label="item.name" :value="`${item.customerId},${item.name}`" v-for="(item,index) in kehu" :key="item.customerId" />
	 			</el-select>
	 		</el-form-item>
			<el-form-item label="车主姓名" prop="carOwnerName">
				<el-input placeholder="请输入车主姓名" v-model="addform.carOwnerName"></el-input>
			</el-form-item>
			<el-form-item label="车型" prop="vehicleModel">
				<el-input placeholder="请输入车型" v-model="addform.vehicleModel"></el-input>
			</el-form-item>
			<el-form-item label="电话" prop="phoneNumber">
				<el-input placeholder="请输入电话" v-model="addform.phoneNumber"></el-input>
			</el-form-item>
			<el-form-item label="车辆单位" prop="vehicleUnit">
				<el-input placeholder="请输入车辆单位" v-model="addform.vehicleUnit"></el-input>
			</el-form-item>
			<el-form-item label="联系地址" prop="contactAddress">
				<el-input placeholder="请输入联系地址" v-model="addform.contactAddress"></el-input>
			</el-form-item>
			<el-form-item label="VIP卡号" prop="vipCardNumber">
				<el-input placeholder="请输入卡号" v-model="addform.vipCardNumber"></el-input>
			</el-form-item>
			<el-form-item label="进厂日期"  prop="enteringTheFactoryDate">
			  <el-date-picker
			  placeholder="请选择进厂日期"
			    v-model="addform.enteringTheFactoryDate"
			    size="small"
			    style="width: 240px"
			    value-format="yyyy-MM-dd"
			    type="date"
			  ></el-date-picker>
			</el-form-item>
			<el-form-item label="到期日期"  prop="expirationDate">
			  <el-date-picker
			  placeholder="请选择到期日期"
			    v-model="addform.expirationDate"
			    size="small"
			    style="width: 240px"
			    value-format="yyyy-MM-dd"
			    type="date"
			  ></el-date-picker>
			</el-form-item>
			<el-form-item label="车辆类别" prop="vehicleCategory">
			  <el-select
			  placeholder="请选择结车辆类别"
				clearable
			  v-model="addform.vehicleCategory"
			  >
			    <el-option
			    v-for="(dict,index) in dict.type.vehicleCategory"
			    :key="index"
			    :label="dict.label"
			    :value="dict.value"/>
			   </el-select>
			</el-form-item>
			<el-form-item label="车架号" prop="frameNumber">
				<el-input  placeholder="车架号" v-model="addform.frameNumber"></el-input>
			</el-form-item>
			<el-form-item label="接车人员" prop="cons">
				<el-select  placeholder="请选择接车人员" v-model="addform.cons" @change="supp" filterable>
					<el-option :label="item.userName" :value="`${item.userId},${item.userName}`"
						v-for="(item,index) in userlist" :key="item.userId" />
					<!-- <el-option :label="item.userName" :value="item.userName"  v-for="(item,index) in userlist" :key="item.userId" /> -->
				</el-select>
			</el-form-item>
			<el-form-item label="配送方式" prop="delivery">
				<el-select placeholder="请选择配送方式" clearable v-model="addform.delivery">
					<el-option  v-for="(dict,index) in dict.type.delivery_method" :key="index"
						:label="dict.label" :value="dict.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="结算方式" prop="paymentTerms">
			  <el-select
			  placeholder="请选择结算方式"
				clearable
			  v-model="addform.paymentTerms"
			  >
			    <el-option
			    v-for="(dict,index) in dict.type.paymentTerms"
			    :key="index"
			    :label="dict.label"
			    :value="dict.value"/>
			   </el-select>
			</el-form-item>
			<el-form-item label="价格方式" prop="priceMode">
				<el-select placeholder="请选择价格方式" clearable v-model="addform.priceMode">
					<el-option v-for="(dict,index) in dict.type.priceMode" :key="index" :label="dict.label"
						:value="dict.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="备注" prop="remark">
				<el-input  v-model="addform.remark"></el-input>
			</el-form-item>
			 </div>
			 <div v-if="look" class="infodatap">
			 	<p style="margin-left: 10px;">门店：{{addform.storeName}}</p>
			 	<p style="margin-left: 10px;">车牌号：{{addform.plateNumber}}</p>
			 	<p style="margin-left: 10px;">往来客户：{{addform.customer}}</p>
			 	<p style="margin-left: 10px;">车主姓名：{{addform.carOwnerName}}</p>
			 	<p style="margin-left: 10px;">车型：{{addform.vehicleModel}}</p>
			 	<p style="margin-left: 10px;">电话：{{addform.phoneNumber}}</p>
			 	<p style="margin-left: 10px;">车辆单位：{{addform.vehicleUnit}}</p>
			 	<p style="margin-left: 10px;">联系地址：{{addform.contactAddress}}</p>
			 	<p style="margin-left: 10px;">VIP卡号：{{addform.vipCardNumber}}</p>
			 	<p style="margin-left: 10px;">进厂日期：{{addform.enteringTheFactoryDate}}</p>
			 	<p style="margin-left: 10px;">到期日期：{{addform.expirationDate}}</p>
			 	<p style="margin-left: 10px;">车架号：{{addform.frameNumber}}</p>
			 	<p style="margin-left: 10px;">接车人员：{{addform.constructionWork}}</p>
			 	<p style="margin-left:20px;display: flex;">配送方式：<dict-tag :options="dict.type.delivery_method" :value="addform.delivery"/></p>
			 	<p style="margin-left: 20px;display: flex;">价格方式：<dict-tag :options="dict.type.priceMode" :value="addform.priceMode"/></p>
			 	<p style="margin-left: 20px;display: flex;">结算方式：<dict-tag :options="dict.type.paymentTerms" :value="addform.paymentTerms"/></p>
			 	<p style="margin-left: 10px;display: flex;">车辆类别：<dict-tag :options="dict.type.vehicleCategory" :value="addform.vehicleCategory"/></p>
				<p style="margin-left: 20px;">备注：{{addform.remark}}</p>

			 </div>
	 	</div>
	 	<div class="formcenter">
	 		<p class="line" v-if="!look"></p>
	 		<div class="formcen"  v-if="!look">
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
	 				<el-button type="success" icon='el-icon-refresh' @click="gochangecwadd">预计转前台</el-button>
	 			</el-form-item>
	 		</div>
	 		<el-table :data="tab" height="250"  v-if="!look" @row-click="cahnridao">
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
	 		<pagination  v-if="!look"  v-show="serprofrom.total>0" :total="serprofrom.total"
	 			:page.sync="serprofrom.pageNum" :limit.sync="serprofrom.pageSize" @pagination="serfrom"
	 			style="bottom:5px;" />
	 		<p class="line"  v-if="!look"></p>
	 		<div class="formcendov"  v-if="!look">
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
	 				<el-input size="mini" type="number" v-model="addshowform.totalPrice" @input="fochange" disabled/>
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
	 		</div>
	 		<p class="line"></p>

	 		<el-table :data="selectedtable" height="250">
	 			<el-table-column label="产品名称" align="center" prop="productName" />
	 			<el-table-column label="库位" align="center" prop="positionCode" />
	 			<el-table-column label="数量" align="center" prop="quantity" />
	 			<el-table-column label="单价" align="center" prop="price" />
	 			<el-table-column label="总金额" align="center" prop="totalPrice" />
	 			<el-table-column label="备注" align="center" prop="remark" width="100px">
	 				<template slot-scope="scope">
	 					<span :title="scope.row.remark"
	 						style=" display: -webkit-box;text-overflow: ellipsis;overflow: hidden;-webkit-line-clamp: 2;-webkit-box-orient: vertical;white-space: pre-line;">
	 						{{ scope.row.remark}}
	 					</span>
	 				</template>
	 			</el-table-column>
	 			<el-table-column label="操作" align="center" class-name="small-padding fixed-width" v-if="!look">
	 				<template slot-scope="scope">
	 					<el-button size="mini" type="text" icon="el-icon-edit" @click="opform(scope.row,scope.$index)"
	 						v-hasPermi="['store:typeData:edit']">修改</el-button>
	 					<el-button size="mini" type="text" icon="el-icon-delete"  style="color: red;"
	 						@click="detelett(scope.$index)">删除</el-button>
	 				</template>
	 			</el-table-column>
	 		</el-table>
			<div v-if="!look" style="margin-top: 20px;text-align: center;">
				<el-button size="mini" type="primary"  v-if="buttontext && addform.status!=3"  icon="el-icon-shopping-cart-full" @click="subthree(0)">暂存</el-button>
				<el-button size="mini" type="primary"  v-if="!buttontext && addform.status!=3" icon="el-icon-shopping-cart-full" @click="subfour(0)">暂存</el-button>
				<el-button size="mini" type="primary"  v-if="buttontext" icon="el-icon-shopping-cart-full" @click="subthree(3)">确认出库</el-button>
				<el-button size="mini" type="primary" icon="el-icon-sell" v-if="!buttontext" @click="subfour(3)">确认修改出库单</el-button> 
			</div>
	 	</div>
	 </el-form>
	 </el-dialog>
	 <!-- 修改中的修改 -->
	 <el-dialog title="编辑" :visible.sync="openfrom" width="40%"  append-to-body :before-close="clo" :close-on-click-modal="false">
	  	<el-form ref="openfromdata" :model="openfromdata"   :rules="ruless" label-width="80px">
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
	  <!-- 预计转销售 -->
	  <el-dialog title="预计转前台" :visible.sync="outtable" width="89%" append-to-body :close-on-click-modal="false">
	  	<el-table :data="outWarehouseList"  >
	  		<el-table-column label="选择项" width="80">
	  			<template slot-scope="scope">
	  				<el-radio v-model="outtableRadio" :label="scope.row"  :disabled="scope.row.status==4">&nbsp;</el-radio>
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
	  					<p style="width: 80%;text-align:center;margin: 2px 0;">前台开单</p>
	  				</div>
	  				<div style="display: flex;justify-content: space-between;align-items: center;width:100%;">
	  					<span>客户：{{porinttable.customer}}</span>
	  					<span>前台开单日期：{{ parseTime(porinttable.createTime, '{y}-{m}-{d}') }}</span>
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
	  	<div class='preview_content2' id="printtwo" ref="print" style="width:100%;">
	  		<div style="display: flex;justify-content: space-between;">
	  			<div style="width: calc( 100% - 100px);">
	  				<div style="text-align: center;">
	  					<img :src="porinttable.logoSrc" style="width: 115px;height: 48px;">
	  					<p style="width:100%;text-align:center;margin-top: 10px;font-size: 16px;">
	  						前台开单
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
	  						<span style="font-size: 18px;font-weight: bold;">前台开单</span>
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
import { forelist, foregroundadd,forefroundinfo, forefroundupdata } from "@/api/stockmgt";
import { listOutWarehouse, getOutWarehouse } from "@/api/store/outWarehouse";
import {supplierlist, groulist, infoinventory} from "@/api/crmgroupmgt";
import {listUser} from "@/api/store/inWarehouse";
import {grounlist} from "@/api/system/tenant";
import { listInventory, printouthose, printouthosetwo } from "@/api/store/inventory";
import { number } from "echarts";



export default {
  dicts: ['paymentTerms','delivery_method',"packagingMethod","vehicleCategory","priceMode", "classification"],
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
		  }else if(e== 4){
			  return '已完成'
		  }
	  }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 入库表格数据
      inWarehouseList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
	  daterangeEstimatedDelivery:[],
      // 备注时间范围
      daterangeShelveDate: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNo: null,
      },
	  // 添加表单
	  salewareopen:false,
	  addform: {
	  	chuku:null,
		plateNumber:null,
		supplierName:null,
		phoneNumber:null,
		enteringTheFactoryDate:null,
		expirationDate:null,
		cons:null,
		delivery:null,
		paymentTerms:null,
		carOwnerName:null,
		vehicleModel:null,
		vehicleUnit:null,
		contactAddress:null,
		vipCardNumber:null,
		vehicleCategory:null,
		frameNumber:null,
		priceMode:null,
		remark:null
	  },
	  // 表单校验
	  rules: {
	  	// storeName: [{
	  	// 	required: true,
	  	// 	message: '业务门店不能为空',
	  	// 	trigger: 'change'
	  	// }],
		// plateNumber:[{
	 //  		required: true,
	 //  		message: '车牌号不能为空',
	 //  		trigger: 'blur'
	 //  	}],
	 //  	supplierName: [{
	 //  		required: true,
	 //  		message: '往来客户不能为空',
	 //  		trigger: 'change'
	 //  	}],
		// phoneNumber:[{
	 //  		required: true,
	 //  		message: '电话不能为空',
	 //  		trigger: 'blur'
	 //  	}],
		// enteringTheFactoryDate:[{
	 //  		required: true,
	 //  		message: '进厂日期不能为空',
	 //  		trigger: 'change'
	 //  	}],
		// expirationDate:[{
	 //  		required: true,
	 //  		message: '到期日期不能为空',
	 //  		trigger: 'change'
	 //  	}],
		// cons: [{
		// 	required: true,
		// 	message: '接车人员不能为空',
		// 	trigger: 'change'
		// }],
		// delivery:[{
		// 	required: true,
		// 	message: '配送方式不能为空',
		// 	trigger: 'change'
		// }],
		// paymentTerms: [{
		// 	required: true,
		// 	message: '结算方式不能为空',
		// 	trigger: 'change'
		// }]
	  },
	  userlist: [], //经办人
	  tableRadio: {//选中的产品
		  productName:null, //产品名称
		  warehouseCode:null, //库位
		  productId:null, //产品id
		  inventoryId:null, //库存id
		  price:null, //单价
	  },
	  isShow: true,
	  dictList: [], //门店列表
	  supplist: [], //门店列表
	  serprofrom: {//产品查询表单
	  	pageNum: 1,
	  	pageSize: 10,
	  	total: 0,
		carg:null,
		productName:null,
		classify:null,
		pinyin:null
	  },
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

            printObjtwo: {
                    id: 'printtwo',
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
	  ruless:{
	  	 quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }],
	  	 price: [{ required: true, message: '请输入金额', trigger: 'blur' }]
	  },
	  lis:{},
	  printboxytwo:false,
	  buttontext:false,
	  printboxythree:false
    };
  },
  created() {
    this.getList();
	// this.serfrom()
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
  },
  methods: {
	  fochange(){
	  	this.$forceUpdate()
	  },
    /** 查询入库列表 */
    getList() {
      this.loading = true;
      forelist(this.queryParams).then(response => {
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
	    this.salewareopen=true
	    this.title = "新增前台开单";
		this.buttontext = true
		this.look=false
		grounlist().then(res => {
			this.addform.storeId = res.data.items[0].warehouseId
			this.addform.storeName = res.data.items[0].warehouseName
			this.serprofrom.warehouseId=res.data.items[0].warehouseId
			this.$forceUpdate()
			this.serfrom()
		})
	},
	
	/** 修改按钮操作 */
	handleUpdate(row) {
	  forefroundinfo(row.outWarehouseId).then(response => {
	   this.addform = response.data;
	   this.addform.supplierName=response.data.customerId + ',' + response.data.customer
	   this.addform.cons=response.data.constructionWorkId + ',' + response.data.constructionWork
	   this.selectedtable=this.addform.detailList
	   this.title = "修改前台开单";
	   this.salewareopen=true
	   this.buttontext = false
	   this.look=false
	  });
	   this.serprofrom.warehouseId=row.storeId
	   this.serfrom()
	   this.$nextTick(()=>{
	  	
	  })
	},
	//提交修改
	subfour(sta){
		if(this.addform.expirationDate<this.addform.enteringTheFactoryDate){
			this.$message.error("到期日期不能大于进厂日期")
			return false
		}
		this.addform.detailList = this.selectedtable
		if (this.addform.detailList.length == 0) {
			this.$message.error("前台开单信息不完整")
		} else {
			this.$refs['addform'].validate(valid => {
				this.addform.orderType= "1"//单据类型
				if (valid) {
					this.addform.type = 3
					this.addform.state = 0
					this.addform.status = sta
					forefroundupdata(this.addform).then(res => {
						if (res.code == 200) {
							if(sta == 0){
								this.$message.success("暂存成功")
							}else{
								this.$message.success("修改成功")
							}
							this.salewareopen = false
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
	
	// 详情
	lookdata(row){
		this.reset();
		this.selectedtable.pop()
		const inWarehouseId = row.outWarehouseId
		forefroundinfo(inWarehouseId).then(response => {
		this.addform = response.data;
		this.selectedtable=this.addform.detailList
		this.salewareopen = true;
		 this.title = "前台开单详情";
		 this.look=true
		});
	},



	// 添加
	// 删除单个表单数据
	detelett(i) {
		this.selectedtable.splice(i, 1)
	},
	// 清除表单
	subtwo() {
		this.selectedtable.splice(0, this.selectedtable.length)
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
		this.tableRadio = {//选中的产品
		  productName:null, //产品名称
		  warehouseCode:null, //库位
		  productId:null, //产品id
		  inventoryId:null, //库存id
		  price:null, //单价
	  }
		this.selectedtable = []
		 this.tab=[]
		this.serprofrom= {//产品查询表单
	  	pageNum: 1,
	  	pageSize: 10,
	  	total: 0,
		carg:null,
		productName:null,
		classify:null,
		pinyin:null
	  },
	  this.addform= {
	  	chuku:null,
		plateNumber:null,
		supplierName:null,
		phoneNumber:null,
		enteringTheFactoryDate:null,
		expirationDate:null,
		cons:null,
		delivery:null,
		paymentTerms:null,
		carOwnerName:null,
		vehicleModel:null,
		vehicleUnit:null,
		contactAddress:null,
		vipCardNumber:null,
		vehicleCategory:null,
		frameNumber:null,
		priceMode:null,
		remark:null
	  }

		this.resetForm("addform");
	},


	// 临时表单
	cahnridao(record,index) {
		this.tableRadio=record
		this.addshowform.productName = this.tableRadio.productName //产品名称
		this.addshowform.positionCode = this.tableRadio.positionCode //库位
		this.addshowform.productId = this.tableRadio.productId //产品id
		this.addshowform.inventoryId = this.tableRadio.inventoryId //库存id
		this.addshowform.price = this.tableRadio.price //单价
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
					this.tableRadio = {}
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
				this.tableRadio = {}
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
	// 保存出库单
	subthree(sta) {
		this.addform.detailList = this.selectedtable
		if (this.addform.detailList.length == 0) {
			this.$message.error("前台开单信息不完整")
		} else {
			this.$refs['addform'].validate(valid => {
				this.addform.orderType= "1"//单据类型
				if (valid) {
					this.addform.type = 3
					this.addform.state = 0
					this.addform.status = sta
					foregroundadd(this.addform).then(res => {
						if (res.code == 200) {
							if(sta == 0){
								this.$message.success("暂存成功")
							}else{
								this.$message.success("添加前台开单成功")
							}
							this.salewareopen = false
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
	/** 修改按钮操作 */
	opform(i, index) {
		this.openfromdataindex = index
		this.openfromdata = i
		this.lis=JSON.stringify(i)
		this.openfrom = true
		// 获取当前产品库存
		infoinventory(i.inventoryId).then(res=>{
			if(res.code == 200){
				this.kucunnum =res.data.usableQuantity
			}
		})
	},
	clo(){
		this.$set(this.selectedtable, this.openfromdataindex, JSON.parse(this.lis));
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
			  this.selectedtable[this.openfromdataindex].price=Number(this.openfromdata.price)
			  this.selectedtable[this.openfromdataindex].quantity=Number(this.openfromdata.quantity)
			  this.selectedtable[this.openfromdataindex].totalPrice=Number(this.openfromdata.price) * Number(this.openfromdata.quantity)
			  this.selectedtable[this.openfromdataindex].remark=this.openfromdata.remark
			  this.openfrom = false
		  }else {
				 this.$set(this.selectedtable, this.openfromdataindex, JSON.parse(this.lis));
					return false;
				}
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
		this.subtwo()
		getOutWarehouse(this.outtableRadio.outWarehouseId).then(response => {
			this.addform.predictId=response.data.outWarehouseId
			this.addform=response.data
			this.addform.supplierName = response.data.customerId + ',' + response.data.customer
			this.addform.chuku = response.data.storeId + ',' + response.data.storeName
			this.addform.cons = response.data.constructionWorkId + ',' + response.data.constructionWork
			response.data.detailList.map(item=>{
				this.selectedtable.push(item)
			})
			this.outtable=false
			this.outtableRadio={}
		})
	},
	// 打印
	goprint(i){
		printouthose(i.outWarehouseId).then(res=>{
			this.porinttable=res.data
			this.printbox=true
		})
	}

  },
 watch:{
	 'addshowform.quantity'(val){
	 		this.addshowform.totalPrice=Math.floor(val*this.addshowform.price * 100)/100
	 },
	 'addshowform.price'(val){
	 		this.addshowform.totalPrice=Math.floor(val*this.addshowform.quantity * 100)/100
	 },

	 salewareopen(val){
	 	if(!val){
	 		this.reset()
	 	}
	 } ,
 }

};
</script>
<style scoped>
	.formtop {
		display: flex;
		justify-content: left;
		/* flex-wrap: wrap; */
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



    #printtwo{
    	font-size: 13px;
    }
    #printtwo table{
    	border: 1px solid black;
    	border-right: 0;
    	margin-top: 10px;
    }
    #printtwo td{
    	text-align: center;
    	border-right: 1px solid black;
    	border-top: 1px solid black;
    }
    #printtwo th{
    	border-right: 1px solid black;
    }
	#printthree{
		font-size: 13px;
	}
	#printthree table{
		border: 1px solid black;
		border-right: 0;
		margin-top: 10px;
	}
	#printthree td{
		text-align: center;
		border-right: 1px solid black;
		border-top: 1px solid black;
	}
	#printthree th{
		border-right: 1px solid black;
	}
	.dict {
		margin: 0;
	}
</style>
