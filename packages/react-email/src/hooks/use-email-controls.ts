import { useEffect, useState } from 'react';
import {
  getEmailControls,
  type ControlsResult,
} from '../actions/get-email-controls';
import type { EmailRenderingResult } from '../actions/render-email-by-path';
import type { Controls } from '../package';

export const useEmailControls = (
  emailPath: string,
  serverEmailControlsResult: ControlsResult,
  emailRenderingResult: EmailRenderingResult,
) => {
  const [emailControlsResult, setEmailControlsResult] =
    useState<ControlsResult>(serverEmailControlsResult);

  if (process.env.NEXT_PUBLIC_IS_BUILDING !== 'true') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      getEmailControls(emailPath)
        .then((result) => { setEmailControlsResult(result); })
        .catch((exception) => {
          throw new Error('Could not get controls after rendering email', {
            cause: exception,
          });
        });
    }, [emailRenderingResult, emailPath]);
  }

  return 'error' in emailRenderingResult
    ? undefined
    : (emailControlsResult as { controls: Controls }).controls;
};
