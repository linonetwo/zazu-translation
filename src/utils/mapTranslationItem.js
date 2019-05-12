const FLAG_ICONS = {
  cn: '🇨🇳',
  tw: '🇨🇳',
  de: '🇩🇪',
  en: '🇬🇧',
  es: '🇪🇸',
  fr: '🇫🇷',
  it: '🇮🇹',
  pl: '🇵🇱',
  pt: '🇵🇹',
  ru: '🇷🇺',
  ja: '🇯🇵',
  '': '',
};

module.exports = function mapTranslationItem({ raw, result, from, to }, index) {
  return {
    id: index,
    title: result,
    value: result,
    subtitle: `${FLAG_ICONS[from]} ${raw}`,
    icon: `./zazu/assets/${to || 'x'}.svg`,
  };
};
