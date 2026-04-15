'use client';

import classNames from 'classnames';
import type { ImageLoader } from 'next/image';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { Heading } from './heading';
import { IconFigma } from './icons/icon-figma';
import { IconGitHub } from './icons/icon-github';
import { Text } from './text';

interface TemplateProps {
  path: string;
  name: string;
  className?: string;
  author?: string;
  href?: string;
  github?: string;
  figma?: string;
  image?: string;
  index?: number;
}

const DEMO_EMAIL_PREVIEW_BASE_URL = 'https://demo.react.email/preview';
const DEFAULT_IMAGE = '/static/covers/react-email.png';

const imageLoader: ImageLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

export function Template({
  className,
  path,
  name,
  author,
  href,
  github,
  figma,
  image,
  index,
  ...props
}: TemplateProps) {
  const emailName = path.split('/').pop();
  if (!path || !emailName) {
    throw new Error('Cannot have an empty path for an Example!');
  }

  const defaultSrc = image ?? `/examples/${emailName}.png`;
  const [imageSrc, setImageSrc] = React.useState(defaultSrc);

  const handleImageError = () => {
    setImageSrc(DEFAULT_IMAGE);
  };

  const linkHref = href ?? `${DEMO_EMAIL_PREVIEW_BASE_URL}/${path}`;

  return (
    <div
      className={classNames(
        'group/card relative mt-7',
        index !== undefined && {
          'lg:ml-6': index % 3 === 0,
          'lg:mx-3': index % 3 === 1,
          'lg:mr-6': index % 3 === 2,
        },
        className,
      )}
    >
      <div className="flex w-full flex-col rounded-md border border-slate-4 p-4 transition-colors duration-300 ease-[cubic-bezier(.36,.66,.6,1)] group-hover/card:border-slate-6">
        <Image
          alt={name}
          className="rounded-xs"
          height="300"
          loader={imageLoader}
          onError={handleImageError}
          priority
          src={imageSrc}
          width="450"
        />
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <Heading as="h2" size="2" weight="medium">
              {name}
            </Heading>
            {github || figma ? (
              <div className="relative z-10 flex items-center gap-3">
                {github ? (
                  <a
                    className="text-slate-11 transition-colors hover:text-white"
                    href={github}
                    rel="noopener noreferrer"
                    target="_blank"
                    title="View on GitHub"
                  >
                    <IconGitHub size={14} />
                  </a>
                ) : null}
                {figma ? (
                  <a
                    className="text-slate-11 transition-colors hover:text-white"
                    href={figma}
                    rel="noopener noreferrer"
                    target="_blank"
                    title="View on Figma"
                  >
                    <IconFigma size={16} />
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
          {author ? (
            <div className="mt-2 flex flex-row gap-2">
              <Image
                alt={author}
                className="rounded-full text-ellipsis overflow-hidden"
                height="24"
                src={`/examples/authors/${author}.png`}
                width="24"
              />
              <Text>{author}</Text>
            </div>
          ) : null}
        </div>
        <Link
          aria-label={name}
          className="absolute inset-0 rounded-md focus:outline-hidden focus:ring-2 focus:ring-white/20"
          href={linkHref}
          target="_blank"
          {...props}
        />
      </div>
    </div>
  );
}
