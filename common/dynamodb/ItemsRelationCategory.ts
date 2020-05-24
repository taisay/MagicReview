import db from './dynamodb';
import * as AWS from 'aws-sdk';

export default class Categories {

  static readonly TABLE_NAME = "Categories";

  private _client: db;

  constructor() {
    this._client = new db(Categories.TABLE_NAME);
  }

  async get<T>(category_id: string, item_id: string): Promise<T | undefined> {

    let result: T | undefined = undefined;
    
    return result;
  }
}
