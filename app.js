var loginInfo={};

App({
  setConfig: { url: "https://www.challs.top/zhwmkl_envelop_klhb/zhwmkl_envelop" },   //全局常量
  onLaunch: function(){   //onLaunch程序初始化执行
    this.userLogin();
  },
  globalData: {   //全局常量
    userInfo: null,
    token: ''
  },
  userLogin: function() {  
    var that=this;
    var codes;
    wx.login({    //微信登录api
      success: function (res) { //返回code
        if(res.code) {
          loginInfo.code = res.code;
          codes=res.code;
          wx.getSetting({   //获取用户当前设置
            success:res => {
                if(res.authSetting['scope.userInfo']) {  //如果授权中含有userinfo代表已经授权过，继续
                    wx.getUserInfo({      //获取用户信息
                      success: function (res) {
                        /*--------- */
                        // 可以将 res 发送给后台解码出 unionId  ??
                        var infoUser = '';
                        that.globalData.userInfo = infoUser = res.userInfo;
                        // 所以此处加入 callback 以防止这种情况 ??
                        if (that.userInfoReadyCallback) {
                          that.userInfoReadyCallback(res);
                        }
                        /*--------- */
                        var url = that.setConfig.url + '/index.php/User/login/dologin'    //服务器接口地址，拼接
                        var data = {
                          user_name: infoUser.nickname,
                          head_img: infoUser.avataＵrl,
                          nick_name: infoUser.nickname,
                          coutry: infoUser.country,
                          sex: infoUser.gender,
                          province: infoUser.province,
                          city: infoUser.city,
                          code: codes,
                        }
                        that.postLogin(url, data);
                      }
                    })
                }else{    //用户没有授权过
                    wx.authorize({   //向用户发起授权请求
                      scope: 'scope.userInfo',   //获取用户信息 
                      success: res => {         //已获得授权同意
                         wx.getUserInfo({      //获取用户信息
                            success:function(res){
                                /*--------- */
                                // 可以将 res 发送给后台解码出 unionId  ??
                                var infoUser = '';
                                that.globalData.userInfo = infoUser = res.userInfo;
                                // 所以此处加入 callback 以防止这种情况 ??
                                if (that.userInfoReadyCallback) {
                                  that.userInfoReadyCallback(res);
                                }
                                /*--------- */
                                    var url = that.setConfig.url + '/index.php/User/login/dologin'    //服务器接口地址，拼接
                                    var data = {
                                      user_name : infoUser.nickname,
                                      head_img : infoUser.avataＵrl,
                                      nick_name : infoUser.nickname,
                                      coutry : infoUser.country,
                                      sex : infoUser.gender,
                                      province : infoUser.province,
                                      city : infoUser.city,
                                      code : codes,
                                    }
                                    that.postLogin(url, data);
                              }
                         })
                      }
                    })
                }
            }
          })
        }else{
          that.userLogin();
          return false;
        }
      }
    });
  },
  postLogin: function (url, data, callback = function () { }){   //提交
  var that=this;
    wx.request({  //发送请求
       url: url,
       data: data,
       method: 'POST',
       header: { "Content-Type" : "application/x-www-form-urlencoded" },
       success:function(res) {
         console.log(res);
         if(res.data.code!=20000){  //状态码20000表示成功
           wx.showToast({
             title: res.data.msg,
             icon:'loading',
             mask:true,
             duration:1500
           })
           return false;
         }
         if(res.data.token){   
           that.globalData.token=res.data.token;  //返回的token写入globalData 
         }
         callback(res);
       }
     })
  }
})