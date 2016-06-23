'use strict'

const express = require('express')
const fs = require('fs-extra')
const path = require('path')
const Mustache = require('mustache')

const app = express()
const _config = path.join(process.cwd(), '.config')

/**
 * @param  {object} req 请求对象
 * @param  {object} res 响应对象
 */
const render = function(req, res) {
  const data = Object.assign({}, this.data) 

  Object.keys(data).forEach(key => {
    if (typeof data[key] === 'string') {
      data[key] = Mustache.render(data[key], req)
    }
  })

  if (app.get('view engine') && this.template) {
    res.render('index', data)
  } else {
    res.json(data)
  }
}

module.exports = () => {
  if (fs.existsSync(_config)) {
    const config = fs.readJsonSync(_config)
    const staticPath = path.join(process.cwd(), config.static)
    const jsonPath = path.join(process.cwd(), config.json)  

    switch (config.templateEngine) {
      case 'mustache':
        app.engine('mustache', require('mustache-express')())
        break
    }
    
    app.use(express.static(staticPath))
    app.set('view engine', config.templateEngine)
    app.set('views', config.views)

    fs.watchFile(_config, () => {
      console.log(_config, 'has changed!')
    })

    app.listen(config.port, err => {
      console.log('You can see your website in http://127.0.0.1:' + config.port)
    })

    if (fs.existsSync(jsonPath)) {
      const route = fs.readJsonSync(jsonPath)
      const toString = Object.prototype.toString

      Object.keys(route).forEach(path => {
        switch (toString.call(route[path])) {
          case '[object Object]':
            app[route[path].method](path, render.bind(route[path]))
            break
          case '[object Array]':
            const topRoute = route[path]

            route[path].forEach((el, index) => {
              const newPath = path + topRoute[index].path

              app[topRoute[index].method](newPath, render.bind(topRoute[index]))
            })
            break
        }
      })
    }
  }
}
