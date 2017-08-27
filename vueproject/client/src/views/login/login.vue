  
<template>
    <div class="layout">
        <div class="layout-ceiling">
            <div class="layout-ceiling-main">
                <a href="#">注册登录</a> |
                <a href="#">帮助中心</a> |
                <a href="#">安全中心</a> |
                <a href="#">服务大厅</a>
            </div>
            
            <div class="system_name">后台管理系统</div>
            
             <Form ref="formInline" :model="formInline" :rules="ruleInline" inline
			 	class="login_form"
			 	
			 	>
		        <Form-item prop="user">
		            <Input type="text" v-model="formInline.user" 
		            	placeholder="Username">
		                <Icon type="ios-person-outline" slot="prepend"></Icon>
		            </Input>
		        </Form-item>
		        <br />
		        <Form-item prop="password">
		            <Input type="password" 
		            	v-model="formInline.password" placeholder="Password">
		                <Icon type="ios-locked-outline" slot="prepend"></Icon>
		            </Input>
		        </Form-item>
		        <br />
		        <Form-item>
		            <Button type="primary" @click="handleSubmit('formInline')"
		            	class="login_btn" style="width:184px;"
		            	>
		            	登录
		            </Button>
		        </Form-item>
		 
		    </Form>
            
        </div>

  	 	 <div class="layout-copy">
            2011-2016 &copy; TalkingData
        </div>
    </div>
</template>



<script>
	import {mapGetters,mapActions}  from "vuex"
	import md5 from 'crypto-js/md5';
    export default {
        data () {
            return {
                formInline: {
                    user: '',
                    password: ''
                },
                ruleInline: {
                    user: [
                        { required: true, message: '请填写用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请填写密码', trigger: 'blur' },
                        { type: 'string', min: 1, message: '密码长度不能小于1位', 
                          trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
        	...mapActions(["setLoginState","setAuthor"]),
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                    	//  this.formInline
                    	console.log("开始登录判定");
                    	
                    	var name = this.formInline.user;
                    	var password = md5(this.formInline.password).toString();
                    	
                    	this.$http.post("http://localhost:3000/users/login",{
                    		name:name,
                    		password:password
                    	}).then((res)=>{
                    		
                    		
                    		if(res.data && res.data.length >0){
                    			this.$Message.info('登录成功');
                    			
                    			setTimeout(()=>{
                    				this.setLoginState(false); //修改状态管理
                    				this.setAuthor(name);     //修改状态管理
                    			},1000);
                    			
                    		}else{
                    			this.$Message.error('用户名或密码错误!');
                    		}
                    		
                    	})
                    	
                        
                    } else {
                        this.$Message.error('登录失败!');
                    }
                })
            }
        }
    }
</script>

<style scoped>
	.ivu-form-inline{
		height:100%;
	}
	.login_form{
		height:500px;
		margin:0 auto;
		text-align: center;
		margin-top:50px;
	}
	
	.system_name{
		width:100%;
		color:#fff;
		text-align: center;
		font-size:40px;
		margin-top:100px;
	}
	.layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .layout-logo{
        width: 100px;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 15px;
        left: 20px;
    }
    .layout-header{
        height: 60px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
    .layout-ceiling{
        background: #464c5b;
        padding: 10px 0;
        overflow: hidden;
    }
    .layout-ceiling-main{
        float: right;
        margin-right: 15px;
    }
    .layout-ceiling-main a{
        color: #9ba7b5;
    }
    .login_btn{
    	width:185px;
    }
</style>