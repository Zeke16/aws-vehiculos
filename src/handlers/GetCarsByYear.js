import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import commonMiddleware from "../../middleware/commonMiddleware";
import validator from "@middy/validator";
import getCarsByYearSchema from "../../schemas/getCarsByYearSchema";
import { transpileSchema } from "@middy/validator/transpile";
import createError from "http-errors";

const dynamo = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: "us-west-2" })
);

const getCarsByYear = async (event, context) => {
  try {
    let cars;
    let { estado, year } = event.pathParameters;

    const params = {
      TableName: "CarsTable",
      IndexName: "estadoYearIndex",
      KeyConditionExpression: "#year = :year AND estado = :estado",
      ExpressionAttributeValues: {
        ":estado": estado,
        ":year": year,
      },
      ExpressionAttributeNames: {
        "#year": "year",
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

export const handler = commonMiddleware(getCarsByYear).use(
  validator({
    eventSchema: transpileSchema(getCarsByYearSchema),
    ajvOptions: {
      useDefault: true,
      strict: false,
    },
  })
);
