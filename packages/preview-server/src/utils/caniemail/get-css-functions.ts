export function getCssFunctions(title: string) {
  if (/^[a-zA-Z]\(\)$/.test(title.trim())) {
    return [title.replace('()', '')];
  }

  // ex: lch(), oklch(), lab(), oklab()
  // this regex avoids matching entries that are for CSS properties listed
  // separated by commas as well
  if (/^(?:[^(),]+?\(\),?)*$/.test(title.trim())) {
    return title
      .split(/\s*,\s*/)
      .map((functionCallWithoutParameters) =>
        functionCallWithoutParameters.replace('()', ''),
      );
  }

  // ex: CSS calc() function
  if (/^CSS [a-z]+\(\) function$/.test(title.trim())) {
    return [
      title.replace('CSS ', '').replace(' function', '').replace('()', ''),
    ];
  }

  return [];
}
