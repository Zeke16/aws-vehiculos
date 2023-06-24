import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import createError from "http-errors";

const dynamo = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: "us-west-2" })
);
export async function findCar(id) {
  let car;
  try {
    const results = await dynamo.send(
      new GetCommand({
        TableName: "CarsTable",
        Key: { id },
      })
    );

    car = results.Item;
  } catch (error) {
    console.log(error.message);
    throw new createError.InternalServerError(error);
  }

  if (!car) {
    throw new createError.NotFound(`Registro con id ${id} no existe`);
  }

  return car;
}
