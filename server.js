var express = require('express');
var express_graphql = require('express-graphql');
var {buildSchema} = require('graphql');

const {personsData} = require('./data.json');

// GraphQL Schema
var schema = buildSchema(`
    type Query {
        persona(id: Int!): Persona
        personas(provincia: String!): [Persona]
    }

    type Mutation{
        updatePersonData(id: Int!, provincia: String!): Persona
    }

    type Persona {
        id: Int
        nombre: String
        apellido: String
        edad: Int
        provincia: String
    }
`);

var getPersona = function(args){
    var id = args.id;
    return personsData.filter(persona => {
        return persona.id == id;
    })[0];
}

var getPersonas = function(args){
    if(args.provincia){
        var provincia = args.provincia;
        return personsData.filter(persona => persona.provincia === provincia);
    }else{
        return personsData;
    }
}

var updatePersonData = function({id, provincia}){
    personsData.map(person => {
        if(person.id === id){
            person.provincia = provincia;
            return person;
        }
    });
    return personsData.filter(person => person.id === id)[0];
}

var root = {
    persona: getPersona,
    personas: getPersonas,
    updatePersonData: updatePersonData
};

// Creating an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(4000, () => console.log('Express GraphQL Server running on 4000/graphql'));