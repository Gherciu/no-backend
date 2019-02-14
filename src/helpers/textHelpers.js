import { tablesPluralSuffix } from './strings'

export const isPlural = (text) => {
    return (new RegExp(/^\w{1,}s$/i).test(text))
}

export const isSingular = (text) => {
    return (!new RegExp(/^\w{1,}s$/i).test(text))
}

export const singularToPlural = (text) => {
    if(isPlural(text))
        return text
    else
        return `${text}${tablesPluralSuffix}`
}

export const pluralToSingular = (text) => {
    if(isSingular(text))
        return text
    else
        return `${text.substr(0,text.length-1)}`
}