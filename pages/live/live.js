var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    buttons: [{ text: '关闭' }],
    height: 0,
    hostShow: false, //主播详情弹窗
    showGiftModa: false, // 礼物弹窗
    isAttention: false, // 关注主播
    giftModaData: {  // 礼物模块数据（主播、粉丝）
      status: 'fans',//直播间身份（粉丝）
      showGivesModa: false,//显隐送礼模块
      giftName: '',
      giftNumValue:'1', // 礼物数量
      giftData: [
        {
          key: '1',
          value: 'gift_1',
          name: '香水玫瑰',
          url: '/images/Gift_01@2x.png'
        },
        {
          key: '2',
          value: '2',
          name: '心想事成',
          url: '/images/Gift_02@2x.png'
        },
        {
          key: '3',
          value: 'gift_3',
          name: '比翼双飞',
          url: '/images/Gift_03@2x.png'
        },
        {
          key: '4',
          value: 'gift_4',
          name: '生日蛋糕',
          url: '/images/Gift_04@2x.png'
        },
        {
          key: '5',
          value: 'gift_5',
          name: '大礼包',
          url: '/images/Gift_05@2x.png'
        },
        {
          key: '6',
          value: 'gift_6',
          name: '春花浪漫',
          url: '/images/Gift_06@2x.png'
        },
        {
          key: '7',
          value: 'gift_7',
          name: '小狗狗',
          url: '/images/Gift_07@2x.png'
        },
        {
          key: '8',
          value: 'gift_8',
          name: '金镯子',
          url: '/images/Gift_08@2x.png'
        }
      ],

      showGiftId: 0,
      options: [{
        city_id: '001',
        city_name: '北京'
      }, {
        city_id: '002',
        city_name: '上海'
      }, {
        city_id: '003',
        city_name: '深圳'
      }]

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
    commentList: [
      {
        name: '一直玫瑰花',
        info: '这是环信的直播吧'
      },
      {
        name: '一路信服',
        info: '是的吧'
      },
      {
        name: '我是一直廊',
        info: '我也是刚听说就来看看'
      },
      {
        name: '一路信服',
        info: '是的吧'
      },
      {
        name: '一路信服',
        info: '是的吧'
      }
    ],
    msgList: [],
    src: '/images/bgImg.jpg',
    showInput: false,
    isDanmu: false,

    roomId: '',
    nickName: '',
    myUserName: '',
    nickName: '',
    textMsg: '',
    audience: 0
  },
  onLoad: function (option) {
    console.log('coption.query', option.query)
    var self = this;

    let userName = wx.getStorageSync('userName')
    let userInfo = JSON.parse(userName)

    self.setData({
      roomId: option.id,
      nickName: option.name,
      myUserName: userInfo.userName,
      nickName: userInfo.nickName,
      audience: userInfo.audience
    })
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          commentHeight: res.windowHeight - 550,
          height: res.windowHeight
        });
      }
    });
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
        ext: {nickName: this.data.nickName},                                 //扩展消息
        success: function (id, serverMsgId) {
            console.log('send private text Success');  
        },
        fail: function(e){
            console.log("Send private text error");  
        }
    });
    msg.setGroup('groupchat');

    console.log('msg', msg)
    wx.WebIM.conn.send(msg.body);
    let msgList = self.data.msgList
    msgList.push(msg.body)
    this.setData({
      msgList: msgList
    })
    
  },

  //发礼物消息
  sendGift() {
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
        customExts: {note: '香水玫瑰'},
        params: {id: 'gift_1', num: 1},
        success: function () {
          console.log('send private text Success'); 
        },
        fail: function () {
        },
        ext: {}
    })
    msg.setGroup('groupchat');

    console.log('msg', msg)
    wx.WebIM.conn.send(msg.body);
    let msgList = self.data.msgList
    msgList.push(msg.body)
    this.setData({
      msgList: msgList
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
        customExts: {note: '点赞'},
        params: {num: 1},
        success: function () {
          console.log('send private text Success'); 
        },
        fail: function () {
        },
        ext: {}
    })
    msg.setGroup('groupchat');

    console.log('msg', msg)
    wx.WebIM.conn.send(msg.body);
    let msgList = self.data.msgList
    msgList.push(msg.body)
    this.setData({
      msgList: msgList
    })
  },

  // 发弹幕消息
  sendSubtitles(){
    let self = this;
    let roomId = this.data.roomId
    let from = this.data.myUserName
    let id = wx.WebIM.conn.getUniqueId(); 
    let msg = new wx.WebIM.message('custom', id); 
    msg.set({
        to: roomId,
        roomType: true,
        customEvent: 'chatroom_barrage',
        customExts: {note: '弹幕'},
        params: {txt: '弹幕'},
        success: function () {
          console.log('send private text Success'); 
        },
        fail: function () {
        },
        ext: {}
    })
    msg.setGroup('groupchat');

    console.log('msg', msg)
    wx.WebIM.conn.send(msg.body);
    let msgList = self.data.msgList
    msgList.push(msg.body)
    this.setData({
      msgList: msgList
    })
  },
  // 退出直播间
  exitLiveRoom() {
    console.log('退出');
  },
  
  // 显示礼物弹窗
  giftModa() {
    this.setData({
      showGiftModa: true
    })
  },
  // 关闭礼物弹窗
  closeMask() {
    this.setData({
      showGiftModa: false
    })
  },
  // 当前选中的礼物
  inselected(e) {
    let id = e.currentTarget.dataset.giftid.key
    let showGiftId = 'giftModaData.showGiftId'
    let showGivesModa = 'giftModaData.showGivesModa'
    let giftName = 'giftModaData.giftName'
    this.setData({
      [showGiftId]: id,
      [showGivesModa]: true,
      [giftName]: e.currentTarget.dataset.giftid.name
    })
  },
  giftSubmit(e){
    console.log('e>>>',e);
  }
});