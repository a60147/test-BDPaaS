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
# API server to accept requests from and send replies to Glassfish web server
#
#

import sys
import os
import SocketServer
import threading
import argparse
import re
import cgi
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
from SocketServer import ThreadingMixIn
import time
import subprocess, thread
import json


# configs
config_file='bas_apiserver.conf'
import ConfigParser
config = ConfigParser.ConfigParser()
config_path = os.path.join(os.path.dirname(os.path.abspath(sys.modules['__main__'].__file__)), config_file)
config.read(config_path)
BDPAAS_PORT = config.get('default', 'API_SERVER_PORT')
BDPAAS_GFSERVER_IP = config.get('default', 'GFSERVER_IP')
BDPAAS_GFSERVER_PORT = config.get('default', 'GFSERVER_PORT')

# globals
remoteIP = ''
ctype = ''
pdict = ''


# callback glassfish server
GFSERVER_CMD1 = "curl http://" + BDPAAS_GFSERVER_IP + ":" + BDPAAS_GFSERVER_PORT + "/BDPaaS/updatePlatform -X POST -H 'content-type:application/json' --data '"
GFSERVER_CMD2 = "'"


#
#
class HTTPRequestHandler(BaseHTTPRequestHandler):
  # routines
  def ReplyOK(self, okno=200, msg=None):
    self.send_response(200)
    self.end_headers()
    if msg is not None:
      self.wfile.write(msg + "\n")
    print "\n"
    sys.stdout.flush()
    return

  def ReplyError(self, errno=403, msg=None):
    self.send_response(errno)
    self.end_headers()
    if msg is not None:
      self.wfile.write(msg)
    print "\n"
    sys.stdout.flush()
    return

  def CheckPostCommand(self):
    global remoteIP
    global ctype, pdict

    #
    remoteIP = self.client_address[0]
    if False == self.ValidateRemoteIP(remoteIP):
      self.ReplyError(401, "\nERR[BDPAAS]: Invalid User in IP : %s\n\n" % (remoteIP))
      return

    try:
      ctype, pdict = cgi.parse_header(self.headers.getheader('content-type'))
      if ctype != 'application/json':
        return 0
    except:
      msg = '\nERR[BDPAAS]: parse header error!\n'
      self.ReplyError(401, msg)
      print (msg)


    #
    cmd = re.search('/api/v1/project_go', self.path)
    if None != cmd:
      return 1
    cmd = re.search('/api/v1/project_finish', self.path)
    if None != cmd:
      return 2

    self.ReplyError(401, "\nERR[BDPAAS]: Invalid api : %s\n\n" % (self.path))
    return 0

  def ValidateRemoteIP(self, remoteip):
    return True

  # POST
  def do_POST(self):
    global remoteIP
    global ctype, pdict

    cmd = self.CheckPostCommand()
    if 0 == cmd:
      print 'unknown command!'
      self.ReplyError()
      return


    #-----
    # /api/v1/project_go
    #-----
    if 1 == cmd:
      print ""
      print '[%s] project_go' % (time.strftime("%c"))

      #
      try:
        length = int(self.headers.getheader('content-length'))
        data = cgi.parse_qs(self.rfile.read(length), keep_blank_values=1)
        datas = data.keys()[0]
        dataj = json.loads(datas)
      except:
        self.ReplyError(400, "\nERR[BDPAAS]: invalid data in POST-1\n\n")
        return


      # spawn a new thred to do job
      thread.start_new_thread(run_job, ( datas, ))

      print "-----"
      msg = "INFO[BDPAAS]: jobecho-1 - %s" % (datas)
      print "%s" % (msg)
      print "-----"
      self.ReplyOK(200, msg)
      return

    #-----
    # /api/v1/project_finish
    #-----
    if 2 == cmd:
      try:
        length = int(self.headers.getheader('content-length'))
        data = cgi.parse_qs(self.rfile.read(length), keep_blank_values=1)
        datas = data.keys()[0]
        dataj = json.loads(datas)
      except:
        self.ReplyError(400, "\nERR[BDPAAS]: data error in POST-2\n\n")
        return
    
      print ""
      print '[%s] project_finish: %s, %s' % (time.strftime("%c"), json.dumps(dataj['user']), json.dumps(dataj['project']))
 
      # extract client name
      try:
        # create ftp dir for client to upload data to
        bashcommand = GFSERVER_CMD1 + datas + GFSERVER_CMD2
        os.system(bashcommand)
      except:
        self.ReplyError(400, "\nERR[BDPAAS]: Invalid data in POST-2\n\n")
        return     

      print "-----"
      msg = "INFO[BDPAAS]: jobecho-3 - %s" % (datas)
      print "%s" % (msg)
      print "-----"
      return

    #-----
    # unsupported commands
    #-----
    self.ReplyError(400, "\nERR[BDPAAS]: unsupported commands!\n")
    return

# run job
def run_job(datas):
  # spwan shell process 
  bashcommand = './bas_k8srun.py ' + datas
  process = subprocess.Popen(bashcommand.split(), stdout=subprocess.PIPE)
  out, err = process.communicate()
  print (out)

  if process.returncode == 1:
    print '\n[ERR]: returncode == 1 from k8s job!\n'
    sys.stdout.flush()
    return 1

  print "-----"
  msg = "INFO[BDPAAS]: jobecho-2 - %s" % (datas)
  print "%s" % (msg)
  print "-----" 
  sys.stdout.flush()
  return


# 
class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
  allow_reuse_address = True
 
  def shutdown(self):
    self.socket.close()
    HTTPServer.shutdown(self)
 
#
class SimpleHttpServer():
  def __init__(self, ip, port):
    self.server = ThreadedHTTPServer((ip,port), HTTPRequestHandler)
 
  def start(self):
    self.server_thread = threading.Thread(target=self.server.serve_forever)
    self.server_thread.daemon = True
    self.server_thread.start()
 
  def waitForThread(self):
    self.server_thread.join()
 
  def stop(self):
    self.server.shutdown()
    self.waitForThread()


def helper(cmd):
	print '\nUsage:\n   To start up BDPAAS server:\n   %s <ip> <port>\n      default: 127.0.0.1 16006\n\n   To flush all BDPAAS instances & DB:\n   %s clean\n' % (cmd, cmd)
 

#
# -- main --
#
if __name__=='__main__':
  #
  # commands
  #
  try:
    argv1 = sys.argv[1].lower()
    if argv1 == '--help' or argv1 == '-h':
      helper(sys.argv[0])
      sys.exit()

    if sys.argv[1].lower() == 'clean':
      sys.exit()
  except SystemExit:
    os._exit(0)
  except:
    pass


  # ip
  try: 
	_ip = sys.argv[1]
  except IndexError:
	_ip = "127.0.0.1"

  # port
  try: 
	_port = int(sys.argv[2])
  except IndexError:
	_port = int(BDPAAS_PORT)


  print ""
  now = time.strftime("%c")
  print '\n[%s] BDPAAS Server Running (ip: %s, port: %d)...\n' % (time.strftime("%c"), _ip, _port)
  sys.stdout.flush()


  handler = HTTPRequestHandler
  httpd = SocketServer.TCPServer(("", _port), handler)
  httpd.serve_forever()

  #
  sys.stdout.flush()
