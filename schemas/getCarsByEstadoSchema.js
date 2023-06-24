const schema = {
  type: "object",
  properties: {
    queryStringParameters: {
      type: "object",
      properties: {
        estado: {
          type: "string",
          enum: ["Activo", "Inactivo"],
          default: "Activo",
        },
      },
    },
  },
  required: ["queryStringParameters"],
};

export default schema;
