Operation Guide of BDPaaS
---
version : 0.1.1<br/>
date : 02-01-2018<br/>
\---
<br>

[Design Notes]
---
Please refer to [docs/bdpaas_design_nodes_v0.1.1.doc](docs/bdpaas_design_nodes_v0.1.1.doc)<br/>
<br>

[Sources]
---
YAMLs are based on:<br/>
- [https://github.com/kubernetes/examples/tree/master/staging/spark](https://github.com/kubernetes/examples/tree/master/staging/spark)

Docker images are based on:<br/>
- [https://github.com/mattf/docker-spark](https://github.com/mattf/docker-spark)
- curated in [https://github.com/kubernetes/application-images/tree/master/spark](https://github.com/kubernetes/application-images/tree/master/spark)

Spark UI Proxy is based on:<br/>
- [https://github.com/aseigneurin/spark-ui-proxy](https://github.com/aseigneurin/spark-ui-proxy)
<br>

Apex image/installation/license are based on:<br/>
- [https://hub.docker.com/r/apacheapex/sandbox/](https://hub.docker.com/r/apacheapex/sandbox/)
- [http://docs.datatorrent.com/installation/](http://docs.datatorrent.com/installation/)
<br/>
<br>

[Kubernetes-Cluster Installation]
---
Please refer to [k8s/k8s_installation_notes.txt](k8s/k8s_installation_notes.txt)

This guide assumes three K8S nodes installation:
  - kubem1 : master node<br/>
  - kubes1 : worker node<br/>
  - kubes2 : worker node<br/>
<br>

[Sample Data Repository]
---
Create NFS server:<br/>
- Install NFS server in kubem1<br/>
  $ sudo mkdir /opt/nfsshare<br/>
  $ sudo chown nobody:nogroup /opt/nfsshare<br/>
  $ sudo apt-get install nfs-kernel-server

- Download sample data bank.zip from Zeppelin tutorial to /opt/nfsshare and unzip<br/>
  [https://zeppelin.apache.org/docs/0.7.3/quickstart/tutorial.html](https://zeppelin.apache.org/docs/0.7.3/quickstart/tutorial.html)<br/>
  data will be shared by Zeppelin and Spark workers

- Modify /etc/exports:<br/>
  /opt/nfsshare   192.168.100.0/255.255.255.0(rw,sync,no_subtree_check)<br/>
  Note to modify 192.168.100.0/255.255.255.0 to reflect actual networking of K8S nodes<br/>
  $ sudo exportfs -a<br>
  $ sudo systemctl restart nfs-kernel-server

- Install nfs client in kubes1/kubes2:<br/>
  $ sudo apt-get install nfs-common<br/>
<br/>

[YAML]
---
- Create persistent volumes<br/>
  nfs-pv.yaml : persistent volume<br/>
  nfs-pvc.yaml : persistent volume claim<br/>

  $ kubectl -n spark-cluster create -f nfs-pv.yaml<br/>
  $ kubectl -n spark-cluster create -f nfs-pvc.yaml<br/>

- Modify zeppelin-controller.yaml<br/>

      kind: ReplicationController
      apiVersion: v1
      metadata:
        name: zeppelin-controller
      spec:
        replicas: 1
        selector:
          component: zeppelin
        template:
          metadata:
            labels:
              component: zeppelin
          spec:
            containers:
              - name: zeppelin
                image: gcr.io/google_containers/zeppelin:v0.5.6_v1
                ports:
                  - containerPort: 8080
                resources:
                  requests:
                    cpu: 100m
                volumeMounts:
                  - name: nfsvol
                    mountPath: /usr/share/nfs_spark
            volumes:
              - name: nfsvol
                nfs:
                  path: /opt/nfsshare
                  server: 192.168.100.10
                  readOnly: true

  Note to modify 192.168.100.10 to reflect actual IP of kubem1<br/>
<br/>

- Modify spark-worker-controller.yaml<br/>

      kind: ReplicationController
      apiVersion: v1
      metadata:
        name: spark-worker-controller
      spec:
        replicas: 2
        selector:
          component: spark-worker
        template:
          metadata:
            labels:
              component: spark-worker
          spec:
            containers:
              - name: spark-worker
                image: gcr.io/google_containers/spark:1.5.2_v1
                command: ["/start-worker"]
                ports:
                  - containerPort: 8081
                resources:
                  requests:
                    cpu: 100m
                volumeMounts:
                  - name: nfsvol
                    mountPath: /usr/share/nfs_spark
            volumes:
              - name: nfsvol
                nfs:
                  path: /opt/nfsshare
                  server: 192.168.121.10
                  readOnly: true
                  
  Note to modify 192.168.100.10 to reflect actual IP of kubem1<br/>
<br/>

[Start BDPaaS API Server on Boot]
---

- Service file : /lib/systemd/system/bdpaas_api_server.service<br>


        [Unit]
        Description=BDPaaS API Server(v0.1.1)

        [Service]
        User=<User>
        Type=oneshot
        Environment="BDPAAS_APISERVER_CMD=bas_SimpleWebSrv.py"
        Environment="BDPAAS_APISERVER_LOGFILE=bas_apiserver.log"
        WorkingDirectory=<BDPaaS-server-directory>
        ExecStart=/bin/bash runsimple.sh start
        RemainAfterExit=true
        ExecStop=/bin/bash runsimple.sh stop
        #StandardOutput=journal
        #Restart=always

        [Install]
        WantedBy=multi-user.target

    Note to replace \<User\> and \<BDPaaS-server-directory\> with actual user and installed path of BDPaaS<br/>

<br/>

