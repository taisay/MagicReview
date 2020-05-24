import AWS from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';

type DocumentClient = AWS.DynamoDB.DocumentClient;
type GetItemInput = AWS.DynamoDB.DocumentClient.GetItemInput;
type QueryInput = AWS.DynamoDB.DocumentClient.QueryInput;
type ScanInput = AWS.DynamoDB.DocumentClient.ScanInput;
type QueryOutput = AWS.DynamoDB.DocumentClient.QueryOutput;
type Put = AWS.DynamoDB.DocumentClient.Put;

export default class DynamoSerializer {

  private _db: DocumentClient;
  private _tableName: string;

  constructor(tableName: string) {
    this._db = new AWS.DynamoDB.DocumentClient();
    this._tableName = tableName;
  }

  public async get(
    key: AWS.DynamoDB.DocumentClient.Key,
    attrName?: AWS.DynamoDB.DocumentClient.ExpressionAttributeNameMap,
    projection?: AWS.DynamoDB.DocumentClient.ProjectionExpression
  ): Promise<PromiseResult<AWS.DynamoDB.DocumentClient.GetItemOutput, AWS.AWSError>> {

    const params: GetItemInput = {
      TableName: this._tableName,
      Key: key,
      ExpressionAttributeNames: attrName,
      ProjectionExpression: projection,
    };

    return this._db.get(params).promise();
  }

  public async query<T>(
    condition: AWS.DynamoDB.DocumentClient.ConditionExpression,
    attrName?: AWS.DynamoDB.DocumentClient.ExpressionAttributeNameMap,
    attrValue?: AWS.DynamoDB.DocumentClient.ExpressionAttributeValueMap,
    filter?: AWS.DynamoDB.DocumentClient.ConditionExpression,
    exclusiveStartKey?: AWS.DynamoDB.DocumentClient.Key,
    projection?: AWS.DynamoDB.DocumentClient.ProjectionExpression
  ): Promise<T[]> {

    try {
      const params: QueryInput = {
        TableName: this._tableName,
        FilterExpression: filter,
        ExpressionAttributeNames: attrName,
        ExpressionAttributeValues: attrValue,
        ProjectionExpression: projection,
        ExclusiveStartKey: exclusiveStartKey,
        KeyConditionExpression: condition
      }

      let p: QueryOutput = {};
      const result: T[] = [];
      do {
        p = await this._db.query(params).promise();
        if( p.Items === undefined) {
          break;
        }
        p.Items.forEach((val) => {
          result.push(Object.assign(val));
        });

        if( p.LastEvaluatedKey ) {
          params.ExclusiveStartKey = p.LastEvaluatedKey;
        }

      } while (p.LastEvaluatedKey);

      return result;

    } catch(error) {
      throw error;
    }
  }

  public async queryByIndex<T>(
    indexName: string,
    condition: AWS.DynamoDB.DocumentClient.ConditionExpression,
    attrName?: AWS.DynamoDB.DocumentClient.ExpressionAttributeNameMap,
    attrValue?: AWS.DynamoDB.DocumentClient.ExpressionAttributeValueMap,
    filter?: AWS.DynamoDB.DocumentClient.ConditionExpression,
    exclusiveStartKey?: AWS.DynamoDB.DocumentClient.Key,
    projection?: AWS.DynamoDB.DocumentClient.ProjectionExpression
  ): Promise<T[]> {

    try {
      const params: QueryInput = {
        TableName: this._tableName,
        IndexName: indexName,
        FilterExpression: filter,
        ExpressionAttributeNames: attrName,
        ExpressionAttributeValues: attrValue,
        ProjectionExpression: projection,
        ExclusiveStartKey: exclusiveStartKey,
        KeyConditionExpression: condition
      };

      let p: QueryOutput = {};
      const result: T[] = [];

      do {
        p = await this._db.query(params).promise();
        if( p.Items === undefined) {
          break;
        }
        p.Items.forEach((val) => {
          result.push(Object.assign(val));
        });

        if( p.LastEvaluatedKey ) {
          params.ExclusiveStartKey = p.LastEvaluatedKey;
        }

      } while( p.LastEvaluatedKey );

      return result;

    } catch(error) {
      throw error;
    }
  }

  public async scan<T>(
    filter?: AWS.DynamoDB.DocumentClient,
    attrName?: AWS.DynamoDB.DocumentClient.ExpressionAttributeNameMap,
    attrValue?: AWS.DynamoDB.DocumentClient.ExpressionAttributeValueMap,
    exclusiveStartKey?: AWS.DynamoDB.DocumentClient.Key,
    projection?: AWS.DynamoDB.DocumentClient.ProjectionExpression
  ): Promise<T[]> {

    try {
      const params: ScanInput = {
        TableName: this._tableName,
        ExpressionAttributeNames: attrName,
        ExpressionAttributeValues: attrValue,
        ProjectionExpression: projection,
        ExclusiveStartKey: exclusiveStartKey,
      }

      let p: QueryOutput = {};
      const result: T[] = [];

      do {
        p = await this._db.query(params).promise();
        if( p.Items === undefined) {
          break;
        }
        p.Items.forEach((val) => {
          result.push(Object.assign(val));
        });

        if( p.LastEvaluatedKey ) {
          params.ExclusiveStartKey = p.LastEvaluatedKey;
        }

      } while( p.LastEvaluatedKey );

      return result;

    } catch(error) {
      throw error;
    }
  }

  public async put(
    item: AWS.DynamoDB.DocumentClient.PutItemInputAttributeMap,
    condition?: AWS.DynamoDB.DocumentClient.ConditionExpression,
    attrName?: AWS.DynamoDB.DocumentClient.ExpressionAttributeNameMap,
    attrValue?: AWS.DynamoDB.DocumentClient.ExpressionAttributeValueMap,
    returnValCondChkFail?: AWS.DynamoDB.DocumentClient.ReturnValuesOnConditionCheckFailure
    ) {

    try {
      const params: Put = {
        TableName: this._tableName,
        Item: item,
        ConditionExpression: condition,
        ExpressionAttributeNames: attrName,
        ExpressionAttributeValues: attrValue,
        ReturnValuesOnConditionCheckFailure: returnValCondChkFail
      }

      // これでいいか不明…実装しながら修正して行く
      return this._db.put(params).promise();

    } catch(error) {
      throw error
    }
  }
}