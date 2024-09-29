import { Helmet } from 'react-helmet-async';
const Title = ( { title = "ChatBox", description = "This is Chat App Called ChatBox" } ) =>
{
  return (
    <>
      <Helmet >
        <title>{ title }</title>
        <meta name='description' content={ description } />
      </Helmet>
    </>
  );
};

export default Title;