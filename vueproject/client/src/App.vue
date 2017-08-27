<template>
    <div class="layout" :class="{'layout-hide-text': spanLeft < 5}"
    
    	>
    	
    	<template v-if="getLoginState">
    		<login></login>
    	</template>
    	
    	<template v-else>
    		
    		  <Row type="flex" style="height:100%;">
        	
	            <Asidebar :spanLeft="spanLeft" :iconSize="iconSize"></Asidebar>
	            
	            <i-col :span="spanRight">
	                <div class="layout-header">
	                    <i-button type="text" @click="toggleClick">
	                        <Icon type="navicon" size="32"></Icon>
	                    </i-button>
	                </div>
	
	                <div class="layout-content">
	                    <div class="layout-content-main">
	                    	 <router-view>展示区</router-view>
	                    </div>
	                </div>
	               <footbar></footbar>
	            </i-col>
	        </Row>
    	</template>
      
        

    </div>
</template>

<script>
	
	import Asidebar from "./components/layout/AsideBar.vue"
	import Footbar from "./components/layout/Footbar.vue"
	import Login from "./views/login/login.vue"
	import {mapGetters,mapActions} from "vuex"
    export default {
        data () {
            return {
                spanLeft: 5,
                spanRight: 19,
                loginState:true
            }
        },
        computed: {
        	...mapGetters(["getLoginState"]),
            iconSize () {
                return this.spanLeft === 5 ? 14 : 24;
            },
            clientHeight(){
            	
            	console.log("------------------");
            	console.log(document.documentElement.clientHeight);
            	
            	return document.documentElement.clientHeight;
            
            }
        },
        methods: {
        	...mapActions(["setLoginState"]),
            toggleClick () {
                if (this.spanLeft === 5) {
                    this.spanLeft = 2;
                    this.spanRight = 22;
                } else {
                    this.spanLeft = 5;
                    this.spanRight = 19;
                }
            }
        },
        components:{
        	Asidebar,Footbar,Login
        }
    }
</script>

<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
 		height:720px;
    }
    .layout-breadcrumb{
        padding: 10px 15px 0;
    }
    .layout-content{
        min-height: 200px;
        margin: 15px;
  
        background: #fff;
        border-radius: 4px;
    }
    .layout-content-main{
        padding: 10px;
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
    .layout-menu-left{
        background: #464c5b;
    }
    .layout-header{
        height: 60px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-logo-left{
        width: 90%;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        margin: 15px auto;
    }
    .layout-ceiling-main a{
        color: #9ba7b5;
    }
    .layout-hide-text .layout-text{
        display: none;
    }
    .ivu-col{
        transition: width .2s ease-in-out;
    }
    


</style>
