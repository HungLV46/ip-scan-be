#!/bin/bash
URL_LOCAL="http://localhost:9200"
URL_DEV="http://elasticsearch.elasticsearch:9200"

# Get indexes
curl -X GET "http://localhost:9200/_cat/indices?v"
curl -X GET "http://elasticsearch.elasticsearch:9200/_cat/indices?v"

# Get all documents from products index
curl -X GET 'http://localhost:9200/products/_search?pretty' -H 'Content-Type: application/json' -d '{
    "query" : { 
        "match_all" : {}
    }
}'

curl -X GET 'http://elasticsearch.elasticsearch:9200/products/_search?pretty' -H 'Content-Type: application/json' -d '{
    "query" : { 
        "match_all" : {}
    }
}'

# Get document by product id
curl -X GET 'http://localhost:9200/products/_search?pretty' -H 'Content-Type: application/json' -d '{
    "query" : { 
        "match" : {"id": "1"}
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
        "wildcard": {
            "name": {
                "value": "Olala"
            }
        }
    }
}'

curl -X GET 'http://localhost:9200/products/_search?pretty' -H 'Content-Type: application/json' -d '{
    "query" : {
        "regexp": {
            "name": {
                "value": "la+",
                "flags": "ALL",
                "case_insensitive": true,
                "rewrite": "constant_score"          
            }
        }
    }
}'

curl -X GET 'http://localhost:9200/products/_search?pretty' -H 'Content-Type: application/json' -d '{
    "query": {
        "match_phrase": {
            "name": {
                "query": "Olala"                
            }
        }
    }
}'

# Search proximity with multiple fields
curl -X GET 'http://localhost:9200/products/_search?pretty' -H 'Content-Type: application/json' -d '{
    "query": {
        "query_string": {
            "query": "*Olala*",
            "fields": ["name", "owner.name"]
        }
    }
}'

curl -X GET 'http://localhost:9200/products/_search?pretty' -H 'Content-Type: application/json' -d '{
    "query": {
        "fuzzy": {
            "name": {
                "value": "Olala",
                "fuzziness": "AUTO:3..5"
            }       
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
                { "term": { "product_collections.chain_id": "11155111" }}
            ]
        }
    }
}'

curl -X GET 'http://localhost:9200/products/_search?pretty' -H 'Content-Type: application/json' -d '{
    "query": {
        "nested": {
        "path": "product_collections",
        "query": {
            "nested": {
                "path": "product_collections.collection",
                "query": {
                    "bool": {
                        "must": [
                            { "terms": { "product_collections.collection.chain_id": ["11155111"] }}
                            ]
                        }
                    }
                }
            }
        }
    },
}'

curl -X GET 'http://localhost:9200/products/_search?pretty' -H 'Content-Type: application/json' -d '{
    "query": {
        "bool": {
            "filter": [
            {
                "nested": {
                "path": "product_collections",
                "query": {
                    "nested": {
                    "path": "product_collections.collection",
                    "query": {
                        "bool": {
                        "filter": [
                            {
                            "terms": {
                                "product_collections.collection.chain_id": ["11155111"]
                            }
                            }
                        ]
                        }
                    }
                    }
                }
                }
            },
            { "terms": { "category": ["game", "manga", "art"] } },
            {
                "nested": {
                "path": "attributes",
                "query": {
                    "bool": {
                    "filter": [
                        { "term": { "attributes.name": "player info" }},
                        {"terms": { "attributes.value": ["Singleplayer"] }}
                    ]
                    }
                }
                }
            }
            ]
        }
    }
}'

curl -X GET 'http://localhost:9200/products/_search?pretty' -H 'Content-Type: application/json' -d '{
    "query": {
        "nested": {
        "path": "attributes",
        "query": {
            "bool": {
                "must": [
                    { "match": { "attributes.name": "genre" }},
                    { "match": { "attributes.value": "Survival" }}
                    ]
                }
            }
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

 curl -X DELETE "http://localhost:9200/products-1723799098975"
 curl -X DELETE "$URL_DEV/products-1723606638996"
