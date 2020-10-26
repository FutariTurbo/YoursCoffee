<template>
  <div id="app">
    <transition :name="animate">
　　　　<router-view/>
　　</transition>
  </div>
</template>  

<script>
export default {
  name: 'App',
  data(){
      return{
  　　　　animate: ""
  　　}
  },
  watch: {
  　　$route(to, from) {
  　　　　if (to.meta.tx > from.meta.tx) {
  　　　　this.animate= "right";
  　　　} else {
  　　　　this.animate= "left";
  　　　　}
  　　}
  }
}
</script>
<style lang="less">
body{
  background-color: #f4f4f4;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.fl{
  float: left;
}
.fr{
  float: right;
}
.clearfix::after{
  content: '';
  display: block;
  clear: both;
}
.auto-img{
  width: 100%;
  display: block;
}
.right-enter-active,
.right-leave-active,
.left-enter-active,
.left-leave-active {
  transition: all 200ms;
}
.right-enter {
  transform: translate3d(-100%, 0, 0);
}
.right-leave-to {
  transform: translate3d(100%, 0, 0);
}
.left-enter {
  transform: translate3d(100%, 0, 0);
}
.left-leave-to {
  transform: translate3d(-100%, 0, 0);
}

</style>
