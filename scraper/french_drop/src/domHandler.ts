/**
 * 取得したHTMLのハンドリング
 */

import axios from 'axios';
import { JSDOM } from 'jsdom';

// 商品一覧の画面から、商品IDを取得
export const createParamList = async (BASE_URL: string, page: number) => {

  try {
    const paramList: Array<string> = [];

    // URLを設定しDOMオブジェクトを取得（page：カテゴリ別のページネーション先）
    await axios.get(BASE_URL + page)
    .then((response: any) => {
      // HTMLのDOM要素？
      const dom = new JSDOM(response.data);
      // h3タグの配下のaタグないにherf=ページ詳細へのリンクがある
      const Elements = dom.window.document.querySelectorAll('h3 > a');
      // /detail?id=... パスパラメータとなる部分を保持しておく
      Elements.forEach(e => {
        if(String(e) !== undefined) { paramList.push(String(e)); }
      })
    })
    .catch((error: any) => {
      console.log("パスパラメータ取得通信中にエラーが発生しました。" + error);
    })

    // 余計な処理させないように処理を終了させる
    if(paramList.length === 0) {
      throw "パラメータが取得できなかったため処理終了"
    }

    return paramList;

  } catch(error) {
    console.error("パスパラメータ取得中にエラーが発生しました。" + error);
  }
}

// 商品ID（パスパラメータ）を使用してURLを作成
export const createUrl = ( BASE_URL: string, paramList: Array<string> ) => {
  try {
    const urlList = paramList.map((param: string) => BASE_URL + param )

    return urlList;
  } catch(error) {
    console.log("URL作成中にエラーが発生しました。" + error);
  }
}

/**
 * URLのリストを使用してgetItemDetailを実行
 * 新商品の追加時など、単発のURLを使用したい場合があると重いので、リストを使用して実行をかけるメソッドを作る
 */ 
export const execGetItemDetail = (urlList: string[]) => {
  urlList.map((url: string) => {
    getItemDetail(url);
  })
}

// 商品詳細画面から商品情報を抜き出し
export const getItemDetail = async (url: string) => {
  try {
    axios.get(url)
      .then((response: any) => {
        if(response.data) {
          const dom = new JSDOM(response.data);
          // 必要な要素を抜き出す
          const title = dom.window.document.querySelector('#item_title > h3')?.textContent;
          // 動画のURL
          const pvUrl = "";
          // サブカテゴリ（サイト内：ジャンル）
          const subCategory = "";
          // 商品説明
          const desctiption = "";
          // 収録作品（いらないに一票）
        }
      })
      .catch((error: any) => {})
   } catch(error) {
    console.error("詳細情報取得中にエラーが発生しました。" + error)
   }
 }