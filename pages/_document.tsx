import Document, { Head, Html, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#111111" />
          <meta name="robots" content="index,follow" />
          <meta name="description" content="Tochiwears curates premium accessories for modern, confident style." />
          <meta property="og:site_name" content="Tochiwears" />
          <meta property="og:type" content="website" />
          <link rel="preconnect" href="https://images.unsplash.com" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
