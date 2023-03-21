// eslint-disable-next-line no-script-url
const NOOP_HREF = 'javascript:void(0)';

// Match the protocol part of an absolute URL, e.g. "http:"
const PROTOCOL_REGEX = /^([^:]+):/;

// Whitespace and control characters are ignored, so we must strip them out
// eslint-disable-next-line no-control-regex
const IGNORED_PROTOCOL_CHARS_REGEX = /[\s\x00-\x1f]/g;

export const isUnsafeUrl = (href: string) => {
  if (href && typeof href === 'string') {
    const protocolMatch = href.match(PROTOCOL_REGEX);
    if (!protocolMatch || href === NOOP_HREF) return false;
    if (
      protocolMatch[0]
        .replace(IGNORED_PROTOCOL_CHARS_REGEX, '')
        // eslint-disable-next-line no-script-url
        .toLowerCase() === 'javascript:'
    ) {
      return true;
    }
  }
  return false;
};
