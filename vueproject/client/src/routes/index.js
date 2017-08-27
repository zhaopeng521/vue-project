import Home from "../views/Home.vue";
import Users from "../views/user/users.vue";
import News from "../views/news/news.vue";
import Cates from "../views/cate/cates.vue";
import Upload from "../views/upload/upload.vue";
import Photo from "../views/photo/photo.vue";

export const routes = [
	{path:"/",component:Home},
	{path:"/users",component:Users},
	{path:"/news",component:News},
	{path:"/cates",component:Cates},
	{path:"/upload",component:Upload},
	{path:"/photo",component:Photo}
]






