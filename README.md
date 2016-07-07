
# 简介

render-server 是一个用于前后端分离的工具。和后端开发者约定好使用的模板引擎（必须支持 Node），通过配置`.config`文件和自定义的`json`路由配置文件来渲染获取数据以及渲染模板！

# 安装

目前还没有放到 npm 上，先通过 git 克隆本项目到本地。

```Shell
git clone https://github.com/q545244819/render-server.git
cd render-server
npm link
```

**注意：运行完上面的命令后，不要删除项目，因为全局命令还是调用这个项目的代码！！！**

# 使用

确保你已经安装了 render-server 后，可以再终端使用`rs help`来查看命令，直接启动渲染服务就使用`rs start`:

```
cd my-project
rs start
```

# 配置文件

为了能够正确的渲染你写好的模板和路由配置文件，你需要再项目根目录下新建两个文件`.config`和一个路由配置文件（后缀为`json`）：

**.config**:

```JSON
{
  "views": "./views",
  "static": "./public",
  "json": "./route.json",
  "locals": "./locals.json",
  "templateEngine": "ejs",
  "port": 8080
}
```

<table>
    <tr>
        <th>属性名</th>
        <th>描述</th>
        <th>必须</th>
    </tr>
    <tr>
        <td>views</td>
        <td>模板文件存放的路径（相对于根目录）</td>
        <td>是</td>
    </tr>
    <tr>
        <td>static</td>
        <td>静态资源文件存放的路径（相对于根目录）</td>
        <td>是</td>
    </tr>
    <tr>
        <td>json</td>
        <td>路由配置文件存放的路径（相对于根目录）</td>
        <td>是</td>
    </tr>
    <tr>
        <td>locals</td>
        <td>全局变量配置文件存放的路径（相对于根目录）</td>
        <td>否</td>
    </tr>
    <tr>
        <td>templateEngine</td>
        <td>指定使用模板引擎，目前支持 ejs、jade 和 mustache ！</td>
        <td>是</td>
    </tr>
    <tr>
        <td>port</td>
        <td>访问测试服务器端口</td>
        <td>是</td>
    </tr>
</table>

路由配置文件（名称随意），后缀为`json`：

```JSON
{
  "/": {
    "method": "get",
    "template": "index",
    "data": {
      "title": "Hey",
      "message": "Hello there!"
    }
  },
  "/api": [
    {
      "method": "get",
      "path": "/:name/age",
      "data": {
        "name": "{{ params.name }}",
        "age": 20  
      }
    }
  ]
}
```

参照上面的路由配置文件 demo，为一个对象，`key`为路径，`value`为对象或者数组。

<table>
    <tr>
        <th>属性名</th>
        <th>描述</th>
    </tr>
    <tr>
        <td>template</td>
        <td>要渲染模板的路径如果没有就返回 JSON 数据</td>
    </tr>
    <tr>
        <td>data</td>
        <td>传入的数据</td>
    </tr>
    <tr>
        <td>path</td>
        <td>如果是根目录下面子目录，则这个为子目录的路径</td>
    </tr>
</table>

注意：如果`value`是数组的话，你需要在每一个数组元素（对象）设置一个`path`为子路径，如上面的`/api`的写法，你可以访问`/api/:name/age`获取对应的数据。

# 全局变量配置文件

有可能某些数据是在所有页面都会使用到的，例如用户的信息等，所以我们需要单独配置一个全局变量配置文件，我一般命名为`locals.json`

例子：

```JSON
{
  "user": {
    "name": "john",
    "mobilePhoneNumber": "110"
  }
}
```

全局变量配置文件就是一个普通的`json`文件，然后只需要把用到的假数据写进去。你就可以直接在模板里面使用到了，不需要每一个重新定义一次。不过要注意自己之前路由配置文件里面`data`是有和全局变量重名的属性！

# 获取 query、params 和 body 的值

如果你想要获取 query string、 params 和 post body 的值的话，并且返回来。你可以再`data`里使用模板，如：

**注意：只能再路由配置文件的`data`里面使用！！！**

```JSON
{
  "/": {
    "method": "get",
    "template": "index",
    "data": {
      "message": "{{ query.message }}"
    }
  }
}
```

然后访问`/?message=hello`的话，`data`里的`message`值会通过模板编译为对应的值。

 - `query`：获取 query string 的值，使用方法：`{{ query.demo }}`
 - `params`：获取 params 的值，使用方法：`{{ params.demo }}`
 - `body`：获取 post body 的值，使用方法：`{{ body.demo }}`

# TODO

  - [x] 支持全局变量
  - [ ] 修改配置文件自动重新启动项目
  - [ ] 支持 handlebars 模板语言

# Licences

MIT
