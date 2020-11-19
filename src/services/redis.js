'use strict'

module.exports = function(URL_CONECTION) {
  const Redis = require("async-redis")
  var redisDeletePattern = require('redis-delete-pattern');
  const redis = Redis.createClient(URL_CONECTION)
  
  let service = {}
  
  service.set = function (clave, value) {
    return redis.set(clave, value)
  }

  service.setWithExpire = function (clave, value, expire) {
    if(expire)
      return redis.set(clave,value,'EX', expire)
    else
      return redis.set(clave,value)
  }
  
  service.get = async function (clave) {
    let resultado = await redis.get(clave)
    return resultado
  }

  service.setJson = function (clave, value) {
    return redis.set(clave, JSON.stringify(value))
  }
  
  service.getJson = async function (clave) {
    let resultado = await redis.get(clave)
    return JSON.parse(resultado)
  }

  service.setObject = function (clave, value) {
    return redis.hmset(clave, value)
  }
  
  service.getObject = async function (clave) {
    let resultado = await redis.hgetall(clave)
    return resultado
  }

  service.deleteByPattern = async function (pattern) {
    redisDeletePattern({ redis: redis, pattern: pattern });
  }

  service.deleteByKey = async function (key) {
    redis.del(key)
  }

  // Clear All Keys
  service.clearAll = async function () {
    redis.flushall('ASYNC');
  }

  return service
}