import db from './dynamodb';
import * as AWS from 'aws-sdk';

export default class Reviews {

  static readonly TABLE_NAME: string = "Reviews";

  private _client: db;

  constructor() {
    this._client = new db(Reviews.TABLE_NAME);
  }

  async get<T>(id: string, item_id: string): Promise<T | undefined> {

    let result: T | undefined = undefined;
    let p: AWS.DynamoDB.DocumentClient.GetItemOutput;
    const key: AWS.DynamoDB.DocumentClient.Key = {
      id: id,
      item_id: item_id
    }

    p = await this._client.get(key);
    if( p.Item !== undefined ) {
      result = Object.assign(p.Item);
    }

    return result;
  }

  
}