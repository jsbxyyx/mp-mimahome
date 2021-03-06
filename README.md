# mp-mimahome 密码管理小程序

## 如何使用

### 使用本人的已经开发好的小程序(小程序搜索【密码Home】)

> 由于个人公众号不能打开网页，所以第1，2步需要在浏览器中完成

<del>GitHub帐号</del>

<del>1. 登录[Github](http://github.com)(没有帐号，请先注册)，在右上角的头像 -> Settings -> Developer settings -> Personal access tokens下，点击Generate new token 生成一个访问token</del>

<del>2. 生成token需要勾选repo权限(请保存下来，后面会用到)</del>
![./static/images/help2.png](./static/images/help2.png)

<del>**由于小程序域名要备案，api.github.com域名是未备案的，故不能使用了**</del>

Gitee帐号

1. 登录 [Gitee](https://gitee.com)(没有帐号，请先注册)，在 右上角头像 -> 设置 -> 私人令牌 -> 生成新令牌

2. 生成的 token 需要勾选 repo 权限，保存生成的 token
![./static/images/help3.png](./static/images/help3.png)


3. 进入小程序，点击我的，输入<del>github或者</del>gitee用户名，第2步中的token，以及加密密钥(加密密钥格式是16位字母或数字)

**重要事情说三遍：**

> 一定要保存好用户名，token，加密密钥

> 一定要保存好用户名，token，加密密钥

> 一定要保存好用户名，token，加密密钥


**备注:**

> <del>github用户名，token，加密密钥都是本地存储的，不会上传到云端，不信的话可以查看源码。(如果还不相信，可以自行部署小程序)</del>

> gitee用户名，token，加密密钥都是本地存储的，不会上传到云端，不信的话可以查看源码。(如果还不相信，可以自行部署小程序)


```
例子：
类型: github.com （推荐以网站名，或者你看名字就能知道是哪里的帐号）
帐号：test（用户名）
密码：Test123（密码）
```

![./static/images/image.png](./static/images/image.png)
