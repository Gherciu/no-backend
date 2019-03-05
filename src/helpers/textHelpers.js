import { tablesPluralSuffix } from "./constants";

export const isPlural = text => {
    if (new RegExp(/\_/gi).test(text))
        return text.split("_").filter(textPart => new RegExp(/^\w{1,}s$/).test(textPart)).length > 1 ? true : false;
    return new RegExp(/^\w{1,}s$/).test(text);
};

export const isSingular = text => {
    if (new RegExp(/\_/gi).test(text))
        return text.split("_").filter(textPart => !new RegExp(/^\w{1,}s$/).test(textPart)).length > 1 ? true : false;
    return !new RegExp(/^\w{1,}s$/).test(text);
};

export const singularToPlural = text => {
    if (isPlural(text)) {
        return text;
    } else {
        if (new RegExp(/\_/gi).test(text))
            return text
                .split("_")
                .map(textPart => `${textPart}${tablesPluralSuffix}`)
                .join("_");
        return `${text}${tablesPluralSuffix}`;
    }
};

export const pluralToSingular = text => {
    if (isSingular(text)) {
        return text;
    } else {
        if (new RegExp(/\_/gi).test(text))
            return text
                .split("_")
                .map(textPart => `${textPart.substr(0, textPart.length - 1)}`)
                .join("_");
        return `${text.substr(0, text.length - 1)}`;
    }
};

export const firstToUpperCase = text => {
    if (new RegExp(/\_/gi).test(text)) {
        let res = [];
        text.split("_").forEach(textPart => {
            res.push(
                textPart
                    .split("")
                    .map((char, index) => (index === 0 ? char.toUpperCase() : char))
                    .join("")
            );
        });
        return res.join("_");
    }

    return text
        .split("")
        .map((char, index) => (index === 0 ? char.toUpperCase() : char))
        .join("");
};
