<template>
	<div>
		<div class="layout-breadcrumb">
            <Breadcrumb>
                <Breadcrumb-item href="#">平台首页</Breadcrumb-item>
                <Breadcrumb-item href="#">用户管理</Breadcrumb-item>
            </Breadcrumb>
            
        </div>
		<div class="btns">
			<Input v-model="input_value" style="width:300px;">
		       
		        <Button slot="append" icon="ios-search" @click="search"></Button>
		        
		    </Input>
		    <Button type="primary" @click="addData"  style="margin:0 20px 0 20px;">
		    	添加</Button>
			<Button type="primary" @click="removes" >删除选中</Button>
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
	        title="请输入用户信息"
	       
	        @on-cancel="cancel">
	        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" 
	        	:label-width="80">
	        	
        <Form-item label="姓名" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入姓名"></Input>
        </Form-item>
        
        <Form-item label="密码" prop="password" v-if="exit_password">
            <Input v-model="formValidate.password"  
            	placeholder="请输入密码">
            	
            </Input>
        </Form-item>
        
        <Form-item label="邮箱" prop="mail">
            <Input v-model="formValidate.mail" placeholder="请输入邮箱"></Input>
        </Form-item>
        
        <Form-item label="城市" prop="city">
            <Select v-model="formValidate.city" placeholder="请选择所在地">
                <Option value="beijing">北京市</Option>
                <Option value="shanghai">上海市</Option>
                <Option value="shenzhen">深圳市</Option>
            </Select>
        </Form-item>
        
        <Form-item label="选择日期">
            <Row>
                <Col span="11">
                    <Form-item prop="date">
                        <Date-picker type="date" placeholder="选择日期" 
                        	v-model="formValidate.date"></Date-picker>
                    </Form-item>
                </Col>
                <Col span="2" style="text-align: center">-</Col>
                <Col span="11">
                    <Form-item prop="time">
                        <Time-picker type="time" placeholder="选择时间" 
                        	v-model="formValidate.time"></Time-picker>
                    </Form-item>
                </Col>
            </Row>
        </Form-item>
        <Form-item label="性别" prop="gender">
            <Radio-group v-model="formValidate.gender">
                <Radio label="male">男</Radio>
                <Radio label="female">女</Radio>
            </Radio-group>
        </Form-item>
        <Form-item label="爱好" prop="interest">
            <Checkbox-group v-model="formValidate.interest">
                <Checkbox label="吃饭"></Checkbox>
                <Checkbox label="睡觉"></Checkbox>
                <Checkbox label="跑步"></Checkbox>
                <Checkbox label="看电影"></Checkbox>
            </Checkbox-group>
        </Form-item>
        <Form-item label="介绍" prop="desc">
            <Input v-model="formValidate.desc" type="textarea" 
            	:autosize="{minRows: 2,maxRows: 5}" placeholder="请输入...">
            </Input>
        </Form-item>
        <Form-item>
            <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
            <Button type="ghost" @click="handleReset('formValidate')" 
            	style="margin-left: 8px">重置</Button>
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
	</div>
</template>

<script>
	import base from "../../common/Base.js";
	
    export default {
    	mixins:[base],
        data () {
            return {
            	module:"users",
                columns7: [
               		{
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '姓名',
                        key: 'name',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: 'person'
                                    }
                                }),
                                h('strong', params.row.name)
                            ]);
                        }
                    },
                    {
                        title: '性别',
                        key: 'gender',
                        width:80
                    },
                    {
                        title: '邮箱',
                        key: 'mail'
                    },
                    {
                        title: '爱好',
                        key: 'interest'
                    },
                    {
                        title: '城市',
                        key: 'city'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
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
                formValidate: {
                    name: '老马',
                    password:"11111",
                    mail: '329077098@qq.com',
                    city: 'shanghai',
                    gender: 'female',
                    interest: [],
                    date: '',
                    time: '',
                    desc: '12121212121212121212121212121'
                },
                exit_password:true,
                ruleValidate: {
                    name: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '密码不能为空', trigger: 'blur' }
                    ],
                    mail: [
                        { required: true, message: '邮箱不能为空', trigger: 'blur' },
                        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                    ],
                    city: [
                        { required: true, message: '请选择城市', trigger: 'change' }
                    ],
                    gender: [
                        { required: true, message: '请选择性别', trigger: 'change' }
                    ],
                    interest: [
                        { required: true, type: 'array', min: 1, 
                        message: '至少选择一个爱好', trigger: 'change' },
                        { type: 'array', max: 2, message: '最多选择两个爱好', 
                        trigger: 'change' }
                    ],
                    date: [
                        { required: true, type: 'date', message: '请选择日期', 
                        trigger: 'change' }
                    ],
                    time: [
                        { required: true, type: 'date', message: '请选择时间', 
                        trigger: 'change' }
                    ],
                    desc: [
                        { required: true, message: '请输入个人介绍', trigger: 'blur' },
                        { type: 'string', min: 20, message: '介绍不能少于20字', 
                        trigger: 'blur' }
                    ]
                }
            }
        },
        created(){
        	console.log(22222);
        	this.getData();
        },
        methods:{
        	test(){
        	
        		for(var i=0; i<this.list.length;i++){
        			
        			if(this.list[i].gender == "female"){
        				this.list[i]._gender = "female";
        				this.list[i].gender = "女";
        			}else{
        				this.list[i]._gender = "male";
        				this.list[i].gender = "男";
        			}
        			
        			this.list[i].interest = this.list[i].interest.toString();
        			
        		}
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
		margin-bottom:10px;
	}
</style>











