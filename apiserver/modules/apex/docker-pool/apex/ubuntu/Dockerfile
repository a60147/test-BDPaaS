# How to run this script from same folder:
# docker build .

FROM ubuntu:14.04
MAINTAINER Chinmay Kolhatkar <chinmay@apache.org>

COPY app/ /app/
COPY datatorrent-rts.bin /etc/init.d/
COPY sudoers /etc/
RUN /app/setup.sh

USER apex
WORKDIR /home/apex
EXPOSE 50070 8088 9090

ENTRYPOINT ["/app/init.sh"]
