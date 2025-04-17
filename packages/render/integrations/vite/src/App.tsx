import { useState, useEffect } from 'react';
import { render } from '@react-email/render';
import './App.css';

function App() {
  const [html, setHtml] = useState('');
  const [error, setError] = useState<string>();

  useEffect(() => {
    (async () => {
      try {
        const html = await render(<div>Testing element</div>, { pretty: true });
        setHtml(html);
      } catch (e) {
        e instanceof Error && setError(e.toString());
      }
    })();
  }, []);

  if (error) {
    return <pre data-testid="rendering-error" style={{ color: 'red' }}>{error}</pre>;
  }

  return <pre data-testid="rendered-html">{html}</pre>;
}

export default App;
