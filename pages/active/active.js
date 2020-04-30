const app = getApp();
Page({
  data: {
    width: 0,
    height: 0,
    liveroomsList: [],
    nickName: '',
    myUserName: '',
  },
  onLoad() {
    let self = this;
    self.getLiveRooms(6, '', callback)
    let userName = wx.getStorageSync('userName')
    let userInfo = JSON.parse(userName)
    console.log('userInfo>>', userInfo);

    self.setData({
      myUserName: userInfo.userName,
      nickName: userInfo.nickName,
    })
    wx.getSystemInfo({
      success: function (res) {
        console.log('res:', res)
      },
    })

    function callback(res) {
      let list = res.data.entities
      self.cursor = res.data.cursor
      self.setData({
        liveroomsList: [{
          data: list
        }]
      })
    }
  },


  onPullDownRefresh() {
    let self = this;
    self.getLiveRooms(6, self.cursor, callback)
    function callback(res) {
      if (!res.data.entities) {
        wx.showToast({
          title: '已无更多数据',
          icon: 'none',
          duration: 2000
        })
        wx.stopPullDownRefresh()
        return
      }
      let list = res.data.entities
      let currentList = list.concat(self.data.liveroomsList[0].data)
      self.cursor = res.data.cursor
      self.setData({
        liveroomsList: [{
          label: '热门直播',
          labelId: '10001',
          data: currentList
        }]
      })
      console.log('list..', list)
      wx.stopPullDownRefresh()
    }
  },
  getLiveRooms(limit, cursor, callback) {
    let self = this;
    wx.request({
      url: 'https://a1.easemob.com/appserver/liverooms',
      data: {
        limit: limit,
        cursor: cursor
      },
      header: {
        'content-type': 'application/json',
        Authorization: 'Bearer ' + getApp().globalData.token
      },
      success(res) {
        callback(res)
      },
      fail(e) {
        callback(e)
      }
    })
  },

  createdLive(e) {
    let self = this
    let liveroom = e.currentTarget.dataset.liveroom
    let myUserName = this.data.myUserName
    console.log('username>>>', myUserName, 'liveroom>>>', liveroom);
    wx.request({
      url: `https://a1.easemob.com/appserver/liverooms/${liveroom.id}/users/${myUserName}/ongoing`,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        Authorization: 'Bearer ' + getApp().globalData.token
      },
      success(res) {
        console.log('开播成功>>>', res);
        self.goLive(res.data)
      },
      fail(e) {
        console.log('err>>>', e);
      }
    })

  },
  goLive(res) {
    let roomInfo = res
    // 进入直播间开始直播
    wx.WebIM.conn.joinChatRoom({
      roomId: res.id,
      success: successFun,
      error: errorFun
    })

    function successFun(res) {
      console.log('res>>>',res);
      wx.navigateTo({
        url: `/pages/live/live?id=${roomInfo.id}&name=${roomInfo.name}&owner=${roomInfo.owner}&audience=${roomInfo.affiliations_count}&identity=compere`,
      })
    }
    function errorFun(e) {
      console.log('加入失败', e)
    }
  }
})