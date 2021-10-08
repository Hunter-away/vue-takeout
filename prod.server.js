/**
 * Created by MINGMING.PENG
 * ON 2018/4/29
 */
var express = require('express')
var config = require('./config/index')

var port = process.env.PORT || config.build.port

var app = express()

var router = express.Router()

router.get('/',function(req,res,next) {
  req.url = 'index.html'
  next()
})

app.use(router)
/**
 * 配置本地数据，拿到数据
 */
var appData = require('./data.json')//加载本地数据文件
var seller = appData.seller//获取对应的本地数据
var goods = appData.goods
var ratings = appData.ratings
var apiRoutes = express.Router()
console.log(seller)
apiRoutes.get('/seller', (req, res) => {
  res.json({
    errno: 0,
    data: seller
  })//接口返回json数据，上面配置的数据seller就赋值给data请求后调用
})
apiRoutes.get('/goods', (req, res) => {
  res.json({
    errno: 0,
    data: goods
  })
})
apiRoutes.get('/ratings', (req, res) => {
  res.json({
    errno: 0,
    data: ratings
  })
})

app.use('/api',apiRoutes)

app.use(express.static('./dist'))

module.exports = app.listen(port, function(err) {
  if(err) {
    console.log(err)
    return
  }
})
