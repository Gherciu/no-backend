import {
    GraphQLBoolean,
    GraphQLInt,
    GraphQLFloat,
    GraphQLString,
    GraphQLNonNull
  } from 'graphql';

const getColumnGraphQlType = (rawType,nullByDefault) => {
    if(new RegExp(/^int/).test(rawType)){//int
        if(nullByDefault){
            return { type:GraphQLInt }
        }
        return { type:new GraphQLNonNull( GraphQLInt ) }
    }else if(new RegExp(/^boo/).test(rawType)){//boolean
        if(nullByDefault){
            return { type:GraphQLBoolean }
        }
        return { type:new GraphQLNonNull( GraphQLBoolean ) }
    }else if(new RegExp(/^flo/).test(rawType)){//float
        if(nullByDefault){
            return { type:GraphQLFloat }
        }
        return { type:new GraphQLNonNull( GraphQLFloat ) }
    }else{//string
        if(nullByDefault){
            return { type:GraphQLString }
        }
        return { type:new GraphQLNonNull( GraphQLString ) }
    }
}

export default getColumnGraphQlType