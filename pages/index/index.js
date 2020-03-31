const app = getApp();
Page({
  cursor: '',
  data: {
    width: 0,
    height: 0,
    liveroomsList: []
  },
  onLoad() {
    let self = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log('res:', res)
        let w = res.windowWidth;
        let h = res.windowHeight;
        app.globalData.width = w;
        app.globalData.height = h;
        self.setData({
          width: w,
          height: h
        })
      },
    })

    this.getLiveRooms(5, '', callback)

    function callback(res){
      console.log('listroom: ', res)
      let list = res.data.entities
      self.cursor = res.data.cursor
      self.setData({
        liveroomsList: [{
          label: '热门直播',
          labelId: '10001',
          data: list
        }]
      })
    }

    //创建直播间
    // wx.request({
    //   url: 'https://a1.easemob.com/appserver/liverooms',
    //   method: 'POST',
    //   data: {
    //     name: '神仙姐姐',
    //     description: '快来嗨',
    //     maxusers: 5000,
    //     owner: 'zdtest',
    //     members: ['zdtest2'],
    //     cover: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585649298994&di=4a23a41095ba858b3275b9a9312eea81&imgtype=0&src=http%3A%2F%2Fa4.att.hudong.com%2F21%2F09%2F01200000026352136359091694357.jpg',
    //     ext: {test: true}
    //   },
    //   header: {
    //     'content-type': 'application/json',
    //     Authorization: 'Bearer YWMtQDafZHMhEeqyFiOa7jOZEE1-S6DcShHjkNXh_7qs2vUy04pwHuER6YGUI5WOSRNCAwMAAAFxL34SkQBPGgCgcHDOxwPUcTnUwWhld-t9BIWlLRZ3xZiJwKGCPYtqew'
    //   },
    //   success (res) {
    //     console.log('创建的直播间: ', res)
    //   }
    // })

    //设置直播状态
    // let liveroomId = "111402651025409";
    // let username = "zdtest"
    // wx.request({
    //   url: `https://a1.easemob.com/appserver/liverooms/${liveroomId}/users/${username}/ongoing`,
    //   method: 'POST',
    //   header: {
    //     'content-type': 'application/json',
    //     Authorization: 'Bearer YWMtQDafZHMhEeqyFiOa7jOZEE1-S6DcShHjkNXh_7qs2vUy04pwHuER6YGUI5WOSRNCAwMAAAFxL34SkQBPGgCgcHDOxwPUcTnUwWhld-t9BIWlLRZ3xZiJwKGCPYtqew'
    //   },
    //   success (res) {
    //     console.log('开始直播: ', res)
    //   }
    // })

  },
  onPullDownRefresh(){
    console.log('出发下啦')
    let self = this;
    this.getLiveRooms(5, self.cursor, callback)
    function callback(res){
      if(!res.data.entities){
        wx.showToast({
           title:'已无更多数据',
           icon:'none',
           duration:2000
        })
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
  getLiveRooms(limit, cursor, callback){
    wx.request({
      url: 'https://a1.easemob.com/appserver/liverooms',
      data: {
        limit: limit,
        cursor: cursor
      },
      header: {
        'content-type': 'application/json',
        Authorization: 'Bearer YWMtQDafZHMhEeqyFiOa7jOZEE1-S6DcShHjkNXh_7qs2vUy04pwHuER6YGUI5WOSRNCAwMAAAFxL34SkQBPGgCgcHDOxwPUcTnUwWhld-t9BIWlLRZ3xZiJwKGCPYtqew'
      },
      success (res) {
        callback(res)
      },
      fail(e){
        callback(e)
      }
    })
  },
  detail() {
    wx.navigateTo({
      url: `/pages/detail/detail`,
    })
  },
  golive() {
    wx.navigateTo({
      url: `/pages/live/live`,
    })
  }
})