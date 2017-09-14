#!/bin/bash

docker run \
    --rm \
    -p 2379:2379 \
    -p 2380:2380 \
    -v /usr/share/ca-certificates/:/etc/ssl/certs \
    -v ${PWD}/.etcd:/etcd-data \
    --name etcd \
    --net=host \
    quay.io/coreos/etcd:latest \
        /usr/local/bin/etcd \
        --data-dir=/etcd-data \
        --name cf-etcd \
        --advertise-client-urls http://0.0.0.0:2379 \
        --listen-client-urls http://0.0.0.0:2379