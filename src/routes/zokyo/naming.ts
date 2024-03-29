const adjectives = [
  'adorable',
  'brave',
  'careless',
  'dazzling',
  'eager',
  'fearless',
  'gigantic',
  'hilarious',
  'icy',
  'jolly',
  'keen',
  'lazy',
  'mysterious',
  'naughty',
  'optimistic',
  'perfect',
  'quaint',
  'radiant',
  'silly',
  'terrific',
  'unusual',
  'vibrant',
  'witty',
  'zealous',
  'alert',
  'beautiful',
  'charming',
  'delightful',
  'elegant',
  'fascinating',
  'graceful',
  'handsome',
  'innovative',
  'joyful',
  'knowledgeable',
  'lovely',
  'majestic',
  'natural',
  'original',
  'proud',
  'quick',
  'resilient',
  'steadfast',
  'tender',
  'upbeat',
  'versatile',
  'whimsical',
  'youthful',
  'zany'
];

const nouns = [
  'aardvark',
  'butterfly',
  'chameleon',
  'dolphin',
  'echidna',
  'flamingo',
  'gazelle',
  'hedgehog',
  'impala',
  'jaguar',
  'koala',
  'lemming',
  'marmoset',
  'narwhal',
  'ocelot',
  'panther',
  'quokka',
  'rhinoceros',
  'swordfish',
  'tapir',
  'urchin',
  'vulture',
  'wombat',
  'xenops',
  'yak',
  'zebra',
  'airplane',
  'backpack',
  'cactus',
  'dandelion',
  'eggplant',
  'fireplace',
  'guitar',
  'honey',
  'igloo',
  'jacket',
  'kangaroo',
  'lighthouse',
  'mask',
  'nightingale',
  'orchid',
  'pinecone',
  'quartz',
  'rainbow',
  'saxophone',
  'trampoline',
  'umbrella',
  'violin',
  'whirlpool',
  'xylophone',
  'yacht',
  'zeppelin'
];

export const generateName = () => {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${adj.charAt(0).toUpperCase() + adj.slice(1)} ${noun.charAt(0).toUpperCase() + noun.slice(1)}`;
}
