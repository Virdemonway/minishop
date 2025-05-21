export default function Error({ statusCode }) {
  return (
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-3xl font-bold neon-text">
        {statusCode ? `An error ${statusCode} occurred` : 'An error occurred'}
      </h1>
      <p>Sorry, something went wrong.</p>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
