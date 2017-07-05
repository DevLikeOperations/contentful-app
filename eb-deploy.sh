#! /bin/bash

rm -rf build/

pushd front
  npm install
  npm run build
popd

cp -R front/build build

eb deploy stage
