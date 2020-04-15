const app = getApp();
Page({
  data: {
    width: 0,
    height: 0,
    liveroomsList: [],
    imgUrls: [
      {
        id: '1',
        url: '/images/1.png',
        title: '神秘直播间',
      },
      {
        id: '2',
        url: '/images/2.png',
        title: '国服第一露娜',
      },
      {
        id: '3',
        url: '/images/3.png',
        title: '神仙姐姐'
      },
      {
        id: '4',
        url: '/images/4.png',
        title: '吃鸡吃鸡~'
      },
      {
        id: '5',
        url: '/images/5.png',
        title: '女装大佬了解下'
      },
      {
        id: '6',
        url: '/images/6.png',
        title: '国服大师局'
      }
    ],
    list: [
      {
        label: '热门直播',
        labelId: '10001',
        data: [
          {
            url: '/images/1.png',
            title: '魔王张三胖',
            username: '琪琪',
            userId: '001',
            count: '4362',
            status: 'offline',
          },
          {
            url: '/images/2.png',
            title: '国服第一露娜',
            username: '露娜',
            userId: '002',
            count: '1.2w',
            status: 'offline',
          },
          {
            url: '/images/3.png',
            title: '神仙姐姐',
            username: '神仙姐姐',
            userId: '003',
            count: '4362',
            status: '',
          },
          {
            url: '/images/4.png',
            title: '指尖艺术',
            username: '张三丰',
            userId: '004',
            count: '20w',
            status: '',
          }
        ]
      },
    ],
  },
  onLoad() {
    let self = this;
    self.getLiveRooms(5, '', callback)

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
    self.getLiveRooms(5, self.cursor, callback)
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
      url: 'https://a1-hsb.easemob.com/appserver/liverooms',
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
    console.log('liveroom', e)
    let liveroom = e.currentTarget.dataset.liveroom
    // {
    //   affiliations_count: 3
    //   cover: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585649298994&di=4a23a41095ba858b3275b9a9312eea81&imgtype=0&src=http%3A%2F%2Fa4.att.hudong.com%2F21%2F09%2F01200000026352136359091694357.jpg"
    //   created: 1585639782505
    //   description: "快来嗨"
    //   ext: {test: true}
    //   id: "111402163437571"
    //   name: "神仙姐姐"
    //   owner: "fca64a28a115453cb902b11ace29baf5"
    //   showid: 3
    //   status: "offline"
    // }

    //进入直播间
    wx.WebIM.conn.joinChatRoom({
      roomId: liveroom.id,
      success: successFun,
      error: errorFun
    })

    function successFun(res) {
      wx.navigateTo({
        url: `/pages/live/live?id=${liveroom.id}&name=${liveroom.name}&owner=${liveroom.owner}&audience=${liveroom.affiliations_count}&identity=compere`,
      })
    }
    function errorFun(e) {
      console.log('加入失败', e)
    }
  }
})