var frisby = require('frisby');

var url = 'http://localhost:8000';

frisby.create('Post a Wine')
    .post(url + '/wines', {
        name: 'test wine',
        year: '2011',
        country: 'France',
        type: 'red'
    })
    .expectJSONTypes('', {
        name: String,
        year: String,
        country: String,
        type: String,
        id: Number
    })
    .expectJSON({
        name: 'test wine',
        year: '2011',
        country: 'France',
        type: 'red'
    })
    .afterJSON(function (json) {
        frisby.create('get wines by name')
            .get(url + '/wines?name=' + json.name)
            .expectStatus(200)
            .expectHeader('Content-Type', 'application/json')
            .expectJSONTypes('*', {
                name: String,
                year: String,
                country: String,
                type: String,
                id: Number
            })
            .expectJSON('?', {
                name: 'test wine',
                year: '2011',
                country: 'France',
                type: 'red',
                id: json.id
            })
            .toss()

        frisby.create('get wines by year')
            .get(url + '/wines?year=' + json.year)
            .expectStatus(200)
            .expectHeader('Content-Type', 'application/json')
            .expectJSONTypes('*', {
                name: String,
                year: String,
                country: String,
                type: String,
                id: Number
            })
            .expectJSON('?', {
                name: 'test wine',
                year: '2011',
                country: 'France',
                type: 'red',
                id: json.id
            })
            .toss();

        frisby.create('get wines by type')
            .get(url + '/wines?type=' + json.type)
            .expectStatus(200)
            .expectHeader('Content-Type', 'application/json')
            .expectJSONTypes('*', {
                name: String,
                year: String,
                country: String,
                type: String,
                id: Number
            })
            .expectJSON('?', {
                name: 'test wine',
                year: '2011',
                country: 'France',
                type: 'red',
                id: json.id
            })
            .toss();

        frisby.create('get wines by country')
            .get(url + '/wines?country=' + json.country)
            .expectStatus(200)
            .expectHeader('Content-Type', 'application/json')
            .expectJSONTypes('*', {
                name: String,
                year: String,
                country: String,
                type: String,
                id: Number
            })
            .expectJSON('?', {
                name: 'test wine',
                year: '2011',
                country: 'France',
                type: 'red',
                id: json.id
            })
            .toss();

        frisby.create('get wine by id')
            .get(url + '/wines/' + json.id)
            .expectStatus(200)
            .expectHeader('Content-Type', 'application/json')
            .expectJSONTypes('', {
                name: String,
                year: String,
                country: String,
                type: String,
                id: Number
            })
            .expectJSON({
                name: 'test wine',
                year: '2011',
                country: 'France',
                type: 'red',
                id: json._id
            })
            .toss()

        frisby.create('put wine by id')
            .put(url + '/wines/' + json.id, {
                type: 'white'
            })
            .expectStatus(200)
            .expectHeader('Content-Type', 'application/json')
            .expectJSONTypes('', {
                name: String,
                year: String,
                country: String,
                type: String,
                id: Number
            })
            .expectJSON({
                name: 'test wine',
                year: '2011',
                country: 'France',
                type: 'white',
                id: json.id
            })
            .afterJSON(function (json) {
                frisby.create('delete wine by id')
                    .delete(url + '/wines/' + json.id)
                    .expectStatus(200)
                    .expectHeader('Content-Type', 'application/json')
                    .expectJSONTypes('', {
                        'success': Boolean
                    })
                    .expectJSON('', {
                        success: true
                    })
                    .toss()
            })
            .toss();
    })
    .toss();

frisby.create('error get wine by id')
    .get(url + '/wines/1111111111111111111111')
    .expectStatus(400)
    .expectHeader('Content-Type', 'application/json')
    .expectJSONTypes('', {
        error: String
    })
    .expectJSON('', {
        error: 'UNKNOWN_OBJECT'
    })
    .toss();

frisby.create('error post wine missing name, year, country and type')
    .post(url + '/wines')
    .expectStatus(400)
    .expectHeader('Content-Type', 'application/json')
    .expectJSONTypes('', {
        error: String,
        validation: {
            name: String,
            year: String,
            country: String,
            type: String
        }
    })
    .expectJSON('', {
        error: 'VALIDATION_ERROR',
        validation: {
            name: 'MISSING',
            year: 'MISSING',
            country: 'MISSING',
            type: 'MISSING'
        }
    })
    .toss();

frisby.create('error post wine invalid type')
    .post(url + '/wines', {
        name: 'test wine',
        year: '2011',
        country: 'France',
        type: 'redd'
    })
    .expectStatus(400)
    .expectHeader('Content-Type', 'application/json')
    .expectJSONTypes('', {
        error: String,
        validation: {
            type: String
        }
    })
    .expectJSON('', {
        error: 'VALIDATION_ERROR',
        validation: {
            type: 'INVALID'
        }
    })
    .toss();

frisby.create('error post wine invalid year length')
    .post(url + '/wines', {
        name: 'test wine',
        year: '20111',
        country: 'France',
        type: 'red'
    })
    .expectStatus(400)
    .expectHeader('Content-Type', 'application/json')
    .expectJSONTypes('', {
        error: String,
        validation: {
            year: String
        }
    })
    .expectJSON('', {
        error: 'VALIDATION_ERROR',
        validation: {
            year: 'INVALID'
        }
    })
    .toss();

frisby.create('error post wine year not a number')
    .post(url + '/wines', {
        name: 'test wine',
        year: 'AAAA',
        country: 'France',
        type: 'red'
    })
    .expectStatus(400)
    .expectHeader('Content-Type', 'application/json')
    .expectJSONTypes('', {
        error: String,
        validation: {
            year: String
        }
    })
    .expectJSON('', {
        error: 'VALIDATION_ERROR',
        validation: {
            year: 'INVALID'
        }
    })
    .toss();

frisby.create('error put wine by false id ')
    .put(url + '/wines/111111111111111111111', {
        type: 'red'
    })
    .expectStatus(400)
    .expectHeader('Content-Type', 'application/json')
    .expectJSONTypes('', {
        error: String
    })
    .expectJSON('', {
        error: 'UNKNOWN_OBJECT'
    })
    .toss();

frisby.create('error delete wine by false id ')
    .delete(url + '/wines/111111111111111111111')
    .expectStatus(400)
    .expectHeader('Content-Type', 'application/json')
    .expectJSONTypes('', {
        error: String
    })
    .expectJSON('', {
        error: 'UNKNOWN_OBJECT'
    })
    .toss();



