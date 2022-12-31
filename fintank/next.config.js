const withPlugins = require("next-compose-plugins")

const reactSvg = require("next-react-svg")
const path = require("path")

/** @type {import('next').NextConfig} */
// const nextConfig = {
  
//   env:{
//     API_URL:'http://localhost:8000',
//     MAPBOX_ACCESS_TOKEN:'pk.eyJ1IjoiZnJhbmNvZmluIiwiYSI6ImNsNm9nNmIzYzBhbnIzaXRlNTJranJwankifQ.8EBtyLcfgqaQYIWn3y1pbA'
//   }
// }

// module.exports = nextConfig

module.exports = withPlugins(
  [
    [
      reactSvg,
      {
        include: path.resolve(__dirname, "./src/assets/svg"),
      },
    ],
  ],
  {
    images: {
      deviceSizes: [320, 480, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      // loader: "imgix", // Uncomment this line for STATIC EXPORT
      // path: "", // Uncomment this line for STATIC EXPORT
      domains:[
        "thetradingfloor.s3.amazonaws.com",
        "www.bing.com",
        'res.cloudinary.com',
      ]
    },
    env: {
      production_type: "server", // Change variable to "static" for STATIC EXPORT
      // FINTANK_API_URL:'http://localhost:8000',
      FINTANK_API_URL:"https://fintank.herokuapp.com",
      MAPBOX_ACCESS_TOKEN:'pk.eyJ1IjoiZnJhbmNvZmluIiwiYSI6ImNsNm9nNmIzYzBhbnIzaXRlNTJranJwankifQ.8EBtyLcfgqaQYIWn3y1pbA'
    },
    reactStrictMode: true,
    swcMinify: true,
    // trailingSlash: true, // Uncomment this line for STATIC EXPORT
  }
)