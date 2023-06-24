import commonMiddleware from "../../middleware/commonMiddleware";
import { findCar } from "../../helpers/FindCar";
import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";
import findCarSchema from "../../schemas/findCarSchema";

const getCarById = async (event, context) => {
  const { id } = event.pathParameters;

  const car = await findCar(id);
  
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  const response = {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify(car),
  };

  return response;
};

export const handler = commonMiddleware(getCarById).use(
  validator({
    eventSchema: transpileSchema(findCarSchema),
  })
);
