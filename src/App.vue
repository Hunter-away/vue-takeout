<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings" active-class="active">评价</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!--keep-alive标签  可以保存这个状态，在切换页面时，不会再重新执行请求-->
    <keep-alive><router-view :seller="seller"></router-view></keep-alive>
  </div>
</template>

<script>

import header from './components/header/header'
import {urlParse} from './common/js/util'

const ERR_OK = 0

export default {
  name: 'app',
  data () {
    return {
      seller: {
        id: (() => {
          let queryParam = urlParse()
          console.log(queryParam)
          return queryParam.id
        })()
      }
    }
  },
  components: {
    'v-header': header
  },
  methods: {
    initSeller () {
      this.$axios.get('/api/seller').then((response) => {
        response = response.data
        if (response.errno === ERR_OK) {
          this.seller = response.data
          console.log(this.seller.id, 'id')
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted () {
    this.initSeller()
  }
}

</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>

  @import './common/stylus/mixin.styl'

  .tab
    width: 100%;
    height: 40px;
    line-height: 40px;
    border-1px(rgba(7,17,27,0.1))

  .tab .tab-item{
    width: 33.33%;
    float: left;
    text-align: center;
  }
  a{
    font-size: 14px;
    color: rgb(77,85,93);
  }
  .active{
    color: rgb(240,20,20);
  }

</style>
