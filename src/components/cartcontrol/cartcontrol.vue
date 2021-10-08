<template>
  <div class="cartcontrol">
    <transition name="slide-fade">
      <div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0" @click.stop.prevent="decreaseCart($event)"></div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)"></div>
  </div>
</template>

<script>

import Vue from 'vue'
export default {
  name: '',
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    addCart (event) {
      /* if(!event._constructed){
              return
            } */
      console.log(1)
      if (!this.food.count) {
        Vue.set(this.food, 'count', 1)
      } else {
        this.food.count++
      }
    },
    decreaseCart (event) {
      this.food.count ? this.food.count-- : ''
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .cartcontrol
    /* 可以设置不同的进入和离开动画 */
    /* 设置持续时间和动画函数 */
    .slide-fade-enter-active
      transition: all .3s ease;
    .slide-fade-leave-active
      transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0)
    .slide-fade-enter, .slide-fade-leave-to
      /* .slide-fade-leave-active for below version 2.1.8 */
      transform: translateX(10px);
      opacity: 0;
    font-size 0
    .cart-decrease,.cart-add
      display inline-block
      padding 6px
      line-height 24px
      font-size 24px
      color rgb(0,160,220)
    .cart-count
      display  inline-block
      vertical-align top
      width 12px
      padding-top 6px
      font-size 10px
      line-height 24px
      text-align center
      color rgb(147,153,159)

</style>
