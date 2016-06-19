'use strict'

const fs=require('fs')
const extend=require('extend-deep')
const deepFreeze=require('deep-freeze-strict')

const defaultConfig={
	"port":process.env.NODE_PORT||5000,
	"host": "localhost:"+this.port,
	"dashboardEndpoint":"/dashboard"

}

const config={
	"development":{
		"port":6000
	}
}

module.exports=deepFreeze(
	extend(true,defaultConfig,(config[process.env.NODE_ENV]||config.development))
	)
