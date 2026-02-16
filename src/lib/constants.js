export const ROLES = {
  USER: 'User',
  SWORDSMAN: 'Swordsman',
  EDGE_KEEPER: 'Edge Keeper',
  FORGE_KEEPER: 'Forge Keeper',
  ADMIN: 'Admin',
};

export const COIN_TYPES = {
  CRUCIBLE_CREDIT: 'Crucible Credit',
  TALENT_TOKEN: 'Talent Token',
  KINGDOM_COIN: 'Kingdom Coin',
};

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const MEETING_DAYS = ['Monday', 'Wednesday', 'Thursday'];

export const BIBLE_BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
  'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah',
  'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel',
  'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
  'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts',
  'Romans', '1 Corinthians', '2 Corinthians', 'Galatians',
  'Ephesians', 'Philippians', 'Colossians',
  '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy',
  'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter',
  '1 John', '2 John', '3 John', 'Jude', 'Revelation',
];

export const BIBLE_BOOK_ABBREVIATIONS = {
  'Genesis': 'GEN', 'Exodus': 'EXO', 'Leviticus': 'LEV', 'Numbers': 'NUM',
  'Deuteronomy': 'DEU', 'Joshua': 'JOS', 'Judges': 'JDG', 'Ruth': 'RUT',
  '1 Samuel': '1SA', '2 Samuel': '2SA', '1 Kings': '1KI', '2 Kings': '2KI',
  '1 Chronicles': '1CH', '2 Chronicles': '2CH', 'Ezra': 'EZR', 'Nehemiah': 'NEH',
  'Esther': 'EST', 'Job': 'JOB', 'Psalms': 'PSA', 'Proverbs': 'PRO',
  'Ecclesiastes': 'ECC', 'Song of Solomon': 'SNG', 'Isaiah': 'ISA', 'Jeremiah': 'JER',
  'Lamentations': 'LAM', 'Ezekiel': 'EZK', 'Daniel': 'DAN', 'Hosea': 'HOS',
  'Joel': 'JOL', 'Amos': 'AMO', 'Obadiah': 'OBA', 'Jonah': 'JON',
  'Micah': 'MIC', 'Nahum': 'NAM', 'Habakkuk': 'HAB', 'Zephaniah': 'ZEP',
  'Haggai': 'HAG', 'Zechariah': 'ZEC', 'Malachi': 'MAL',
  'Matthew': 'MAT', 'Mark': 'MRK', 'Luke': 'LUK', 'John': 'JHN',
  'Acts': 'ACT', 'Romans': 'ROM', '1 Corinthians': '1CO', '2 Corinthians': '2CO',
  'Galatians': 'GAL', 'Ephesians': 'EPH', 'Philippians': 'PHP', 'Colossians': 'COL',
  '1 Thessalonians': '1TH', '2 Thessalonians': '2TH', '1 Timothy': '1TI', '2 Timothy': '2TI',
  'Titus': 'TIT', 'Philemon': 'PHM', 'Hebrews': 'HEB', 'James': 'JAS',
  '1 Peter': '1PE', '2 Peter': '2PE', '1 John': '1JN', '2 John': '2JN',
  '3 John': '3JN', 'Jude': 'JUD', 'Revelation': 'REV',
};

