<template>
<i-col :span="spanLeft" class="layout-menu-left">
    <Menu active-name="1" theme="dark" width="auto">
        <div class="layout-logo-left"></div>
        <Menu-item name="1">
            <Icon type="ios-navigate" :size="iconSize"></Icon>
            <span class="layout-text">
            	
            	<router-link to="/" activeClass="active">首页</router-link>
            	
            </span>
        </Menu-item>
        <Menu-item name="2">
            <Icon type="ios-keypad" :size="iconSize"></Icon>
            <span class="layout-text">
            	
            	<router-link to="/users">用户</router-link>
            	
            </span>
        </Menu-item>
        
        <Menu-item name="3">
            <Icon type="ios-analytics" :size="iconSize"></Icon>
            <span class="layout-text">
            	<router-link to="/news">新闻管理</router-link>
            
            </span>
        </Menu-item>
        
         <Menu-item name="4">
            <Icon type="ios-analytics" :size="iconSize"></Icon>
            <span class="layout-text">
            	<router-link to="/cates">分类管理</router-link>
            
            </span>
        </Menu-item>
        
        <Menu-item name="5">
            <Icon type="ios-analytics" :size="iconSize"></Icon>
            <span class="layout-text">
            	<router-link to="/upload">上传管理</router-link>
            
            </span>
        </Menu-item>
        
        <Menu-item name="6">
            <Icon type="ios-analytics" :size="iconSize"></Icon>
            <span class="layout-text">
            	<router-link to="/photo">相册管理</router-link>
            
            </span>
        </Menu-item>
        
         <Menu-item name="7" >
            <Icon type="ios-analytics" :size="iconSize"></Icon>
            <span class="layout-text" @click="logout">
            	
            	登出
            </span>
        </Menu-item>
    </Menu>
</i-col>
</template>

<script>
	import {mapGetters,mapActions} from "vuex"
	
	export default {
		props:['spanLeft','iconSize'],
		methods:{
			...mapActions(["setLoginState","setAuthor"]),
			logout(){
			
				this.setLoginState(true);
				this.setAuthor("");
				this.$router.push("/");

			}
		},
		computed:{
			...mapGetters(["getLoginState","getAuthor"])
		}
	}
</script>

<style scoped>
	.active{
		color:blue;
	}
</style>