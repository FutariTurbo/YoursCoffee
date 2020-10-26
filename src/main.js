import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'lib-flexible/flexible'

// 导入vant框架组件
import { 
  Button, 
  NavBar, 
  Icon, 
  Form, 
  Field, 
  Popup, 
  Tabbar, 
  TabbarItem, 
  Notify, 
  Toast,
  Search,
  Swipe, 
  SwipeItem,
  Grid, 
  GridItem,
  Skeleton,
  Stepper,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  Sku,
  SwipeCell,
  Cell,
  Checkbox,
  CheckboxGroup,
  SubmitBar,
  Empty,
  AddressList,
  AddressEdit,
  PullRefresh,
  List,
  NoticeBar,
  Uploader,
  Tab, 
  Tabs,
  PasswordInput,
  NumberKeyboard,
  Tag
} from 'vant'
// 全局注册组件
Vue.use(Button)
   .use(NavBar)
   .use(Icon)
   .use(Form)
   .use(Field)
   .use(Popup)
   .use(Tabbar)
   .use(TabbarItem)
   .use(Notify)
   .use(Toast)
   .use(Search)
   .use(Swipe)
   .use(SwipeItem)
   .use(Grid)
   .use(GridItem)
   .use(Skeleton)
   .use(Stepper)
   .use(GoodsAction)
   .use(GoodsActionIcon)
   .use(GoodsActionButton)
   .use(Sku)
   .use(SwipeCell)
   .use(Cell)
   .use(Checkbox)
   .use(CheckboxGroup)
   .use(SubmitBar)
   .use(Empty)
   .use(AddressList)
   .use(AddressEdit)
   .use(PullRefresh)
   .use(List)
   .use(NoticeBar)
   .use(Uploader)
   .use(Tab)
   .use(Tabs)
   .use(PasswordInput)
   .use(NumberKeyboard)
   .use(Tag)

//注册axios, ajax方案，用于请求数据
Vue.use(VueAxios, axios)

//设置post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'

//设置请求基础路径
axios.defaults.baseURL = 'http://www.kangliuyong.com:10002'

//添加一个Vue的原型属性
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='

Vue.config.productionTip = false

// 全局注册过滤器, 用于格式化时间数据
Vue.filter('formatDate', (value, format) => {
  let date = new Date(value);
  // 获取一个年份
  let y = date.getFullYear();
  // 获取匹配组的内容
  if(/(y+)/.test(format)){
    let content = RegExp.$1;
    format = format.replace(content, y.toString().slice(4 - content.length));
  }
  // 创建一个对象
  let obj = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  }
  for(let key in obj){
    // 构造动态正则
    let reg = new RegExp(`(${key}+)`);
    if(reg.test(format)){
      let content = RegExp.$1;
      let k = obj[key] >= 10 ? obj[key] : content.length == 2 ? '0' + obj[key] : obj[key];
      format = format.replace(content, k);
    }
  }
  return format;
})



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
