import { convert } from 'html-to-text';
import { Suspense } from 'react';
import type { Options } from '../shared/options';
import { plainTextSelectors } from '../shared/plain-text-selectors';
import { pretty } from '../shared/utils/pretty';
import { readStream } from './read-stream';

export const render = async (
  element: React.ReactElement,
  options?: Options,
) => {
  const suspendedElement = <Suspense>{element}</Suspense>;
  const reactDOMServer = await import('react-dom/server');

  let html!: string;
  if (Object.hasOwn(reactDOMServer, 'renderToReadableStream')) {
    html = await readStream(
      await reactDOMServer.renderToReadableStream(suspendedElement),
    );
  } else {
    await new Promise<void>((resolve, reject) => {
      const stream = reactDOMServer.renderToPipeableStream(suspendedElement, {
        async onAllReady() {
          html = await readStream(stream);
          resolve();
        },
        onError(error) {
          reject(error as Error);
        },
      });
    });
  }

  if (options?.plainText) {
    return convert(html, {
      selectors: plainTextSelectors,
      ...options.htmlToTextOptions,
    });
  }

  const doctype =
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';

    let document = `${doctype}${html.replace(/<!DOCTYPE.*?>/, '')}`;

    //Search returns -1 when substring is not found. Adjusting it to 0 gives us a false value. 
    var search1 = html.search("&quot;") + 1;
    var search2 = html.search("&#x27;") + 1;
    var search3 = html.search("&amp;") + 1;
    console.log(search1,search2,search3);
    
    //Checks to see if there are incorrect escape characters within the html string and uses regex to change them correct formatting to prevent errors. 
    if(search1|| search2){
      console.log('Quote or Single quote detected');
  
      const styleRegex = /style="([^"]*(&quot;|&#x27;)[^"]*)"/g;
      document = document.replace(styleRegex, (match, p1) => {
      return `style="${p1.replace(/&quot;|&#x27;/g, "'")}"`;
  
    });
    }
    else if(search3){
      console.log('Ampbersand Detected.');
      document = document.replace(/href="([^"]*&amp;[^"]*)"/g, (match, p1) => {
      return `href="${p1.replace(/&amp;/g, "&")}"`;
      });
    }
  
  
    if (options?.pretty) {
      return pretty(document);
    }
  
    return document;
  };
