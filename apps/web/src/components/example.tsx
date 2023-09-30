import classnames from "classnames";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { Heading } from "./heading";
import { Text } from "./text";

interface ExampleProps {
  id: string;
  name: string;
  className?: string;
  author: string;
}

const GITHUB_URL = "https://demo.react.email/preview";

export const Example: React.FC<Readonly<ExampleProps>> = ({
  className,
  id,
  name,
  author,
  ...props
}) => (
  <Link
    className={classnames(
      "bg-gradient border-slate-6 flex w-full flex-col rounded-md border backdrop-blur-[20px] focus:outline-none focus:ring-2",
      "hover:bg-gradientHover",
      "focus:bg-gradientHover focus:ring-white/20",
      className,
    )}
    href={`${GITHUB_URL}/${id}`}
    target="_blank"
    {...props}
  >
    <Image
      alt={name}
      className="rounded-t-md"
      height="300"
      src={`/static/examples/${id}.png`}
      width="450"
    />
    <div className="p-4">
      <Heading size="2" weight="medium">
        {name}
      </Heading>
      <div className="mt-2 flex flex-row gap-2">
        <img
          alt={author}
          className="rounded-full"
          height="24"
          src={`https://github.com/${author}.png`}
          width="24"
        />
        <Text>{author}</Text>
      </div>
    </div>
  </Link>
);
