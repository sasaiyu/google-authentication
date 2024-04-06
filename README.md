# React + TypeScript + Vite

## アプリの起動

```bash
# パッケージのインストール
npm install

# Google Cloud Platformの登録後にviteを起動
npm run dev
```

### Google Cloud Plattorm の登録

- [Google Cloud Plattorm](https://console.cloud.google.com/welcome) から Google Calendar API を有効化
- 登録方法は [GCP プロジェクトの設定をする](https://zenn.dev/yuu104/articles/use-google-calendar-api-with-react-native-expo) を参照
- **認証情報を作成** のアプリケーションの種類はウェブアプリケーションを選択
- OAuth 同意画面の非機密のスコープには以下を追加する
  - .../auth/userinfo.email
  - .../auth/userinfo.profile
  - openid
  - .../auth/calendar.events.readonly
- 認証情報の OAuth2.0 の URI に <http://localhost:3000> を設定

## 設定の詳細

### vite.config.ts

- `base`は相対パスをプロジェクトフォルダにすることで HTML のパス指定を有効にする
- `server`は`npm run dev`でポート番号を指定しブラウザ起動させる
- `plugin` の `tsconfigPaths()`は`import`で指定するパスに含まれる記号を置き換える
  - 定義は `tsconfig.json` の`paths` に記載する
  - `@/` は プロジェクトフォルダ配下の `src/`、`~/` は `./` になる

## OpenAPI Generator

### OpenAPI Generator での自動生成

詳細は [こちら](https://zenn.dev/overflow_offers/articles/20220620-openapi-generator)

VSCode の拡張機能（[42crunch.vscode-openapi](42crunch.vscode-openapi) で検索）をインストールすると、yaml を Swager Doc で表示できる

package.json に yaml の格納先 `-i src/openApi.yaml` と出力先 `-o src/types/typescript-axios` を定義して、`npm run generate-typescript-axios` を実行すると自動生成される

```bash
  "scripts": {
    "generate-typescript-axios": "openapi-generator-cli generate -g typescript-axios -i src/openApi.yaml -o src/types/typescript-axios"
  },
```

### OpenAPI Generator で生成した POJO を実装

自動生成したインターフェイスは直接は変更せず、インポートして委譲する形で使用する。以下の例では、自動生成された `Configuration` と `UserinfoApi` をインスタンス化して、一部を加工することで利用している。

```javascript
// 自動生成されたConfigurationをインスタンス化
const config = new Configuration();
// Googleログイン認証で取得したBear認証に変更
config.accessToken = token;

// ユーザ情報を取得
const userinfo = await getUserinfo(config);

export const getUserinfo = async (config: Configuration) => {
  // 自動生成されたUserinfoApiをインスタンス化
  const userInfoApi = new UserinfoApi(config);
  // getUserinfoメソッドを実行して、レスポンスを取得する
  const userInfo = await userInfoApi.getUserinfo();
  // 使いやすいように加工する。
  return userInfo.data;
};
```
