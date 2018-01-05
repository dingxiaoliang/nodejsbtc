'use strict'

function init()
{
	let readline = require('readline').createInterface(
		{
			input: process.stdin,
			output: process.stdout
		})

	readline.on(
		'line', 
		function(cmd) 
		{
			if(cmd[0] == '!')
			{
				cmd = cmd.substr(1)

				try
				{
					eval(cmd)	
				}
				catch(err)
				{
					console.log(err)
				}
			}
			else
			{
				switch(cmd)
				{
				case 'listen':
					if(g_server.m_readys != 0/*3*/)
					{
						console.log('服务器还没有准备好呦~~~么么哒~~ ' + g_server.m_readys)
						break
					}

					g_server.m_net.listen(g_config['listenPort'], '')
					break
				case 'info':
					{
						console.log('')
						console.log('pid: ' + process.pid)
						console.log('')
						console.log('connections: ' + g_server.m_connections)

						let count = 0
						for(let k in g_server.m_usersBySID)
						{
							++count	
						}
						console.log('usersBySID: ' + count)

						count = 0
						for(let k in g_server.m_usersByID)
						{
							++count
						}
						console.log('usersByID: ' + count)

						count = 0
						for(let k in g_server.m_rolesByID)
						{
							++count
						}
						console.log('rolesByID: ' + count)
						console.log('')

						console.log(process.memoryUsage())
					}
					break
				case 'quit':
					{
						// 不在允许新的连接
						//g_server.m_net.close()

						// 
						g_serverHttp.m_http.close()

						// 踢掉所有连接
						/*for(let k in g_server.m_usersBySID)
						{
							let user = g_server.m_usersBySID[k]
							user.m_socket.destroy()
						}*/

						// 关控制台
						readline.close()

						// 停止timer
						//clearInterval(g_server.m_timer)

						// 存盘
						//g_shellMgr.save()

						//
						/*if(g_server.m_connections == 0 && !g_server.m_net._handle)
						{
							// 所有连接没了才能关数据库
							g_mysql.end()
						}*/
					}
					break
				}
			}
		})
}

module.exports.init = init
