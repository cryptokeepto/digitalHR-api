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
    employmentCertifyLetter
        - POST /api/certifyLetter/employmentCertifyLetter/add [employeeID: string, typeCertifyLetter: string, firstName: string, lastName: string, note: string, numberOfCopy: number]



    GET /api/users/showAll
    GET /api/users/showOne
    POST /api/users/addOne [firstName, lastName, sex, email, image];
```

# Reference
```
    Word
    - https://github.com/Ziv-Barber/officegen
    Excel
    - https://github.com/natergj/excel4node
    PDF
    - http://pdfkit.org/
```