import {
  Configuration,
  GetFreeBusyRequest,
  BusyInner,
} from '@/types/typescript-axios';

// import { CalendarApi, UserinfoApi } from '@/mock';
import { CalendarApi, UserinfoApi } from '@/types/typescript-axios/api';

/**
 * @summary OpenAPI GeneratorのAPIのインスタンス化で使用する
 */
let configuration: Configuration;

/**
 * @summary OpenAPI Generatorのアクセストークンを変更する関数
 * @export
 * @function
 * @param {string} [token] Googleログイン認証で取得したアクセストークンを設定
 * @example
 * // Googleログイン認証で取得したBear認証を設定。モックの場合は不要
 * setConfig(token);
 */
export const setConfiguration = (token: string): void => {
  const config = new Configuration();
  config.accessToken = token;
  configuration = config;
};

/**
 * @summary ユーザの情報を取得する関数
 * @export
 * @function
 * @returns Userinfo
 * @example
 * // ユーザ情報を取得
 * const userinfo = await getUserinfo();
 */
export const getUserinfo = async () => {
  const userInfoApi = new UserinfoApi(configuration);
  const userInfo = await userInfoApi.getUserinfo();
  return userInfo.data;
};

/**
 * @summary カレンダーのPrimary IDを取得する関数
 * @export
 * @function
 * @return primary@gmail.com
 * @example
 * // カレンダーのIDを取得（Primary IDはuserinfoのemailと原則は同じ）
 * const calendarId = await getCalendarId();
 */
export const getCalendarId = async () => {
  const calendarApi = new CalendarApi(configuration);
  const calendarList = await calendarApi.getCalendarList();

  // primary指定されたカレンダーのIDを返却
  return calendarList.data.items?.find((item) => item.primary === true)?.id;
};

/**
 * @summary カレンダーの予定を取得する関数
 * @export
 * @function
 * @param {GetFreeBusyRequest} [param] param.itemsリストのidにカレンダーのidを指定すること
 * @returns [{ start: "2024-04-01T08:00:00Z", end: "2024-04-01T10:00:00Z" },...]
 * @example
 * // カレンダーの空き時間を指定 (JTC)
 * const param: GetFreeBusyRequest = {
 *   timeMin: '2024-04-06T10:00:00+09:00',
 *   timeMax: '2024-04-06T20:00:00+09:00',
 *   // カレンダーのidを配列で渡す
 *   items: [{ id: calendarId }],
 * };
 * // パラメータで指定した範囲にある予定ありの時間を取得
 * const freeBusy = await getFreeBusy(param);
 * // itemsで指定したidごとに結果が配列で返ってくるので、添え字0を指定して取り出す
 * console.log(freeBusy[0]);
 */
export const getFreeBusy = async (
  param: GetFreeBusyRequest
): Promise<Array<BusyInner>> => {
  const freeBusy = await new CalendarApi(configuration).getFreeBusy(param);
  const calendars = freeBusy.data.calendars;

  const res: BusyInner[] = [];

  param.items
    ?.map((item) => calendars?.[item.id || ''].busy)
    .filter((busy) => busy !== undefined)
    .forEach((i) => res.push(i));

  // busyで指定されたArrayを返却
  return res;
};
