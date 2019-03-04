const matchFilters = (payload, { filters }) => {
    let payloadMatchFilters = true;
    let payloadValue = payload && Object.values(payload);
    payloadValue = payloadValue[0];

    if (payloadValue && Array.isArray(payloadValue) && filters) {
        if (Array.isArray(filters)) {
            for (let payloadValueItem of payloadValue) {
                if (payloadValueItem.id === 241) {
                    payloadMatchFilters = false;
                    break;
                }
            }
        } else {
            throw new TypeError(
                `Error: arg (filters) is ${typeof filters} but it must be an array --> on fn:matchFilters!`
            );
        }
    }

    return payloadMatchFilters;
};

export default matchFilters;
