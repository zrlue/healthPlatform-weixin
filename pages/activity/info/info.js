const app = getApp();
Page({
  data: {
    TabCur: 0,
    info: null,
    userPass: "",
    id: null,
    startdate: "2024-03-01",
    content: ""
  },
  // 值初始化
  init() {
    var id = this.data.id;
    var that = this;
    var userId = app.globalData.userId;
    wx.request({
      url: app.globalData.local_url + 'api/getHealthyService',
      data: {
        serviceId: id,
        userId: userId
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.data);
        that.setData({
          info: res.data.data
        });
      }
    })
  },
  // 根据用户输入的密码设置密码值
  userPass: function (e) {
    this.setData({
      userPass: e.detail.value
    })
  },
  // 设置留言内容
  getcontent: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  // 设置预约时间
  DateChange(e) {
    this.setData({
      startdate: e.detail.value
    })
  },
  // 电话联系功能
  dial(e) {
    if (!app.globalData.isLogin) {
      wx.navigateTo({
        url: '/pages/about/login/login'
      })
    } else {
      var id = e.currentTarget.dataset.id;
      wx.makePhoneCall({
        phoneNumber: id, //仅为示例，并非真实的电话号码
        success: function () {
          wx.showToast({
            title: '拨打电话成功！',
          })
        },
      })
    }
  },
  // 页面加载时触发。一个页面只会调用一次
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.init();
  },
  // 预约服务功能
  showModal(e) {
    var that = this;
    if (!app.globalData.isLogin) {
      wx.navigateTo({
        url: '/pages/about/login/login'
      })
      return;
    }
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  // 设置隐藏窗口属性
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  // 实现预约服务方法，支付功能
  pay(e) {
    var that = this;
    if (that.data.userPass != '123456') {
      wx.showToast({
        title: "支付密码不正确",
        icon: 'none',
        duration: 2000 //持续的时间
      });
      return;
    }
    if (that.data.startdate == "2024-03-01") {
      wx.showToast({
        title: "请选择时间",
        icon: 'none',
        duration: 2000 //持续的时间
      });
      return;
    }
    var userId = app.globalData.userId;
    console.log(that.data.info.serviceId),
    // 基本信息都正确后，保存数据并调用后端接口
    wx.request({
      url: app.globalData.local_url + 'api/addOrder',
      data: {
        serviceId: that.data.info.serviceId,
        userId: userId,
        message: that.data.content,
        time: that.data.startdate
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: '预约成功',
            icon: 'success',
            duration: 2000 //持续的时间
          });
        } else {
          wx.showToast({
            title: '预约失败',
            icon: 'error',
            duration: 2000
          })
        }
        // 隐藏弹窗
        that.setData({
          modalName: null
        })
      }
    })
  },
})