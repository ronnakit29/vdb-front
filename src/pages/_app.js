import store from '@/store';
import '@/styles/globals.css'
import { NextUIProvider } from "@nextui-org/react";
import { Provider } from 'react-redux';

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <Provider store={store}>
      <NextUIProvider>
        {getLayout(<Component {...pageProps} />)}
      </NextUIProvider>
    </Provider>
  )
}
