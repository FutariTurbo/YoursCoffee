<template>
    <div class="shopbag">
        <div class="navbar">
            <van-nav-bar
                title="购物袋"
                left-arrow
                :fixed="true"
                @click-right="editProduct"
                @click-left="goback"
            >
            <template #right v-if="productData.length > 0">
                <div>{{isEdit ? '完成' : '编辑'}}</div>
            </template>
            </van-nav-bar>
        </div>
        <div class="shopbag-adv" v-if="productData.length > 0"></div>
        <van-pull-refresh v-model="isLoading" success-text="刷新成功" @refresh="onRefresh">
            <div class="shopbag-swipe" v-for="(item, index) in productData" :key="index">
                <van-swipe-cell :disabled="!isEdit">
                    <van-cell :border="false">
                        <div class="porduct-item">
                            <div class="porduct-check">
                                <van-checkbox v-model="item.isCheck" icon-size="20px" checked-color="#549434" @change="check"></van-checkbox>
                            </div>
                            <div class="porduct-img">
                                <img class="auto-img" :src="item.small_img" alt="" >
                            </div>
                            <div class="porduct-info">
                                <div class="info-title">{{item.name}}</div>
                                <div class="info-specs">{{item.rule}}</div>
                                <div class="info-price">
                                    <div class="price">￥{{item.price}}</div>
                                    <div class="count">
                                        <van-stepper v-model="item.count" @change="updateCount(item)" theme="round" button-size="20" disable-input />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </van-cell>
                    <template #right>
                        <van-button square color="#549434" text="删除" @click="delectOneProduct(item.sid)"/>
                    </template>
                </van-swipe-cell>
            </div>
        </van-pull-refresh>
        
        <div v-if="productData.length > 0">
            <div class="submitbar" v-show="!isEdit">
                <van-submit-bar :price="total" button-text="提交订单" @submit="commit" >
                    <van-checkbox v-model="isAllCheck" checked-color="#549434" @click="allCheck">全选</van-checkbox>
                </van-submit-bar>
            </div>
            <div class="submitbar" v-show="isEdit">
                <van-submit-bar button-text="删除" @submit="delectAllProduct">
                    <van-checkbox v-model="isAllCheck" checked-color="#549434" @click="allCheck">全选</van-checkbox>
                </van-submit-bar>
            </div>
        </div>
        <div class="notshopbag" v-else>
            <van-empty
                class="custom-image"
                :image="require('../../assets/images/emptybag.png')"
                :description="isLogin ? '购物袋还是空的哦！' : '您还没登录，请先登录'"
            />
        </div>
    </div>
</template>

<script>
    import '../../assets/less/shopbag.less'
    import {utils} from '../../assets/js/utils'
    export default {
        name: 'Shopbag',
        data() {
            return {
                isCheck: false,
                isAllCheck: false,
                count:0,
                productData: [],
                isEdit: false,
                total: 0,
                isLoading: false,
                sids: [],
                isLogin: true
            }
        },
        created() {
            this.getShopbagData();
            // 
        },

        methods: {
            // 下拉刷新
            onRefresh(){
                setTimeout(() => {
                    this.getShopbagData();
                    this.isLoading = false;
                }, 1000)
            },
            // 提交订单
            commit(){
                let sids = [];
                this.productData.map(v => {
                    if(v.isCheck){
                        sids.push(v.sid);
                    }
                })
                sids = sids.join(',');
                this.$router.push({name: 'Order', query: {sids}});
            },
            // 是否编辑
            editProduct(){
                this.isEdit = !this.isEdit;
            },
            // 返回
            goback(){
                this.$router.go(-1)
            },
            // 获取购物袋商品数据
            getShopbagData(){
                let tokenString = localStorage.getItem('ctk');
                if(!tokenString){
                    this.isLogin = false;
                    return;
                }
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0
                })
                this.axios({
                    method: 'GET',
                    url: '/findAllShopcart',
                    params:{
                        appkey: this.appkey,
                        tokenString
                    }
                }).then(result => {
                    this.$toast.clear();
                    
                    if(result.data.code == 5000){
                        result.data.result.map(v => {
                            v.isCheck = false;
                        })
                        this.productData = result.data.result;
                    }
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            },
            // 单选
            check(){
                this.sum();
                for(let i = 0; i < this.productData.length; i++){
                    if(!this.productData[i].isCheck){
                        this.isAllCheck = false;
                        return;
                    }
                }
                this.isAllCheck = true;
            },
            // 全选
            allCheck(){
                this.productData.map(v => {
                    v.isCheck = this.isAllCheck;
                })
                this.sum();
            },

            // 修改商品数量
            updateCount(item){
                let tokenString = localStorage.getItem('ctk');
                if(!tokenString){
                    return;
                }
                let data = utils.queryString({
                    appkey: this.appkey,
                    tokenString,
                    sid: item.sid,
                    count: item.count
                })
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0
                })
                this.axios({
                    method: 'POST',
                    url: '/modifyShopcartCount',
                    data
                }).then(result => {
                    this.$toast.clear();
                    this.sum();
                    
                    if(result.data.code !== 6000){
                        this.$toast(result.data.msg);
                    }
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            },

            // 删除商品数据
            delectProduct(sids){
                let tokenString = localStorage.getItem('ctk');
                if (!tokenString) {
                    return;
                }
                //参数序列化
                let data = utils.queryString({
                    appkey: this.appkey,
                    tokenString,
                    sids: JSON.stringify(sids),
                })
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                })
                return this.axios({
                    method: 'POST',
                    url: '/deleteShopcart',
                    data
                })
            },

            // 删除单个商品
            delectOneProduct(sid, index){
                this.delectProduct([sid]).then(result => {
                    this.$toast.clear();
                    if (result.data.code == 7000) {
                        this.$toast.success(result.data.msg);
                        this.productData.splice(index, 1);
                    }
                    this.sum();
                }).catch(err => {
                    this.$toast.clear();
                })
            },
            // 删除所有商品
            delectAllProduct(){
                let sids = [];
                this.productData.map(v => {
                    if(v.isCheck){
                        sids.push(v.sid);
                    }
                })
                this.delectProduct(sids).then(result => {
                    this.$toast.clear();
                    if(result.data.code == 7000){
                        for(let i = this.productData.length - 1; i >= 0 ; i--){
                            if(this.productData[i].isCheck){
                                this.$toast.success(result.data.msg);
                                this.productData.splice(i, 1);
                            }
                        }
                    }
                    this.sum();
                }).catch(err => {
                    this.$toast.clear();
                })
            },

            // 合计
            sum(){
                this.total = 0;
                this.productData.map(v => {
                    if(v.isCheck){
                        this.total += v.count * v.price;
                    }
                })
                this.total *= 100;
            }
        }
    }
</script>
