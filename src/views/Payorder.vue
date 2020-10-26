<template>
    <div class="payorder">
        <div class="navbar">
            <van-nav-bar
                title="订单列表"
                left-arrow
                :fixed="true"
                @click-left="goback"
            />
        </div>
        <van-tabs color="#549434" title-active-color="#549434" v-model="tabIndex" @change="toggleTabs">
            <van-tab :title="v.title" v-for="(v, i) in tabsList" :key="i" >
                <div class="product" v-if="orderData.length > 0">
                    <div class="pro-list" v-for="(item, index) in orderData" :key="index">
                        <div class="state-box">
                            <div class="bg"></div>
                            <div class="bg-box"></div>
                            <div class="order-num">订单号：{{item.orderId}}</div>
                            <div class="order-state" v-if="item.status == 1">进行中</div>
                            <div class="finish-box" v-else>
                                <div class="state-finish">已完成</div>
                                <div class="finish-icon" @click="deleteOrder(item.orderId, index)"></div>
                            </div>
                        </div>
                        <div class="order-time">{{item.date | formatDate('yyyy-MM-dd hh:mm')}}</div>
                        <div class="pro-item" v-for="(value, i) in item.products" :key="i">
                            <div class="porduct-info">
                                <div>
                                    <img class="info-img" :src="value.smallImg" alt="">
                                </div>
                                <div class="info-box">
                                    <div class="pay-title">
                                        <div class="info-title-box">{{value.name}}</div>
                                    </div>
                                    <div class="info-item-box">
                                        <div class="info-specs">{{value.rule}}</div>
                                        <div class="info-count">x{{value.count}}</div>
                                        <div class="info-price">￥{{value.price}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="price-box">
                            <div class="porduct-count">共 <span class="num">{{item.count}}</span> 件商品</div>
                            <div class="pay">已付款:<span class="pay-price">￥{{item.total}}</span></div>
                            <div v-if="item.status == 1">
                                <van-button @click="receiveOrder(item, index)" color="#549434" plain size="small">确认收货</van-button>
                            </div>
                            <van-button v-else color="#549434" plain size="small" @click="agingOrder(item.pid)">再来一单</van-button>
                        </div>
                    </div>
                </div>
                <div class="notshopbag" v-else>
                    <van-empty
                        class="custom-image"
                        :image="require('../assets/images/emptyorder.png')"
                        description="订单还是空的哦！"
                    />
                </div>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
    import '../assets/less/payorder.less'
    import {utils} from '../assets/js/utils'
    export default {
        data() {
            return {
                tabIndex: 0,
                orderData: [],
                tabsList: [
                    {title: '全部'},
                    {title: '未完成'},
                    {title: '已完成'}
                ]
            }
        },
        created() {
            this.getOrderData(0);
        },
        methods: {
            // 返回上一级
            goback(){
                this.$router.go(-1)
            },
            // 再来一单
            agingOrder(pid){
                this.$router.push({name: 'Detail', query:{pid}})
            },
            // 获取订单数据
            getOrderData(status) {
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
                    url: '/findOrder',
                    params: {
                        appkey: this.appkey,
                        tokenString,
                        status
                    }
                }).then(result => {
                    this.orderData = [];
                    this.$toast.clear();
                    if (result.data.code == 70000) {
                        let orderList = {};
                        result.data.result.map(v => {
                            if (!orderList[v.oid]) {
                                //如果不存在该订单数据，则初始化一个对象
                                orderList[v.oid] = {
                                    orderId: v.oid,
                                    date: v.createdAt,
                                    count: v.count,
                                    total: v.count * v.price,
                                    products: [v],
                                    status: v.status,
                                    pid: v.pid
                                }
                            } else {
                                orderList[v.oid].count += v.count;
                                orderList[v.oid].total += v.count * v.price;
                                orderList[v.oid].products.push(v);
                            }
                        })
                        for (let key in orderList) {
                            this.orderData.push(orderList[key]);
                        }
                        this.orderData.sort((a, b) => {
                            return a.status - b.status;
                        })
                    }
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            },
            // 切换tab栏
            toggleTabs(name){
                this.getOrderData(name);
            },
            // 确认收货
            receiveOrder(item, index){
                let tokenString = localStorage.getItem('ctk');
                if(!tokenString){
                    return this.$router.push({name: 'Login'});
                }
                let data = utils.queryString({
                    appkey: this.appkey,
                    tokenString,
                    oid: item.orderId
                })
                
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0
                })

                this.axios({
                    method: 'POST',
                    url: '/receive',
                    data
                }).then(result => {
                    this.$toast.clear();
                    
                    if(result.data.code == 80000){
                        this.$toast.success(result.data.msg);
                        if(this.tabIndex == 1){
                            this.orderData.splice(index, 1)
                        }else{
                            item.status = 2;
                        }
                    }
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            },
            // 删除订单
            deleteOrder(oid, index){
                this.$dialog.confirm({
                    title: "删除订单",
                    message: "确定要删除订单吗？",
                    confirmButtonColor: "#549434",
                    confirmButtonText: '残忍丢弃',
                    cancelButtonText: '我再想想'
                }).then(() =>{
                    let tokenString = localStorage.getItem('ctk');
                    if(!tokenString){
                        return this.$router.push({name: 'Login'});
                    }
                    let data = utils.queryString({
                        appkey: this.appkey,
                        tokenString,
                        oid
                    })
                    
                    this.$toast.loading({
                        message: '加载中...',
                        forbidClick: true,
                        duration: 0
                    })

                    this.axios({
                        method: 'POST',
                        url: '/removeOrder',
                        data
                    }).then(result => {
                        this.$toast.clear();
                        
                        if(result.data.code == 90000){
                            this.$toast.success(result.data.msg);
                            this.orderData.splice(index, 1);
                        }
                    }).catch(err => {
                        this.$toast.clear();
                        
                    })
                })
            }
        }
    }
</script>

