'use strict'

module.exports = function (URL_CONECTION) {
  const Redis = require("async-redis")
  const redis = Redis.createClient(URL_CONECTION)
  redis.on('error', function (err) {
    console.log(URL_CONECTION + " " + err);
  })
  redis.on('connect', function () {
    console.log('Redis connected ' + URL_CONECTION);
  })
  
  let service = {}

  service.set = function (clave, value) {
    if (redis.connected)
      return redis.set(clave, value)
    else
      return false
  }

  service.setWithExpire = function (clave, value, expire) {
    if (redis.connected) {
      if (expire)
        return redis.set(clave, value, 'EX', expire)
      else
        return redis.set(clave, value)
    } else
      return false
  }

  service.get = async function (clave) {
    if (redis.connected) {
      let resultado = await redis.get(clave)
      return resultado
    } else
      return false
  }

  service.setJson = function (clave, value) {
    if (redis.connected)
      return redis.set(clave, JSON.stringify(value))
    else
      return false
  }

  service.getJson = async function (clave) {
    if (redis.connected) {
      let resultado = await redis.get(clave)
      return JSON.parse(resultado)
    } else
      return false
  }

  service.setObject = function (clave, value) {
    if (redis.connected) {
      return redis.hmset(clave, value)
    }
    return false
  }

  service.getObject = async function (clave) {
    if (redis.connected) {
      let resultado = await redis.hgetall(clave)
      return resultado
    } else
      return false
  }

  service.deleteByPattern = async function (pattern) {
    if (redis.connected) {
      const keys = await redis.keys(pattern)
      keys.forEach(key => {
        redis.del(key)
      })
      return keys
    } else
      return false
  }

  service.deleteByKey = async function (key) {
    if (redis.connected)
      return await redis.del(key)
    else
      return false
  }

  // Clear All Keys
  service.clearAll = async function () {
    if (redis.connected) {
      return await redis.flushall();
    }
    else
      return false
  }

  return service
}
