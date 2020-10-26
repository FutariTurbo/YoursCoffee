<template>
    <div class="login">
        <div class="login-box">
            <van-nav-bar :border="false" @click-right="backHome">
                <template #left>
                    <div class="logo">
                        <div class="logo-icon"></div>
                        <div class="logo-title">
                            Yuor.s Coffee
                            <div class="logo-cname">约氏咖啡</div>
                        </div>
                    </div>
                </template>
                <template #right>
                    <div class="close">
                        <van-icon name="cross"/>
                    </div>
                </template>
            </van-nav-bar>
            <div class="login-content">
                <div class="content-title">欢迎登录！</div>
                <div class="content-info">
                    Please login to your <br/> accounts
                </div>
            </div>
            <div class="login-form">
                <van-form>
                    <van-field
                        label="手机号"
                        placeholder="请输入手机号"
                        v-model="userLogin.phone"
                    />
                    <van-field
                        v-model="userLogin.password"
                        :type="isPassword ? 'password' : 'text'"
                        label="密码"
                        placeholder="请输入6-16位密码"
                        :right-icon="isPassword ? 'closed-eye' : 'eye-o'"
                        @click-right-icon="toggleEye"
                    />
                    <div class="forgot fr clearfix">
                        <span @click="goForgotpassword">忘记密码？</span>
                    </div>
                    <div class="login-btn">
                        <van-button color="#549434" block native-type="submit" @click="login">登录</van-button>
                        <van-button block type="default" @click="showRegister">注册</van-button>
                    </div>
                </van-form>
            </div>
        </div>
        <div class="register">
            <van-popup v-model="isShow" closeable round position="bottom" :style="{ height: '50%' }" >
                <div class="register-box">
                    <div class="register-box-title">注册</div>
                    <van-form>
                        <van-field
                            label="昵称"
                            placeholder="请输入昵称"
                            v-model="userRegister.nickName"
                        />
                        <van-field
                            label="手机号"
                            placeholder="请输入手机号"
                            v-model="userRegister.phone"
                        />
                        <van-field
                            v-model="userRegister.password"
                            :type="isPassword ? 'password' : 'text'"
                            label="密码"
                            placeholder="请输入6-16位密码"
                            :right-icon="isPassword ? 'closed-eye' : 'eye-o'"
                            @click-right-icon="toggleEye"
                        />
                    </van-form>
                    <div class="register-btn">
                        <van-button @click="register" color="#549434" block native-type="submit">注册</van-button>
                    </div>
                </div>
            </van-popup>
        </div>
    </div>
</template>

<script>
    import "../assets/less/login.less"
    import {utils} from '../assets/js/utils'
    import {validForm} from '../assets/js/validForm'
    export default {
        data() {
            return {
                userLogin: {
                    phone: '',
                    password: ''
                },
                userRegister: {
                    nickName: '',
                    phone: '',
                    password: ''
                },
                isPassword: true,
                isShow: false
            }
        },
        methods: {
            // 回到首页
            backHome(){
                this.$router.push({name: 'Home'});
            },
            // 显示密码
            toggleEye(){
                this.isPassword = !this.isPassword;
            },

            // 打开注册
            showRegister(){
                this.isShow = true;
            },

            // 注册
            register(){
                let userInfo = this.userRegister;
                let o = {
                    nickName: {
                        value: userInfo.nickName,
                        reg: /^[\w\u4e00-\u9fa5]{1,10}$/,
                        errorMsg: '昵称格式不正确'
                    },
                    phone: {
                        value: userInfo.phone,
                        reg: /^1[3-9]\d{9}$/,
                        errorMsg: '手机号格式不正确'
                    },
                    password: {
                        value: userInfo.password,
                        reg: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
                        errorMsg: '密码格式不正确'
                    }
                };
                if (!validForm.valid(o)) {
                    //验证不通过
                    return;
                }
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                })

                let info = Object.assign({}, userInfo);
                
                info.appkey = this.appkey;
                let data = utils.queryString(info);
                
                this.axios({
                    method: 'POST',
                    url: '/register',
                    data
                }).then(result => {
                    
                    this.$toast.clear();
                    if(result.data.code == 100){
                        this.isShow = false;
                        for(let key in userInfo){
                            userInfo[key] = '';
                            this.$notify({
                                background: '#f0f9eb',
                                color: '#67c23a',
                                message: result.data.msg
                            })
                        }
                    }else{
                        this.$notify({
                            background: '#fef0f0',
                            color: '#f56c6c',
                            message: result.data.msg
                        })
                    }
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            },
            // 登录
            login(){
                let userInfo = this.userLogin;
                let o = {
                    phone: {
                        value: userInfo.phone,
                        reg: /^1[3-9]\d{9}$/,
                        errorMsg: '手机号格式不正确'
                    },
                    password: {
                        value: userInfo.password,
                        reg: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
                        errorMsg: '密码格式不正确'
                    }
                };
                if(!validForm.valid(o)){
                    return;
                }
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                })
                let info = Object.assign({}, userInfo);
                info.appkey = this.appkey;
                let data = utils.queryString(info);
                this.axios({
                    method: 'POST',
                    url: '/login',
                    data
                }).then(result => {
                    
                    this.$toast.clear();
                    if(result.data.code == 200){
                        localStorage.setItem('ctk', result.data.token);
                        this.$router.push({name: 'Home'})                 
                        this.$notify({
                            background: '#f0f9eb',
                            color: '#67c23a',
                            message: result.data.msg
                        })
                    }else{
                        this.$notify({
                            background: '#fef0f0',
                            color: '#f56c6c',
                            message: result.data.msg
                        })
                    }
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            },
            // 忘记密码
            goForgotpassword(){
                this.$router.push({name: 'Forgotpassword'})
            }
        }
    }
</script>

