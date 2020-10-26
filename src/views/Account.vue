<template>
    <div class="account">
        <div class="navbar">
            <van-nav-bar
                title="个人资料"
                left-arrow
                :fixed="true"
                @click-left="goback"
            />
        </div>
        <div class="bg-box">
            <div class="bg-boxs"></div>
            <div class="bg"></div>
        </div>
        <div class="account-list">
            <div class="list-item">
                <van-cell title="头像" center clickable>
                    <div class="user-img fr">
                        <img class="auto-img" :src="userInfo.userImg" alt="">
                        <van-uploader class="uploader-box" :after-read="uploadImg" />
                    </div>
                    <template #right-icon>
                        <van-icon name="arrow" class="list-icon" />
                    </template>
                </van-cell>
                <van-cell title="用户账号" center clickable :value="userInfo.userId">
                    <template #right-icon>
                        <van-icon name="arrow" class="list-icon" />
                    </template>
                </van-cell>
                <van-cell title="昵称" clickable center>
                    <div>
                        <van-field class="nickname" maxlength="5" type="text" v-model="userInfo.nickName" @change="updateUserInfo('nickName', '/updateNickName')" />
                    </div>
                    <template #right-icon>
                        <van-icon name="arrow" class="list-icon" />
                    </template>
                </van-cell>
                <van-cell title="手机号" center clickable :value="userInfo.phone">
                    <template #right-icon>
                        <van-icon name="arrow" class="list-icon" />
                    </template>
                </van-cell>
                <van-cell title="简介" center clickable>
                    <template #right-icon>
                        <van-icon name="arrow" class="list-icon" />
                    </template>
                </van-cell>
                <div>
                    <textarea @change="updateUserInfo('desc', '/updateDesc')" v-model="userInfo.desc" class="textarea" placeholder="这家伙很懒，什么也没留下"></textarea>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import '../assets/less/account.less'
    import {utils} from '../assets/js/utils'
    export default {
        data() {
            return {
                userInfo: {},
                maxSize: 1 * 1024 * 1024
            }
        },
        created() {
            this.getUserInfo();
        },
        methods: {
            // 返回上一级
            goback(){
                this.$router.go(-1);
            },
            // 获取用户信息
            getUserInfo(){
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
                    url: '/findAccountInfo',
                    params:{
                        appkey: this.appkey,
                        tokenString
                    }
                }).then(result => {
                    this.$toast.clear();
                    
                    if(result.data.code == 'B001'){
                        this.userInfo = result.data.result[0];
                    }
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            },
            // 上传头像
            uploadImg(file){
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
                    url: '/updateAvatar',
                    data
                }).then(result => {
                    this.$toast.clear();
                    
                    if(result.data.code == 'H001'){
                        this.userInfo.userImg = result.data.userImg;
                    }
                    this.$toast.success(result.data.msg)
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            },
            // 修改用户信息
            updateUserInfo(key, url){
                let tokenString = localStorage.getItem('ctk');
                if(!tokenString){
                    return this.$router.push({name: 'Login'});
                }
                let data = utils.queryString({
                    appkey: this.appkey,
                    tokenString,
                    [key]: this.userInfo[key]
                })
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0
                })
                this.axios({
                    method: "POST",
                    url,
                    data
                }).then(result => {
                    this.$toast.clear();
                    
                    this.$toast.success(result.data.msg)
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            }
        }
    }
</script>

