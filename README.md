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

## Google 認証のライブラリ

利用しているライブラリは[こちら](https://github.com/MomenSherif/react-oauth?tab=readme-ov-file)

## OpenAPI Generator での自動生成

OpenAPI Generator は API のドキュメント（Swagger Doc）とソースの自動生成ができる。

- インストール

詳細は [こちら](https://zenn.dev/overflow_offers/articles/20220620-openapi-generator)

```bash
# パッケージのインストール
npm install @openapitools/openapi-generator-cli -D

#パッケージを動かすために、javaがインストールされている必要がある
java --version
```

`package.json` に yaml の格納先 `-i src/openApi.yaml` と出力先 `-o src/types/typescript-axios` を定義する。

```bash
  "scripts": {
    "generate-typescript-axios": "openapi-generator-cli generate -g typescript-axios -i src/openApi.yaml -o src/types/typescript-axios"
  },
```

`num run` を実行すると自動生成される。上記の例だと、`src/types/typescript-axios/api.ts`に API を実行するクラス群が記載される。

```bash
# yamlの内容をもとに自動生成
npm run generate-typescript-axios
```

- yaml の作成と Swagger Doc の自動生成

VSCode の拡張機能（[42crunch.vscode-openapi](https://marketplace.visualstudio.com/items?itemName=42Crunch.vscode-openapi) で検索）をインストールすると、yaml を Swager Doc で表示できる。

- コードの自動生成

自動生成したインターフェイスは直接は変更せず、インポートして委譲する形で使用する。以下の例では、自動生成された `Configuration` と `UserinfoApi` をインスタンス化して、一部を加工することで利用している。

```javascript
// src/components/LoginButton.tsx
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
  // 使いやすいようにレスポンスを加工する。
  return userInfo.data;
};
```

- カレンダー情報の取得

カレンダー情報は GCP Calender API の [freeBusy](https://developers.google.com/calendar/api/v3/reference/freebusy/query?hl=ja)で取得できる。ただし、リクエストパラメータにある[カレンダー ID](https://developers.google.com/calendar/api/concepts/events-calendars?hl=ja#calendar_and_calendar_list) は事前に取得しておくこと。

```url
https://www.googleapis.com/calendar/v3/freeBusy
```

レスポンスの例は以下。

```json
{
  "kind": "string",
  "timeMin": "2024-04-07T09:41:44.507Z",
  "timeMax": "2024-04-07T09:41:44.507Z",
  "calendars": {
    "keys": {
      "errors": [
        {
          "domain": "string",
          "reason": "string"
        }
      ],
      "busy": [
        {
          /* ここの値を取得したい */
          "start": "2024-04-07T09:41:44.507Z",
          "end": "2024-04-07T09:41:44.507Z"
        }
      ]
    }
  }
}
```

上記の JSON 構造に対応する POJO は自動生成されるため、POJO のクラスを紐解いていけば欲しい情報が取得できる。

```javascript
# src/OpenApi.ts
export const getFreeBusy = async (
  config: Configuration,
  param: GetFreeBusyRequest
) => {
  // 自動生成されたメソッドを実行してレスポンスを取得
  const freeBusy = await new CalendarApi(config).getFreeBusy(param);
  // レスポンスのcaldendersタグの値を取得
  const calendars = freeBusy.data.calendars;
  // keysタグにはカレンダーIDが入るため、バリューを展開して配列にしたあと、busyタグの値を取得
  return Object.values(calendars || {})[0]['busy'];
};
```

実行結果は以下。4 月 6 日 10 時～ 13:30、16 時～ 18 時にスケジュールを入れているが、UTC 標準時間（日本時間からマイナス 9 時間）で取得されている。

```json
[
  {
    "start": "2024-04-06T01:00:00Z",
    "end": "2024-04-06T04:30:00Z"
  },
  {
    "start": "2024-04-06T07:00:00Z",
    "end": "2024-04-06T09:00:00Z"
  }
]
```
