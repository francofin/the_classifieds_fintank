import React from "react"
import Layout from "@components/Layout"
import { DjangoAuthProvider} from '@context/authContext';
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
    <DjangoAuthProvider>
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    </DjangoAuthProvider>
  )
}

// This default export is required in a new `pages/_app.js` file.
export default App
