import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { findCar } from "../../helpers/FindCar";

import validator from "@middy/validator";
import updateCarSchema from "../../schemas/updateCarSchema";
import { transpileSchema } from "@middy/validator/transpile";

import commonMiddleware from "../../middleware/commonMiddleware";
import createError from "http-errors";

const dynamo = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: "us-west-2" })
);
const updateCar = async (event, context) => {
  const { id } = event.pathParameters;
  await findCar(id);
  const {
    marca,
    modelo,
    year,
    color,
    carroceria,
    motor,
    transmision,
    kilometraje,
    estado,
  } = event.body;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };
  let updatedCar;
  try {
    const results = await dynamo.send(
      new UpdateCommand({
        TableName: "CarsTable",
        Key: { id },
        UpdateExpression:
          "SET marca = :marca, modelo = :modelo, #year = :year, color = :color, carroceria = :carroceria, motor = :motor, transmision = :transmision, kilometraje = :kilometraje, estado =:estado",
        ExpressionAttributeValues: {
          ":marca": marca,
          ":modelo": modelo,
          ":year": year,
          ":color": color,
          ":carroceria": carroceria,
          ":motor": motor,
          ":transmision": transmision,
          ":kilometraje": kilometraje,
          ":estado": estado,
        },
        ExpressionAttributeNames: {
          "#year": "year",
        },
        ReturnValues: "ALL_NEW",
      })
    );

    updatedCar = results.Attributes;

  } catch (error) {
    console.log(error.message);
    throw new createError.InternalServerError(error);
  }

  const response = {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify(updatedCar),
  };
  
  return response;
};

export const handler = commonMiddleware(updateCar).use(
  validator({
    eventSchema: transpileSchema(updateCarSchema),
  })
);


let userTokenCredentials = {
  client_id: "aca el clientid de tu app en auth0",
  username: "usuario existente/ posiblemente correo",
  password: "password del usuario",
  grant_type: "password",
  scope: "openid"
}

fetch('https://example.com/login', {
    method: 'POST',
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },    
    body: new URLSearchParams(userTokenCredentials)
});