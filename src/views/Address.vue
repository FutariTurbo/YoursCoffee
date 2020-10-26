<template>
    <div class="address">
        <div class="address-box">
            <div class="navbar">
                <van-nav-bar
                    title="地址管理"
                    left-arrow
                    :fixed="true"
                    @click-left="goback"
                />
            </div>
            <div v-if="list.length > 0">
                <van-address-list
                    v-model="chosenAddressId"
                    :list="list"
                    default-tag-text="默认"
                    @add="newAddress"
                    @edit="editAddress"
                />
            </div>
            <div class="notshopbag" v-else>
                <van-empty
                    class="custom-image"
                    :image="require('../assets/images/emptyaddress.png')"
                    description="地址还是空的哦！"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import '../assets/less/address.less'
    export default {
        data() {
            return {
                chosenAddressId: '',
                list: [],
            }
        },
        created() {
            this.getReceiveAddress();
        },
        methods: {
            // 返回上一级
            goback(){
                this.$router.go(-1);
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
                        })
                    }
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            },

            //新增地址
            newAddress() {
                this.$router.push({name: 'NewAddress'});
            },

            //编辑地址
            editAddress(item) {
                
                this.$router.push({name: 'NewAddress', query: {aid: item.id}});
            }
        }
    }
</script>

