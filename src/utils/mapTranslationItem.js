const FLAG_ICONS = {
  'zh-CN': '🇨🇳',
  'zh-TW': '🇨🇳',
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

module.exports = function mapTranslationItem({ raw, result, from = '', to }, index) {
  return {
    id: `a-translation-${index}`,
    title: result,
    value: result,
    subtitle: `${FLAG_ICONS[from]} ${raw}`,
    icon: `./src/assets/${to || 'x'}.svg`,
  };
};
