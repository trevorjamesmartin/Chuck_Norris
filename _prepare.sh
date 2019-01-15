#!/usr/bin/env bash
UUID=$1

if ! test -d "./bin"; then
  mkdir ./bin
fi

echo "creating temporary folder"
mkdir ./cn_tmp

echo "copying files"
cp $UUID/*.* ./cn_tmp
cp -r $UUID/icons ./cn_tmp
cd cn_tmp
echo "compiling schemas"
sh compile.sh
echo "compressing"
zip -r ../bin/$UUID ./*
echo "removing temporary folder"
cd ..
rm -rf ./cn_tmp
echo "done"
