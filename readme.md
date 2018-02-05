# Install
```
    $ git https://git.sami.int.thomsonreuters.com/Veerayut.Intorn/DigitalHR/tree/master/Utility/jsonToWordExcel
    $ cd digitalHR-api
    $ npm install
```

# CreateDatabase
```
    $ mongorestore --db <dataname> db/dump/digitalHR
    $ mongod

```

# Routes
```
    GET /api/showAll
    GET /api/showOne
    POST /api/addOne [firstName, lastName, sex, email, image];
```