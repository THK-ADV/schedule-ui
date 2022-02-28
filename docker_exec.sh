#!/bin/sh

img_name=schedule-frontend
packed_name=dist/${img_name}.tar
dock_hub_URL=dockhub.gm.fh-koeln.de
dock_hub_username=dobrynin
dock_hub_img_location=${dock_hub_URL}/${dock_hub_username}/${img_name}

buildApp() {
  ng build --prod
}

dockerClear() {
    docker stop ${img_name}
    docker container rm ${img_name}
    docker image rm ${img_name}
}

dockerRebuild() {
  docker stop ${img_name}
  docker container rm ${img_name}
  docker image rm ${img_name}
  docker build -t ${img_name} .
}

pack() {
  docker save -o ${packed_name} ${img_name}
}

uploadDockHub() {
  docker login ${dock_hub_URL} &&
  docker tag ${img_name} ${dock_hub_img_location} &&
  docker push ${dock_hub_img_location} &&
  echo "successfully uploaded image ${img_name} to ${dock_hub_URL}"
}

upload() {
  echo start scp &&
  scp ${packed_name} $1 &&
  echo finised scp &&
  rm ${packed_name} &&
  echo removed img file
}

case "$1" in
"local")
  buildApp && 
    dockerRebuild &&
    exit 0
  ;;
"stage")
  buildApp && 
    dockerRebuild && 
    pack && 
    upload $2 &&
    exit 0
  ;;
"dockhub")
  buildApp &&
    dockerRebuild &&
    uploadDockHub &&
     exit 0
  ;;
*)
  echo expected local, stage or dockHub, but was $1
  exit 1
  ;;
esac
