//app.js
import WebIM from './utils/im';
import utils from './utils/util';
import USERS from './utils/users';
import disp from "./utils/dispatcher";
App({
  onLaunch: function () {

    WebIM.conn.listen({
      onOpened(message){
        let identityToken = WebIM.conn.context.accessToken
        let identityName = WebIM.conn.context.jid
      },
      onReconnect(){
        wx.showToast({
          title: "重连中...",
          duration: 2000
        });
      },
      onSocketConnected(){
        wx.showToast({
          title: "socket连接成功",
          duration: 2000
        });
      },
      onClosed(){
        wx.showToast({
          title: "网络已断开",
          icon: 'none',
          duration: 2000
        });
        wx.redirectTo({
            url: "../login/login"
          });
        me.conn.closed = true;
        WebIM.conn.close();
      },

      onPresence(message){
        //console.log("onPresence", message);
        switch(message.type){
        case "unsubscribe":
          // pages[0].moveFriend(message);
          break;
        // 好友邀请列表
        case "subscribe":
          if(message.status === "[resp:true]"){

          }
          else{
            // pages[0].handleFriendMsg(message);
            for (let i = 0; i < me.globalData.saveFriendList.length; i ++) {
                  if(me.globalData.saveFriendList[i].from === message.from){
                    me.globalData.saveFriendList[i] = message
                    disp.fire("em.xmpp.subscribe");
                    return;
              }
              }
            me.globalData.saveFriendList.push(message);
            disp.fire("em.xmpp.subscribe");
          }
          break;
        case "subscribed":
          wx.showToast({
            title: "添加成功",
            duration: 1000
          });
          disp.fire("em.xmpp.subscribed");
          break;
        case "unsubscribed":
          // wx.showToast({
          //  title: "已拒绝",
          //  duration: 1000
          // });
          break;
        case "memberJoinPublicGroupSuccess":
          wx.showToast({
            title: "已进群",
            duration: 1000
          });
          break;
        // 好友列表
        // case "subscribed":
        //  let newFriendList = [];
        //  for(let i = 0; i < me.globalData.saveFriendList.length; i++){
        //    if(me.globalData.saveFriendList[i].from != message.from){
        //      newFriendList.push(me.globalData.saveFriendList[i]);
        //    }
        //  }
        //  me.globalData.saveFriendList = newFriendList;
        //  break;
        // 删除好友
        case "unavailable":
          disp.fire("em.xmpp.contacts.remove");
          disp.fire("em.xmpp.group.leaveGroup", message);
          break;

        case 'deleteGroupChat':
          disp.fire("em.xmpp.invite.deleteGroup", message);
          break;

        case "leaveGroup": 
          disp.fire("em.xmpp.group.leaveGroup", message);
          break;

        case "removedFromGroup": 
          disp.fire("em.xmpp.group.leaveGroup", message);
          break;
        default:
          break;
        }
      },

      onTextMessage(message){
        console.log("onTextMessage", message);
        if(message){
          disp.fire('app.onTextMessage', message)
        }
      },
      onCustomMessage(message){
        console.log("onCustomMessage", message);
        if(message){
          disp.fire('app.onCustomMessage', message)
        }
      },

      // 各种异常
      onError(error){
        console.log(error)
        // 16: server-side close the websocket connection
        if(error.type == WebIM.statusCode.WEBIM_CONNCTION_DISCONNECTED && !logout){
          if(WebIM.conn.autoReconnectNumTotal < WebIM.conn.autoReconnectNumMax){
            return;
          }
          wx.showToast({
            title: "server-side close the websocket connection",
            duration: 1000
          });
          wx.redirectTo({
            url: "../login/login"
          });
          logout = true
          return;
        }
        // 8: offline by multi login
        if(error.type == WebIM.statusCode.WEBIM_CONNCTION_SERVER_ERROR){
          wx.showToast({
            title: "offline by multi login",
            duration: 1000
          });
          wx.redirectTo({
            url: "../login/login"
          });
        }
        if(error.type ==  WebIM.statusCode.WEBIM_CONNCTION_OPEN_ERROR){
          wx.hideLoading()
          disp.fire("em.xmpp.error.passwordErr");
          // wx.showModal({
          //  title: "用户名或密码错误",
          //  confirmText: "OK",
          //  showCancel: false
          // });
        }
        if (error.type == WebIM.statusCode.WEBIM_CONNCTION_AUTH_ERROR) {
          wx.hideLoading()
          disp.fire("em.xmpp.error.tokenErr");
        }
        if (error.type == 'socket_error') {///sendMsgError
          console.log('socket_errorsocket_error', error)
          wx.showToast({
            title: "网络已断开",
            icon: 'none',
            duration: 2000
          });
          disp.fire("em.xmpp.error.sendMsgErr", error);
        }
      },
    });

    if(!WebIM.conn.isOpened()){
      let userName = wx.getStorageSync('userName')
      let password = '000000'
      if(!userName){
        userName = utils.getIMUserId();
        return this.register(userName, password)
      }
      let userInfo = JSON.parse(userName)
      this.autoLogin(userInfo.userName, password)
    }

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  autoLogin(userName, password){
    var self = this;
    WebIM.conn.open({
      apiUrl: WebIM.config.apiURL,
      user: userName,
      pwd: password,
      appKey: WebIM.config.appkey,
      success(token) {
        console.log('登录成功', token)
        self.globalData.token = token.access_token
        disp.fire("app.loginSuccess");
      },
      error: e => {
        console.log('登录失败', e)
      }
    })
  },
  register(userName, password){
    let self = this;
    let nickName = USERS[parseInt(Math.random()*USERS.length)].nick
    if(!userName || !password){return}
    let options = {
      username: userName,
      password,
      nickname: nickName,
      success: function(res){
        console.log('注册成功：', res) 
        if(res.entities){
          wx.setStorage({
            key: "userName",
            data: JSON.stringify({userName, nickName})
          });
        }
        self.autoLogin(userName, password)
      },
      error: function(res){
        console.log('注册失败：', res) 
      }
    };
    WebIM.conn.registerUser(options);
  },
  globalData: {
    userInfo: null,
    width: 0,
    height: 0,
    token: ''
  }
})