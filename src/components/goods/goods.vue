<template>
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item,index) in goods" class="menu-item" :key="index" :class="{'current':currentIndex===index}"
          @click="selectMenu(index,$event)">
            <span class="icon" v-show="item.type>0" :class="classMap[item.type]"></span><span class="text border-1px">{{item.name}}</span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodWrapper">
        <ul>
          <li v-for="(item,index) in goods" class="food-list food-list-hook" :key="index">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li v-for="(food,index) in item.foods" :key="index" class="food-item border-1px" @click="selectFood(food,$event)">
                <div class="icon">
                  <img width="57" height="57" :src="food.icon"/>
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="description">{{food.description }}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span>
                    <span>好评率{{food.sellCount}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">¥{{food.price}}</span>
                    <span v-show="food.oldPrice" class="old">¥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-warpper">
                    <cartcontrol :food="food"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>

      </div>
      <shopcart :select-foods="selectFoods" :deliverty-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
      <food :food="selectedFood" ref="food"></food>
    </div>
</template>

<script>

import BScroll from 'better-scroll'
import shopcart from '@/components/shopcart/shopcart'
import cartcontrol from '@/components/cartcontrol/cartcontrol'
import food from '@/components/food/food'

const ERR_OK = 0

export default {
  name: '',
  props: {
    seller: {
      type: Object
    }

  },
  data () {
    return {
      goods: [],
      classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    }
  },
  components: {
    shopcart,
    cartcontrol,
    food
  },
  created () {
    this.$axios.get('/api/goods').then((response) => {
      response = response.data
      if (response.errno === ERR_OK) {
        this.goods = response.data
        this.$nextTick(() => {
          this._initScroll()
          this._calculateHeight()
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  computed: {
    currentIndex () {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        // eslint-disable-next-line no-mixed-operators
        if (!height2 || this.scrollY >= height1 && this.scrollY < height2) {
          return i
        }
      }
      return 0
    },
    selectFoods () {
      let foods = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  methods: {
    selectFood (food, event) {
      console.log('--selectFood--')
      console.log(food)
      this.selectedFood = food
      this.$refs.food.show()
    },
    selectMenu (index, event) {
      /* if(event._constructed){
            return
          } */
      let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook')
      let el = foodList[index]
      this.foodScroll.scrollToElement(el, 300)
    },
    _initScroll () {
      // 支持移动端的点击
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      })
      this.foodScroll = new BScroll(this.$refs.foodWrapper, {
        click: true,
        probeType: 3
      })
      this.foodScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    _calculateHeight () {
      let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  @import "../../common/stylus/mixin.styl"
  .goods
    width 100%
    position absolute
    top 174px
    display flex
    bottom 46px
    overflow hidden
    .menu-wrapper
      flex 0 0 80px
      width 80%
      background #f3f5f7
      .menu-item
        display table
        height 54px
        width 56px
        line-height 14px
        padding 0 11px
        &.current
          position relative
          z-index 10
          margin-top -1px
          background #fff
          font-weight 700
          .text
            border-none()
        .icon
          display inline-block
          vertical-align top
          width 12px
          height 12px
          margin-right 2px
          background-size 12px 12px
          background-repeat no-repeat
          &.decrease
            bg-image('/goods/decrease_3')
          &.discount
            bg-image('/goods/discount_3')
          &.guarantee
            bg-image('/goods/guarantee_3')
          &.invoice
            bg-image('/goods/invoice_3')
          &.special
            bg-image('/goods/invoice_3')
        .text
          display table-cell
          width 56px
          height 54px
          font-size 12px
          vertical-align middle
          border-1px(rgba(7,17,27,0.1))
    .foods-wrapper
      flex 1
      .title
        padding-left 14px
        height 26px
        line-height 26px
        border-left 2px id #d9dde1
        font-size 12px
        color rgb(147,153,159)
        background #f3f5f7
      .food-item
        display flex
        margin 18px
        /*padding-bottom 18px*/
        border-1px(rgba(7,17,27,0.1))
        &:last-child
          border-none()
          margin-bottom 0
        .icon
          flex 0 0 57px
          margin-right 10px
        .content
          flex 1
          .name
            margin 2px 0 5px 0
            height 14px
            line-height 14px
            font-size 14px
            color rgb(7,17,27)
          .description,.extra
            line-height 12px
            font-size 10px
            color rgb(147,153,159)
          .description
            margin-bottom 8px
          .extra
            &.count
              margin-right 12px
          .price
            font-weight 700
            line-height 48px
            .now
              margin-right 8px
              font-size 14px
              color rgb(240,20,20)
            .old
              text-decoration line-through
              font-size 10
              color rgb(147,153,159)

          .cartcontrol-warpper
            position absolute
            right 0
            bottom 8px

</style>
