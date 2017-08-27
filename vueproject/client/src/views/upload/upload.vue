<template>
	<div>
	    <div class="layout-breadcrumb">
	    	
            <Breadcrumb>
                <Breadcrumb-item href="#">平台首页</Breadcrumb-item>
                <Breadcrumb-item href="#">上传管理</Breadcrumb-item>
            </Breadcrumb>
            
        </div>
         <Button-group  style="margin-top:10px;">
	
	        <Button type="primary" :class="{active:currentType==1}"
	        	@click="clickCateBtn(1)"
	        	>日志分类</Button>
	        <Button type="primary" style="margin:0 5px 0 5px;"
	        	:class="{active:currentType==2}" @click="clickCateBtn(2)"
	        	>文件上传分类</Button>
	        <Button type="primary" :class="{active:currentType==3}"
	        	@click="clickCateBtn(3)"
	        	>图片分类</Button>
	    </Button-group>
	    
	    <Row style="margin-top:20px;padding-left:20px;">
	    	
	        <Col span="3">
     		 	<Tree :data="baseData"  @on-select-change="onSelectChange"></Tree>
            </Col>
            
   			<Col span="10">
     		 	 <Form ref="formValidate" :model="formValidate" 
     		 	 	:rules="ruleValidate" 
	        	:label-width="80">
	        	
		 	   <Form-item label="上传类别" prop="title">
		            <Input v-model="formValidate.title" style="width:300px;"
		            	placeholder="请输入节点名称"></Input>
		        </Form-item>
		
		     	<Form-item label="类别id：" prop="title">
		            <Input v-model="currentId" style="width:300px;"></Input>
		        </Form-item>
		    </Form>
            </Col>
            
            <Col span="10">
            	<span style="height:60px;float: left;line-height: 60px;margin-left:40px;"
            		>
            	</span>
	            <div class="demo-upload-list" v-for="item in uploadList">
		        <template v-if="item.status === 'finished'">
		            <img :src="item.url">
		            <div class="demo-upload-list-cover">
		                <Icon type="ios-eye-outline" 
		                	@click.native="handleView(item.name)"></Icon>
		                <Icon type="ios-trash-outline" 
		                	@click.native="handleRemove(item)"></Icon>
		            </div>
		        </template>
		        
		        <template v-else>
		            <Progress v-if="item.showProgress" :percent="item.percentage" 
		            	hide-info></Progress>
		        </template>
	    	</div>
	    	
	    	
			 <Upload
			 	name="avatar"
			 	:data="postData"
			 	:action="postUrl"
			 	
		        ref="upload"
		        :show-upload-list="false"
		        :on-success="handleSuccess"
		        :format="['jpg','jpeg','png']"
		        :max-size="2048"
		        :on-format-error="handleFormatError"
		        :on-exceeded-size="handleMaxSize"
		        :before-upload="handleBeforeUpload"
		        multiple
		        type="drag"
		       
		        style="display: inline-block;width:58px;">
		        <div style="width: 58px;height:58px;line-height: 58px;">
		            <Icon type="camera" size="20"></Icon>
		        </div>
		    </Upload>
            </Col>
	    </Row>
		
		
		
		<hr style="margin-bottom:20px;"/>
		
		<div class="btns">
			<Input v-model="input_value" style="width:300px;">
		       
		        <Button slot="append" icon="ios-search" @click="search"></Button>
		        
		    </Input>
		 
			<Button type="primary" @click="removes" style="margin-left:20px;">
				删除选中
			</Button>
			
			<Button type="primary" @click="refreshD"  style="margin:0 20px 0 20px;">
		    	刷新
		    </Button>
		</div>
		
		<Table border :columns="columns7" :data="list" style="margin-top:5px;"
				@on-selection-change="onSelectionChange"
			>
		</Table>
	    
	    <Page :total="filter.total" :page-size="filter.limit" :show-total="true"
			  show-elevator @on-change="onPageChange" class-name="pagenation"
			  @on-page-size-change="onPageSizeChange" show-sizer
			  :page-size-opts="pageSizeOpts" placement="top"
		>
			
		</Page>
	    
	    
	     <Modal v-model="modal2" width="360">
	        <p slot="header" style="color:#f60;text-align:center">
	            <Icon type="information-circled"></Icon>
	            <span>删除确认</span>
	        </p>
	        <div style="text-align:center">
	     
	            <p>是否确定删除数据？</p>
	        </div>
	        <div slot="footer">
	            <Button type="error" size="large" long 
	            	 @click="del">删除</Button>
	        </div>
	    </Modal>
	    
	     <Modal v-model="modal3" width="360">
	        <p slot="header" style="color:#f60;text-align:center">
	            <Icon type="information-circled"></Icon>
	            <span>删除确认</span>
	        </p>
	        <div style="text-align:center">
	     
	            <p>是否确定删除这些数据 ？</p>
	        </div>
	        <div slot="footer">
	            <Button type="error" size="large" long :loading="modal_loading2" 
	            	 @click="del_more">删除</Button>
	        </div>
	    </Modal>
	</div>
