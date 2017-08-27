
// var CryptoJS = require("crypto-js");//加密作用，比如 md5
import md5 from 'crypto-js/md5';
//var res = md5( xxxxx ).toString();
export default {
    data () {
        return {
        	pageSizeOpts:[5,10,15,20],
            list:[],
            list2:[],
            ids:[],
            filter:{
                limit:5,
                page:1,
                pages:0,
                total:0,
                name:""
            },
            modal1:false,
            modal2:false,
            modal3:false,
            modal_loading: false,
            modal_loading2: false,
            delete_id:0,
            input_value:"",
        }
    },
    methods: {
        editor (index) {
        	
       		this.formValidate = this.list[index]; //注意 这一步会让 form多出一个 _id，
       		//注意修改完后， 把_id 删掉，否则会有问题的，添加的话 _id 存在，数据库也存在，则无法添加
       		this.modal1 = true;
       		
      
       		this.exit_password = false;  // 判断是 修改 而不是 添加 模态框
       		
			//把日期转回去
			if(this.formValidate.date){
				this.formValidate.date = new Date(this.formValidate._date); 
			}

    		//把性别转回去
    		if(this.formValidate.gender){
    			this.formValidate.gender = this.formValidate._gender;
    		}

    		//把爱好转回去
    		console.log(this.formValidate.interest);
    		if(typeof this.formValidate.interest == "string"){
    			//防止第二次点击修改时，第一次已经转为数组了，则没有split方法
    			if(this.formValidate.interest.split){
    		this.formValidate.interest = this.formValidate.interest.split(",");
    		console.log(this.formValidate.interest);
    			}
    		
    		}
    		
        },
        remove (index) {
            //this.list.splice(index, 1);
            console.log(index);
      
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
          	var id = this.delete_id;     				this.$http.delete(`http://localhost:3000/${this.module}/data/`+id)
            .then((res)=>{
            	console.log("-------------------");
            	console.log(res);
            	this.getData();
            })
        },
        getData(){  //获取 数据
        	console.log("---------------------Base---getData");
        	console.log(this.filter);
        	this.$http.post(`http://localhost:3000/${this.module}/list`,
        		this.filter
        	)
        	.then((res)=>{
        		var dataArr = res.data.docs;
        		console.log(dataArr);
        		
        		for(var i=0; i<dataArr.length;i++){
        			
        			dataArr[i]._date =dataArr[i].date;
        			var t =  new Date(dataArr[i].date).getTime();
        			
        			dataArr[i].date =this.changeTime(t);
        			
        		}
        		
        		this.list = dataArr;
        		this.list2 = dataArr;

        		this.filter.page = res.data.page;
        		this.filter.pages = res.data.pages;
        		this.filter.total = res.data.total;
        		if(this.test){ // 返回结果处理一下
        			this.test();
        		}
   				Object.assign(
        	 		this.$data.formValidate,
        	 		this.$options.data().formValidate
   				);
        	})
        },
        onPageChange(page){//页码改变的回调，返回改变后的页码
        	this.filter.page = page;
        	this.getData();	
        },
        onPageSizeChange(pageSize){ //改变 每页显示的条数
//          	console.log(pageSize);
        	this.filter.limit = pageSize; //即 limit改变
        	this.filter.page = 1;         //切回第一页
        	this.getData();
        	
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
        removes(){
        	console.log(this.ids);
        	
        	if(this.ids.length > 0){
        		this.modal3 = true;
        	}else{
        		this.$Message.info("请选择要删除的数据")
        	}
        
        },
        del_more(){
            	          				this.$http.post(`http://localhost:3000/${this.module}/data/removes`,{
          		ids:this.ids
          	}).then(res=>{
          		
          		if(res){
          			this.filter.page = 1;
          			this.getData();
          			this.modal3 = false;
          		}
          	})
        },
        search(){ // 搜索 
        	
        	if(this.input_value && this.input_value.trim().length >0 ){

        		this.filter.name = this.input_value;
        		this.getData();

        	}else{
        		this.$Message.info("请输入搜索内容")
        	}
        },
        addData(){ // 确定-ok  取消-cancel
      
     
        	this.exit_password=true;
        	this.modal1=true;
        },
        ok() {
            this.$Message.info('点击了确定');
            //console.log(this.formValidate);
        },
        cancel () {
        	if(this.formValidate.gender == "female"){
				this.formValidate._gender = "female";
				this.formValidate.gender = "女";
			}else{
				this.formValidate._gender = "male";
				this.formValidate.gender = "男";
			}
			
			if(this.formValidate.interest){
			this.formValidate.interest = this.formValidate.interest.toString();
			}
			
			
            this.$Message.info('点击了取消');
        },
        handleSubmit (name) {  //表单提交     添加 和 修改 功能
        	console.log("handleSubmit1111111111111111111");
        	//通过exit_password 判断是 添加 还是 修改
        	console.log(this.exit_password);
        	if(this.exit_password){   // 添加
        	
                this.$refs[name].validate((valid) => {
                    if (valid) {
   						// 将敏感信息  用 md5 加密
                        var p = md5(this.formValidate.password).toString();
                        console.log("向 服务器 增加 数据--------------");
                        console.log(this.formValidate);
                        console.log(this.formValidate.date);
                        console.log(typeof this.formValidate.date);
                        this.formValidate.password = p;
                        
                        var url = `http://localhost:3000/${this.module}/data`;
                        
                        this.$http.post(url,this.formValidate)
                        .then((res)=>{
//                      	console.log(res);
                        	this.getData();  //刷新表格，重新获取第一页的内容
                        	this.modal1 =false; //把 添加的弹框  隐藏
                        	// 让我们的数据恢复到初始化状态
                        	console.log(this);
                        	 Object.assign(
                        	 	this.$data.formValidate,
                        	 	this.$options.data().formValidate); 
                        	 	
                        })
                        
                    } else {
                        this.$Message.error('用户信息不完整!');
                    }
                })
            }else{ // 通过 put 和 id 进行修改
            	// 注意 修改完后 删除 _id，否则 含有_id数据库若有同名_id值，则无法添加
            	console.log("eeeeeee");
            
            	this.$refs[name].validate((valid) => {
                    if (valid) {

                        console.log("向 服务器 修改 数据--------------");
             			
                       	var id = this.formValidate._id;
                        var url = `http://localhost:3000/${this.module}/data/${id}`;
                        
                        this.formValidate.date = new Date(this.formValidate.date);
                        
                        console.log(this.formValidate.date);
                        
                        this.$http.put(url,this.formValidate)
                        .then((res)=>{
//                      	console.log(res);

							delete this.formValidate._id;//----删除_id字段-----
							
                        	this.getData();  //刷新表格，重新获取第一页的内容
                        	this.modal1 =false; //把 添加的弹框  隐藏
                        	// 让我们的数据恢复到初始化状态
               
                        	 Object.assign(
                        	 	this.$data.formValidate,
                        	 	this.$options.data().formValidate
                        	 );
                        	 	
                        })
                        
                    } else {
                        this.$Message.error('用户信息不完整!');
                    }
                })
            }
        },
        handleReset (name) {
            this.$refs[name].resetFields();
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
    }
}
