#!/bin/bash
#
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

#
# Manage user namespaces & Spark jobs
#
#

JOBS_PATH="./modules/spark/"
JOBS=(\
	spark-master-controller.yaml \
	spark-master-service.yaml \
	spark-ui-proxy-controller.yaml \
	spark-ui-proxy-service.yaml \
	spark-worker-controller.yaml \
	zeppelin-controller.yaml \
	zeppelin-service.yaml)
SPECS=(\
	spark-master \
	sss \
	spark-ui-proxy \
	sss \
	spark-worker \
	zeppelin-controller)
URLS=(\
	'spark-ui-proxy' \
	'zeppelin')

loop=3
LOOP_CHECK_NS_READY=60
LOOP_CHECK_NS_CLOSE=60


#
check_pod_ready()
{
	local _ns _pod _loop i
	_ns=$1
	_pod=$2
	_loop=$3

	for(( i=0;i<${_loop};i++ )); do 
		_r=`kubectl -n ${_ns} get po ${_pod} 2>/dev/null  | grep -i "running"`
		[[ ! -z ${_r} ]] && return 0
		echo -n "."
		sleep 1
	done
	return 1
}

check_podspec_ready()
{
	local _ns _pod _loop _nn i

	([ -z $1 ] || [ -z $2 ]) && echo -e "\nPls specify namespace and pod spec\n" && exit 1
	_ns=$1
	_podspec=$2
	_loop=loop
	[[ ! -z $3 ]] && _loop=$3

	_pods=(`kubectl -n ${_ns} get po | tail -n +2 | grep ${_podspec} | awk -L' ' '{ print $1 }'`)
	_nn=${#_pods[*]}
	[[ $_nn = 0 ]] && return 1

	#
	for(( i=0;i<${_nn};i++ )); do
		_pod="${_pods[$i]}"
		check_pod_ready ${_ns} ${_pod} ${_loop}
		if [[ $? = 0 ]]; then
			echo "   [Y] "${_pod}" ready"
		else
			echo "      [N] "${_pod}" not ready!"
			return 1
		fi
	done
	return 0
}

start_spark_job()
{
	local _ns _nn _ready _rr i j

	_ns=$1
	echo -e "\nStart spark jobs in namespace: "${_ns}"\n"

	# check if namespace exists already
	kubectl get namespace ${_ns} >/dev/null 2>&1
	[[ $? = 0 ]] && echo -e "\nNamespace already exists: "${_ns}"\n" && return 1

	# create namespace
	kubectl create namespace ${_ns}

	echo ""

	_nn=${#JOBS[*]}
        for(( i=0;i<${_nn};i++ )); do
		echo "   [INFO]: create pod - ${JOBS[$i]}"
		kubectl -n ${_ns} create -f ${JOBS_PATH}/${JOBS[$i]}
		[[ $? != 0 ]] && echo "      [ERR]: fail to create!" && return 1
		sleep 1
		echo ""
	done

	# check pods ready
	_loops=LOOP_CHECK_NS_READY
        for(( i=0;i<${_loops};i++ )); do
		_ready=true
		_nn=${#SPECS[*]}
        	for(( j=0;j<${_nn};j++ )); do
			[[ ${SPECS[$j]} = "sss" ]] && continue
			check_podspec_ready ${_ns} ${SPECS[$j]}
			[[ $? = 0 ]] && continue	# it's ready & check next one
			_ready=false
			sleep 1
		done
		[[ "${_ready}" = "true" ]] && \
			echo -e "\n>>> nNamespace is running up: "${_ns}"\n" && \
			echo "" && \
			kubectl -n ${_ns} get po && \
			echo "" && \
			kubectl -n ${_ns} get svc && \
			return 0
	done	

	# something wrong...!
	echo ""
	kubectl -n ${_ns} get po
	echo ""
	kubectl -n ${_ns} get svc
	return 1
}

stop_spark_job()
{
	local _ns _nn _ready _rr i j

	_ns=$1
	echo -e "\nStop spark jobs in namespace: "${_ns}"\n"

	# check if namespace exists
	kubectl get namespace ${_ns} >/dev/null 2>&1
	[[ $? != 0 ]] && echo -e "\nNamespace does noty exist: "${_ns}"\n" && return 1

	_nn=${#JOBS[*]}
        for(( i=0;i<${_nn};i++ )); do
		echo "   [INFO]: delete pod - ${JOBS[$i]}"
		kubectl -n ${_ns} delete -f ${JOBS_PATH}/${JOBS[$i]}
		[[ $? != 0 ]] && echo "      [ERR]: fail to delete!" && echo "" && continue
		echo ""
		sleep 1
	done

	# check pods closed
	echo ""
	_ready=false
	_loops=LOOP_CHECK_NS_CLOSE
	echo "   [INFO]: checking pods"
        for(( i=0;i<${_loops};i++ )); do
		_rr=`kubectl -n ${_ns} get po`
		[[ ! -z ${_rr} ]] && sleep 1 && echo -n "." && continue	# pods not closed yet
		_ready=true
		break
	done
	[[ "${_ready}" = "false" ]] && (echo ""; kubectl -n ${_ns} get po;)

	echo ""
	_ready=false
	echo "   [INFO]: checking services"
        for(( i=0;i<${_loops};i++ )); do
		_rr=`kubectl -n ${_ns} get svc`
		[[ ! -z ${_rr} ]] && sleep 1 && echo -n "." && continue	# services not closed yet
		_ready=true
		break
	done	
	[[ "${_ready}" = "false" ]] && (echo ""; kubectl -n ${_ns} get svc;)

	echo ""

	# delete namespace
	kubectl delete namespace ${_ns}
	sleep 5

	echo -e "\nNamespace cleared: "${_ns}"\n"
	return 0

}

query_spark_url()
{
	local _ns _k8s_server_eth0 _k8s_server_ip _nn _n _rr _url _js i j

	_ns=$1

	# check if namespace exists
	kubectl get namespace ${_ns} >/dev/null 2>&1
	[[ $? != 0 ]] && return 1

	_k8s_server_eth0=$2
	_k8s_server_ip=`ip address show ${_k8s_server_eth0} | grep 'inet ' | awk -F' ' '{print $2}' | awk -F'/' '{print $1}'`

	_nn=${#URLS[*]}
	let "_n = ${_nn} - 1"
	_js="{"
        for(( i=0;i<${_nn};i++ )); do
		_has_type=`kubectl -n ${_ns} get svc | head -n 1 | grep "TYPE"`
		_rr=`kubectl -n ${_ns} get svc | grep '^'${URLS[$i]}' '`
		[[ $? != 0 ]] && echo "      [ERR]!" && return 1
		if [[ ${_has_type} = "" ]]; then
			_url=`echo "${_rr}" | awk -F' ' '{print $4}' | awk -F'[:/]' '{print $2}'`
		else
			_url=`echo "${_rr}" | awk -F' ' '{print $5}' | awk -F'[:/]' '{print $2}'`
		fi
		_js=${_js}"\"${URLS[$i]}\": \"http://${_k8s_server_ip}:${_url}\""
		[[ $i != ${_n} ]] && _js=${_js}", "
	done
	_js=${_js}"}"
	echo "${_js}"
	return 0
}


#---
# main
#---
pushd `dirname $0` > /dev/null
SCRIPTPATH=`pwd`


[ -z $1 ] && echo -e "\nPls specify namespace to run spark jobs\n" && exit 1

ns=$1
cmd=`echo $2 | tr '[:upper:]' '[:lower:]'`
k8s_server_eth0=$3

case "${cmd}" in
	"start")
		start_spark_job ${ns}
		ret=$?
		echo ""
		;;
	"stop")
		stop_spark_job ${ns}
		ret=$?
		echo ""
		;;
	"queryurl")
		if [[ -z ${k8s_server_eth0} ]]; then
#			echo -e "\nPls specify k8s server interface!\n"
			ret=1
		else
			ip address show ${k8s_server_eth0} > /dev/null
			if [[ $? != 0 ]]; then
#				echo -e "\n   [ERR]: incorrect interface!\n"
				ret=1
			else
				query_spark_url ${ns} ${k8s_server_eth0}
				ret=$?
			fi
		fi
		;;
	*)
		echo -e "\nIncorrect command: ${cmd}!\n"
		ret=1
		;;
esac


#
popd > /dev/null
SCRIPTPATH=`pwd`

exit ${ret}
