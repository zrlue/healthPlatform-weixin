const app = getApp();
var uploadFileServlet = app.globalData.local_url + "api/upload";
var Util = require('../../../utils/util.js');
Page({
  data: {
    userName: null,
    userPass: null,
    name: null,
    phone: null,
    index: null,
    picker: ["男", "女"],
    detail: null,
    head: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201509%2F22%2F20150922180033_hV43u.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1619497588&t=97dff18686d16d8e31ebb95122318105"
  },
  userName: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  userPass: function (e) {
    this.setData({
      userPass: e.detail.value
    })
  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },
  phone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  name: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 1, //默认9
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
            console.log("图片上传失败")
          },
          complete: function () {
            console.log("图片上传完成")
          }
        })
      }
    });
  },
  // 规则校验，如果有信息没有填写，则进行提示
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
    var userPass = this.data.userPass;
    if (userPass == "") {
      wx.showModal({
        title: '提示',
        content: '请输入密码',
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
    var name = this.data.name;
    if (name == "") {
      wx.showModal({
        title: '提示',
        content: '请输入昵称',
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
    // 正则表达式校验手机号
    if (/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(phone) == false) {
      wx.showModal({
        title: '提示',
        content: '手机号码不正确',
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
      url: app.globalData.local_url + 'api/registerUser',
      data: {
        userName: userName,
        passWord: userPass,
        name: name,
        pic: head,
        sex: this.data.picker[this.data.index],
        phone: phone
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: '注册成功',
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