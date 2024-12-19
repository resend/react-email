/**
 * @vitest-environment node
 */

import { Suspense } from 'react';
import usePromise from 'react-promise-suspense';
import { Preview } from '../shared/utils/preview';
import { Template } from '../shared/utils/template';
import { renderAsync } from './render-async';

type Import = typeof import('react-dom/server') & {
  default: typeof import('react-dom/server');
};

describe('renderAsync on node environments', () => {
  it('converts a React component into HTML with Next 14 error stubs', async () => {
    vi.mock('react-dom/server', async () => {
      const ReactDOMServer = await vi.importActual<Import>('react-dom/server');
      const ERROR_MESSAGE =
        'Internal Error: do not use legacy react-dom/server APIs. If you encountered this error, please open an issue on the Next.js repo.';

      return {
        ...ReactDOMServer,
        renderToString() {
          throw new Error(ERROR_MESSAGE);
        },
        renderToStaticMarkup() {
          throw new Error(ERROR_MESSAGE);
        },
      };
    });

    const actualOutput = await renderAsync(<Template firstName="Jim" />);

    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><link rel="preload" as="image" href="img/test.png"/><!--$--><h1>Welcome, <!-- -->Jim<!-- -->!</h1><img alt="test" src="img/test.png"/><p>Thanks for trying our product. We&#x27;re thrilled to have you on board!</p><!--/$-->"`,
    );

    vi.resetAllMocks();
  });

  // This is a test to ensure we have no regressions for https://github.com/resend/react-email/issues/1667
  it('should handle characters with a higher byte count gracefully in React 18', async () => {
    const actualOutput = await renderAsync(
      <>
        <p>Test Normal 情報Ⅰコース担当者様</p>
        <p>
          平素よりお世話になっております。 情報Ⅰサポートチームです。
          情報Ⅰ本講座につきまして仕様変更のためご連絡させていただきました。{' '}
        </p>
        今後ジクタス上の講座につきましては、8回分の授業をひとまとまりとしてパート分けされた状態で公開されてまいります。
        <p>
          伴いまして、画面上の表示に一部変更がありますのでお知らせいたします。
          ご登録いただいた各生徒の受講ペースに応じて公開パートが増えてまいります。
          具体的な表示イメージは下記ページをご確認ください。
        </p>
        <p>
          2024年8月末時点で情報Ⅰ本講座を受講していたアカウントにつきましては、
          今まで公開していた第１～９回までの講座一覧に加え、パート分けされた講座が追加で公開されてまりいます。
          第1～9回の表示はそのまま引き継がれますが、Webドリルの進捗表示はパート分けの講座には適用されません。ご了承くださいませ。
          仕様変更に伴い、現在教室長もしくは講師に生徒アカウントログインをお願いしておりますが、今後は生徒自身にてログインをしていただいて問題ございません。
        </p>
        <p>
          また、生徒が自宅等にてログインし復習に取り組むことも問題ございませんので、教室にてご指示いただければと存じます。
          （実際にご指示いただくかは教室判断に委ねさせていただきます。）
        </p>
        <p>
          受講ペースが変更したり、増コマが発生したりする場合などは、公開ペースを本部にて調整いたしますので、下記より必ずご連絡くださいませ。
          また本件に関して不明な点がございましたら、同フォームよりお問い合わせください。
          以上、引き続きよろしくお願い申し上げます。 情報Ⅰサポートチーム
        </p>
      </>,
    );

    expect(actualOutput).toMatchSnapshot();
  });

  it('that it properly waits for Suepsense boundaries to resolve before resolving', async () => {
    const EmailTemplate = () => {
      const html = usePromise(
        () => fetch('https://example.com').then((res) => res.text()),
        [],
      );

      return <div dangerouslySetInnerHTML={{ __html: html }} />;
    };

    const renderedTemplate = await renderAsync(
      <Suspense>
        <EmailTemplate />
      </Suspense>,
    );

    expect(renderedTemplate).toMatchSnapshot();
  });

  it('converts a React component into HTML', async () => {
    const actualOutput = await renderAsync(<Template firstName="Jim" />);

    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><link rel="preload" as="image" href="img/test.png"/><!--$--><h1>Welcome, <!-- -->Jim<!-- -->!</h1><img alt="test" src="img/test.png"/><p>Thanks for trying our product. We&#x27;re thrilled to have you on board!</p><!--/$-->"`,
    );
  });

  it('converts a React component into PlainText', async () => {
    const actualOutput = await renderAsync(<Template firstName="Jim" />, {
      plainText: true,
    });

    expect(actualOutput).toMatchInlineSnapshot(`
      "WELCOME, JIM!

      Thanks for trying our product. We're thrilled to have you on board!"
    `);
  });

  it('converts to plain text and removes reserved ID', async () => {
    const actualOutput = await renderAsync(<Preview />, {
      plainText: true,
    });

    expect(actualOutput).toMatchInlineSnapshot(
      `"THIS SHOULD BE RENDERED IN PLAIN TEXT"`,
    );
  });
});
