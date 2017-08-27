
<template>
	<div>
	    <div class="layout-breadcrumb">
            <Breadcrumb>
                <Breadcrumb-item href="#">平台首页</Breadcrumb-item>
                <Breadcrumb-item href="#">分类管理</Breadcrumb-item>
            </Breadcrumb>
        </div>
         <Button-group>
	
	        <Button type="primary" :class="{active:currentType==3}"
	        	@click="clickCateBtn(3)"
	        	>图片分类</Button>
	    </Button-group>
	    
	    <Row style="padding-top:20px;">
	    	
	    	<Col span="3">
	    		<Tree :data="baseData"  @on-select-change="onSelectChange"
					style="margin-left:20px;"
					>
	    		</Tree>
	    	</Col>
	    	<Col span="20" >
			    <span>分类:{{title}}</span>	<br />
			    <div  class="img_box" >
			    	<li v-for="(val,index) in list" key="index" 
			    		class="li_box"
			    		>
			    		<img :src="val.src" class="myImg"/>
			    	</li>
			    </div>
			    
			    <Page :total="filter.total" :page-size="filter.limit" :show-total="true"
			  show-elevator @on-change="onPageChange" class-name="pagenation"
			  @on-page-size-change="onPageSizeChange" show-sizer
			  :page-size-opts="pageSizeOpts" placement="top"
		>
			
		</Page>
	    	</Col>
	    </Row>

	</div>
</template>

<script>
    export default {
        data () {
            return {
   				module:"cate",
            	classify:"",
            	currentType:3,
            	currentId:null,
            	currentNode:{},
                baseData: [],
                test_id:"",
 				title:"旅游图片",
 				list:[],
 				filter:{
	                limit:6,
	                page:1,
	                pages:0,
	                total:0,
	                name:"",
	                cateId:""
	           },
	           pageSizeOpts:[3,6,9,12]
            }
        },
        methods:{
        	getTreeData(){
        		var url=`http://localhost:3000/${this.module}/${this.currentType}`;
        
        		this.$http.get(url).then((res)=>{
        	    	this.baseData = res.data; //展示数据
        	    })
        	},
        	clickCateBtn(type){
        		this.currentType = type;         //当前currentType，来切换 选项的
        		this.getTreeData();
        		this.currentId = null;
        		this.test_id = this.currentId;
        	},
            onSelectChange(selArr){
            
            	var id = selArr[0]._id;
            	this.currentNode = selArr[0];   //获取当前 选中的节点 数据
            	this.currentId = id;    //当前选中的 节点id，如果是添加，则该id是新节点的父id
     			
     			this.title = selArr[0].title;
				this.filter.cateId = id;
				this.getImageClassifyData();
            },
            getImageClassifyData(){
            	var id = this.currentId;
            	console.log(id);
            	console.log("-----获取分类图片------");
            	
            	this.$http.post("http://localhost:3000/upload/list",this.filter)
            	.then((res)=>{
            		console.log("----------获取成功----------");
            		console.log(res);
           			
           			var arr = res.data.docs;
           			
            		var len = arr.length;
            		for(var i=0; i<len ;i++ ){
            			
       			 		arr[i].src ="http://localhost:3000/"+arr[i].filename;
        
            		}
            		
            		this.list = arr;
            		this.filter.page = res.data.page;
	        		this.filter.pages = res.data.pages;
	        		this.filter.total = res.data.total;
            	});
            },
             onPageChange(page){//页码改变的回调，返回改变后的页码
	        	this.filter.page = page;
	        	this.getImageClassifyData();	
	        },
	        onPageSizeChange(pageSize){ //改变 每页显示的条数
	
	        	this.filter.limit = pageSize; //即 limit改变
	        	this.filter.page = 1;         //切回第一页
	        	this.getImageClassifyData();
	        	
	        }
	 
        },
        created(){
        	this.getTreeData();
        	this.getImageClassifyData();
        }
    }
</script>

<style scoped>
	ul,ol,li{list-style:none;}
	.pagenation{
		float:left;
	}
	.layout-content-main .add_btn{
		margin-right:50px;
		float:right;
	}
	.btns{
		display: flex;
	}
	.active{
		color:deeppink;
	}
	.img_box{
		display: flex;
		flex-wrap: wrap;
	}
	.li_box{
		width:220px;
		height:220px;
		display: flex!important;
		justify-content: center;
		align-content: center;
		background: #ccc;
		padding-top: 10px;
		margin:5px;
	}
	.myImg{
		width:200px;
		height:200px;
	}
</style>




























