type Opener = (condition: string | undefined) => string;

interface CommentTemplateData {
  opener?: Opener;
  closer?: string;
  name: Capitalize<string>;
}

const MSO_CONDITION_ARGUMENT_KEY = "a";

const VERSION_SEPARATOR = ",";

type ChildrenProps = React.PropsWithChildren<
  Pick<React.DOMAttributes<unknown>, "dangerouslySetInnerHTML">
>;

type ConditionProps = Partial<
  Record<typeof MSO_CONDITION_ARGUMENT_KEY, string>
>;

type ComponentPlaceholder = React.FC<ChildrenProps & ConditionProps>;

const generateCommentUtilities = <T extends CommentTemplateData[]>(
  ...args: T
) => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  const placeholders = {} as Record<
    {
      [index in keyof T]:
        | `${T[index]["name"]}Placeholder`
        | (T[index]["closer"] extends string
            ? T[index]["opener"] extends Opener
              ? `${T[index]["name"]}Placeholder${"Opener" | "Closer"}`
              : never
            : never);
    }[number],
    ComponentPlaceholder
  >;

  const commentReplacerMap = new Map<
    string,
    (comment: string, condition: string | undefined) => string
  >();

  let alphabetIndex = 0;

  args.forEach(({ name, opener, closer }) => {
    const letter = alphabet[alphabetIndex++];

    placeholders[`${name as T[number]["name"]}Placeholder`] =
      `${letter}-` as unknown as ComponentPlaceholder;

    if (opener && closer) {
      const openCommentLetter = alphabet[alphabetIndex++];

      const closeCommentLetter = alphabet[alphabetIndex++];

      placeholders[`${name}PlaceholderOpener` as keyof typeof placeholders] =
        `${openCommentLetter}-` as unknown as ComponentPlaceholder;

      placeholders[`${name}PlaceholderCloser` as keyof typeof placeholders] =
        `${closeCommentLetter}-` as unknown as ComponentPlaceholder;

      commentReplacerMap.set(
        letter,
        (comment, condition) =>
          `<!--${opener(condition)}${comment}${closer}-->`,
      );

      commentReplacerMap.set(
        openCommentLetter,
        (_, condition) => `<!--${opener(condition)}`,
      );

      commentReplacerMap.set(closeCommentLetter, () => `${closer}-->`);
    } else if (opener) {
      commentReplacerMap.set(
        letter,
        (comment, condition) => `<!--${opener(condition)}${comment}-->`,
      );
    } else if (closer) {
      commentReplacerMap.set(letter, () => `<!--${closer}-->`);
    } else {
      commentReplacerMap.set(letter, (comment) => `<!--${comment}-->`);
    }
  });

  const placeholderRegex = new RegExp(
    `<([${alphabet[0]}-${
      alphabet[alphabetIndex - 1]
    }])-(?: ${MSO_CONDITION_ARGUMENT_KEY}="(.*?)")?>(.*?)<\\/\\1->`,
    "g",
  );

  return {
    placeholders,
    replaceCommentPlaceholders: (html: string) =>
      html.replace(
        placeholderRegex,
        (_, tag: string, condition: string | undefined, comment: string) =>
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          commentReplacerMap.get(tag)!(comment, condition),
      ),
  };
};

const { placeholders, replaceCommentPlaceholders } = generateCommentUtilities(
  {
    name: "NonMsoOpener",
    opener: (version) =>
      version
        ? `[if ${version
            .split(VERSION_SEPARATOR)
            .map((item) => `!mso ${item}`)
            .join(" | ")}]><!`
        : "[if !mso]><!",
  },
  { name: "NonMsoCloser", closer: "<![endif]" },
  {
    name: "Mso",
    opener: (data) =>
      data
        ? `[if ${data
            .split(VERSION_SEPARATOR)
            .map((item) => {
              const t = item.split(" ");

              return t.length === 1 ? `mso ${t[0]}` : `${t[0]} mso ${t[1]}`;
            })
            .join(" | ")}]>`
        : "[if mso]>",
    closer: "<![endif]",
  },
  {
    name: "Comment",
  },
);

export { replaceCommentPlaceholders };

export const {
  CommentPlaceholder,
  MsoPlaceholder,
  NonMsoCloserPlaceholder,
  NonMsoOpenerPlaceholder,
  MsoPlaceholderCloser,
  MsoPlaceholderOpener,
} = placeholders;

export const childrenPropsDecider = (
  children: React.ReactNode,
): ChildrenProps =>
  typeof children === "string"
    ? { dangerouslySetInnerHTML: { __html: children } }
    : { children };

export const conditionPropsDecider = (
  data: string | string[] | undefined,
): ConditionProps =>
  data
    ? {
        [MSO_CONDITION_ARGUMENT_KEY]:
          typeof data !== "object" ? data : data.join(VERSION_SEPARATOR),
      }
    : {};
