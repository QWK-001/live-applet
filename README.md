# 环信--小程序直播聊天室
# 介绍
******
环信直播小程序demo是基于环信im SDK开发的一款直播小程序。这个demo可以帮助开发者们更轻松的集成环信SDK。
demo 包含以下功能
  - 主播开播、下播
  - 直播间聊天系统
  - 点赞、礼物系统（示例不包含api）
  - 房间禁言、黑白名单
# 在本地跑起来
拉取代码，导入开发者工具即可运行起来。

# 项目结构
```shell
|- template 自定义组件目录
    |- card 直播间列表（已开播、未开播、立即开播）
    |- gift 礼物组件
    |- memberListModa 成员列表组件（直播间成员、禁言名单、白名单）
|-pages 功能页面
    |-abount 关于直播间
    |-active 开播列表
    |-index 正在直播列表
    |-live 直播间详情页面 （大部分逻辑都在此页面）
|-utils 工具类和sdk的一些配置
|-sdk 环信sdk
|-app.js 小程序根实例，存放一些全局变量，注册监听事件
|-app.json 注册页面以及全局的一些配置
|-app.wxss 一些全局样式
|-project.config.json工程的一些配置，和开发者工具 “详情” 中的设置一样
```
# 可以复用的代码
如果想快速搭建起一个有im能力的直播小程序，可以选择复用demo中的代码，其中utils以帮助快速集成sdk，template组件里面包含礼物系统、直播列表card等

# 常见问题
+ 怎么发扩展消息？

  构造消息的时候msg.set(option)， option中传人ext字段，即可发送扩展消息,具体可以查看[文档](http://docs-im.easemob.com/im/applet/message#%E5%8F%91%E9%80%81%E6%96%87%E6%9C%AC%E6%B6%88%E6%81%AF_%E5%8D%95%E8%81%8A)。

# 写在最后
第一期直播小程序demo完善了直播间聊天部分，主播开播下播、白名单用户、房间禁言等 [礼物、点赞类的实现的仅仅是静态示例。真正结合实际应用场景还需要用户根据自己的需求完善]

注意：这期我们没有加入用户系统、都是随机生成的。后续我们会引入直播视频、弹幕漂浮。让这款demo真正看起来符合一个开箱即用快速集成的直播小程序。

还有一些功能demo没有去实现但是sdk是支持的，要用到的话大家可以去查[文档](https://webim.easemob.com/sdk/jsdoc/out/connection.html) [当然也可以在环信提工单进行咨询]