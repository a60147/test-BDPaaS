#!/bin/bash
# -> Start/Stop BDPaaS API Server
#
#
pushd `dirname $0` > /dev/null
SCRIPTPATH=`pwd`

cmd=$(basename $0)
bas_pid=$(ps -ef |grep bas_SimpleWebSrv.py |grep -v grep |awk -F' ' '{print $2}')

if [[ $1 = "start" ]]; then
	# start api server
	if [[ ! -z ${bas_pid} ]]; then
		echo -e "\n[${cmd}] - API server is already running: ${bas_pid}\n"
	else
		./bas_SimpleWebSrv.py 127.0.0.1 15001   > ./_bas_apiserver.log &
		bas_pid=$(ps -ef |grep bas_SimpleWebSrv.py |grep -v grep |awk -F' ' '{print $2}')
		echo -e "\n[${cmd}] - API server is running: ${bas_pid}\n"
	fi
else
	# stop api server
	if [[ ! -z ${bas_pid} ]]; then
		kill -9 ${bas_pid}
		echo -e "\n[${cmd}] - API server is stopped: ${bas_pid}\n"
	else
		echo -e "\n[${cmd}] - API server is already stopped!\n"
	fi
fi

popd > /dev/null
SCRIPTPATH=`pwd`

