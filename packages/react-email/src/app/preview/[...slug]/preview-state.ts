import type { BuildEmailComponentResult } from '../../../actions/build-email-component';
import type {
  Control,
  ControlsResult,
} from '../../../actions/get-email-controls';
import type {
  EmailRenderingResult,
  RenderedEmailMetadata,
} from '../../../actions/render-email';
import { type Result, err, isErr, ok } from '../../../utils/result';
import type { ErrorObject } from '../../../utils/types/error-object';

export type PreviewState = Result<
  {
    controls: Control[];
    renderingMetadata: RenderedEmailMetadata;
    previewProps: Record<string, unknown>;
  },
  ErrorObject
>;

export function getPreviewState(
  buildResult: BuildEmailComponentResult,
  controlsResult: ControlsResult,
  renderingResult: EmailRenderingResult,

  previewProps: Record<string, unknown>,
): PreviewState {
  if (isErr(buildResult)) {
    switch (buildResult.error.type) {
      case 'BUILD_FAILED':
        return err(buildResult.error.failure);
      case 'COMPONENT_EVALUATION_ERROR':
        return err(buildResult.error.error);
      case 'NO_DEFAULT_EXPORT':
        return err(buildResult.error.error);
      default:
    }
  }

  if (isErr(controlsResult)) {
    throw new Error(
      'Error during prop controls resolution, this should not happen and is a bug in React Email',
      {
        cause: {
          controlsResult,
          buildResult,
        },
      },
    );
  }

  if (isErr(renderingResult)) {
    switch (renderingResult.error.type) {
      case 'EMAIL_COMPONENT_NOT_BUILT':
        throw new Error(
          'Email component was not built during rendering. This is a bug in React Email, please open an issue.',
          {
            cause: {
              renderingResult,
              controlsResult,
              buildResult,
            },
          },
        );
      case 'RENDERING_FAILURE':
        return err(renderingResult.error.exception);
    }
  }

  return ok({
    renderingMetadata: renderingResult.value,
    controls: controlsResult.value ?? [],
    previewProps,
  });
}
