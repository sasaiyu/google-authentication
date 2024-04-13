import { useEffect, useState } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

import { googleConfig } from '@/config';
import { GetFreeBusyRequest } from '@/types/typescript-axios/api';
import {
  getFreeBusy,
  getUserinfo,
  getCalendarId,
  setConfiguration,
} from '@/OpenApi';

export const LoginButton = () => {
  const [token, setToken] = useState<string>('');
  const Button = () => {
    const login = useGoogleLogin({
      onSuccess: (credentialResponse) => {
        setToken(credentialResponse.access_token);
      },
      // scopeには使用するAPIが必要とするスコープを設定する。GCPの認証情報も更新が必要。
      scope:
        'email profile openid https://www.googleapis.com/auth/calendar.readonly',
    });

    const handleSubmit = (event: { preventDefault: () => void }) => {
      // デフォルトのフォーム送信をキャンセル⇒ボタン押下時に再読込しない
      event.preventDefault();
      // Googleログイン認証を実行
      login();
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          // Googleログイン認証で取得したBear認証を更新
          setConfiguration(token);

          // ユーザ情報を取得
          const userinfo = await getUserinfo();

          // カレンダーのIDを取得
          const id = await getCalendarId();
          const calendarId = id ? id : userinfo.email;

          // カレンダーの空き時間を取得(UTC標準)
          const param: GetFreeBusyRequest = {
            timeMin: '2024-04-06T10:00:00+09:00',
            timeMax: '2024-04-06T20:00:00+09:00',
            items: [{ id: calendarId }],
          };
          const freeBusyResponse = await getFreeBusy(param);

          // 出力される時間もJTCへの変換が必要
          console.log(freeBusyResponse);
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }, [token]);

    return (
      <form onSubmit={handleSubmit}>
        <button type='submit' color='primary'>
          Google認証
        </button>
      </form>
    );
  };

  return (
    <>
      <GoogleOAuthProvider clientId={googleConfig.webClientId}>
        <Button />
      </GoogleOAuthProvider>
    </>
  );
};
