const schema = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        marca: {
          type: "string",
          minLength: 1,
          maxLength: 100,
        },
        modelo: {
          type: "string",
          minLength: 1,
          maxLength: 100,
        },
        year: {
          type: "number",
        },
        color: {
          type: "string",
          minLength: 1,
          maxLength: 25,
        },
        carroceria: {
          type: "string",
          minLength: 1,
          maxLength: 100,
        },
        motor: {
          type: "string",
          minLength: 1,
          maxLength: 100,
        },
        transmision: {
          type: "string",
          minLength: 1,
          maxLength: 100,
        },
        kilometraje: {
          type: "number",
        },
      },
      required: ["marca", "modelo", "year", "color", "carroceria", "motor", "transmision", "kilometraje"],
    },
  },
  required: ["body"],
};

export default schema;