</template>

<script>
	
    export default {
        data () {
            return {	
            	modal_loading:false,
            	modal1:false,
            	modal_loading2: false,
            	modal2:false,
            	modal_loading3: false,
            	modal3:false,
            	delete_id:null,
            	pageSizeOpts:[5,6,7],
            	module:"upload",
            	currentType:1,
            	currentId:null,
            	currentNode:{},
                baseData: [],
                test_id:"",
                classify_id:"",
                input_value:"",
                ids:[],
                formValidate: {
                 	type:1,
                    title: '',
                    cateId:null
                },
                ruleValidate: {
                    title: [
                        { required: true, message: '输入不能为空', trigger: 'blur' }
                    ],
                	content: [
                        { required: true, message: '输入不能为空', trigger: 'blur' }
                    ],
                    desc: [
                        { required: true, message: '请输入个人介绍', trigger: 'blur' },
                        { type: 'string', min: 10, message: '介绍不能少于10字', 
                         trigger: 'blur' }
                    ]
                },
                imgName: '',
                visible: false,
                uploadList: [],
                postData:{
                	_id:null
                },
                list:[],
	            filter:{
	                limit:5,
	                page:1,
	                pages:0,
	                total:0,
	                originalname:""
	            },
                columns7: [
               		{
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '图片名',
                        key: 'originalname',
                        width:100
                    },
                    {
                        title: '上传时间',
                        key: 'date'
                    },
                    {
                        title: '大小',
                        key: 'size',
                        align: 'center',
                        width:100
                    },
                    {
                        title: '路径',
                        key: 'path',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 200,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                
            }
        },
        methods:{
        	getTreeData(){
        		var url = `http://localhost:3000/cate/${this.currentType}`;
        
        		this.$http.get(url).then((res)=>{
        	    	this.baseData = res.data; //展示数据
        	    })
        	},
        	clickCateBtn(type){
//      		console.log(type);
        		this.currentType = type;         //当前currentType，来切换 选项的
        		this.formValidate.type = type;   //当前form操作的 type，添加 删除 修改用的
        		this.getTreeData();
        		this.currentId = null;
        		this.test_id = this.currentId;
        		
        	},
            onSelectChange(selArr){
   
            	var id = selArr[0]._id;
            	this.currentNode = selArr[0];   //获取当前 选中的节点 数据
            	this.currentId = id;    //当前选中的 节点id，如果是添加，则该id是新节点的父id
            	this.postData._id = id; //上传 文件的 _id参数
              	this.formValidate.title = selArr[0].title;
				
            },
            handleView (name) {
                this.imgName = name;
                this.visible = true;
            },
            handleRemove (file) {
                // 从 upload 实例删除数据
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            handleSuccess (res, file) {
                // upload组件自带 fileList 来 添加 返回来的 数据，如图片
                // file 就是fileList里 新的数据源
                //  this.$refs.upload.fileList;
                console.log("---------------handleSucess------------");
                console.log(res);
                console.log(file);
                var name = res.cateId;
                var url = "http://localhost:3000/"+res.filename;
                file.url = url;
                file.name = name;
                this.refreshD();  //刷新下面的 表
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: '超出文件大小限制',
                    desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
                });
            },
            handleBeforeUpload () {
                const check = this.uploadList.length < 5;
                if (!check) {
                    this.$Notice.warning({
                        title: '最多只能上传 5 张图片。'
                    });
                }
                if(!this.postData._id){
                	
                	this.$Notice.warning({
                        title: '请选择分类。'
                    });
                
                	
                }
                
                return check;
            },
            onSelectionChange(selection){
	        	console.log(selection);
	        	var len = selection.length;
	        	var ids = [];
	        	for(var i =0; i<len; i++){
	        		ids.push(selection[i]._id);
	        	}
	        	this.ids = ids;
	        },
	        getImageData(){
	        	this.$http.post("http://localhost:3000/upload/list",this.filter)
	        	.then((res)=>{
	        		console.log("----------返回的图片-------");
	        		console.log(res);
	        		var dataArr = res.data.docs;
	        		for(var i=0; i<dataArr.length;i++){
	        			var t =  new Date(dataArr[i].date).getTime();
	        			
	        			dataArr[i].date =this.changeTime(t);
	        		}
	        		this.list = dataArr;
					
	        		this.filter.page = res.data.page;
	        		this.filter.pages = res.data.pages;
	        		this.filter.total = res.data.total;
	        		
//	   				Object.assign(
//	        	 		this.$data.formValidate,
//	        	 		this.$options.data().formValidate
//	   				);
	        	});
	        },
	        onPageChange(page){//页码改变的回调，返回改变后的页码
	        	this.filter.page = page;
	        	this.getImageData();	
	        },
	        onPageSizeChange(pageSize){ //改变 每页显示的条数
	//          	console.log(pageSize);
	        	this.filter.limit = pageSize; //即 limit改变
	        	this.filter.page = 1;         //切回第一页
	        	this.getImageData();
	        	
	        },
	        onSelectionChange(selection){
	        	console.log(selection);
	        	var len = selection.length;
	        	var ids = [];
	        	for(var i =0; i<len; i++){
	        		ids.push(selection[i]._id);
	        	}
	        	this.ids = ids;
	        },
	        editor (index) {
        	
	       		this.formValidate = this.list[index]; //注意 这一步会让 form多出一个 _id，
	       		//注意修改完后， 把_id 删掉，否则会有问题的，添加的话 _id 存在，数据库也存在，则无法添加
	       		this.modal1 = true;
	       		this.exit_password = false;  // 判断是 修改 而不是 添加 模态框
	       		console.log(this.exit_password);
	        },
	        remove (index) {
	            //this.list.splice(index, 1);
	         
	            this.modal2 =true;          
	          
	            var id = this.list[index]._id;
	            this.delete_id = id;
	        },
	        
	        del(){
	        	this.modal_loading = true;
	        	this.delete();
	        	setTimeout(() => {
	                this.modal_loading = false;
	                this.modal2 = false;
	                this.$Message.success('删除成功');
	                
	            }, 300);
	        },
	        delete(){
	          	var id = this.delete_id; 
//	          	console.log("要删除的id：-----------");
	          	console.log(id);
	          	this.$http.delete(`http://localhost:3000/upload/${id}`)
	            .then((res)=>{
//	            	console.log("---------删除结果：----------");
//	            	console.log(res);
	            	this.getImageData();
	            })
	        },
	        search(){
	        	console.log(11);
	        	if(this.input_value && this.input_value.trim().length >0 ){
//					console.log(22);
	        		this.filter.originalname = this.input_value;
//	        		console.log(this.filter);
	        		this.getImageData();
	
	        	}else{
	        		this.$Message.info("请输入搜索内容")
	        	}
	        },
	        removes(){
	        	console.log("--------------删除选中--------------");
	        	console.log(this.ids);
	        	
	        	if(this.ids.length > 0){
	        		this.modal3 = true;
	        	}else{
	        		this.$Message.info("请选择要删除的数据")
	        	}
	        
	        },
	        refreshD(){
            	this.filter = {
	                limit:5,
	                page:1,
	                pages:0,
	                total:0,
	                originalname:""
	            }
            	this.getImageData();
            },
            del_more(){
	            	          				this.$http.post(`http://localhost:3000/upload/removes`,{
	          		ids:this.ids
	          	}).then(res=>{
	          		
	          		if(res){
	          			this.filter.page = 1;
	          			this.getImageData();
	          			this.modal3 = false;
	          		}
	          	})
	        },
	        changeTime(t){
	        	var date = new Date();
				date.setTime(t);
				var y = date.getFullYear();
				var m = date.getMonth()+1;
				var d = date.getDate();
				var hour = date.getHours();
				var min = date.getMinutes();
				var sec = date.getSeconds();
				
				return `${y}年${this.fillZero(m)}月${this.fillZero(d)}日 ${this.fillZero(hour)}:${this.fillZero(min)}:${this.fillZero(sec)}`;
	        },
	        fillZero(n){
	        	return n<10?"0"+n:""+n
	        }
	        	
        },
        created(){
        	this.getTreeData();
        	this.getImageData();
        },
        mounted () {
            this.uploadList = this.$refs.upload.fileList;
        },
        computed:{
        	postUrl(){
        		return `http://localhost:3000/upload/filedata/${this.postData._id}`
        	}
        	
        }
       
    }
</script>

<style scoped>
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
	.demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
    .btns{
		display: flex;
	}
	
</style>










