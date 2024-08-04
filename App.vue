<script>
	
	let cloudApi = null
	
	async function getCloudApi() {
		if(cloudApi != null) {
			return cloudApi
		}
		cloudApi = new wx.cloud.Cloud({
		  resourceAppid: 'wxf6e7dbe6198c7f06', // 微信云托管环境所属账号，服务商appid、公众号或小程序appid
		  resourceEnv: 'prod-4g3usz1465b5625e', // 微信云托管的环境ID
		})
		await cloudApi.init() // init过程是异步的，需要等待init完成才可以发起调用
		return cloudApi
	}
	
	/**
	 * 封装的微信云托管调用方法
	 * @param {*} obj 业务请求信息，可按照需要扩展
	 * @param {*} number 请求等待，默认不用传，用于初始化等待
	 */
	async function callWithWxCloud(obj, number=0){
	  const that = this
	  // if(that.cloud == null){
	  //   that.cloud = new wx.cloud.Cloud({
	  //     resourceAppid: 'wxf6e7dbe6198c7f06', // 微信云托管环境所属账号，服务商appid、公众号或小程序appid
	  //     resourceEnv: 'prod-4g3usz1465b5625e', // 微信云托管的环境ID
	  //   })
	  //   await that.cloud.init() // init过程是异步的，需要等待init完成才可以发起调用
	  // }
	  const cloudApi = await getCloudApi()
	  console.log('cloudApi - DEBUG ', cloudApi)
	  try{
	    const result = await cloudApi.callContainer({
	      path: obj.path, // 填入业务自定义路径和参数，根目录，就是 / 
	      method: obj.method||'GET', // 按照自己的业务开发，选择对应的方法
		  data: obj.data||{},
	      // dataType:'text', // 如果返回的不是json格式，需要添加此项
	      header: {
	        'X-WX-SERVICE': 'express-8zu8', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
	        // 其他header参数
	      }
	      // 其余参数同 wx.request
	    })
	    console.log(`微信云托管调用结果${result.errMsg} | callid:${result.callID}`)
	    return result.data // 业务数据在data中
	  } catch(e){
	    const error = e.toString()
	     // 如果错误信息为未初始化，则等待300ms再次尝试，因为init过程是异步的
		 console.log("Cloud API isn't enabled", error)
	    if(error.indexOf("Cloud API isn't enabled")!=-1 && number<3){
	      return new Promise((resolve)=>{
	        setTimeout(function(){
	          // resolve(that.call(obj,number+1))
			  resolve(that.callWithWxCloud(obj, number + 1));
	        },300)
	      })
	    } else {
	      throw new Error(`微信云托管调用失败${error}`)
	    }
	  }
	}
	
	export default {
		globalData: {  
			isWxEnv: false,
			userInfo: {
				nickName: '..',
				avatarUrl: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132'
			},
			getCloudApi: getCloudApi(),
			callWithWxCloud
		},  
		callWithWxCloud,
		onLaunch: function() {
			
			const that = this; // 保存 this 的引用
			console.log('App Launch', this.globalData)
			
			if(wx.cloud) {
					
				that.globalData.isWxEnv = true;
				wx.getUserInfo({
				  success: function (res) {
				    const userInfo = res.userInfo;

				    // 使用头像和昵称
					console.log({userInfo})
					that.globalData.userInfo = userInfo
					
					callWithWxCloud({
						path: '/registerUser',
						method: 'POST',
						data: userInfo
					}).then(res => {
						console.log('Debug res', res)
					});
					
				  },
				  fail: function (err) {
				    console.log('获取用户信息失败', err);
				  }
				});
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
