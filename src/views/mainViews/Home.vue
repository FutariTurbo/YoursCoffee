<template>
    <div class="home">
        <div class="header">
            <div class="title">
                <div class="info-img"> 
                    <img class="auto-img" src="../../assets/images/logo.jpg" alt="">
                </div>
                <div class="logo-title">
                    Yuor.s Coffee
                    <div class="logo-cname">约氏咖啡</div>
                </div>
            </div>
            <div class="banner">
                <van-swipe :autoplay="3000" indicator-color="#549434">
                    <van-swipe-item v-for="(item, index) in bannerData" :key="index" @click="viewProductDetail(item.pid)">
                        <img class="auto-img" :src="item.bannerImg" alt="">
                    </van-swipe-item>
                </van-swipe>
            </div>
        </div>
        
        <div class="content">
            <div class="user-info clearfix">
                <div class="search">
                <van-search
                shape="round"
                placeholder="请输入商品名称"
                v-model="name"
                @focus="search"
                />
            </div>
                <div class="info-name fr" v-if="isLogin">Hi, {{userInfo.nickName}}</div>
                <div class="info-name fr" v-else @click="goLogin">登录/注册</div>
                <div class="info-title fr">{{timeText}}</div>
            </div>
            <div class="product">
                <div class="hot-title">热卖推荐</div>
                <div class="product-box">
                    <div class="p-item" v-for="(item, index) in productData" :key="index" @click="viewProductDetail(item.pid)">
                        <div class="p-img">
                            <img class="auto-img" :src="item.smallImg" alt="">
                        </div>
                        <div class="p-title">{{item.name}}</div>
                        <div class="p-price">￥{{item.price}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import '../../assets/less/home.less'
    export default {
        name: 'Home',
        data() {
            return {
                timeText: '',
                bannerData: [],
                productData: [],
                name: '',
                userInfo: [],
                isLogin: false
            }
        },

        created() {
            this.getBannerData();
            this.getTime();
            this.getProductData();
            this.getUserInfo();
        },

        methods: {
            // 跳转到登录页
            goLogin(){
                this.$router.push({name: 'Login'})
            },
            // 获取轮播图数据
            getBannerData(){
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                }),
                this.axios({
                    method: 'GET',
                    url: '/banner',
                    params: {
                        appkey: this.appkey
                    }
                }).then(result => {
                    
                    this.$toast.clear();
                    if(result.data.code == 300){
                        this.bannerData = result.data.result;
                    }
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            },
            // 获取时间改变文字
            getTime(){
                let hours = new Date().getHours();
                if(hours >= 6 && hours < 12){
                    this.timeText = '咖啡会让你脑洞大开哟';
                }else if(hours >=12 && hours < 18){
                    this.timeText = '咖啡和今天的你更配哟';
                }else if(hours >= 18 && hours < 24){
                    this.timeText = '这个夏季，约氏陪你';
                }
            },
            // 获取商品数据
            getProductData(){
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0
                }),
                this.axios({
                    method: 'GET',
                    url: '/typeProducts',
                    params: {
                        appkey: this.appkey,
                        key: 'isHot',
                        value: 1
                    }
                }).then(result => {
                    this.$toast.clear();
                    
                    if(result.data.code == 500){
                        this.productData = result.data.result;
                    }
                }).catch(err => {
                    this.$toast.clear();
                    
                    
                })
            },
            // 搜索
            search(){
                this.$router.push({name: 'Search'});
            },
            // 查看商品详情
            viewProductDetail(pid){
                this.$router.push({name: 'Detail', query: {pid}});
            },
            // 获取用户信息
            getUserInfo(){
                let tokenString = localStorage.getItem('ctk');
                if(!tokenString){
                    return;
                }
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0
                })
                this.axios({
                    method: 'GET',
                    url: '/findMy',
                    params:{
                        appkey: this.appkey,
                        tokenString
                    }
                }).then(result => {
                    this.$toast.clear();
                    
                    if(result.data.code == 'A001'){
                        this.isLogin = true;
                        this.userInfo = result.data.result[0];
                    }
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            }
        }
    }
</script>