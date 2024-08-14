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

curl -X GET 'http://localhost:9200/products/_search?pretty' -H 'Content-Type: application/json' -d '{
    "query" : { 
        "bool": {
            "should": [
                {
                    "term": { "name": "Oriental" }
                }
            ]
        }
    }
}'

curl -X GET 'http://localhost:9200/products/_search?pretty' -H 'Content-Type: application/json' -d '{
    "query" : {
        "multi_match": {
            "query":                "pizze",
            "fields":               [ "*name" ]
        }
    }
}'

curl -X GET 'http://localhost:9200/products/_search?pretty' -H 'Content-Type: application/json' -d '{
    "query" : { 
        "bool": {
            "filter": [
                { "term": { "category": "game" }}
            ]
        }
    }
}'

curl -X GET 'http://localhost:9200/products/_search?pretty' -H 'Content-Type: application/json' -d '{
    "query" : { 
        "bool": {
            "filter": [
                { "term": { "collections.id": "2" }},
                { "term": { "collections.chain_id": "11155111" }},
                { "term": { "attributes.value": "Ethereum" }}
            ]
        }
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

 curl -X DELETE "http://localhost:9200/products-1723004571946"
