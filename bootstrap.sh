#!/usr/bin/env bash

DIR=$(pwd)
COMPOSE_FILE=$DIR/docker-compose.yml
PROJECT_NAME=peof
LOG_AGGREGATOR_SERVICE=logstash

rebuild(){
	docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE up -d --build
}

start(){
	docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE up -d
}

stop(){
	docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE stop
}

remove(){
    SERVICE=$1
	docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE down $SERVICE
}

top(){
	docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE top
}

tail(){
	docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE logs -f $LOG_AGGREGATOR_SERVICE
}

list(){
	docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE config --services
}

status(){
	docker-compose -p $PROJECT_NAME -f $COMPOSE_FILE ps
}

OPTION=$1

case $OPTION in
rebuild)
  echo "Building images and then starting containers for ${PROJECT_NAME} in detached mode"
  rebuild
  ;;
start)
  echo "Starting containers for ${PROJECT_NAME} in detached mode"
  start
  ;;
stop)
  echo "Stopping all containers for ${PROJECT_NAME}"
  stop
  ;;
remove)
  echo "Stopping and removing all containers for ${PROJECT_NAME} ${2}"
  remove $2
  ;;
top)
	echo "Containers in ${PROJECT_NAME}"
	top
	;;
tail)
	tail
	;;
list)
	list
	;;
status)
	status
	;;
*)
    echo "Did you forget something!! [ rebuild | start | stop | remove | list | tail | status | top ]"
    echo "-- Options --"
    echo "rebuild : Builds images and starts all the containers in detached mode"
    echo "start : Starts all the containers in detached mode"
    echo "stop : Stops all the containers"
    echo "remove : Stops and removes all the containers"
    echo "list : Lists all the services"
    echo "status : Shows status of all the services"
    echo "tail <service_name> : Tail the logs of the given service"
    echo "top : Shows the top output for all the services"
esac