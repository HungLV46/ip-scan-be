#!/bin/bash

# Get indexes
curl -X GET "http://localhost:9200/_cat/indices?v"

# Get all documents from products index
curl -X GET 'http://localhost:9200/products/_search?pretty' -H 'Content-Type: application/json' -d '{
    "query" : { 
        "match_all" : {}
    }
}'

# Get document by product id
curl -X GET 'http://localhost:9200/products/_search?pretty' -H 'Content-Type: application/json' -d '{
    "query" : { 
        "match" : {"product_id": "1"}
    }
}'

# Delete all documents
curl \
 -X POST http://localhost:9200/products/_delete_by_query \
 -H "Content-Type: application/json" \
 -d '{
    "query" : { 
            "match_all" : {}
    }
 }'