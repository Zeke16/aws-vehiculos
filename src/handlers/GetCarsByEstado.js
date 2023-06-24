import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import commonMiddleware from "../../middleware/commonMiddleware";
import validator from "@middy/validator";
import getCarsByEstadoSchema from "../../schemas/getCarsByEstadoSchema";
import { transpileSchema } from "@middy/validator/transpile";
import createError from "http-errors";

const dynamo = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: "us-west-2" })
);

const getCarsByEstado = async (event, context) => {
  try {
    let cars;
    let { estado } = event.queryStringParameters;

    const params = {
      TableName: "CarsTable",
      IndexName: "estadoCreatedAtIndex",
      KeyConditionExpression: "estado = :estado",
      ExpressionAttributeValues: {
        ":estado": estado,
      },
    };

    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };

    const results = await dynamo.send(new QueryCommand(params));

    cars = results.Items;

    const response = {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(cars),
    };

    return response;
  } catch (error) {
    console.log(error.message);
    throw new createError.InternalServerError(error);
  }
};

export const handler = commonMiddleware(getCarsByEstado).use(
  validator({
    eventSchema: transpileSchema(getCarsByEstadoSchema),
    ajvOptions: {
      useDefault: true,
      strict: false,
    },
  })
);
