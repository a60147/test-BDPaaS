#!/usr/bin/python
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
# Drive Spark & Apex jobs by calling into shell scripts
#
#

import sys
import os
import json
import subprocess

BDPAAS_PORT = 15001
APM_URL1 = "curl http://127.0.0.1:"+str(BDPAAS_PORT)+"/api/v1/project_finish -X POST -H 'Content-Type:application/json' --data '"
APM_URL2 = "'"

K8SRUN_COMMAND_SPARK = './bas_spark_nsjob.sh'
K8SRUN_COMMAND_APEX = './bas_apex_nsjob.sh'
K8SRUN_START = 'start'
K8SRUN_STOP = 'stop'
K8SRUN_QUERYURL = 'queryurl'
BDPAAS_MODULE_SPARK = 'spark'
BDPAAS_MODULE_APEX = 'apex'
BDPAAS_MODULE_TYPE = ( 'spark', 'apex' )

k8s_namespace = ''
k8s_bashcommand = ''
k8s_qurlcommand = ''

# public network interface
config_file='bas_apiserver.conf'
import ConfigParser
config = ConfigParser.ConfigParser()
config_path = os.path.join(os.path.dirname(os.path.abspath(sys.modules['__main__'].__file__)), config_file)
config.read(config_path)
K8S_SERVER_ETH0 = config.get('default', 'PUBLIC_NIC')


#
def getns(dataj, cmd):
  global k8s_namespace, k8s_bashcommand, k8s_qurlcommand
  try:
    _user = dataj['user']['name']
    _prjname = dataj['project']['name']
    _prjmodule = dataj['project']['module']

    if not _user or not _prjname or not _prjmodule:
      # illegal data
      print '   [ERR-k8srun] illegal json!\n'
      return 1
    if not _prjmodule in BDPAAS_MODULE_TYPE:
      # illegal module type
      print '   [ERR-k8srun] illegal module type: %s!\n' % (_prjmodule)
      return 1

    # replace space character with underscore
    _user = _user.replace(' ', '-')
    _prjname = _prjname.replace(' ', '-')
  except:
    # illegal data
    return 1

  k8s_namespace = _prjmodule + '-cluster' + '--' + _user + '--' + _prjname
  if _prjmodule == BDPAAS_MODULE_SPARK:
    k8s_bashcommand = K8SRUN_COMMAND_SPARK + ' ' + k8s_namespace + ' ' + cmd
    k8s_qurlcommand = K8SRUN_COMMAND_SPARK + ' ' + k8s_namespace + ' ' + K8SRUN_QUERYURL + ' ' + K8S_SERVER_ETH0
  else:
    if _prjmodule == BDPAAS_MODULE_APEX:
      k8s_bashcommand = K8SRUN_COMMAND_APEX + ' ' + k8s_namespace + ' ' + cmd
      k8s_qurlcommand = K8SRUN_COMMAND_APEX + ' ' + k8s_namespace + ' ' + K8SRUN_QUERYURL + ' ' + K8S_SERVER_ETH0
    else:
      # should not be!
      return 1
  return 0

def return_to_apm_server(rets, ok):
  print '--------\n  %s' % (rets)
  if ok == 'true':
    _results = '{"user": "%s", "project": {"name": "%s", "module": "%s", "command": %s, "return": {"result": "true", %s}}}' % \
	(dataj['user']['name'], dataj['project']['name'], dataj['project']['module'], json.dumps(dataj['project']['command']), rets )
  else:
    _results = '{"user": "%s", "project": {"name": "%s", "module": "%s", "command": %s, "return": {"result": "false"}}}' % \
	(dataj['user']['name'], dataj['project']['name'], dataj['project']['module'], json.dumps(dataj['project']['command']) )
    
  _bashcommand = APM_URL1 + _results + APM_URL2
  os.system(_bashcommand)
  print '--------\n  %s' % (_bashcommand)


def main(dataj):
  #
  # -- create --
  #
  global k8s_namespace, k8s_bashcommand, k8s_qurlcommand

  if dataj['project']['command'][0] == 'create':
    # 
    if getns(dataj, K8SRUN_START) != 0:
      # err
      return 1

    #
    print '   [INFO-k8srun] create job: \n      namespace: %s\n' % (k8s_namespace)

    #
    try:
      #
      try: 
        out = subprocess.check_output(k8s_bashcommand, stderr=subprocess.STDOUT, shell=True)
        print (out)
      except subprocess.CalledProcessError as e:
        print "   [ERR-k8srun] create job error code: ", e.returncode, '\n---\n', e.output
        return_to_apm_server('', 'false')
        return 1

      # query urls
      try: 
        urls = subprocess.check_output(k8s_qurlcommand, stderr=subprocess.STDOUT, shell=True)
        print '\nQuery Spark service URLs:\n   %s\n' % (urls)
      except subprocess.CalledProcessError as e:
        print "   [ERR-k8srun] query URLs error: ", e.returncode, '\n---\n', e.output
        return_to_apm_server('', 'false')
        return 1
    except:
      print "   [ERR-k8srun] UNKOWN K8S ERROR!"
      return_to_apm_server('', 'false')
      return 1

    # lets now reply results to APM server
    return_to_apm_server('"urls": ' + urls.split('\n')[0], 'true')
    return 0

  #
  # -- delete
  #
  if dataj['project']['command'][0] == 'delete':
    # 
    if getns(dataj, K8SRUN_STOP) != 0:
      # err
      return 1

    #
    print '   [INFO-k8srun] delete job: \n      namespace: %s\n' % (k8s_namespace)

    #
    try:
      #
      try: 
        out = subprocess.check_output(k8s_bashcommand, stderr=subprocess.STDOUT, shell=True)
        print (out)
      except subprocess.CalledProcessError as e:
        print "   [ERR-k8srun] delete job error code: ", e.returncode, '\n---\n', e.output
        return_to_apm_server('', 'false')
        return 1
    except:
      print "   [ERR-k8srun] UNKOWN K8S ERROR!"
      return_to_apm_server('', 'false')
      return 1

    # lets now reply results to APM server
    return_to_apm_server('"urls": ""', 'true')
    return 0

  # ---> ???
  print '   [INFO-k8srun] illegal api command: %s' % (dataj['project']['command'][0])
  return 1


#
# -- main --
#
if __name__=='__main__':
  print ''

  # helper
  if len(sys.argv) < 1:
    print '\n   [ERR]: pls provide json data!\n'
    sys.exit()

  args = sys.argv
  del args[0]
  datas = ' '.join(args)
  dataj = json.loads(datas)


  #
  sys.exit(main(dataj))

