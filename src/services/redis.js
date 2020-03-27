'use strict'

module.exports = function(URL_CONECTION) {
  const Redis = require("async-redis")
  const redis = Redis.createClient(URL_CONECTION)
  
  let service = {}
  
  service.set = function (clave, value) {
    return redis.set(clave, value)
  }
  
  service.get = async function (clave) {
    let resultado = await redis.get(clave)
    return resultado
  }

  service.setObject = function (clave, value) {
    return redis.hmset(clave, value)
  }
  
  service.getObject = async function (clave) {
    let resultado = await redis.hgetall(clave)
    return resultado
  }

  return service
}