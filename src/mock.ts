import {
  GetCalendarList200Response,
  GetFreeBusy200Response,
  GetFreeBusyRequest,
  Userinfo,
} from './types/typescript-axios/api';
import { BaseAPI } from './types/typescript-axios/base';

/**
 * @summary getUserinfoのレスポンスのサンプルデータ
 */
const userinfo: Userinfo = {
  email: 'test@example.com',
  family_name: '原',
  given_name: '健一郎',
  id: '123456789',
  locale: 'ja_JP',
  name: '健一郎 原',
  picture:
    'https://lh3.googleusercontent.com/a/ACg8ocJ0Cg10JKHQ7vOi8WaM3YWkJwifNOjErx4OLUSO6JGCHvnKv-kP=s96-c',
  verified_email: true,
};

/**
 * @summary getCalendarListのレスポンスのサンプルデータ
 */
const getCalendarList200Response: GetCalendarList200Response = {
  kind: 'calendar#calendarList',
  etag: '123456789',
  nextPageToken: 'nextPageTokenValue',
  nextSyncToken: 'nextSyncTokenValue',
  items: [
    {
      kind: 'calendar#calendarListEntry',
      id: 'primary@gmail.com',
      primary: true,
    },
    {
      kind: 'calendar#calendarListEntry',
      id: 'not primary id',
      primary: false,
    },
  ],
};

/**
 * @summary getFreeBusyのレスポンスのサンプルデータ
 */
const getFreeBusy200Response: GetFreeBusy200Response = {
  kind: 'calendar#freeBusy',
  timeMin: '2024-04-01T00:00:00Z',
  timeMax: '2024-04-07T23:59:59Z',
  calendars: {
    keys: {
      errors: [{ domain: 'Error message 1' }, { reason: 'Error message 2' }],
      busy: [
        { start: '2024-04-01T08:00:00Z', end: '2024-04-01T10:00:00Z' },
        { start: '2024-04-01T13:00:00Z', end: '2024-04-01T15:00:00Z' },
        { start: '2024-04-02T09:00:00Z', end: '2024-04-02T11:00:00Z' },
        { start: '2024-04-03T10:00:00Z', end: '2024-04-03T12:00:00Z' },
        { start: '2024-04-03T14:00:00Z', end: '2024-04-03T16:00:00Z' },
        { start: '2024-04-03T18:00:00Z', end: '2024-04-03T20:00:00Z' },
        { start: '2024-04-04T08:30:00Z', end: '2024-04-04T10:30:00Z' },
        { start: '2024-04-05T11:00:00Z', end: '2024-04-05T13:00:00Z' },
        { start: '2024-04-06T12:00:00Z', end: '2024-04-06T14:00:00Z' },
        { start: '2024-04-06T15:00:00Z', end: '2024-04-06T17:00:00Z' },
        { start: '2024-04-06T19:00:00Z', end: '2024-04-06T21:00:00Z' },
        { start: '2024-04-07T08:00:00Z', end: '2024-04-07T10:00:00Z' },
        { start: '2024-04-07T13:00:00Z', end: '2024-04-07T15:00:00Z' },
        { start: '2024-04-07T17:00:00Z', end: '2024-04-07T19:00:00Z' },
      ],
    },
  },
};

/**
 * @summary ユーザの情報を取得するAPI
 * @export
 * @class UserinfoApi
 */
export class UserinfoApi extends BaseAPI {
  /**
   * @summary ユーザ情報をdataプロパティにくるんで返却
   * @memberof UserinfoApi
   * @method
   * @returns data:Userinfo
   */
  public getUserinfo(): Promise<{ data: Userinfo }> {
    return Promise.resolve({ data: userinfo });
  }
}
/**
 * @summary カレンダー情報を取得するAPI
 * @export
 * @class CalendarApi
 */
export class CalendarApi extends BaseAPI {
  /**
   * @summary カレンダーのイベント情報をdataプロパティにくるんで返却
   * @memberof CalendarApi
   * @method
   * @returns data:GetCalendarList200Response
   */
  public getCalendarList(): Promise<{ data: GetCalendarList200Response }> {
    return Promise.resolve({ data: getCalendarList200Response });
  }
  /**
   * @summary カレンダーの予定をdataプロパティにくるんで返却
   * @memberof CalendarApi
   * @method
   * @param {getFreeBusyRequest} [getFreeBusyRequest]
   * @returns data:GetFreeBusyRequest
   */
  public getFreeBusy(
    getFreeBusyRequest?: GetFreeBusyRequest
  ): Promise<{ data: GetFreeBusy200Response }> {
    // モックのため、リクエストパラメータは使用しない
    getFreeBusyRequest;
    return Promise.resolve({ data: getFreeBusy200Response });
  }
}
