#!/usr/bin/env bash

mkdir -p test/ &&
cd test/ &&
echo "$ isis" &&
../script/isis &&
echo "$ isis create ." &&
../script/isis create . &&
echo "$ node launch" &&
node launch