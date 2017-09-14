#!/bin/bash

docker run -p 9000:9000 -it --rm \
    --name cf1 \
    --net=host \
    -v ${PWD}/.node:/node \
    --entrypoint=/usr/local/bin/crossbar \
    crossbario/crossbar-fabric-armhf:latest \
    start --personality fabric --cbdir /node/.crossbar/
