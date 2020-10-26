<template>
    <div class="security">
        <div class="navbar">
            <van-nav-bar
                title="设置"
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
                <van-cell title="修改密码" center @click="openPassword">
                    <template #right-icon>
                        <van-icon name="arrow" class="list-icon" />
                    </template>
                </van-cell>
                <van-cell title="注销账号" center @click="destroyAccount">
                    <template #right-icon>
                        <van-icon name="arrow" class="list-icon" />
                    </template>
                </van-cell>
                
            </div>
            <div class="btn">
                <van-button plain block color="#549434" @click="logout">退出登录</van-button>
            </div>
            <div>
                <van-popup v-model="isOpen" round closeable  position="bottom">
                    <div class="update-password">
                        <div class="update-text">修改密码</div>
                        <van-form>
                            <van-field
                                v-for="(item, index) in password"
                                :key="index"
                                v-model="item.password"
                                :type="item.isPassword ? 'password' : 'text'"
                                :label="item.title"
                                placeholder="请输入6-16位密码"
                                :right-icon="item.isPassword ? 'closed-eye' : 'eye-o'"
                                @click-right-icon="toggleEye(item)"
                            />
                        </van-form>
                        <div class="update-btn">
                            <van-button block color="#549434" @click="updatePassword">确认修改</van-button>
                        </div>
                    </div>
                </van-popup>
            </div>
        </div>
    </div>
</template>

<script>
    import '../assets/less/security.less'
    import { validForm } from "../assets/js/validForm"
    import {utils} from '../assets/js/utils'
    export default {
        data() {
            return {
                isOpen: false,
                password: {
                    old: {
                        password: '',
                        isPassword: true,
                        title: '旧密码'
                    },
                    new: {
                        password: '',
                        isPassword: true,
                        title: '新密码'
                    }
                }
            }
        },
        methods: {
            // 返回上一级
            goback(){
                this.$router.go(-1)
            },
            // 显示密码
            toggleEye(item){
                item.isPassword = !item.isPassword;
            },
            // 打开修改密码
            openPassword(){
                this.isOpen = true;   
            },
            // 修改密码
            updatePassword(){
                let tokenString = localStorage.getItem('ctk');
                    if (!tokenString) {
                    return this.$router.push({name: 'Login'});
                }
                let o = {
                    oldPassword: {
                        value: this.password.old.password,
                        reg: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
                        errorMsg: '旧密码不正确'
                    },
                    newPassword: {
                        value: this.password.new.password,
                        reg: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
                        errorMsg: '新密码格式不正确'
                    }
                }

                if(!validForm.valid(o)){
                    return;
                }

                let data = utils.queryString({
                    appkey: this.appkey,
                    tokenString,
                    password: this.password.new.password,
                    oldPassword: this.password.old.password
                })
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                })
                this.axios({
                    method: 'POST',
                    url: '/updatePassword',
                    data
                }).then(result => {
                    this.$toast.clear();
                    
                    if(result.data.code == 'E001'){
                        this.$toast.success(result.data.msg);
                        setTimeout(() => {
                            this.$router.push({name: 'Login'});
                        }, 500);
                    }
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            },
            // 退出登录
            logout(){
                this.$dialog.confirm({
                    title: "退出登录",
                    message: "确定要退出登录吗？",
                    confirmButtonColor: "#549434",
                }).then(() =>{
                    this.$toast.loading({
                        message: "加载中...",
                        forbidClick: true,
                        duration: 0,
                    })
                    localStorage.removeItem('ctk');
                    this.$toast.success('退出登录成功！');
                    setTimeout(() => {
                        this.$toast.clear();
                        this.$router.push({name: 'Login'});
                    }, 600);
                })
            },
            // 注销账号
            destroyAccount(){
                let tokenString = localStorage.getItem('ctk');
                    if (!tokenString) {
                    return this.$router.push({name: 'Login'});
                }
                this.$dialog.confirm({
                    title: "注销账号",
                    message: "确定要注销账号吗？一旦确认将删除所有东西，无法恢复哦！",
                    confirmButtonColor: "#549434",
                    confirmButtonText: '残忍丢弃',
                    cancelButtonText: '我再想想'
                }).then(() =>{
                    this.$toast.loading({
                        message: "加载中...",
                        forbidClick: true,
                        duration: 0,
                    })

                    let data = utils.queryString({
                        appkey: this.appkey,
                        tokenString
                    })
                    this.axios({
                        method: 'POST',
                        url: '/destroyAccount',
                        data
                    }).then(result => {
                        this.$toast.clear();
                        
                        this.$toast.success(result.data.msg);
                        if(result.data.code == 'G001'){
                            localStorage.removeItem('ctk');
                            setTimeout(() => {
                                this.$router.push({name: 'Login'});
                            }, 600);
                        }
                    }).catch(err => {
                        this.$toast.clear();
                        
                    })
                }).catch(() => {
                    
                })
            }
        }
    }
    
</script>
