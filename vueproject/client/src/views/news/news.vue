<template>
	<div>
		 <div class="layout-breadcrumb">
            <Breadcrumb>
                <Breadcrumb-item href="#">平台首页</Breadcrumb-item>
                <Breadcrumb-item href="#">新闻管理</Breadcrumb-item>
            </Breadcrumb>
            
        </div>
		<div class="btns">
			<Input v-model="input_value" style="width:300px;">
		       
		        <Button slot="append" icon="ios-search" @click="search"></Button>
		        
		    </Input>
		    <Button type="primary" @click="addData"  style="margin:0 20px 0 20px;">
		    	添加
		    </Button>
			<Button type="primary" @click="removes" >删除选中</Button>
			
			<Button type="primary" @click="refreshD"  style="margin:0 20px 0 20px;">
		    	刷新
		    </Button>
		</div>
		
		<Table border :columns="columns7" :data="list"
				@on-selection-change="onSelectionChange"
			>
		</Table>
		
		
		<Page :total="filter.total" :page-size="filter.limit" :show-total="true"
			  show-elevator @on-change="onPageChange" class-name="pagenation"
			  @on-page-size-change="onPageSizeChange" show-sizer
			  :page-size-opts="pageSizeOpts" placement="top"
		>
			
		</Page>
		
		
		 <Modal
	        v-model="modal1"
	        title="请输入数据"
	        @on-ok="ok"
	        @on-cancel="cancel">
	        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" 
	        	:label-width="80">
	        	
        <Form-item label="标题" prop="title">
            <Input v-model="formValidate.title" placeholder="请输入 标题"></Input>
        </Form-item>
        
        <Form-item label="内容" prop="desc">
            <Input v-model="formValidate.desc"  
            	placeholder="请输入内容">
            	
            </Input>
        </Form-item>

        <Form-item>
            <Button type="primary" 
            	@click="handleSubmit('formValidate')">提交
            </Button>
            <Button type="ghost" @click="handleReset('formValidate')" 
            	style="margin-left: 8px">
            	重置
            </Button>
        </Form-item>
        
    </Form>
    
    
		 </Modal>
			
	    <Modal v-model="modal2" width="360">
	        <p slot="header" style="color:#f60;text-align:center">
	            <Icon type="information-circled"></Icon>
	            <span>删除确认</span>
	        </p>
	        <div style="text-align:center">
	     
	            <p>是否确定删除数据？</p>
	        </div>
	        <div slot="footer">
	            <Button type="error" size="large" long :loading="modal_loading" 
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
	    
	    
	    <Modal
	        v-model="modal_comment"
	        title="评论"
	        @on-ok="goComment"
	        @on-cancel="cancelComment">
	        
	        <p v-model="comment.logId"></p>
	        <p v-model="comment.name"></p>
	                     打    分：<Rate allow-half v-model="valueHalf"></Rate>
	          <br />           
	                    评价：<Input v-model="comment.desc" type="textarea" placeholder="请输入...">
	                     	
	                     </Input>
	        
	    </Modal>
	    
	    
		
		
		<Modal
        	title="新闻评论"
        	v-model="modal_comment_result"
        	class-name="comment_class"
        	:mask-closable="false">
        	
		        <i-circle :percent="percent" v-if="isLoading">
			        <span class="demo-i-circle-inner" 
			        	style="font-size:24px">{{percent}}%</span>
			    </i-circle>
			    <br />
			    <p style="text-align: center;" v-if="isLoading">{{load_state}}</p>
			    
			    
			    <div v-else >
			    	
				    <div v-for="(val,index) in commentList" key="index" 
				    	class-name="comment_box">
				    	<span>{{index+1}}.</span>
				    	<span>{{val.desc}}</span>
				    	<span style="float: right;">评论人： {{val.author}}</span>
				    </div>
				    
			    </div>
    	</Modal>
    
	</div>
</template>

