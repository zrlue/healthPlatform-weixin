const app = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    CustomBar: app.globalData.CustomBar,
    list: [],
    id: null,
    content: null
  },
  lifetimes: {
    //自定义组件
    attached: function () {
      var that = this;
      if (!app.globalData.isLogin) {
        wx.navigateTo({
          url: '/pages/about/login/login'
        })
      } else {
        getData(that, "")
      }
    },
  },

  methods: {
    // 跳转到问诊页面
    toReply(e) {
      var id = e.currentTarget.dataset.id;
      app.globalData.id = id;
      wx.navigateTo({
        url: '/pages/basics/chat/chat?id=' + id
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
    // 删除留言信息
    delete(e) {
      var questionId = e.currentTarget.dataset.id;
      console.log("正在删除")
      wx.request({
        url: app.globalData.local_url + 'api/deleteMeassage',
        data: {
          questionId: questionId,
        },
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
      })
    },
  }
})
// 获取该用户所有的留言列表信息
function getData(that, val) {
  var get_url = app.globalData.local_url + "api/getMessageList?&userId=" + app.globalData.userId;
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
        console.log("获取失败")
      }
    }
  })
}