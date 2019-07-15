#!/usr/bin/env bash

# copy this into primary container to use for checking if secondary containers are ready

if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ] || [ -z "$4" ]
  then
    echo "You must provide arguments for service name, host, port and seconds to wait." && exit 1
fi

echo waiting for $1 to respond at $2 port $3 for $4 seconds

for i in `seq 1 $4`;
do
  nc -z $2 $3 && echo success && exit 0
  echo -n .
  sleep 1
done

echo failed waiting for $1 && exit 1

