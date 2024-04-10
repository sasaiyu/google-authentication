import { Configuration, GetFreeBusyRequest } from '@/types/typescript-axios';

import { CalendarApi, UserinfoApi } from '@/mock';

/**
 * @summary ユーザの情報を取得する関数
 * @export
 * @function getUserinfo
 * @param {Configuration} [config] config.accessTokenを払い出ししたトークンで更新すること
 * @returns Userinfo
 */
export const getUserinfo = async (config: Configuration) => {
  const userInfoApi = new UserinfoApi(config);
  const userInfo = await userInfoApi.getUserinfo();
  return userInfo.data;
};

/**
 * @summary カレンダーのIDを取得する関数
 * @export
 * @function getCalendarList
 * @param {Configuration} [config] config.accessTokenを払い出ししたトークンで更新すること
 * @return string | undefined
 */
export const getCalendarList = async (config: Configuration) => {
  const calendarApi = new CalendarApi(config);
  const calendarList = await calendarApi.getCalendarList();

  // primary指定されたカレンダーのIDを返却
  return calendarList.data.items?.find((item) => item.primary === true)?.id;
};

/**
 * @summary カレンダーの予定を取得する関数
 * @export
 * @function getCalendarList
 * @param {Configuration} [config] config.accessTokenを払い出ししたトークンで更新すること
 * @param {GetFreeBusyRequest} [param] param.itemsリストのidにカレンダーのidを指定すること
 * @returns Array<{string,string}>
 */
export const getFreeBusy = async (
  config: Configuration,
  param: GetFreeBusyRequest
) => {
  const freeBusy = await new CalendarApi(config).getFreeBusy(param);
  const calendars = freeBusy.data.calendars;
  // busyで指定されたArrayを返却
  return Object.values(calendars || {})[0]['busy'];
};
