
// 在保证 hook-XMLHttpRequest.js 在该文件之前加载成功，该文件依赖于它

// 如下是用于记录日至，统一写的代码
hookXMLHttpRequest({
	// 属性，callback 执行，只传递过来了 xhr
	onload: function(xhr) {
		console.log('onload has called');
	},

	// 方法，callback 执行，传递了：第一部分参数是调用原生对应方法传递的参数，第二部分参数是 xhr
	open: function(args, xhr) {
		console.log("open called: method:%s,url:%s,async:%s",args[0],args[1],args[2],xhr)
	},

	send: function(args, xhr) {
		console.log('send has called');
	}
});