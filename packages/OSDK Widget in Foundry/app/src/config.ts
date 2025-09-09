import { IConfigDefinition } from "@osdk/workshop-iframe-custom-widget";


export const EXAMPLE_CONFIG = [
    {
        fieldId: "stringField", 
        field: {
            type: "single",
            fieldValue: {
                type: "inputOutput", 
                variableType: {
                    type: "string",
                    defaultValue: "test", 
                },
            }, 
            label: "string field", 
        }, 
    }, 
    {
        fieldId: "numberField",
        field: {
            type: "single",
            label: "number field",
            fieldValue: {
                type: "inputOutput",
                variableType: {
                    type: "number", 
                    defaultValue: 25,    
                },
            },
        },
    }, 
    {
        fieldId: "booleanField",
        field: {
            type: "single",
            label: "boolean field",
            fieldValue: {
                type: "inputOutput",
                variableType: {
                    type: "boolean",    
                    defaultValue: undefined,
                },
            },
        },
    }, 
    {
        fieldId: "dateField",
        field: {
            type: "single",
            label: "date field",
            fieldValue: {
                type: "inputOutput",
                variableType: {
                    type: "date",
                    defaultValue: new Date("2024-01-01"),
                },
            }
        },
    }, 
    {
        fieldId: "timestampField",
        field: {
            type: "single",
            label: "timestamp field",
            fieldValue: {
                type: "inputOutput",
                variableType: {
                    type: "timestamp",
                    defaultValue: new Date("2024-12-31"),
                },
            },
        },
    },
    {
        fieldId: "objectSetField", 
        field: {
            type: "single",
            label: "object set field",
            fieldValue: {
                type: "inputOutput",
                variableType: {
                    type: "objectSet",
                    objectTypeId: "<ID.example-alert-INSTALL-SUFFIX>",
                    defaultValue: {
                        type: "string", 
                        primaryKeys: ["1"], 
                    }
                },
            },
        },
    }, 
    {
        fieldId: "stringListField", 
        field: {
            type: "single",
            label: "string list field",
            fieldValue: {
                type: "inputOutput",
                variableType: {
                    type: "string-list",
                    defaultValue: ["hello", "world"],       
                },
            },
        },
    }, 
    {
        fieldId: "numberListField", 
        field: {
            type: "single",
            label: "number list field",
            fieldValue: {
                type: "inputOutput",
                variableType: {
                    type: "number-list",
                    defaultValue: [1, 3]       
                },
            },
        },
    }, 
    {
        fieldId: "booleanListField", 
        field: {
            type: "single",
            label: "boolean list field",
            fieldValue: {
                type: "inputOutput",
                variableType: {
                    type: "boolean-list",
                    defaultValue: [true, false],         
                },
            },
        },
    }, 
    {
        fieldId: "dateListField", 
        field: {
            type: "single",
            label: "date list field",
            fieldValue: {
                type: "inputOutput",
                variableType: {
                    type: "date-list",
                    defaultValue: [new Date("2023-01-01"), new Date("2024-01-01")]         
                },
            },
        },
    }, 
    {
        fieldId: "timestampListField", 
        field: {
            type: "single",
            label: "timestamp list field",
            fieldValue: {
                type: "inputOutput",
                variableType: {
                    type: "timestamp-list",
                    defaultValue: undefined,            
                },
            },
        },
    }, 
    {
        fieldId: "event", 
        field: {
            type: "single",
            label: "Events",
            fieldValue: {
                type: "event",
            },
        },
    }, 
    
]  as const satisfies IConfigDefinition;