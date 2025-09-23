import { useRef, useState } from 'react';

export interface ResendStatus {
  hasApiKey: boolean;
  message?: string;
}

export const useResend = ({
  initialStatus,
}: {
  initialStatus?: ResendStatus;
} = {}) => {
  const [status, setStatus] = useState<ResendStatus | undefined>(initialStatus);

  const [loading, setLoading] = useState(false);
  const isLoadingRef = useRef(false);

  const load = async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setLoading(true);

    try {
      const response = await fetch('/api/has-resend-api-key', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const body = (await response.json().catch(() => ({}))) as
        | { status?: string; message?: string; error?: string }
        | undefined;

      if (response.ok) {
        const result: ResendStatus = { hasApiKey: true };
        setStatus(result);
        return result;
      }

      if (response.status === 400) {
        const result: ResendStatus = {
          hasApiKey: false,
          message: body?.message ?? 'Resend API Key is not set',
        };
        setStatus(result);
        return result;
      }

      console.error(
        body?.error ?? 'Unknown error while checking Resend API key',
      );
    } catch (exception) {
      console.error(exception);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  };

  return [status, { loading, load }] as const;
};
