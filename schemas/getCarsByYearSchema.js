const schema = {
  type: "object",
  properties: {
    pathParameters: {
      type: "object",
      properties: {
        year: {
          type: "number",
        },
        estado: {
          type: "string",
          enum: ["Activo", "Inactivo"],
          default: "Activo",
        },
      },
    },
  },
  required: ["pathParameters"],
};

export default schema;
