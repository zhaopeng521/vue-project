<template>
	<div class="welcome_txt">
		欢迎登录,{{getAuthor}}
	</div>
</template>

<script>
	import {mapGetters,mapActions} from "vuex";
	
	export default {
		data(){
			
			return {
				
			}
		},
		methods:{
			
		},
		computed:{
			...mapGetters(["getAuthor"])
		}
	}
</script>

<style>
.welcome_txt{
	text-align:center;
	font-size:30px;
	
}
</style>