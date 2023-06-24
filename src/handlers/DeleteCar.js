import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { findCar } from "../../helpers/FindCar";

import validator from "@middy/validator";
import findCarSchema from "../../schemas/findCarSchema";
import { transpileSchema } from "@middy/validator/transpile";

import commonMiddleware from "../../middleware/commonMiddleware";
import createError from "http-errors";

const dynamo = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: "us-west-2" })
);
const deleteCar = async (event, context) => {
  const { id } = event.pathParameters;
  await findCar(id);

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };
  let deletedCar;
  try {
    const results = await dynamo.send(
      new UpdateCommand({
        TableName: "CarsTable",
        Key: { id },
        UpdateExpression:
          "SET estado =:estado",
        ExpressionAttributeValues: {
          ":estado": "Inactivo",
        },
        ReturnValues: "ALL_NEW",
      })
    );

    deletedCar = results.Attributes;

  } catch (error) {
    console.log(error.message);
    throw new createError.InternalServerError(error);
  }

  const response = {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify(deletedCar),
  };
  
  return response;
};

export const handler = commonMiddleware(deleteCar).use(
  validator({
    eventSchema: transpileSchema(findCarSchema),
  })
);
