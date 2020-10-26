<template>
    <div class="menu">
        <div class="search">
            <van-search
            shape="round"
            background="#549434"
            placeholder="请输入商品名称"
            v-model="name"
            @focus="search" 
            />
        </div>
        <div class="adv"></div>
        <div class="menu-box">
            <div class="menu-list">
                <div class="menu-item" v-for="(item, index) in typeData" :key="index" @click="toggleType(item)">
                    <div class="menu-img">
                        <img class="auto-img" :src="item.isActive ? item.activeImg : item.img" alt="">
                    </div>
                    <div class="menu-title" :class="{active: item.isActive}">{{item.typeDesc}}</div>
                </div>
            </div>
        </div>
        <div class="menu-product">
            <van-skeleton :row="8" :loading="isSkeleton">
                <div class="product-list">
                    <div class="product-item" v-for="(item, index) in productData" :key="index" @click=" viewProductDetail(item.pid)">
                        <div class="p-img">
                            <img class="auto-img" :src="item.smallImg" alt="">
                        </div>
                        <div class="p-content">
                            <div class="p-title">{{item.name}}</div>
                            <div class="p-enname">{{item.enname}}</div>
                            <div class="p-price">￥{{item.price}}</div>
                            <van-icon class="fr p-add" name="add" color="#549434" />
                        </div>
                    </div>
                </div>
            </van-skeleton>
        </div>
    </div>
</template>

<script>
    import '../../assets/less/menu.less'
    export default {
        name: 'Menu',
        data() {
            return {
                name: '',
                typeData: [],
                productData: [],
                isSkeleton: true,
            }
        },

        created() {
            this.getTypeData();

        },

        methods: {
            // 获取商品类型
            getTypeData() {
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                })
                this.axios({
                    method: 'GET',
                    url: '/type',
                    params: {
                        appkey: this.appkey
                    }
                }).then(result => {
                    
                    this.$toast.clear();
                    if(result.data.code == 400){
                        let imgData = [
                            {
                                type: 'latte',
                                activeImg: require('../../assets/images/menu_03.png'),
                                img: require('../../assets/images/menu_04.png')
                            },
                            {
                                type: 'coffee',
                                activeImg: require('../../assets/images/menu_05.png'),
                                img: require('../../assets/images/menu_06.png')
                            },
                            {
                                type: 'rena_ice',
                                activeImg: require('../../assets/images/menu_07.png'),
                                img: require('../../assets/images/menu_08.png')
                            }
                        ];
                        result.data.result.map( v => {
                            for(let i = 0; i < imgData.length; i++){
                                if(v.type == imgData[i].type){
                                    v.activeImg = imgData[i].activeImg;
                                    v.img = imgData[i].img;
                                    v.isActive = false;
                                    break;
                                }
                            }
                        })
                        result.data.result.unshift({
                            type: 'isHot',
                            typeDesc: '推荐',
                            activeImg: require('../../assets/images/menu_01.png'),
                            img: require('../../assets/images/menu_02.png'),
                            isActive: true
                        });

                        this.typeData = result.data.result;
                        this.getTypeProduct(this.typeData[0]);
                    }
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            },
            // 切换商品类型
            toggleType(item){
                if(item.isActive){
                    return;
                }
                this.isSkeleton = true;
                for(let i = 0; i < this.typeData.length; i++){
                    if(this.typeData[i].isActive){
                        this.typeData[i].isActive = false;
                        break;
                    }
                }
                item.isActive = true;
                this.getTypeProduct(item);
            },
            // 获取不同类型商品
            getTypeProduct(item){
                this.productData = [];
                let data = sessionStorage.getItem(item.type);
                if(data){
                    this.isSkeleton = false;
                    this.productData = JSON.parse(data);
                    return;
                }

                let params = {
                    key: 'type',
                    value: item.type,
                    appkey: this.appkey
                };

                if(item.type == 'isHot'){
                    params.key = 'isHot';
                    params.value = 1;
                }
                
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0
                })
                this.axios({
                    method: 'GET',
                    url: '/typeProducts',
                    params
                }).then(result => {
                    this.$toast.clear();
                    
                    if(result.data.code == 500){
                        this.isSkeleton = false;
                        this.productData = result.data.result;
                        sessionStorage.setItem(item.type, JSON.stringify(this.productData));
                    }
                }).catch(err => {
                    this.$toast.clear();
                    
                })
            },
            // 搜索
            search(){
                this.$router.push({name: 'Search'});
            },
            // 查看商品详情
            viewProductDetail(pid){
                this.$router.push({name: 'Detail', query: {pid}});
            }
        },
    }
</script>
