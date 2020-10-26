<template>
    <div class="detail">
        <div class="detail-header">
            <img class="auto-img" :src="productData.large_img" alt="">
        </div>
        <div class="detail-info">
            <div class="specs-box">
                <div class="sp-name">
                    {{productData.name}}
                    <van-icon class="cloes" name="cross" @click="closeDetail" />
                </div>
                <div class="sp-enname">{{productData.enname}}</div>
                <div class="specs-item">
                    <div class="sp-content" v-for="(item, index) in productData.specs" :key="index">
                        <div class="sp-title">{{item.title}}</div>
                        <div class="sp-option">
                            <div class="sp-info" :class="{active: val.isActive}" @click="toggleSpecs(val,index)" v-for="(val, i) in item.specs" :key="i">{{val.titleName}}</div>
                        </div>
                    </div>
                </div>
                <div class="price clearfix">
                    <div class="sp-price fl">￥{{productData.price}}</div>
                    <div class="sp-stepper fr">
                        <van-stepper v-model="count" theme="round" button-size="22" disable-input />
                    </div>
                </div>
                <div class="sp-desc">
                    <div class="desc-title">商品描述</div>
                    <div class="desc-info" v-for="(item, index) in productData.desc" :key="index">{{item}}</div>
                </div>
            </div>
        </div>
        <div class="goods-action">
            <van-goods-action>
                <van-goods-action-icon icon="like" text="喜欢" :color="isLike ? '#549434' : '#c0c0c0'"  @click="likeAndNotlike" />
                <van-goods-action-icon icon="bag" text="购物袋" color="#c0c0c0" :badge="badge == 0 ? '' : badge" @click="goShopbag"/>
                <van-goods-action-button
                    text="立即结算"
                    @click="buyNow"
                />
                <van-goods-action-button
                    color="#549434"
                    text="加入购物袋"
                    @click="addShopbag"
                />
            </van-goods-action>
        </div>
    </div>
</template>

<script>
    import '../assets/less/detail.less'
    import{utils} from '../assets/js/utils'
    export default {
        data() {
            return {
                pid: '',
                productData: {},
                count: 0,
                isLike: false,
                badge: 0
            }
        },
        created() {
            this.pid = this.$route.query.pid;
            this.getProductPid();
            this.selectLike();
            this.selectShopbag();
        },

        methods: {
            // 返回上一页面
            closeDetail(){
                this.$router.go(-1);
            },

            // 获取商品id
            getProductPid(){
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0
                })
                this.axios({
                    method: 'GET',
                    url: '/productDetail',
                    params: {
                        appkey: this.appkey,
                        pid: this.pid
                    }
                }).then(result => {
                    this.$toast.clear();
                    
                    if (result.data.code == 600) {
                        let specsItems = ['tem', 'sugar', 'cream', 'milk'];
                        let specsData = [];
                        specsItems.map(v => {
                            if(result.data.result[0][v] == ''){
                                return;
                            }

                            let spec = {
                                title: result.data.result[0][v + '_desc'],
                                specs: []
                            }

                            let sp = result.data.result[0][v].split('/');
                            sp.map((value, index) => {
                                let o ={
                                    titleName: value,
                                    isActive: index == 0
                                }
                                spec.specs.push(o);
                            })
                            specsData.push(spec);
                        })
                        result.data.result[0].specs = specsData;
                        result.data.result[0].desc = result.data.result[0].desc.split(/\n/);
                        this.productData = result.data.result[0];
                    }
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            },
            // 切换规格
            toggleSpecs(val,index){
                if(val.isActive){
                    return;
                }
                let specData = this.productData.specs[index].specs;

                for(let i = 0; i < specData.length; i++){
                    if(specData[i].isActive){
                        specData[i].isActive = false;
                        break;
                    }
                }
                val.isActive = true;
            },
            
            // 查找是否收藏
            selectLike(){
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
                    url: '/findlike',
                    params: {
                        appkey: this.appkey,
                        tokenString,
                        pid: this.pid
                    }
                }).then(result => {
                    this.$toast.clear();
                    
                    if(result.data.code == 1000){
                        if(result.data.result.length == 1){
                            this.isLike = true;
                        }
                    }
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            },

            // 收藏和没有收藏
            likeAndNotlike(){
                let tokenString = localStorage.getItem('ctk');
                if(!tokenString){
                    return this.$router.push({name: 'Login'});
                }

                let data = utils.queryString({
                    appkey: this.appkey,
                    pid: this.pid,
                    tokenString
                })

                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0
                })
                let url = this.isLike ? '/notlike' : '/like';
                this.axios({
                    method: 'POST',
                    url,
                    data
                }).then(result => {
                    this.$toast.clear();
                    
                    if(result.data.code == 700){
                        return this.$router.push({name: 'Login'});
                    }
                    this.$toast.success(result.data.msg);

                    if(result.data.code == 800){
                        this.isLike = true;
                    }else if(result.data.code == 900){
                        this.isLike = false;
                    }
                    
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            },

            // 加入购物袋
            addShopbag(isBuy){
                let tokenString = localStorage.getItem('ctk');
                if(!tokenString){
                    return this.$router.push({name: 'Login'});
                }
                //获取选择的规格
                let specs = this.productData.specs;
                let spec = [];
                specs.map(v => {
                    for (let i = 0; i < v.specs.length; i++) {
                        if (v.specs[i].isActive) {
                            spec.push(v.specs[i].titleName);
                            break;
                        }
                    }
                })

                //序列化参数
                let data = utils.queryString({
                    appkey: this.appkey,
                    pid: this.pid,
                    count: this.count,
                    rule: spec.join('-'),
                    tokenString
                })
                
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0
                })
                this.axios({
                    method: 'POST',
                    url: '/addShopcart',
                    data
                }).then(result => {
                    this.$toast.clear();
                    
                    this.$toast.success(result.data.msg);
                    if(result.data.code == 3000){
                        if(result.data.status == 1){
                            this.badge++;
                        }
                        if(isBuy === true){
                            setTimeout(() => {
                                this.$router.push({name: 'Order', query: {sids: result.data.sid}});
                            }, 600);
                        }
                    }
                }).catch(err => {
                    this.$toast.clear();
                    
                })

            },

            // 查询购物袋数目
            selectShopbag(){
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
                    url: '/findAllShopcart',
                    params: {
                        appkey: this.appkey,
                        tokenString
                    }
                }).then(result => {
                    this.$toast.clear();
                    
                    if(result.data.code == 5000){
                        this.badge = result.data.result.length;
                    }else{
                        this.$toast(result.data.msg);
                    }
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            },
            // 跳转到购物袋
            goShopbag(){
                this.$router.push({name: 'Shopbag'});
            },
            // 立即购买
            buyNow(){
                this.addShopbag(true);
            }
        }
    }
</script>
