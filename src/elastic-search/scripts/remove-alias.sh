#!/bin/bash

json=$(curl -X GET 'http://localhost:9200/_alias/products')
echo "$json"
index=$(echo "$json" | tr -d '{}' | tr ',' '\n' | grep -o '"[^"]*":' | sed 's/"\([^"]*\)":/\1/' | head -n 1)

echo "$index"

curl -X DELETE http://localhost:9200/$index/_alias/products?pretty
