const graphQlError = (error) => {
    
    return {
            "errors": [
            {
                "message": error,
                "locations": [
                    {
                        "line": 0,
                        "column": 0
                    }
                ]
            }
            ]
      }

}

export default graphQlError