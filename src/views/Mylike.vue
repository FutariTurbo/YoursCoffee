<template>
    <div class="mylike">
        <div class="navbar">
            <van-nav-bar
                title="收藏"
                left-arrow
                :fixed="true"
                @click-left="goback"
            />
        </div>
        <div class="bg-box">
            <div class="bg-boxs"></div>
            <div class="bg"></div>
        </div>
        <div class="menu-product">
            <div class="product-list" v-if="likeData.length > 0">
                <div class="product-item" v-for="(item, index) in likeData" :key="index" >
                    <div class="p-img">
                        <img class="auto-img" :src="item.smallImg" alt="">
                    </div>
                    <div class="p-content">
                        <div>
                            <div class="p-title">{{item.name}}</div>
                            <div class="p-enname">{{item.enname}}</div>
                        </div>
                        <div class="p-price" @click="cancelLike(item.pid, index)">取消收藏</div>
                    </div>
                </div>
            </div>
            <div class="notshopbag" v-else>
                <van-empty
                    class="custom-image"
                    :image="require('../assets/images/emptylike.png')"
                    description="收藏商品还是空的哦！"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import '../assets/less/mylike.less'
    import {utils} from '../assets/js/utils'
    export default {
        data() {
            return {
                likeData:[]
            }
        },
        created() {
            this.getAllLike();
        },
        methods: {
            // 返回上一级
            goback(){
                this.$router.go(-1)
            },
            // 获取所有收藏的商品
            getAllLike(){
                let tokenString = localStorage.getItem('ctk');
                    if (!tokenString) {
                    return this.$router.push({name: 'Login'});
                }
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                })
                this.axios({
                    method: 'GET',
                    url: '/findAllLike',
                    params: {
                        appkey: this.appkey,
                        tokenString,
                    }
                }).then(result => {
                    this.orderDatas = [];
                    this.$toast.clear();
                    
                    if (result.data.code == 2000) {
                        this.likeData = result.data.result;
                    }
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            },
            // 取消收藏商品
            cancelLike(pid, index){
                let tokenString = localStorage.getItem('ctk');
                    if (!tokenString) {
                    return this.$router.push({name: 'Login'});
                }
                let data = utils.queryString({
                    appkey: this.appkey,
                    tokenString,
                    pid
                })
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                })
                this.axios({
                    method: 'POST',
                    url: '/notlike',
                    data
                }).then(result => {
                    this.orderDatas = [];
                    this.$toast.clear();
                    
                    if (result.data.code == 900) {
                        this.$toast.success(result.data.msg);
                        this.likeData.splice(index, 1);
                    }
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            }
        }
    }
</script>

