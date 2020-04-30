import IMsdk from "../sdk/webimSDK3.1.1";
// import IMsdk from "../sdk/sdk/src/connection";
IMsdk.config = {
	/*
	 * XMPP server
	 */
	xmppURL: "wss://im-api-wechat.easemob.com/websocket", //沙箱环境
	// xmppURL: 'ws://39.107.156.84:5280/ws/',
	/*
	 * Backend REST API URL
	 */
	// apiURL: (location.protocol === 'https:' ? 'https:' : 'http:') + '//a1.easemob.com',
	// ios must be https!!! by lwz
	apiURL: "https://a1.easemob.com", //沙箱环境
	// apiURL: 'https://172.17.3.155:8080',
	/*
	 * Application AppKey 1102190314084694#supplymall
	 */
	appkey: "easemob-demo#chatdemoui",
	/*
	 * Whether to use HTTPS      '1177161227178308#xcx'
	 * @parameter {Boolean} true or false
	 */
	https: false,
	/*
	 * isMultiLoginSessions
	 * true: A visitor can sign in to multiple webpages and receive messages at all the webpages.
	 * false: A visitor can sign in to only one webpage and receive messages at the webpage.
	 */
	isMultiLoginSessions: false,
	/**
	 * Whether to use window.doQuery()
	 * @parameter {Boolean} true or false
	 */
	isWindowSDK: false,
	/**
	 * isSandBox=true:  xmppURL: 'im-api.sandbox.easemob.com',  apiURL: '//a1.sdb.easemob.com',
	 * isSandBox=false: xmppURL: 'im-api.easemob.com',          apiURL: '//a1.easemob.com',
	 * @parameter {Boolean} true or false
	 */
	isSandBox: false,
	/**
	 * Whether to console.log in strophe.log()
	 * @parameter {Boolean} true or false
	 */
	isDebug: false,
	/**
	 * will auto connect the xmpp server autoReconnectNumMax times in background when client is offline.
	 * won't auto connect if autoReconnectNumMax=0.
	 */
	autoReconnectNumMax: 15,
	/**
	 * the interval secons between each atuo reconnectting.
	 * works only if autoReconnectMaxNum >= 2.
	 */
	autoReconnectInterval: 2,
	/*
	 * Set to auto sign-in
	 */
	isAutoLogin: true
}
IMsdk.conn = new IMsdk.connection({
	appKey: IMsdk.config.appkey,
    isHttpDNS: IMsdk.config.isHttpDNS,
    isMultiLoginSessions: IMsdk.config.isMultiLoginSessions,
    host: IMsdk.config.Host,
    https: IMsdk.config.https,
    url: IMsdk.config.xmppURL,
    apiUrl: IMsdk.config.apiURL,
    isAutoLogin: false,
    heartBeatWait: IMsdk.config.heartBeatWait,
    autoReconnectNumMax: IMsdk.config.autoReconnectNumMax,
    autoReconnectInterval: IMsdk.config.autoReconnectInterval,
    isStropheLog: IMsdk.config.isStropheLog,
    delivery: IMsdk.config.delivery
});

export default IMsdk

