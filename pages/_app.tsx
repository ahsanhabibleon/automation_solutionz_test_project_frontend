import type { AppProps } from 'next/app'
import 'antd/dist/antd.css';
import "../styles/global.scss"
import { notification } from 'antd';

function MyApp({ Component, pageProps }: AppProps) {

  notification.config({
    // placement: 'bottomRight',
    // bottom: 50,
    duration: 3,
    // rtl: true,
  });

  return <Component {...pageProps} />
}

export default MyApp
