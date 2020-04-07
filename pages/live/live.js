var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    buttons: [{ text: '关闭' }],
    height: 0,
    hostShow: false, //主播详情弹窗
    showGiftModa: true, // 礼物弹窗
    isAttention: false, // 关注主播
    giftModaData: {  // 礼物模块数据（主播、粉丝）
      status: 'fans',//直播间身份（粉丝）

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
    commentList: [{
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
    src: '/images/bgImg.jpg',
    showInput: false,
    isDanmu: false,

    roomId: '',
    nickName: '',
    myUserName: '',
    textMsg: ''
  },
  onLoad: function (option) {
    console.log('coption.query', option.query)
    var self = this;

    let userName = wx.getStorageSync('userName')
    let userInfo = JSON.parse(userName)

    self.setData({
      roomId: option.id,
      nickName: option.name,
      myUserName: userInfo.userName
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
  //发送弹幕
  sendTextMsg() {
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
        ext: {},                                 //扩展消息
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

    //测试发自定义消息
    // const pMessage = parseFromLocal(chatType, chatId, message, 'custom')
    // msgObj.set({
    //     to,
    //     roomType: chatroom,
    //     chatType: 'singleChat',
    //     customEvent: 'customEvent',
    //     customExts: {qw: 123},
    //     params: {a: 33},
    //     success: function () {
    //         dispatch(Creators.updateMessageStatus(pMessage, 'sent'))
    //     },
    //     fail: function () {
    //         dispatch(Creators.updateMessageStatus(pMessage, 'fail'))
    //     },
    //     ext: {a: 1}
    // })
  },
  // 退出直播间
  exitLiveRoom() {
    console.log('退出');
  },
  // 点赞
  giveLike() {

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
    let id = e.currentTarget.dataset.giftid
    let showGiftId = 'giftModaData.showGiftId'
    this.setData({
      [showGiftId]: id
    })
  }
});