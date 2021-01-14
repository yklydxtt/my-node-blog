#!/bin/sh
cd /Users/xiaoguoguo/Documents/node课程/node博客/blog-1/logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log