export const AVATAR_OPTIONS = {
  Skin_Color: ['Tanned', 'Yellow', 'Pale', 'Light', 'Brown', 'DarkBrown', 'Black'],
  Top: [
    'NoHair', 'Eyepatch', 'Hat', 'Hijab', 'Turban', 'WinterHat1', 'WinterHat2',
    'WinterHat3', 'WinterHat4', 'LongHairBigHair', 'LongHairBob', 'LongHairBun',
    'LongHairCurly', 'LongHairCurvy', 'LongHairDreads', 'LongHairFrida',
    'LongHairFro', 'LongHairFroBand', 'LongHairNotTooLong', 'LongHairShavedSides',
    'LongHairMiaWallace', 'LongHairStraight', 'LongHairStraight2', 'LongHairStraightStrand',
    'ShortHairDreads01', 'ShortHairDreads02', 'ShortHairFrizzle', 'ShortHairShaggyMullet',
    'ShortHairShortCurly', 'ShortHairShortFlat', 'ShortHairShortRound', 'ShortHairShortWaved',
    'ShortHairSides', 'ShortHairTheCaesar', 'ShortHairTheCaesarSidePart',
  ],
  HairColor: ['Auburn', 'Black', 'Blonde', 'BlondeGolden', 'Brown', 'BrownDark', 'PastelPink', 'Platinum', 'Red', 'SilverGray'],
  Accessories: ['Blank', 'Kurt', 'Prescription01', 'Prescription02', 'Round', 'Sunglasses', 'Wayfarers'],
  FacialHair: ['Blank', 'BeardMedium', 'BeardLight', 'BeardMajestic', 'MoustacheFancy', 'MoustacheMagnum'],
  FacialHairColor: ['Auburn', 'Black', 'Blonde', 'BlondeGolden', 'Brown', 'BrownDark', 'Platinum', 'Red'],
  Clothes: ['BlazerShirt', 'BlazerSweater', 'CollarSweater', 'GraphicShirt', 'Hoodie', 'Overall', 'ShirtCrewNeck', 'ShirtScoopNeck', 'ShirtVNeck'],
  ClotheColor: ['Black', 'Blue01', 'Blue02', 'Blue03', 'Gray01', 'Gray02', 'Heather', 'PastelBlue', 'PastelGreen', 'PastelOrange', 'PastelRed', 'PastelYellow', 'Pink', 'Red', 'White'],
  Graphic: ['Bat', 'Cumbia', 'Deer', 'Diamond', 'Hola', 'Pizza', 'Resist', 'Selena', 'Bear', 'SkullOutline', 'Skull'],
  Eyes: ['Close', 'Cry', 'Default', 'Dizzy', 'EyeRoll', 'Happy', 'Hearts', 'Side', 'Squint', 'Surprised', 'Wink', 'WinkWacky'],
  Eyebrow: ['Angry', 'AngryNatural', 'Default', 'DefaultNatural', 'FlatNatural', 'RaisedExcited', 'RaisedExcitedNatural', 'SadConcerned', 'SadConcernedNatural', 'UnibrowNatural', 'UpDown', 'UpDownNatural'],
  Mouth: ['Concerned', 'Default', 'Disbelief', 'Eating', 'Grimace', 'Sad', 'ScreamOpen', 'Serious', 'Smile', 'Tongue', 'Twinkle', 'Vomit'],
  Background_or_Transparent: ['Circle', 'Transparent'],
};

export function buildAvatarUrl(options) {
  const params = new URLSearchParams({
    avatarStyle: options.Background_or_Transparent,
    topType: options.Top,
    accessoriesType: options.Accessories,
    hairColor: options.HairColor,
    facialHairType: options.FacialHair,
    facialHairColor: options.FacialHairColor,
    clotheColor: options.ClotheColor,
    clotheType: options.Clothes,
    graphicType: options.Graphic,
    eyeType: options.Eyes,
    eyebrowType: options.Eyebrow,
    mouthType: options.Mouth,
    skinColor: options.Skin_Color,
  });
  return `https://avataaars.io/?${params.toString()}`;
}

export function getBibleUrl(book, chapter, verseStart, verseEnd) {
  const abbr = BIBLE_BOOK_ABBREVIATIONS[book];
  if (!abbr) return null;
  const versePart = verseEnd ? `${verseStart}-${verseEnd}` : `${verseStart}`;
  return `https://www.bible.com/bible/114/${abbr}.${chapter}.${versePart}.NKJV`;
}

export const GOOGLE_CALENDAR_EMBED_URL = 'https://calendar.google.com/calendar/embed?src=390cfd1b1abe61204b2176348dd0922608bc775ff31d686c85082ca1fac784a6%40group.calendar.google.com&ctz=America%2FCosta_Rica';
