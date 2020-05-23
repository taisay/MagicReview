import * as domHandler from './domHandler';

// 取得したいカテゴリなどによってここのURLを変更する
const CREATE_PARAM_BASE_URL: string = "";
// 何ページ目まで取得したいか選択（DynamoDBは25件までしか一括投入できないから、一括でやりたい時の処理考えないと…）
const END_PAGE: number = 1
const DETAIL_BASE_URL:string = "";

const main = async () => {
  try {
    
    const paramList = await domHandler.createParamList(CREATE_PARAM_BASE_URL, END_PAGE);
    
    // 起こらないはずだが、型の制限によりチェック入れる（本当はちゃんとしたやり方あるはず…）
    
    // 取得するページのURLを設定
    console.log("取得するページのURLを設定：START")
    // こんな書き方でいいのか疑問。。。
    const urlList = paramList !== undefined ? await domHandler.createUrl(DETAIL_BASE_URL, paramList) : [];
    console.log("取得するページのURLを設定：END")
    
    // HTMLの要素をGet
    console.log("HTMLから情報を取得：START")
    // ↓処理出来上がってないから一旦コメントアウト
    //domHandler.execGetItemDetail(urlList)
    console.log("HTMLから情報を取得：END")
    // DB登録用にJSON形式に変換
    console.log("JSON形式にデータを変換：START");
    console.log("JSON形式にデータを変換：END");
    // データを登録
    console.log("DynameDBへデータ登録：START")
    console.log("DynameDBへデータ登録：END")
  } catch(err) {
    console.log("スクレイピング処理中にエラーが発生しました：" + err)
  }
  
}

main();