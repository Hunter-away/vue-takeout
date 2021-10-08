<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highLight': totalCount>0}">
              <i class="icon-shopping_cart" :class="{'highLight': totalCount>0}"></i>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highLight': totalCount>0}">¥{{totalPrice}}</div>
          <div class="desc">另需配送费{{deliveryPrice}}</div>
        </div>

        <div class="content-right" :class="payClass">
          <div class="pay">
            {{payDesc}}
          </div>
        </div>
      </div>
      <transition name="list">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <div class="title">购物车</div>
            <div class="empty" @click="empty">清空</div>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="(food,index) in selectFoods" :key="index">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>¥{{food.price*food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="mask"><!--背景模糊 start-->
      <div class="list-mask" v-show="listShow"></div>
    </transition><!--背景模糊 end-->
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import cartcontrol from '@/components/cartcontrol/cartcontrol'
export default {
  name: '',
  data () {
    return {
      fold: true,
      balls: [
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ]
    }
  },
  props: {
    selectFoods: {
      type: Array,
      default () {
        return [
          {
            price: 20,
            count: 1
          }
        ]
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  components: {
    cartcontrol
  },
  computed: {
    listShow () {
      if (!this.totalCount) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.fold = true
        return false
      }
      let show = !this.fold
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.listContent, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      }
      return show
    },
    totalPrice () {
      let total = 0
      this.selectFoods.forEach((food) => {
        total += food.price * food.count
      })
      return total
    },
    totalCount () {
      let count = 0
      this.selectFoods.forEach((food) => {
        count += food.count
      })
      return count
    },
    payDesc () {
      if (this.totalPrice === 0) {
        return `¥${this.minPrice}元起送`
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice
        return `还差¥${diff}元起送`
      } else {
        return '去结算'
      }
    },
    payClass () {
      return this.totalPrice < this.minPrice ? 'not-enough' : 'enough'
    }
  },
  methods: {
    empty () {
      this.selectFoods.forEach((food) => {
        food.count = 0
      })
    },
    toggleList () {
      console.log('toggleList')
      if (!this.totalCount) return
      this.fold = !this.fold
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>

  @import "../../common/stylus/mixin.styl"

  .shopcart
    position fixed
    left 0
    bottom 0
    z-index 50
    width 100%
    height 48px
    .content
      display flex
      background #141d27
      color rgba(255,255,255,0.4)
      .content-left
        flex 1
        .logo-wrapper
          display inline-block
          position relative
          top -10px
          margin 0 12px
          padding 6px
          width 56px
          height 56px
          box-sizing border-box
          vertical-align top
          border-radius 50%
          background #141d27
          .logo
            width 100%
            height 100%
            text-align center
            border-radius 50%
            background #2b343c
            &.highLight
              background rgb(0,160,220)
            .icon-shopping_cart
              font-size 24px
              color #80858a
              line-height 44px
              &.highLight
                color #fff
          .num
            position absolute
            top 0
            right 0
            width 24px
            line-height 16px
            text-align center
            font-size 9px
            font-weight 700
            border-radius 16px
            color #fff
            background rgb(240,20,20)
            border-shadow 0 4px 8px 0 rgba(0,0,0,0.4)
        .price
          display inline-block
          vertical-align top
          line-height 24px
          margin-top 12px
          padding-right 12px
          box-sizing border-box
          border-right 1px solid rgba(255,255,255,0.1)
          font-size 16px
          font-weight 700
          &.highLight
            color #fff
        .desc
          display inline-block
          vertical-align top
          line-height 24px
          margin 12px 0 0 12px
          font-size 10px
      .content-right
        flex 0 0 105px
        width 105px
        .pay
          height 48px
          line-height 48px
          text-align center
          font-size 12px
          font-weight 700
        &.not-enough
          background #2b333b
        &.enough
          background #00b43c
          color #fff

    .list-enter-active, .list-leave-active
      transition: all .8s;
    .list-enter, .list-leave-to
      /* .list-leave-active for below version 2.1.8 */
      opacity: 0;
      transform: translateY(30px);
    .shopcart-list
      position absolute
      left 0
      bottom 48px
      z-index -1
      width 100%
      .list-header
        height 40px
        line-height 40px
        padding 0 18px
        background #f3f5f7
        border-bottom 1px solid rgba(7,17,27,0.1)
        .title
          float left
          font-size 14px
          color rgb(7,17,27)
        .empty
          float right
          font-size 12px
          color rgb(0,160,220)
      .list-content
        padding 0 18px
        max-height 217px
        background #fff
        overflow hidden
        .food
          position relative
          padding 12px 0
          box-sizing border-box
          border-1px(rgba(7,17,27,0.1))
          .name
            line-height 24px
            font-size 14px
            color rgb(7,17,27)
          .price
            position absolute
            right 90px
            bottom 12px
            line-height 24px
            font-size 14px
            font-weight 700
            color rgb(240,20,20)
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 6px
  .mask-enter-active, .mask-leave-active {
    transition: opacity .8s;
  }
  .mask-enter, .mask-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .list-mask
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    z-index 40
    backdrop-filter blur(10px)
    background: rgba(7,17,27,0.6)
</style>
