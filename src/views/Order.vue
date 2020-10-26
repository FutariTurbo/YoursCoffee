<template>
    <div class="order">
        <div class="navbar">
            <van-nav-bar
                title="提交订单"
                left-arrow
                :fixed="true"
                @click-left="goback"
            />
        </div>
        <div class="order-adv"></div>
        <div class="order-address">
            <div class="address-box">
                <div class="choose-address" @click="isShowAddress">
                    <div class="addr-title">选择收货地址</div>
                    <div class="addr-arrow">
                        <van-icon name="arrow" class="arrow-icon" />
                    </div>
                </div>
                <div class="user-info">
                    <div class="info-title">{{currentAddress.address}}</div>
                    <div class="info-box">
                        <div class="info-name">{{currentAddress.name}}</div>
                        <div class="info-phone">{{currentAddress.tel}}</div>
                    </div>
                </div>
            </div>
            <div class="order-product">
                <div class="pro-list">
                    <div class="pro-item" v-for="(item, index) in shopbagData" :key="index">
                        <div class="porduct-img">
                            <img class="auto-img" :src="item.small_img" alt="">
                        </div>
                        <div class="porduct-info">
                            <div class="info-title-box">{{item.name}}</div>
                            <div class="info-item-box">
                                <div class="info-specs">{{item.rule}}</div>
                                <div class="info-count">x{{item.count}}</div>
                                <div class="info-price">￥{{item.price}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="line">
                    <div class="porduct-count">共计 <span class="num">{{sum.count}}</span> 件商品</div>
                </div>
                <div>
                    <van-submit-bar :price="sum.total" button-text="结算" @submit="isOpenPassword"/>
                    <van-popup v-model="isShow" closeable position="bottom" >
                        <van-address-list
                            v-model="chosenAddressId"
                            :list="list"
                            default-tag-text="默认"
                            @select="selectAddress"
                            @add="newAddress"
                            @edit="editAddress"
                        />
                    </van-popup>
                </div>
            </div>
        </div>
        <div>
            <van-popup
                v-model="isOpen"
                closeable
                position="bottom"
                :style="{ height: '60%' }"
                round>
                <div>
                    <!-- 密码输入框 -->
                    <van-password-input
                        :value="value"
                        info="密码为 6 位数字"
                        :focused="showKeyboard"
                        @focus="showKeyboard = true"
                    />
                    <!-- 数字键盘 -->
                    <van-number-keyboard
                        :show="showKeyboard"
                        @input="onInput"
                        @delete="onDelete"
                        @blur="showKeyboard = false"
                    />
                </div>
            </van-popup>
        </div>
    </div>
</template>

<script>
    import '../assets/less/order.less'
    import { utils } from '../assets/js/utils';
    export default {
        data() {
            return {
                isShow: false,
                chosenAddressId: '',
                list: [],
                currentAddress: {
                    name: '',
                    tel: '',
                    address: ''
                },
                sids: [],
                shopbagData: [],
                sum:{
                    count: 0,
                    total: 0
                },
                value: '',
                showKeyboard: true,
                isOpen: false
            }
        },
        created() {
            this.sids = this.$route.query.sids.split(',');
            this.getReceiveAddress();
            this.getShopbagDataSids();
        },
        methods: {
            // 打开密码框
            isOpenPassword(){
                this.isOpen = true;
            },
            // 打开键盘输入密码支付
            onInput(key) {
                this.value = (this.value + key).slice(0, 6);
                if (this.value.length === 6) {
                    this.pay();
                }
            },
            // 删除密码
            onDelete() {
                this.value = this.value.slice(0, this.value.length - 1);
            },
            // 返回购物袋
            goback(){
                this.$router.push({name: 'Shopbag'})
            },
            // 打开地址选择
            isShowAddress(){
                this.isShow = true;
            },
            // 查询地址
            selectAddress(item, index){
                this.isShow = false;
                for(let key in this.currentAddress){
                    this.currentAddress[key] = item[key]
                }
            },
            // 新增地址
            newAddress(){
                this.$router.push({name: 'NewAddress'})
            },
            //编辑地址
            editAddress(item) {
                
                this.$router.push({name: 'NewAddress', query: {aid: item.id}});
            },
            // 获取收货地址
            getReceiveAddress(){
                let tokenString = localStorage.getItem('ctk');
                if(!tokenString){
                    return this.$router.push({name: 'Login'});
                }
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0
                })
                this.axios({
                    method: 'GET',
                    url: '/findAddress',
                    params: {
                        appkey: this.appkey,
                        tokenString
                    }
                }).then(result => {
                    this.$toast.clear();
                    
                    if(result.data.code == 20000){
                        result.data.result.map(v => {
                            let address = v.province + v.city + v.county + v.addressDetail;
                            this.list.push({
                                id: v.aid,
                                name: v.name,
                                tel: v.tel,
                                address,
                                isDefault: Boolean(v.isDefault)
                            })
                            if(Boolean(v.isDefault)){
                                this.chosenAddressId = v.aid,
                                this.currentAddress.name = v.name,
                                this.currentAddress.tel = v.tel,
                                this.currentAddress.address = address
                            }
                        })
                    }
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            },
            // 获取购物袋的商品id
            getShopbagDataSids(){
                let tokenString = localStorage.getItem('ctk');
                if(!tokenString){
                    return this.$router.push({name: 'Login'});
                }
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0
                })
                this.axios({
                    method: 'GET',
                    url: '/commitShopcart',
                    params: {
                        appkey: this.appkey,
                        tokenString,
                        sids: JSON.stringify(this.sids)
                    }
                }).then(result => {
                    this.$toast.clear();
                    
                    if(result.data.code == 50000){
                        if (result.data.result.length === 0) {
                            return this.$router.push({name: 'Shopbag'});
                        }
                        result.data.result.map(v => {
                            this.sum.count += v.count;
                            this.sum.total += v.count * v.price;
                        })
                        this.sum.total *= 100;
                        this.shopbagData = result.data.result;
                    }
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            },
            // 结算
            pay(){
                if(this.chosenAddressId == ''){
                    this.$toast('请选择收货地址');
                    // this.isShow = true;
                    return;
                }
                let tokenString = localStorage.getItem('ctk');
                if(!tokenString){
                    return this.$router.push({name: 'Login'});
                }

                let data = utils.queryString({
                    appkey: this.appkey,
                    tokenString,
                    sids: JSON.stringify(this.sids),
                    phone: this.currentAddress.tel,
                    address: this.currentAddress.address,
                    receiver: this.currentAddress.name
                })
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0
                })
                this.axios({
                    method: 'POST',
                    url: '/pay',
                    data
                }).then(result => {
                    this.$toast.clear();
                    
                    this.$toast.success(result.data.msg);
                    if(result.data.code == 60000){
                        setTimeout(() => {
                            this.$router.push({name: 'Payorder'});
                        }, 800);
                    }
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            }
        }
    }
</script>
