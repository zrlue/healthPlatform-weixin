const app = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    CustomBar: app.globalData.CustomBar,
    list: [],
    id: null,
    userId: "",
    modalName: "",
    type: false,
    content: null
  },
  //自定义组件
  attached: function () {
    var that = this;
    setInterval(function () {
      getData(that, "")
    }, 2000) //循环时间 这里是1秒  
    that.setData({
      userId: app.globalData.id
    });
    if (!app.globalData.isLogin) {
      wx.navigateTo({
        url: '/pages/about/login/login'
      })
    } else {
      // 调用获取问诊记录方法
      getData(that, "")
    }
  },
  methods: {
    getData(e) {
      var val = e.detail.value;
      var that = this;
      getData(that, val)
    },
    showModal(e) {
      var id = e.currentTarget.dataset.id;
      this.setData({
        modalName: e.currentTarget.dataset.target,
        id: id
      })
    },
    hideModal(e) {
      this.setData({
        modalName: null
      })
    },
    content: function (e) {
      this.setData({
        content: e.detail.value
      })
    },
    send(e) {
      if (null == this.data.content || "" == this.data.content) {
        return;
      }
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    },
    // 发送问诊信息
    send() {
      if (!app.globalData.isLogin) {
        wx.navigateTo({
          url: '/pages/about/login/login'
        })
      }
      var that = this;
      var content = this.data.content;
      wx.request({
        url: app.globalData.local_url + 'api/saveMeassage',
        data: {
          userId: app.globalData.userId,
          context: content,
          pid: app.globalData.id,
        },
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.data.code == 200) {
            that.setData({
              content: ""
            })
            getData(that);
          } else {

          }
        }
      })
    }
  }
})
// 查看聊天记录
function getData(that, val) {
  var get_url = app.globalData.local_url + "api/getChatList?&userId=" + app.globalData.userId + "&questionId=" + app.globalData.id;
  wx.request({
    url: get_url,
    data: {},
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      if (res.data.code == 200) {
        console.log(res.data.data);
        that.setData({
          list: res.data.data
        });

      } else {

      }
    }
  })


}