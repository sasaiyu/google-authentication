import '@/App.css';

import { LoginButton } from '@/components/LoginButton';

function App() {
  return (
    <>
      <LoginButton />
      <p>Google認証ボタンを押したあとにF12キーでコンソールを表示</p>
    </>
  );
}

export default App;
