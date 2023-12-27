import { getEmails } from '../utils/get-emails';

const Home = async () => {
  const emailPaths = await getEmails();

  return (
    <main>
      <ul>
        {emailPaths.map((path) => (
          <li key={path}>{path}</li>
        ))}
      </ul>
    </main>
  );
};

export default Home;
