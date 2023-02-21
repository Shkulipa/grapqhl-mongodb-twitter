# packaages
grapqhl packages: (https://docs.nestjs.com/graphql/quick-start)
1. npm i @nestjs/graphql @nestjs/apollo graphql apollo-server-express

mongoose packages: (https://docs.nestjs.com/techniques/mongodb)
1. npm i @nestjs/mongoose mongoose

dotenv: (https://docs.nestjs.com/techniques/configuration)
1. npm i --save @nestjs/config

# Run
1. yarn docker:compose
2. yarn start:local

after "yarn docker:compose", you can check in browser db by this link:
http://localhost:8081 (for UI of Mongo DB)
http://localhost:8001 (for UI of Redis) or use the RedisInsight(https://redis.com/redis-enterprise/redis-insight/) (connection local will be: host - redis, port - 6379)

# Functional
1. login(access + refresh token)
2. create, update, delete  tweet
3. create, update, delete comment for tweet
4. websockets(subscriptions) for chats(chats exsist as minimum 2 users)
5. redis(using in Tweets) + mongodb

# CLI
docs: https://docs.nestjs.com/cli/overview
```
1. nest generate --help
2. nest generate res --no-spec
```

# mapped /graphql
```
local: http://localhost:3000/graphql
```

# websockets(subscription)
tutorial #1: https://www.youtube.com/watch?v=yXdJGR-gLAQ&ab_channel=%5Bk%5Dcode
tutorial #2: https://docs.nestjs.com/graphql/subscriptions
tutorial #3: https://www.youtube.com/watch?v=7-eEAJkzYgw&ab_channel=PragmaticReviews

# example in /graphql
for create:
```
mutation createTweet($createTweetInput: CreateTweetInput!){
  createTweet(createTweetInput: $createTweetInput) {
    _id,
    description,
    owner {
      _id,
      username,
      photo
    },
    createdAt,
    media {
      urlFile,
      key
    }
  }
}
```

where query variables:
```
{
  "createTweetInput": {
    "media": [
      {
        "urlFile": "https://graphql-nestjs-twitter.s3.eu-central-1.amazonaws.com/public/tweets/832a88ad-c8f9-45a0-a172-c1a865d3874e-1676497008931.jpeg",
        "key": "public/tweets/832a88ad-c8f9-45a0-a172-c1a865d3874e-1676497008931.jpeg"
      },
      {
        "urlFile": "https://graphql-nestjs-twitter.s3.eu-central-1.amazonaws.com/public/t1weets/9fb1dac1-c6cc-46a5-ae98-e10520f96f3d-1676497009809.jpeg",
        "key": "public/tweets/9fb1dac1-c6cc-46a5-ae98-e10520f96f3d-1676497009809.jpeg"
      } 
    ], 
    "description": "asdasdasdasd"
  }
}
```

and HTTP headers:
```
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2VjYWRiMGNhMGU0MjI3YjQ5YTk1YTciLCJpYXQiOjE2NzY1NTY0OTUsImV4cCI6MTY3NjU1NzM5NX0.uG38tneY0eGlGHWrDNDUbQPhPdlf74qRw7KGGofs1ZE"
}
```


for get smth:
```
query getTweetById($query: GetItembyIdInput!) {
  getTweetById(query: $query) {
		_id,
    description,
    createdAt,
		media {
      urlFile,
      key
    },
    owner {
      _id,
      username,
      photo,
    }
  }
}
```

where query variables:
```
{
  "query": {
   	"id": "63ee38db2830c239b3b22b81"
  }
}
```


subscription for comments:
```
subscription($tweetId: String!) {
  comment(tweetId: $tweetId) {
    action,
    comment {
      _id,
      comment
    }
  }
}
```

where query variables:
```
{
  "tweetId": "63ee38db2830c239b3b22b81"
}
```

