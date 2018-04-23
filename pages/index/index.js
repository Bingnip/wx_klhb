const app=getApp();

Page({
  data:{
    hasUserInfo:false, //用户授权，初始值false
    userInfo: {}, //用户信息
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
    maxnum: 999,  //最大个数
    sum: '',   //赏金输入框内容
    num: '',  //数量输入框内容
    advert: false,  //广告开关
    piazza: false, //分享到广场开关
    btn: '生成语音口令',  // 支付按钮提示语
    serviceCharge:'0.00',  //需支付的服务费
    control:true,  //发布按钮控制器
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
    var inp = Math.round(value * 100) / 100;    //四舍五入取整，保留两位小数
    var max = parseFloat(this.data.maxsum),       //最大金额
        min = parseFloat(this.data.initials.minfc); //最小金额
    var bi = this.data.advert ? parseFloat(this.data.initials.yjgg) / 100 : parseFloat(this.data.initials.yjpt) / 100;  //广告开关对应的佣金比例
    inp = inp > max ? max : inp;    //输入金额最大值判断
    inp = inp > 0 ? inp < min ? min.toFixed(2) : inp.toFixed(2) : '' //输入金额最小值判断  
    var val = inp;
    var balance = parseFloat(this.data.balance);  //账户余额
    var serc = Math.round(val * bi * 100) /100;  //广告服务费,保留两位小数
    var actual = val + serc > balance ? (val + serc - balance).toFixed(2) : 0; //判断余额充足扣款
    if(parseFloat(actual) > 0){ //支付按钮的样式切换
      var btntxt = '还需支付' + actual + '元'
      this.setData({
        sum: inp,
        serviceCharge: serc.toFixed(2),
        btn: btntxt
      })
    } else {
      this.setData({
        sum: inp,
        serviceCharge: serc.toFixed(2),
        btn: '生成语音口令'
      })
    }
  },

  bindSLInput: function (e) {  //数量输入框函数
      var value = !e ? this.data.num : e.detail.value;
      var num = Math.ceil(value),
          max = parseFloat(this.data.mannum);
      num = num > 0 ? num > max ? max : num : '';
      this.setData({
        num : num
      })
  },

  switchAdv: function(e){  //广告开关
    var advert = e;
    this.setData({
      advert : advert
    })
  },

  switchPz: function(e){  //广场开关
    var piazza = e.detail.value;
    this.setData({
      piazza : piazza
    })
  },

  formSubmit:function (e) {  //表单提交
    var that = this;
    var val = e.detail.value;
    // console.log(e);
    var mode = this.data.mode;
    if(mode == 0){
      var valkl = e.detail.value.kl;
    }
    var valsj = parseFloat(val.sj);
    var valsl = Math.ceil(val.sl);
    var formid = e.detail.formId;
    var maxsum = parseFloat(this.data.maxsum);
    var minsum = parseFloat(this.data.initials.minfc);
    var maxnum = parseFloat(this.data.maxnum);
    valsj = valsj > maxsum ? maxsum : valsj;
    valsj = valsj > 0 ? valsj < minsum ? minsum : valsj : '';
    valsl = valsl > 0 ? valsl > maxnum ? maxnum : valsl : '';
    var minlq = parseFloat(this.data.initials.minlq);
    var ns = valsj - minlq * valsl;   //每个红包不能少于minlq元
    if(ns<0){
        wx.showModal({
          title: '提示',
          content: '单个红包金额不能少于' + minlq.toFixed(2) + '元',
          showCancel: false,
          success: function (res) {
          }
        })
        return false
      }
    
    //登录信息验证
    var tok = app.globalData.token;
    if(!this.data.control || !tok){
      return false;
    }
    this.setData({
      control:false
    })

    var datas = {};

    datas.amount = valsj;
    datas.num = valsl;
    datas.is_adv = advert ? 1 : 0;
    datas.enve_type = mode;
    datas.form_id = formid;
    datas.token = tok;

    datas.share2square = piazza ? 1 : 0;

    if(mode == 0){
      datas.quest = valkl;
      var postUrl = app.setConfig.url + '/index.php/Api/Enve/saveEnve';
      app.postLogin(postUrl, datas, that.saveEnve);
    }
  

  },
  /*--------*/
  
  saveEnve: function() {  //口令提交函数，回调
    
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
    if (info && !this.data.hasUserInfo){  //判断用户已经授权，并且用户有用户信息
      wx.showLoading({
        title: '数据初始化',
        mask: true
      })
      this.setData({
        userInfo: info,
        hasUserInfo: true
      })
    }
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