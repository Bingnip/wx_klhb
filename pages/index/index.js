const app=getApp();

Page({
  data:{
    hasUserInfo:false, //用户授权，初始值false
    canIUse: wx.canIUse('button.open-type.getUserInfo'),  //检测小程序版本兼容，检测getUserInfo API能否调用，返回值：true/false
    token:''  //token初始值空，每次获取新的token
  },

  onShow: function() {   //获取登录信息
    wx.showLoading({
      title: '加载中•••',
      mask: true
    })
    this.loop();
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

  }
})