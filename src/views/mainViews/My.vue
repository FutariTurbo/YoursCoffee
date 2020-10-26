<template>
    <div class="my">
        <div class="my-box">
            <div class="my-bg" :style="{backgroundImage: isLogin ? 'url('+ userInfo.userBg +' )' : 'url()'}">
                <van-uploader v-if="isLogin" class="uploader-box" :after-read="upload" />
            </div>
            <div v-if="isLogin">
                <div class="my-info-box" >
                    <div class="my-info">
                        <div class="info-img">
                            <img class="auto-img" :src="userInfo.userImg" alt="">
                        </div>
                        <div class="info-name">
                            <div class="name-title">{{userInfo.nickName}}</div>
                            <van-tag round color="#979797" type="primary">普通会员</van-tag>
                            <div class="name-introduce">{{userInfo.desc == '' ? '这家伙很懒，啥也没留下' : userInfo.desc}}</div>
                        </div>
                    </div>
                    <div>
                        <van-notice-bar left-icon="volume-o" color="#6d6d6d" background="#fff"
                            text="您有一个新的红包可领取" mode="closeable"
                        />
                    </div>
                </div>
                <div class="my-list">
                    <van-cell center :icon="item.icon" :title="item.title" :to="item.to" is-link  v-for="(item, index) in list" :key="index"/>
                </div>
            </div>
            <div class="not-login" v-else>
                未登录，请先登录
                <van-button color="#549434" plain size="small" @click="goLogin">去登录</van-button>
            </div>
        </div>
    </div>
</template>

<script>
    import '../../assets/less/my.less'
    import {utils} from '../../assets/js/utils'
    export default {
        name: 'My',
        data() {
            return {
                list: [
                    {title: '个人资料', icon: require('../../assets/images/personal.png'), to: {name: 'Account'}},
                    {title: '我的订单', icon: require('../../assets/images/order.png'), to: {name: 'Payorder'}},
                    {title: '我的收藏', icon: require('../../assets/images/like.png'), to: {name: 'Mylike'}},
                    {title: '地址管理', icon: require('../../assets/images/address.png'), to: {name: 'Address'}},
                    {title: '设置', icon: require('../../assets/images/install.png'), to: {name: 'Security'}},
                ],
                isLogin: true,
                userInfo: {},
                maxSize: 1 * 1024 * 1024
            }
        },
        created() {
            this.getUserInfo();
        },
        methods: {
            // 跳转到登录页
            goLogin(){
                this.$router.push({name: 'Login'})
            },
            // 获取用户信息
            getUserInfo(){
                let tokenString = localStorage.getItem('ctk');
                if(!tokenString){
                    this.isLogin = false
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
                        this.userInfo = result.data.result[0];
                    }
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            },
            // 上传背景
            upload(file){
                let tokenString = localStorage.getItem('ctk');
                if(!tokenString){
                    return this.$router.push({name: 'Login'});
                }

                let type = file.file.type.split('/')[1];
                let imgType = ['png', 'jpg', 'jpeg', 'gif'];
                if(imgType.indexOf(type) === -1){
                    this.$notify({
                        background: '#fef0f0',
                        color: '#f56c6c',
                        message: '图片只支持'+ imgType.join('，') + '格式'
                    });
                    return;
                }

                if(this.maxSize < file.file.size){
                    this.$notify({
                        background: '#fef0f0',
                        color: '#f56c6c',
                        message: '图片大小只支持'+ this.maxSize / 1024 + 'KB'
                    });
                    return;
                }
                let base64 = file.content.replace(/data:image\/[A-Za-z]+;base64,/, '');
                let data = utils.queryString({
                    appkey: this.appkey,
                    tokenString,
                    imgType: type,
                    serverBase64Img: base64
                })
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0
                })
                this.axios({
                    method: "POST",
                    url: '/updateUserBg',
                    data
                }).then(result => {
                    this.$toast.clear();
                    
                    if(result.data.code == 'I001'){
                        this.userInfo.userBg = result.data.userBg;
                    }
                    this.$toast.success(result.data.msg)
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            }
        }
    }
</script>

