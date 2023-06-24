import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuid } from "uuid";

import validator from "@middy/validator";
import createCarSchema from "../../schemas/createCarSchema";
import { transpileSchema } from "@middy/validator/transpile";

import commonMiddleware from "../../middleware/commonMiddleware";
import createError from "http-errors";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as fileType from "file-type";

const allowedMimes = ["image/jpeg", "image/png", "image/jpg"];

const dynamo = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: "us-west-2" })
);
const client = new S3Client({ region: "us-west-2" });
const createCar = async (event, context) => {
  try {
    /*const {
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
    };
    
    {
    "marca": "Toyota",
    "modelo": "Corolla",
    "year": 2007,
    "color": "Blanco",
    "carroceria": "Sedan",
    "motor": "V8",
    "transmision": "Automatica",
    "kilometraje": "2049
} */
    const img = event.body;
    const buffer = Buffer.from(img, "base64");
    const fileInfo = await fileType.fileTypeFromBuffer(buffer);
    const detectedExt = fileInfo.ext;
    const detectedMime = fileInfo.mime;
    const name = uuid();
    const key = `${name}.${detectedExt}`;
    const params = {
      Bucket: "images-cars-bucket", // Reemplaza con el nombre de tu bucket
      Key: key, // Reemplaza con el nombre que desees para la imagen en S3
      Body: buffer,
      ContentType: detectedMime,
      ACL: "public-read",
    };

    // Sube la imagen a S3
    const command = new PutObjectCommand(params);
    const data = await client.send(command);
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };

    const response = {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(clave),
    };

    /*await dynamo.send(
      new PutCommand({
        TableName: "CarsTable",
        Item: newCar,
      })
    );*/

    return response;
  } catch (error) {
    console.log(error.message);
    throw new createError.InternalServerError(error);
  }
};

export const handler = commonMiddleware(createCar);
