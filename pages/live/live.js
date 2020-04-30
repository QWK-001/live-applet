var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
import USERS from '../../utils/users';
import disp from "../../utils/dispatcher";
Page({
  data: {
    buttons: [{ text: '关闭' }],
    height: 0,
    hostShow: false, //主播详情弹窗
    showGiftModa: false, // 礼物弹窗
    opacity:0,
    showGiftHint: false,// 展示礼物特效
    isAttention: false, // 关注主播
    showMemberListModa: false, // 成员列表弹窗
    msgList: [],
    giftNum: '1',
    toView:'', //消息框自动滚动
    src: '/images/bgImg.jpg',
    showInput: false,
    isDanmu: false,

    roomId: '',
    nickName: '',
    myUserName: '',
    textMsg: '',
    audience: 0,
    giftModaData: {  // 礼物模块数据（主播、粉丝）
      identity: '',//直播间身份（粉丝）
      showGivesModa: false,//显隐送礼模块
      giftName: '',
      giftNumValue: '1', // 礼物数量
      giftUrl: '',
      giftData: {
        gift_1: {
          key: '1',
          value: 'gift_1',
          name: '香水玫瑰',
          url: '/images/Gift_01@2x.png'
        },
        gift_2: {
          key: '2',
          value: '2',
          name: '心想事成',
          url: '/images/Gift_02@2x.png'
        },
        gift_3: {
          key: '3',
          value: 'gift_3',
          name: '比翼双飞',
          url: '/images/Gift_03@2x.png'
        },
        gift_4: {
          key: '4',
          value: 'gift_4',
          name: '生日蛋糕',
          url: '/images/Gift_04@2x.png'
        },
        gift_5: {
          key: '5',
          value: 'gift_5',
          name: '大礼包',
          url: '/images/Gift_05@2x.png'
        },
        gift_6: {
          key: '6',
          value: 'gift_6',
          name: '春花浪漫',
          url: '/images/Gift_06@2x.png'
        },
        gift_7: {
          key: '7',
          value: 'gift_7',
          name: '小狗狗',
          url: '/images/Gift_07@2x.png'
        },
        gift_8: {
          key: '8',
          value: 'gift_8',
          name: '金镯子',
          url: '/images/Gift_08@2x.png'
        }
      },

      showGiftId: 0,
    },
    memberListModa: {
      affiliations_count: '',// 观看成员人数
      list: [],// 成员列表模块数据
      whiteList: [],// 白名单列表
      switchChecked: false, //房间禁言
      tabs: ["观众", "白名单", "用户禁言"],
      type: '',
      activeIndex: 0,
      sliderOffset: 0,
      sliderLeft: 0,
    },
    danmuList: [
      {
        text: '这是我的弹幕',
        color: '#ff0000',
        time: 1
      },
      {
        text: '小程序直播哦',
        color: '#ff00ff',
        time: 3
      }],
  },
  onUnload: function () {
    this.exitLiveRoom()
  },
  onLoad: function (option) {
    console.log('coption.query', option)
    var self = this;

    let userName = wx.getStorageSync('userName')
    let userInfo = JSON.parse(userName)
    let identity = 'giftModaData.identity'
    let type = 'memberListModa.type'
    self.setData({
      roomId: option.id,
      roomName: option.name,
      owner: option.owner,
      myUserName: userInfo.userName,
      nickName: userInfo.nickName,
      audience: option.audience,
      [identity]: option.identity,
      [type]: option.identity,
    })
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          sliderLeft: (res.windowWidth / self.data.memberListModa.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / self.data.memberListModa.tabs.length * self.data.memberListModa.activeIndex,
          commentHeight: res.windowHeight - 500,
          height: res.windowHeight
        });
      }
    });

    //收到普通消息
    disp.on('app.onTextMessage', function (message) {
      let nickName = USERS[parseInt(Math.random() * USERS.length)].nick
      message.nickName = nickName
      let msgList = self.data.msgList
      msgList.push(message)
      self.setData({
        msgList: msgList,
        toView:`item${message.id}`
      })
    })

    //收到自定义消息 包括弹幕 礼物 点赞
    disp.on('app.onCustomMessage', function (message) {
      let nickName = USERS[parseInt(Math.random() * USERS.length)].nick
      message.nickName = nickName
      let msgList = self.data.msgList
      msgList.push(message)
      self.setData({
        msgList: msgList,
        toView:`item${message.id}`
      })
    })

  },

  tabClick: function (e) {
    let self = this
    let sliderOffset = 'memberListModa.sliderOffset'
    let activeIndex = 'memberListModa.activeIndex'
    self.setData({
      [sliderOffset]: e.currentTarget.offsetLeft,
      [activeIndex]: e.currentTarget.id
    });
    let val = e.currentTarget.id
    switch (val) {
      case '1':
        self.getChatRoomWhitelist()
        break;
      case '2':
        break
      default:
        break;
    }

  },
  //点击出现输入框
  showInput: function () {
    this.setData({
      showInput: true
    })
  },
  //隐藏输入框
  onHideInput: function () {
    this.setData({
      showInput: false
    })
  },

  // 显示主播详情页面
  showHostDetail() {
    this.setData({
      hostShow: true
    })
  },
  // 点击关注
  clickAttention() {
    this.setData({
      isAttention: !this.data.isAttention
    })
  },
  // 弹幕开关
  switchChange() {
    this.setData({
      isDanmu: !this.data.isDanmu
    });
  },
  tapDialogButton(e) {
    this.setData({
      hostShow: false,
    })
  },
  // 键盘输入时触发
  bindInputMsg(e) {
    console.log('txt:', e.detail.value);
    this.setData({
      textMsg: e.detail.value
    })
  },
  //发送普通消息
  sendTextMsg() {
    let self = this;
    this.onHideInput()
    let tsxtMsg = this.data.textMsg
    let roomId = this.data.roomId
    let from = this.data.myUserName
    let id = wx.WebIM.conn.getUniqueId();                 // 生成本地消息id
    let msg = new wx.WebIM.message('txt', id);      // 创建文本消息
    msg.set({
      msg: tsxtMsg,                            // 消息内容
      to: roomId,
      from,
      roomType: true,
      ext: { nickName: this.data.nickName },                                 //扩展消息
      success: function (id, serverMsgId) {
        console.log('send private text Success');
      },
      fail: function (e) {
        console.log("Send private text error");
      }
    });
    msg.setGroup('groupchat');

    console.log('msg', msg)
    wx.WebIM.conn.send(msg.body);
    msg.body.nickName = self.data.nickName
    let msgList = self.data.msgList
    msgList.push(msg.body)
    let lastMsg = msgList.slice(-1)
    let toView = lastMsg[0]
    this.setData({
      msgList: msgList,
      toView:`item${toView.id}`
    })

    console.log('msgList', msgList)
  },

  //发礼物消息
  sendGiftMsg(giftNum) {
    let self = this;
    let roomId = this.data.roomId
    let from = this.data.myUserName
    let id = wx.WebIM.conn.getUniqueId();
    let msg = new wx.WebIM.message('custom', id);
    //不同的礼物修改 id {gift_1: '香水玫瑰', gift_2: '心想事成', ...}
    msg.set({
      to: roomId,
      roomType: true,
      customEvent: 'chatroom_gift',
      customExts: { note: self.data.giftModaData.giftName },
      params: { id: 'gift_' + self.data.giftModaData.showGiftId, num: giftNum },
      success: function () {
        console.log('send private text Success');
      },
      fail: function () {
      },
      ext: { nickName: self.data.nickName }
    })
    msg.setGroup('groupchat');

    console.log('msg', msg)
    wx.WebIM.conn.send(msg.body);
    msg.body.nickName = self.data.nickName
    let msgList = self.data.msgList
    msgList.push(msg.body)
    let lastMsg = msgList.slice(-1)
    let toView = lastMsg[0]
    this.setData({
      msgList: msgList,
      toView:`item${toView.id}`
    })
  },

  // 发点赞消息
  giveLike() {
    let self = this;
    let roomId = this.data.roomId
    let from = this.data.myUserName
    let id = wx.WebIM.conn.getUniqueId();
    let msg = new wx.WebIM.message('custom', id);
    msg.set({
      to: roomId,
      roomType: true,
      customEvent: 'chatroom_praise',
      customExts: { note: '点赞' },
      params: { num: 1 },
      success: function () {
        console.log('send private text Success');
      },
      fail: function () {
      },
      ext: { nickName: self.data.nickName }
    })
    msg.setGroup('groupchat');

    console.log('msg', msg)
    wx.WebIM.conn.send(msg.body);
    msg.body.nickName = self.data.nickName
    let msgList = self.data.msgList
    msgList.push(msg.body)
    let lastMsg = msgList.slice(-1)
    let toView = lastMsg[0]
    this.setData({
      msgList: msgList,
      toView:`item${toView.id}`
    })
  },

  // 发弹幕消息
  sendSubtitles() {
    let self = this;
    let roomId = this.data.roomId
    let from = this.data.myUserName
    let id = wx.WebIM.conn.getUniqueId();
    let msg = new wx.WebIM.message('custom', id);
    msg.set({
      to: roomId,
      roomType: true,
      customEvent: 'chatroom_barrage',
      customExts: { note: '弹幕' },
      params: { txt: '弹幕' },
      success: function () {
        console.log('send private text Success');
      },
      fail: function () {
      },
      ext: { nickName: self.data.nickName }
    })
    msg.setGroup('groupchat');

    console.log('msg', msg)
    wx.WebIM.conn.send(msg.body);
    msg.body.nickName = self.data.nickName
    let msgList = self.data.msgList
    msgList.push(msg.body)
    this.setData({
      msgList: msgList
    })
  },
  // 退出直播间
  exitLiveRoom() {
    let obj = {
      roomId: this.data.roomId,
      identity: this.data.giftModaData.identity || '',
      myUserName: this.data.myUserName
    }
    // 主播下播
    if (obj.identity === 'compere') {
      this.stopLive(obj)
    }
    wx.WebIM.conn.quitChatRoom({
      roomId: obj.roomId,
      success: successFun,
      error: errorFun
    })

    function successFun(res) {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
    function errorFun(e) {
      console.log('退出失败', e)
    }
  },

  stopLive(obj) {
    wx.request({
      url: `https://a1.easemob.com/appserver/liverooms/${obj.roomId}/users/${obj.myUserName}/offline`,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        Authorization: 'Bearer ' + getApp().globalData.token
      },
      success(res) {
        console.log('res>>>', res);
      },
      fail(e) {
        console.log('err>>>', e);
      }
    })
  },


  // 显示礼物弹窗
  giftModa() {
    this.setData({
      showGiftModa: true
    })
  },
  //显示成员列表弹窗
  changeMemberListModa() {
    let self = this
    self.getLiveRoomsMember(callback)
    self.setData({
      showMemberListModa: true
    })

    function callback(res) {
      let affiliations_count = 'memberListModa.affiliations_count'
      let list = 'memberListModa.list'
      self.setData({
        [affiliations_count]: res.data.affiliations_count,
        [list]: res.data.affiliations
      })
    }
  },
  // 关闭礼物、成员列表弹窗
  closeMask() {
    this.setData({
      showGiftModa: false,
      showMemberListModa: false
    })
  },
  // 当前选中的礼物
  inselected(e) {
    let id = e.currentTarget.dataset.giftid.key
    let showGiftId = 'giftModaData.showGiftId'
    let showGivesModa = 'giftModaData.showGivesModa'
    let giftName = 'giftModaData.giftName'
    let giftUrl = 'giftModaData.url'
    this.setData({
      [showGiftId]: id,
      [showGivesModa]: true,
      [giftName]: e.currentTarget.dataset.giftid.name,
      [giftUrl]: e.currentTarget.dataset.giftid.url
    })
  },
  giftSubmit(e) {
    let giftNum = e.detail.value.giftNum || '1'
    this.sendGiftMsg(giftNum)
    this.setData({
      showGiftModa: false,
      giftNum: giftNum,
      showGiftHint: true,
    })

    // 这样的实现简直拉垮，时间原因将就凑合吧
    setTimeout(() => {
      this.setData({
        opacity:1
      })
    }, 100)
    setTimeout(() => {
      this.setData({
        opacity:0,
        showGiftHint:false
      })
    }, 2000)
  },

  //获取直播间成员详情
  getLiveRoomsMember(callback) {
    let liveroomid = this.data.roomId
    wx.request({
      url: `https://a1.easemob.com/appserver/liverooms/${liveroomid}`,
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

  // 获取白名单列表
  getChatRoomWhitelist() {
    let self = this
    let liveroomid = this.data.roomId
    wx.WebIM.conn.getChatRoomWhitelist({
      chatRoomId: liveroomid,
      success: successFun,
      error: errorFun
    })
    function successFun(res) {
      let whiteList = 'memberListModa.whiteList'
      self.setData({
        [whiteList]: res.entities
      })
    }
    function errorFun(e) {
      console.log('白名单列表错误>>', e)
    }
  },

  // 房间禁言
  changeSpeech(e) {
    e.detail.value ? this.standSpeech() : this.relieve()
  },
  // 房间禁言
  standSpeech() {
    let self = this
    let liveroomid = this.data.roomId
    wx.WebIM.conn.disableSendChatRoomMsg({
      chatRoomId: liveroomid,
      success: successFun,
      error: errorFun
    })
    function successFun(res) {
      let switchChecked = 'memberListModa.switchChecked'
      self.setData({
        [switchChecked]: true
      })
    }
    function errorFun(e) {
      console.log('禁言失败>>', e)
      let switchChecked = 'memberListModa.switchChecked'
      self.setData({
        [switchChecked]: false
      })
    }
  },
  // 房间解除禁言
  relieve() {
    let self = this
    let liveroomid = this.data.roomId
    wx.WebIM.conn.enableSendChatRoomMsg({
      chatRoomId: liveroomid,
      success: successFun,
      error: errorFun
    })
    function successFun(res) {
      let switchChecked = 'memberListModa.switchChecked'
      self.setData({
        [switchChecked]: false
      })
    }
    function errorFun(e) {
      console.log('解除禁言失败>>', e)
    }
  },
});