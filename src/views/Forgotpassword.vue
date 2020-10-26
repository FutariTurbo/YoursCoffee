<template>
    <div class="forgot-password">
        <div class="navbar">
            <van-nav-bar
                title="找回密码"
                left-arrow
                :fixed="true"
                @click-left="goback"
            />
        </div>
        <div class="logo">
            <div class="logo-icon"></div>
            <div class="logo-title">
                Yuor.s Coffee
                <div class="logo-cname">约氏咖啡</div>
            </div>
        </div>
        <div class="login-content">
            <div class="content-info">
                Please reset your <br/> password
            </div>
        </div>
        <div class="login-form">
            <van-form>
                <van-field 
                    label="手机号" 
                    placeholder="手机号" 
                    v-model="userData.phone" 
                />
                <van-field 
                    label="密码" 
                    placeholder="密码" 
                    v-model="userData.password" 
                    :type="isPassword ? 'password' : 'text'" 
                    :right-icon="isPassword ? 'closed-eye' : 'eye-o'" 
                    @click-right-icon="showPassword" 
                />
                <van-field 
                    label="邮箱" 
                    placeholder="邮箱" 
                    v-model="userData.email" 
                />
                <van-field 
                    center 
                    clearable 
                    label="邮箱验证码" 
                    placeholder="请输入邮箱验证码"
                    v-model="userData.validCode" 
                >
                <template #button>
                    <van-button size="small" color="#549434" :disabled="isSend" @click="sendValidCode" >{{text}}</van-button>
                </template>
                </van-field>
                <div class="forgot fr clearfix">
                    <span @click="goLogin">去登录</span>
                </div>
                <div class="login-btn">
                    <van-button color="#549434" block native-type="submit" @click="commitPassword">完成</van-button>
                </div>
            </van-form>
        </div>
    </div>
</template>

<script>
    import '../assets/less/forgotpassword.less'
    import {utils} from '../assets/js/utils'
    import {validForm} from '../assets/js/validForm'
    export default {
        data() {
            return {
                isPassword:true,
                userData: {
                    phone: '',
                    password: '',
                    email: '',
                    validCode: ''
                },
                isSend: false,
                text: '发送验证码'
            }
        },
        methods: {
            // 返回上一级
            goback(){
                this.$router.go(-1);
            },
            // 显示密码
            showPassword(){
                this.isPassword = !this.isPassword;
            },
            // 跳转登录页
            goLogin(){
                this.$router.push({name: 'Login'});
            },
            // 发送验证码
            sendValidCode(){
                let time = 60;
                this.isSend = true;
                let timer = setInterval(() => {
                    if(time === 0){
                        clearInterval();
                        this.text = '发送验证码'
                        this.isSend = false;
                    }else{
                        time --;
                        this.text = time + 's后重新发送';
                    }
                }, 1000)
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                })
                //参数序列化
                let data = utils.queryString({
                    email: this.userData.email,
                    appkey: this.appkey
                });
                this.axios({
                    method: 'POST',
                    url: '/emailValidCode',
                    data
                }).then(result => {
                    this.$toast.clear();
                    
                    this.$toast.success('发送验证码成功');
                }).catch(err => {
                    this.$toast.clear();
                    

                })
            },

            //提交密码表单
            commitPassword() {
                //验证修改密码表单
                let o = {
                    phone: {
                        value: this.userData.phone,
                        reg: /^1[3-9]\d{9}$/,
                        errorMsg: '手机号格式不正确'
                    },
                    password: {
                        value: this.userData.password,
                        reg: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
                        errorMsg: '密码格式为字母开头和_组合'
                    },
                    email: {
                        value: this.userData.email,
                        reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                        errorMsg: '邮箱格式不正确'
                    },
                    validCode: {
                        value: this.userData.validCode,
                        reg: /^\d{6}$/,
                        errorMsg: '验证码为6位数字'
                    }
                }

                if (!validForm.valid(o)) {
                    //验证不通过
                    return;
                }
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                })
                let data = utils.queryString({
                    validCode: this.userData.validCode,
                    appkey: this.appkey
                });

                this.axios({
                    method: 'POST',
                    url: '/checkValidCode',
                    data
                }).then(result => {
                    this.$toast.clear();
                    
                    if (result.data.code == 'K001') {
                        //验证成功
                        this.updatePassword();
                    } else {
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

            //修改密码
            updatePassword() {
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                })
                //参数序列化
                let data = utils.queryString({
                    phone: this.userData.phone,
                    password: this.userData.password,
                    appkey: this.appkey
                });
                this.axios({
                    method: 'POST',
                    url: '/retrievePassword',
                    data
                }).then(result => {
                    this.$toast.clear();
                    
                    if (result.data.code == 'L001') {
                        setTimeout(() => {
                            this.$toast.success(result.data.msg);
                            this.$router.push({name: 'Login'});
                        }, 800);
                    } else {
                        this.$notify({
                            background: '#fef0f0',
                            color: '#f56c6c',
                            message: result.data.msg
                        })
                    }
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            }
        }
    }
</script>

