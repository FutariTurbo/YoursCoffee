<template>
    <div class="search">
        <div class="navbar">
            <van-nav-bar title="搜索商品" left-arrow @click-left="goback" />
        </div>
        <div class="search">
            <van-search
            shape="round"
            background="#549434"
            placeholder="请输入商品名称"
            v-model="name"
            @search="search" 
            />
        </div>
        <div class="menu-product">
            <van-skeleton :row="10" :loading="isSkeleton">
                <div class="product-list">
                    <div class="product-item" v-for="(item, index) in productData" :key="index" @click=" viewProductDetail(item.pid)">
                        <div class="p-img">
                            <img class="auto-img" :src="item.smallImg" alt="">
                        </div>
                        <div class="p-content">
                            <div class="p-title">{{item.name}}</div>
                            <div class="p-enname">{{item.enname}}</div>
                            <div class="p-price">￥{{item.price}}</div>
                            <van-icon class="fr p-add" name="add" color="#549434" />
                        </div>
                    </div>
                </div>
            </van-skeleton>
        </div>
    </div>
</template>

<script>
    import '../assets/less/search.less'
    export default {
        data() {
            return {
                name: '',
                productData: [],
                isSkeleton: true
            }
        },

        methods: {
            // 搜索
            search(){
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0
                })
                this.axios({
                    method: 'GET',
                    url: '/search',
                    params: {
                        appkey: this.appkey,
                        name: this.name
                    }
                }).then(result => {
                    this.$toast.clear();
                    
                    if(result.data.code == 'Q001'){
                        this.isSkeleton = false;
                        if(result.data.result.length == 0){
                            this.$toast('没有找到您要的商品');
                        }
                        this.productData = result.data.result;
                        this.name = '';
                    }
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            },
            // 查看商品详情
            viewProductDetail(pid){
                this.$router.push({name: 'Detail', query: {pid}});
            },
            // 返回上一级
            goback(){
                this.$router.go(-1);
            }
        }
    }
</script>
