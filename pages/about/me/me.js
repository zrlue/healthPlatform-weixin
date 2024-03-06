const app = getApp();
var uploadFileServlet = app.globalData.local_url + "api/upload";
Page({
  data: {
    userName: null,
    userPass: null,
    name: null,
    index: 0,
    picker: ["男", "女"],
    detail: null,
    user: {},
    phone: null,
    head: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201509%2F22%2F20150922180033_hV43u.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1619497588&t=97dff18686d16d8e31ebb95122318105"
  },
  // 设置手机号
  phone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 根据选择设置性别
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },
  // 设置用户名
  userName: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  // 设置密码
  userPass: function (e) {
    this.setData({
      userPass: e.detail.value
    })
  },
  // 设置昵称
  name: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  // 进入页面的时候加载数据
  onLoad: function (options) {
    var that = this;
    getloadData(that);
  },
  ChooseImage() {
    wx.chooseImage({
      count: 1, //只能上传一张照片
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        var that = this;
        wx.uploadFile({
          url: uploadFileServlet,
          filePath: res.tempFilePaths[0],
          name: "uploadfile",
          success: function (res) {
            var pics = JSON.parse(res.data)
            console.log(pics)
            that.setData({
              head: pics.data
            })

          },
          fail: function (err) {
            console.log("有图片上传失败")
          },
          complete: function () {


          }
        })
      }
    });
  },
  regUser: function () { //提交input信息到后台
    var userName = this.data.userName;
    if (userName == "") {
      wx.showModal({
        title: '提示',
        content: '请输入用户名',
        success: function (res) {}
      })
      return;
    }
    var index = this.data.index;
    if (index == null) {
      wx.showModal({
        title: '提示',
        content: '请选择性别',
        success: function (res) {}
      })
      return;
    }
    var phone = this.data.phone;
    if (phone == null) {
      wx.showModal({
        title: '提示',
        content: '请输入手机号',
        success: function (res) {}
      })
      return;
    }
    if (/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(phone) == false) {
      wx.showModal({
        title: '提示',
        content: '手机号码不正确',
        success: function (res) {}
      })
      return;
    }
    var userPass = this.data.userPass;
    if (userPass == "") {
      wx.showModal({
        title: '提示',
        content: '请输入密码',
        success: function (res) {}
      })
      return;
    }
    var name = this.data.name;
    if (name == "") {
      wx.showModal({
        title: '提示',
        content: '请输入昵称',
        success: function (res) {}
      })
      return;
    }
    var head = this.data.head;
    if (head == "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201509%2F22%2F20150922180033_hV43u.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1619497588&t=97dff18686d16d8e31ebb95122318105") {
      wx.showModal({
        title: '提示',
        content: '请上传头像',
        success: function (res) {}
      })
      return;
    }
    wx.request({
      url: app.globalData.local_url + 'api/editUser',
      data: {
        userName: userName,
        passWord: userPass,
        name: name,
        pic: head,
        phone: phone,
        sex: this.data.picker[this.data.index],
        userId: app.globalData.userId
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000 //持续的时间
          });

          //两秒跳转首页
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/index/index',
            })
          }, 2000);
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000 //持续的时间
          });
        }
      }
    })
  }
});
function getloadData(that) {
  wx.showToast({
    title: '加载中',
    icon: "loading",
    duration: 10000
  });
  wx.request({
    url: app.globalData.local_url + "api/getinfo?userId=" + app.globalData.userId,
    data: {},
    header: {
      'content-type': 'application/json'
    },
    method: 'POST',
    dataType: 'json',
    responseType: 'text',
    success: function (res) {
      console.log(res.data);
      wx.hideToast();
      console.log(res.data.data.sex);
      if (res.data.data.sex == '男') {
        console.log("男11");
        that.setData({
          index: 0,

        })
      } else {
        console.log("男1");
        that.setData({
          index: 1,

        })
      }
      that.setData({
        user: res.data.data,
        head: res.data.data.pic,
        phone: res.data.data.phone
      });
      // 隐藏加载框
      wx.hideLoading();

    },
    fail: function (res) {
      wx.stopPullDownRefresh();
    },
  })
}