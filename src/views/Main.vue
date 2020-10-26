<template>
    <div class="main">
        <div>
            <keep-alive include="Home, Menu, Shopbag, My">
                <transition name="fade">
                    <router-view></router-view>
                </transition>
            </keep-alive>
        </div>
        <div class="tabbar">
            <van-tabbar v-model="tabbarIndex" active-color="#549434" route>
                <van-tabbar-item v-for="(item, index) in tabbarData" :key="index" :to="item.url">
                    <span>{{item.title}}</span>
                    <template #icon="props">
                    <img :src="props.active ? item.icon.active : item.icon.inactive" />
                    </template>
                </van-tabbar-item>
            </van-tabbar>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tabbarIndex: 0,
                tabbarData: [
                    {
                        title: '首页',             
                        icon: {
                            active: require('../assets/images/tabbar_01.png'),
                            inactive: require('../assets/images/tabbar_02.png')
                        },
                        url: {
                            name: 'Home'
                        }
                    },
                    {
                        title: '菜单',             
                        icon: {
                            active: require('../assets/images/tabbar_03.png'),
                            inactive: require('../assets/images/tabbar_04.png')
                        },
                        url: {
                            name: 'Menu'
                        }
                    },
                    {
                        title: '购物袋',             
                        icon: {
                            active: require('../assets/images/tabbar_05.png'),
                            inactive: require('../assets/images/tabbar_06.png')
                        },
                        url: {
                            name: 'Shopbag'
                        }
                    },
                    {
                        title: '我的',             
                        icon: {
                            active: require('../assets/images/tabbar_07.png'),
                            inactive: require('../assets/images/tabbar_08.png')
                        },
                        url: {
                            name: 'My'
                        }
                    }
                ]
            }
        },
    }
</script>

<style lang="less" scoped>
.main{
    padding-bottom: 50px;
    .fade-enter-active, .fade-leave-avtive {
        transition: opacity 2s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0
    }
}
</style>