const app = getApp();
Page({
  data: {
    TabCur: 0,
    scrollLeft:0,
    list:null,
    TabCur: 0,
    type:3,
    scrollLeft:0,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    TabbarBot: app.globalData.tabbar_bottom,
    TabCur: 3,scrollLeft:0,
    SortMenu: [{id:3,name:"历史订单"},{id:0,name:"代配送"},{id:2,name:"已完成"}]
  },
  tabSelect(e) {
    console.log(e.currentTarget.dataset.id);
    this.setData({
      type:e.currentTarget.dataset.id,
        TabCur: e.currentTarget.dataset.id,
        scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
    this.init();
},
  onShow(){
    this.init()
  },
  reply(e){
 
  },
  goInfo(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
    url: '/pages/activity/info/info?id=' + id
    })
  },
  init(){
    var that = this;  
    var userId = app.globalData.userId;
    wx.request({
      url: app.globalData.local_url + 'api/getOrderList',
      data: {
        userId: userId,
        type:that.data.type
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            list: res.data.data
          });   

        } else {
          
        }
      }
    })
  },
  queren(e){
    var that = this;  
    var id = e.currentTarget.dataset.id;
    wx.request({
      url: app.globalData.local_url + 'api/updateOrder',
      data: {
        id:id,
        status:2
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.code == 200) {
        wx.showToast({
            title: '确认成功',
            icon: 'success',
            duration: 2000 //持续的时间
        });
        that.init()

        } else {
          
        }
      }
    })
  }  ,
  delete(e){
    var that = this;  
    var id = e.currentTarget.dataset.id;
    wx.request({
      url: app.globalData.local_url + 'api/deleteOrder',
      data: {
        id:id
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.code == 200) {
        wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000 //持续的时间
        });
        that.init()

        } else {
          
        }
      }
    })
  }
})