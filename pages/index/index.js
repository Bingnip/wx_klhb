const app=getApp();

Page({
  data:{
    hasUserInfo:false, //用户授权，初始值false
    canIUse: wx.canIUse('button.open-type.getUserInfo'),  //检测小程序版本兼容，检测getUserInfo API能否调用，返回值：true/false
    token:'',  //token初始值空，每次获取新的token
    initials:{    //当中配置都是在后端config这种配置，页面给默认值
       yjpt:'2',  //佣金比率（*%）
       yjgg:'3',  //广告佣金比例
       minfc:'1',  //最小发出金额
       minlq:'0.01' //最小领取金额
    },
    balance: '0.00',     //余额
    imgsTP: [],  //平台广告
    mode: 0,    //模式控制参数，首页三种红包参数
    duration: 300, //切换效果时长
    token:'',  //token初始值空，每次获取新的token
    textCN:'', //设置口令框
    maxsum:'10000', //最大赏金额
    maxnum: 100,  //最大个数
    sum: '',   //赏金输入框内容
    num: '',  //数量输入框内容
  },

  /*---------input框--------------*/
  bindKLInput: function(e){   //口令框函数
      var val = e.detail.value.trim(),
          reg = /[\u4e00-\u9fa5]/g,  //判断是否纯汉字
          result = val.match(reg);
      if(result === null){
        this.setData({
           textCN:''
        })
      }else{
        result = result.join("");
        this.setData({
          textCN: result
        })
      }
  },
  bindJEInput: function(e){   //金额输入框函数
    var value = !e ? this.data.sum : e.detail.value;//判断值是否存在
    var inp = Math.round(value * 100);
    console.log(inp);


  },

  onShow: function() {   //获取登录信息
    wx.showLoading({
      title: '加载中•••',
      mask: true
    })
    this.loop();
  },

  switchNav: function (e) { //模式切换
    var that = this;
    if(this.data.mode === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        mode: e.currentTarget.dataset.current
      })
    }
  },

  swiperTab: function(e) {  //
      console.log(e);
  },

  loop: function() {   //请求登录信息
    var tok = app.globalData.token;
    var info = app.globalData.userInfo;
    if(!tok){
      var that = this;
      setTimeout(that.loop,100);    //获取globalData的token
    }else{
      this.setData({
         token : tok
      })
      var postUrl=app.setConfig.url + '/index.php?g=User&m=Consumer&a=userInfo',
      postData = { token : tok };
      app.postLogin(postUrl , postData , this.initial);
    }
  },

  initial: function(res) {
      if(res.data.code == 20000) {
          var data = res.data.data;
          var initials = {
             yjpt: data.commsion,
             yjgg: data.commision_adv,
             minfc: data.amount_min,
             minlq: data.receive_amount_min
          };
          wx.hideLoading();
          this.setData({
              initials: initials,
              balance: data.amount,
              imgsTP: data.adv_list
          })

      }
  }


})