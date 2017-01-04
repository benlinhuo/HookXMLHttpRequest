
(function(W) {
	var xmlHttpRequestBackup;
	//  我们可以将想要替换的方法，通过 `hookXMLHttpRequest` 方法的处理。将原生的对应方法加上需要额外处理的事情
	W.hookXMLHttpRequest = function(funcs) {

		// 在替换原生之前，先备份。以便恢复
		xmlHttpRequestBackup = xmlHttpRequestBackup || XMLHttpRequest;
		// 重写 XMLHttpRequest，原生 XMLHttpRequest 就是一个 function
		XMLHttpRequest = function () {
			this.xhr = new xmlHttpRequestBackup;
			// 遍历原生 XMLHttpRequest 的所有方法和属性
			for (var attr in this.xhr) {
				var type = typeof this.xhr[attr];
				if (type === 'function') {
					this[attr] = hookXHRFunction(attr);

				} else {
				 	// 为属性设置 get和 set 方法
					Object.defineProperty(this, attr, {
						get: getter(attr),
						set: setter(attr)
					});
				}
			}
		}

		function hookXHRFunction(func) {
			return function() {
				var arrArgs = Array.prototype.slice.call(arguments);// 对象转数组
				// 指定额外需要处理的方法
				if (funcs[func]) {
					funcs[func].call(this, arrArgs, this.xhr);
				}
				// 原生本应处理的内容
				this.xhr[func].apply(this.xhr, arrArgs);
			}
		}

		function getter(attr) {
			return function() {
				return this.xhr[attr];
			}
		}

		function setter(attr) {
			return function(fn) {
				var xhr = this.xhr;
				var self = this;
				// 指定要处理的方法集合：funcs
				if (funcs[attr]) {
					xhr[attr] = function() {
						// 非原生额外做的事情
						funcs[attr](self);
						// 原生属性做的事情
						fn.call(xhr, xhr);
					}

				} else {
					xhr[attr] = fn;
				}
			}
		}

	};

	W.unHookXMLHttpRequest = function() {
		if (xmlHttpRequestBackup) {
			XMLHttpRequest = xmlHttpRequestBackup;
		}
		xmlHttpRequestBackup = undefined; // 重置
	}

})(window);



