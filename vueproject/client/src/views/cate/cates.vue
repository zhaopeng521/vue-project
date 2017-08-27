<template>
	<div>
	    <div class="layout-breadcrumb">
	    	
            <Breadcrumb>
                <Breadcrumb-item href="#">平台首页</Breadcrumb-item>
                <Breadcrumb-item href="#">分类管理</Breadcrumb-item>
            </Breadcrumb>
            
        </div>
         <Button-group>
	
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
	    
		<Tree :data="baseData"  @on-select-change="onSelectChange"
			style="margin-left:20px;"
			></Tree>
		
		<Form ref="formValidate" :model="formValidate" :rules="ruleValidate" 
	        	:label-width="80">
	        	
	        <Form-item label="插入节点" prop="title">
	            <Input v-model="formValidate.title" 
	            	placeholder="请输入节点名称"></Input>
	        </Form-item>
	
	     
	    </Form>
	    <!--<input type="text" :value="test_id" />-->
		<div class="btns">
		    <Button type="primary"   
		    	style="margin:0 20px 0 20px;" @click="addNode">
		    	添加
		    </Button>
			
			<Button type="primary"   
				style="margin:0 20px 0 20px;" @click="reviseNode">
		    	修改
		    </Button>
		    <Button type="primary" @click="deleteNode">
				删除选中
			</Button>
		</div>
		

	</div>
</template>

<script>
    export default {
        data () {
            return {
            	module:"cate",
            	currentType:1,
            	currentId:null,
            	currentNode:{},
            	modal1:false,
                baseData: [],
                test_id:"",
                formValidate: {
                 	type:1,
                    title: '',
                    parentId:null
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
                        { type: 'string', min: 20, message: '介绍不能少于20字', 
                         trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
        	getTreeData(){
        		var url = `http://localhost:3000/${this.module}/${this.currentType}`;
        
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
            addNode(){
            	var t = this.formValidate.title;
            	if(!(t && t.trim().length > 0)){
            		this.$Message.info("请输入节点");
            		return;
            	}
           		var type = this.currentType; //保存 当前 type
           		this.formValidate.parentId = this.currentId;
        	    this.$http.post(`http://localhost:3000/${this.module}/data`,
        	    	this.formValidate
        	    ).then((res)=>{
        	    	
                	// 让我们的数据恢复到初始化状态
                	 Object.assign(// 让我们的数据恢复到初始化状态
                	 	this.$data.formValidate,
                	 	this.$options.data().formValidate
                	 );
                	 
                	this.currentType = type;     // 保存当前的type
                	this.formValidate.type = type; //再 回到 之前的type .获取该type下的数据
					this.$Message.info("添加成功");
					this.getTreeData();
                	
                })
            },
            reviseNode(){
//          	console.log(this.currentNode)
            	
            	this.currentNode.title = this.formValidate.title; //更新 title数据
            	// 根据 id 更新到服务器 
            	var url = `http://localhost:3000/cate/data/${this.currentId}`;
            	
            	this.$http.put(url,this.currentNode)
            	.then((res)=>{
            		console.log("-------------更新成功:-------------");
            		console.log(res);
            		
            		this.getTreeData();
            	});
            },
            deleteNode(){
            	var url = `http://localhost:3000/cate/data/${this.currentId}`;
            	
            	this.$http.delete(url)
            	.then((res)=>{
            		console.log("-------------删除成功:-------------");
            		console.log(res);
            		
            		this.getTreeData();
            	});
            },
            onSelectChange(selArr){
            	console.log(selArr);
            	var id = selArr[0]._id;
            	this.currentNode = selArr[0];   //获取当前 选中的节点 数据
            	this.currentId = id;    //当前选中的 节点id，如果是添加，则该id是新节点的父id
            	
              	this.formValidate.title = selArr[0].title;
				
            }
        },
        created(){
        	this.getTreeData();
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
</style>