<script>
	import {mapGetters,mapActions} from "vuex";
	import base from "../../common/Base.js";
	
    export default {
    	mixins:[base],
        data () {
            return {
            	module:"news",
            	valueHalf: 2.5,
                columns7: [
               		{
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '标题',
                        key: 'title'
                    },
                    {
                        title: '内容',
                        key: 'desc'
                    },
                    {
                        title: '发布时间',
                        key: 'date'
                    },
                    {
                        title: '评论数',
                        key: 'commentCount',
                        align: 'center'
                    },
                    {
                        title: '查看评论',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.seeComment(params)
                                        }
                                    }
                                }, '查看评论')
                                
                            ]);
                        }
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
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.editor(params.index)
                                        }
                                    }
                                }, '修改'),
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
                                }, '删除'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                        
                                            this.commentIt(params)
                                        }
                                    }
                                }, '评论')
                            ]);
                        }
                    }
                ],
                formValidate: {  //添加的时候的 提交内容
                    cateId:null,
                    _id: null,
                    title: '',
                    desc: '',
                    author:""
                },
                comment:{
                	logId: "",
				    name: "默认的新闻",
				    desc: "默认的评论",
				    author:""
                },
                modal_comment_result:false,   // 查看评论的 模态框
                modal_comment:false,          //评论的模态框
                exit_password:true, //false是 修改，true是添加
                percent:0,
                comment_logId:"",
                isLoading:true,
                load_state:"正在加载中",
                commentList:[],
                filter:{         // 查询数据时候的  筛选条件
	               cateId:null,
	               cate:{}
                },
                ruleValidate: {
                    title: [
                        { required: true, message: '标题不能为空', trigger: 'blur' }
                    ],
                    desc: [
                        { required: true, message: '请输入备注', trigger: 'blur' },
                        { type: 'string', min: 2, message: '备注不能少于2字', 
                        trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{ //mixins
        	...mapActions(["setAuthor"]),
        	handleSubmit (name) {  //表单提交
            	console.log("handleSubmit1222222222222222222222222");
            	
            	if(this.exit_password){ //添加
            		  this.$refs[name].validate((valid) => {
                		
	                    if (valid) {
	   					var  url = `http://localhost:3000/${this.module}/data`;
	                        this.$http.post(url,this.formValidate)
	                        .then((res)=>{
								console.log(res);
	                        	this.getData();  //刷新表格，重新获取第一页的内容
	                        	this.modal1 =false; //把 添加的弹框  隐藏
	                        	// 让我们的数据恢复到初始化状态
	                        	
	                        	Object.assign(// 让我们的数据恢复到初始化状态
	                        	 	this.$data.formValidate,
	                        	 	this.$options.data().formValidate
	                        	);
	                        	 	
	                        })
	                        
	                    } else {
	                        this.$Message.error('输入的数据信息不完整!');
	                    }
	                })
            	}else{ //修改
            		
            		this.$refs[name].validate((valid) => {
	                    if (valid) {
	
	                        console.log("向 服务器 修改 数据--------------");
	             			
	                       	var id = this.formValidate._id;
	                       	console.log(id);
	                       	console.log(this.formValidate);
	                       	
	                    var url = `http://localhost:3000/${this.module}/data/${id}`;
	                    this.formValidate.date = new Date(this.formValidate.date);
	                    //注意 日期格式， 因为我们转过一次String， 要转回来Date，数据库日期格式为Date
                        console.log(this.formValidate.date);
                        
	                        this.$http.put(url,this.formValidate)
	                        .then((res)=>{
	                        	console.log("修改完成");
	                      		console.log(res);
	                        	this.getData();  //刷新表格，重新获取第一页的内容
	                        	this.modal1 =false; //把 添加的弹框  隐藏
	                        	console.log(this.modal1);
	                        
	                        })
	                        
	                    } else {
	                        this.$Message.error('用户信息不完整!');
	                    }
	                })
            	}
              
            },
            commentIt(params){
            	//评论的 字段 ：  logId name date desc
            	console.log(params.row); // { author  cateId _id  title desc ..}
//          	console.log(this.getAuthor);
            	
            	this.comment.name = params.row.title; // 评论的新闻名字
            	
            	this.comment.logId = params.row._id; // 评论的  新闻的cateId
            	
            	this.comment.author = this.getAuthor;   //评论的作者， 当前登录的vuex的人
            	
            	this.modal_comment = true;
            },
            goComment(){
            	console.log("-------去评论--------------");
            	console.log(this.comment);
            	var url = "http://localhost:3000/comment/data";
            	this.$http.post(url,this.comment)
            	.then((res)=>{
            		console.log("评论 完成， 数据库返回结果如下：");
            		console.log(res);
            		
            		this.getData();
            	});
            },
            cancelComment(){
            	this.$Message.info("取消评论");
            },
            seeComment(params){
            	console.log("  ===============");
            	console.log(this.percent);
            	if(!this.isLoading){
            		this.isLoading = true;
            		this.percent = 0;
            	}
//          	console.log(params);
            	
            	this.modal_comment_result = true;
            	
            	this.comment_logId = params.row._id;  // 评论的 id

            	var timer = setInterval(()=>{
            		if(this.percent <100){
            			this.percent++;
            		}else{
            			this.load_state = "评论加载完毕";
            			
            			setTimeout(()=>{
            				this.isLoading = false;
            				this.percent = 0;
            			},1000)
            			clearInterval(timer);
            		}
            		
            	},30);
            	
            	console.log(this.comment_logId);
            	var url="http://localhost:3000/comment/list";
            	
            	this.$http.post(url,{
            		logId:this.comment_logId
            	}).then((res)=>{
            		console.log("查询评论的结果如下：----");

            		this.commentList = res.data.docs;
      
              
            	});
            },
            refreshD(){
            	this.filter = {
	                limit:5,
	                page:1,
	                pages:0,
	                total:0,
	                name:""
	            }
            	this.getData();
            }
        },
        created(){
        	
        	this.getData();
        },
        computed:{
        	...mapGetters(["getAuthor"])
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
	

	.comment_class{
		text-align: center;
	}
	.ivu-chart-circle{
		margin-left:180px;
	}
	.comment_box{
		display: flex;
	}
</style>











