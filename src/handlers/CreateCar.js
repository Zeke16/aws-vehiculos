import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuid } from "uuid";

import validator from "@middy/validator";
import createCarSchema from "../../schemas/createCarSchema";
import { transpileSchema } from "@middy/validator/transpile";

import commonMiddleware from "../../middleware/commonMiddleware";
import createError from "http-errors";

const dynamo = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: "us-west-2" })
);
const createCar = async (event, context) => {
  try {
    const {
      marca,
      modelo,
      year,
      color,
      carroceria,
      motor,
      transmision,
      kilometraje,
    } = event.body;
    //const { email } = event.requestContext.authorizer;
    const now = new Date();

    const newCar = {
      marca: marca,
      modelo: modelo,
      year: year,
      color: color,
      carroceria: carroceria,
      motor: motor,
      transmision: transmision,
      kilometraje: kilometraje,
      createdAt: now.toISOString(),
      id: uuid(),
      estado: "Activo",
      imagen: ""
    };
    
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };

    const response = {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(newCar),
    };

    await dynamo.send(
      new PutCommand({
        TableName: "CarsTable",
        Item: newCar,
      })
    );

    return response;
  } catch (error) {
    console.log(error.message);
    throw new createError.InternalServerError(error);
  }
};

export const handler = commonMiddleware(createCar).use(
  validator({
    eventSchema: transpileSchema(createCarSchema),
  })
);
