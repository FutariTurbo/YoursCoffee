<template>
    <div class="newAddress">
        <div class="navbar">
            <van-nav-bar
                :title="aid ? '编辑地址' :'新增地址'"
                left-arrow
                :fixed="true"
                @click-left="goback"
            />
        </div>
        <van-address-edit
            :area-list="areaList"
            show-postal
            :show-delete="!!aid"
            show-set-default
            :address-info="addressInfo"
            :area-columns-placeholder="['请选择', '请选择', '请选择']"
            @save="saveAddress"
            @delete="deleteAddress"
        />
    </div>
</template>

<script>
    import '../assets/less/newAddres.less'
    import areaList from '../assets/js/arealist'
    import {utils} from '../assets/js/utils'
    export default {
        data() {
            return {
                areaList,
                addressInfo: {
                    id: '',
                    name: '',
                    tel: '',
                    province: '',
                    city: '',
                    county: '',
                    addressDetail: '',
                    areaCode: '',
                    postalCode: '',
                    isDefault: false
                },
                aid: ''
            }
        },
        created() {
            this.aid = this.$route.query.aid;
            if(this.aid){
                this.getAddressDataAid();
            }
        },
        methods: {
            // 返回上一级
            goback(){
                this.$router.push({name: 'My'});
            },
            // 新增地址
            newAddress(address) {
                let content = Object.assign({}, address);
                //获取token字符串
                let tokenString = localStorage.getItem('ctk');
                if (!tokenString) {
                    return this.$router.push({name: 'Login'});
                }
                delete content.id;
                delete content.country;
                content.isDefault = Number(content.isDefault);
                content.appkey = this.appkey;
                content.tokenString = tokenString

                //参数序列化
                let data = utils.queryString(content);
                
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                })
                this.axios({
                    method: 'POST',
                    url: '/addAddress',
                    data
                }).then(result => {
                    this.$toast.clear();
                    
                    if(result.data.code == 9000){
                        this.$toast.success(result.data.msg);
                        setTimeout(() =>{
                            this.$router.go(-1)
                        }, 500)
                    }
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            },
            // 编辑地址
            editAddress(content){
                //获取token字符串
                let tokenString = localStorage.getItem('ctk');
                if (!tokenString) {
                    return this.$router.push({name: 'Login'});
                }
                let isEdit = false;
                for(let key in this.addressInfo){
                    if(this.addressInfo[key] != content[key]){
                        isEdit = true;
                        break;
                    }
                }
                if(isEdit){
                    let addressData = Object.assign({}, content);
                    delete addressData.id;
                    delete addressData.country;
                    addressData.aid = this.aid;
                    addressData.isDefault = Number(addressData.isDefault);
                    addressData.appkey = this.appkey;
                    addressData.tokenString = tokenString
                    // 参数序列化
                    let data = utils.queryString(addressData);
                    
                    this.$toast.loading({
                        message: '加载中...',
                        forbidClick: true,
                        duration: 0,
                    })
                    this.axios({
                        method: 'POST',
                        url: '/editAddress',
                        data
                    }).then(result => {
                        this.$toast.clear();
                        
                        if(result.data.code == 30000){
                            this.$toast.success(result.data.msg);
                            setTimeout(() =>{
                                this.$router.go(-1);
                            }, 500)
                        }
                    }).catch(err => {
                        this.$toast.clear();
                        
                    })
                }else{
                    this.$router.push({name: 'Address'})
                }
            },
            // 判断是新增还是编辑
            saveAddress(address){
                if(this.aid){
                    this.editAddress(address);
                }else {
                    this.newAddress(address);
                }
            },
            // 获取地址的id
            getAddressDataAid(){
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
                    url: '/findAddressByAid',
                    params: {
                        appkey: this.appkey,
                        tokenString,
                        aid: this.aid
                    }
                }).then(result => {
                    this.$toast.clear();
                    
                    if(result.data.code == 40000){
                        for (let key in this.addressInfo) {
                            if (key == 'id') {
                                this.addressInfo[key] = result.data.result[0].aid;
                                continue;
                            }
                            let resultData = result.data.result[0][key]
                            this.addressInfo[key] = key == 'isDefault' ? Boolean(resultData) : resultData;
                        }
                    }
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            },
            // 删除地址
            deleteAddress(){
                let tokenString = localStorage.getItem('ctk');
                if (!tokenString) {
                    return this.$router.push({name: 'Login'});
                }
                let data = utils.queryString({
                    appkey: this.appkey,
                    tokenString,
                    aid: this.aid
                })
                this.$toast.loading({
                        message: '加载中...',
                        forbidClick: true,
                        duration: 0,
                })
                this.axios({
                    method: 'POST',
                    url: '/deleteAddress',
                    data
                }).then(result => {
                    this.$toast.clear();
                    
                    if(result.data.code == 10000){
                        this.$toast.success(result.data.msg);
                        setTimeout(() =>{
                            this.$router.go(-1);
                        }, 500)
                    }
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            }
        }
    }
</script>

