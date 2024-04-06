import {
  CalendarApi,
  Configuration,
  GetFreeBusyRequest,
  UserinfoApi,
} from '@/types/typescript-axios';

export const getUserinfo = async (config: Configuration) => {
  const userInfoApi = new UserinfoApi(config);
  const userInfo = await userInfoApi.getUserinfo();
  return userInfo.data;
};

export const getCalendarList = async (config: Configuration) => {
  const calendarApi = new CalendarApi(config);
  const calendarList = await calendarApi.getCalendarList();

  // primary指定されたカレンダーのIDを返却
  return calendarList.data.items?.find((item) => item.primary === true)?.id;
};

export const getFreeBusy = async (
  config: Configuration,
  param: GetFreeBusyRequest
) => {
  const freeBusy = await new CalendarApi(config).getFreeBusy(param);
  const calendars = freeBusy.data.calendars;
  // busyで指定されたArrayを返却
  return Object.values(calendars || {})[0]['busy'];
};
