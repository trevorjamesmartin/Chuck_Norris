#!/usr/bin/env bash

echo "creating temporary folder"
mkdir ./cn_tmp
echo "copying files"
cp Chuck_Norris@debauchery1st.github.com/*.* ./cn_tmp
cp -r Chuck_Norris@debauchery1st.github.com/icons ./cn_tmp
cd cn_tmp
echo "compiling schemas"
sh compile.sh
echo "creating zip file"
zip -r ../bin/Chuck_Norris@debauchery1st.github.com.zip ./*
echo "removing temporary folder"
cd ..
rm -rf ./cn_tmp
echo "done"
