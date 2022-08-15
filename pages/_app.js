import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <div className="px-16 py-8">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
