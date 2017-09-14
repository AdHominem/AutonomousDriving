#!/bin/bash

#convert 
ffmpeg -i input.mp4 -vcodec h264 -acodec aac -strict -2 persona.mp4
