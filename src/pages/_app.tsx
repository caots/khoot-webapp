import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from 'src/config/store';
import ErrorBoundary from 'src/layout/ErrorBoundary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../styles/main.css';
import '../styles/login.css';
import '../styles/topBar.css';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <Provider store={store}>
    <ErrorBoundary>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Component {...pageProps} />
    </ErrorBoundary>
  </Provider>
);

export default MyApp;
