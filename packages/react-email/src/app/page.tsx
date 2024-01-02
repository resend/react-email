import { getEmails } from '../utils/get-emails';

const Home = () => {
  const emailPaths = getEmails();

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
