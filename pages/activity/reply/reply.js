const app = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    CustomBar: app.globalData.CustomBar,
    // 活动详情数据列表
    list: [],
    // item: {},
    // 报名确认
    content: ""
  },
  //在组件实例进入页面节点树时执行
  attached: function (e) {
    var that = this;
    // 获取评论列表
    getData(that)
    wx.request({
      url: app.globalData.local_url + 'api/getActivityInfo?activityId=' + app.globalData.id + "&userId=" + app.globalData.userId,
      data: {},
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log("活动详细信息ActivityInfo：",res.data.data);
        that.setData({
          info: res.data.data
        });
      }
    })
  },
  methods: {
    // 根据输入的内容设置评论内容
    content: function (e) {
      this.setData({
        content: e.detail.value
      })
    },
    /**
     * 确认报名或取消报名方法
     * @param {*} e 
     */
    apply(e) {
      var that = this;
      // 获取传入的参数status
      var status = e.currentTarget.dataset.status
      var hint = "确认报名吗？";
      // 如果为1表示已经报名了
      if (status == 1) {
        hint = "确认取消报名吗？";
      }
      // 点击报名按钮后的提示
      wx.showModal({
        title: '提示',
        content: hint,
        success: function (res) {
          // 如果用户点击确认
          if (res.confirm) {
            // 判断是否已经登录，登录校验
            if (!app.globalData.isLogin) {
              wx.navigateTo({
                url: '/pages/about/login/login'
              })
              return;
            }
            // 获取传入的活动id
            var id = e.currentTarget.dataset.id;
            // 获取全局的登录用户id
            var userId = app.globalData.userId;
            // 调用后端的活动报名接口
            wx.request({
              url: app.globalData.local_url + 'api/enlist',
              data: {
                userId: userId,
                activityId: id,
              },
              header: {
                'content-type': 'application/json'
              },
              method: 'POST',
              success: function (res) {
                if (res.data.code == 200) {
                  wx.showToast({
                    title: '操作成功',
                    icon: 'success',
                    duration: 2000 //持续的时间
                  });
                  // 报名或取消报名成功后，重新获取数据
                  wx.request({
                    url: app.globalData.local_url + 'api/getActivityInfo?activityId=' + app.globalData.id + "&userId=" + app.globalData.userId,
                    data: {},
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
                } else {
                  wx.showToast({
                    // 服务器返回的是'活动已结束'
                    title: res.data.message,
                    icon: 'success',
                    duration: 2000 //持续的时间
                  });
                }
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    send() {
      if (!app.globalData.isLogin) {
        wx.navigateTo({
          url: '/pages/about/login/login'
        })
      }


      var that = this;
      var content = this.data.content;
      wx.request({
        url: app.globalData.local_url + 'api/saveComment',
        data: {
          userId: app.globalData.userId,
          content: content,
          forumId: app.globalData.id
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
            console.log("保存评论成功")
            wx.showToast({
              title: '评论成功',
              icon: 'success',
              duration: 2000 //持续的时间
            });
            getData(that)
          } else {

          }
        }
      })
    }

  }
})


function getData(that) {
  var get_url = app.globalData.local_url + "api/getCommentList?forumId=" + app.globalData.id;
  wx.request({
    url: get_url,
    data: {
      'commentId': '',
      'content': '',
    },
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      if (res.data.code == 200) {
        console.log('评论数据', res.data.data);
        that.setData({
          list: res.data.data
        });
      } else {

      }
    }
  })
}