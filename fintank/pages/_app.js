import React from "react"
import Layout from "@components/Layout"
import { DjangoAuthProvider} from '@context/authContext';
import { Provider } from "react-redux";
import { wrapper, theStore } from "@src/store";
import "swiper/css/bundle"
// swiper core styles
import "swiper/css"

// modules styles
import "swiper/css/pagination"
import "swiper/css/navigation"

import "@fortawesome/fontawesome-svg-core/styles.css"
import "../src/scss/style.default.scss"

const App = ({ Component, pageProps }) => {
  return (
    <Provider store={theStore}>
      <DjangoAuthProvider>
        <Layout {...pageProps}>
          <Component {...pageProps} />
        </Layout>
      </DjangoAuthProvider>
    </Provider>
  )
}

// This default export is required in a new `pages/_app.js` file.
export default wrapper.withRedux(App);
