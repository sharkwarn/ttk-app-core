import { Toast, Notification, Modal, Popconfirm, localeWrapper, Alert } from 'edf-component'
import { fetch, environment } from 'edf-utils'
// import './mock.js'

var _options = {}


fetch.config({
	mock: false,
	after: (response, url, data, header) => {
		if (response.result) {
			if (response.token) {
				fetch.config({ token: response.token })
			}
			return response
		}
		else {
			if (data && data.isReturnValue) {
				return response
			}
			else {
				let errorCode = ''
				if(response.error && response.error.code){
					errorCode = response.error.code
				}
				if (environment.isDevMode()) {
					Modal.error({ title: '错误:' + errorCode || '', okText: '关闭', width: 600, bodyStyle: 'height:300px;overflow:auto;', content: response.error.message })
				}
				else {
					Toast.error(response.error.message)
				}
				return
			}
		}
	}
})

function config(options) {
	Object.assign(_options, options)

	//对应用进行配置，key会被转换为'^<key>$'跟app名称正则匹配
	_options.apps && _options.apps.config({
		'*': {
			//webapi,//正式网站应该有一个完整webapi对象，提供所有web请求函数
			webProvider: fetch.mock,
			//dbProvider: websql,
			dbConfig: {
				name: 'test'
			},
		},
		'edfx-app-root': {
			startAppName: 'edfx-app-login',
		}
	})

	//require('./mock.js')
	_options.targetDomId = 'app' //react render到目标dom
	_options.startAppName = 'edfx-app-root' //启动app名，需要根据实际情况配置

	_options.toast = Toast //轻提示使用组件，edf-meta-engine使用
	_options.notification = Notification //通知组件
	_options.modal = Modal //模式弹窗组件
	_options.popconfirm = Popconfirm //confirm提示组件
	_options.alert = Alert //alert
	_options.rootWrapper = (child) => localeWrapper('zh-CN', child) //国际化处理
	return _options
}

config.current = _options

export default config
