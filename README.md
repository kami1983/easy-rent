## 优势信息通
## 版本
### 1.2.1
* 修正一些系统BUG，包括普通公告显示模版的问题，以及新用户使用地图授权的问题。

### 1.2.2
* 在页面里面新增一个程序版本，直接添加到条款页面的尾部即可，用来区分当前程序的版本，已确定问题。 【OK】
* 授权使用用户头像之后，如果删除小程序则 tmp/xxx 目录就会被清除导致重新进入的时候无法显示头像，也就是说授权使用头像后，需要将头像缓存到存储服务器上。[OK]
* 需要重构上传图片的代码，放到data_tools里面。【OK】
* 授权后返回程序点击，授权按钮后虽然没有弹出授权按钮，但是提示授权的 cover 层没有自动隐藏，或者点击后需要隐藏。【OK】
* 在消息界面上提示用户：“消息为用户个人发送，属于个人行为，注意分辨。” 【OK】

## ToDoList
* 分享后可以通过分享连接获取积分的功能，每个用户点击后标记share_id[分享人], open_id[点击人], new_id[新闻id], 这三个上唯一索引不能重复 
* 所有消息发布的时候都需要选择一个社区，这个社区的初始列表来源是位置授权，或者手动的选择。
* 联系方式不一定非要是电话，如果不是电话就不需要显示打电话的按钮

```

所以需要一个：社区名称（李庄家园） =》 中心坐标 的列表集合。

用户

```