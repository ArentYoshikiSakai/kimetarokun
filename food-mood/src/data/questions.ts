import { Question } from '../types';

export const questions: Question[] = [
  {
    id: 'nutrition',
    text: '今どんな栄養を取りたい気分ですか？',
    options: [
      { id: 'protein', text: 'タンパク質' },
      { id: 'carbs', text: '炭水化物' },
      { id: 'fat', text: '脂質' },
      { id: 'fiber', text: '食物繊維' }
    ]
  },
  {
    id: 'taste_intensity',
    text: '味の濃さはどの程度がいいですか？',
    options: [
      { id: 'strong', text: '濃い' },
      { id: 'light', text: '薄い' },
      { id: 'medium', text: '普通' }
    ]
  },
  {
    id: 'juiciness',
    text: 'ジューシーかたんぱくどちらのものを食べたいですか？',
    options: [
      { id: 'juicy', text: '脂質多め' },
      { id: 'lean', text: 'たんぱく' }
    ]
  },
  {
    id: 'quantity',
    text: 'どれくらいの量を食べたいですか？',
    options: [
      { id: 'large', text: '多め' },
      { id: 'medium', text: '普通' },
      { id: 'small', text: '少な目' }
    ]
  },
  {
    id: 'soup',
    text: '汁っけは欲しいですか？',
    options: [
      { id: 'yes', text: '欲しい' },
      { id: 'no', text: '欲しくない' },
      { id: 'neutral', text: 'どちらでもない' }
    ]
  },
  {
    id: 'immediacy',
    text: 'すぐ食べれるものがいいですか？',
    options: [
      { id: 'yes', text: 'はい' },
      { id: 'no', text: 'いいえ' },
      { id: 'neutral', text: 'どちらでもない' }
    ]
  },
  {
    id: 'cooked',
    text: '熱を通しているものがいいですか？',
    options: [
      { id: 'yes', text: 'はい' },
      { id: 'no', text: 'いいえ' },
      { id: 'neutral', text: 'どちらでもない' }
    ]
  },
  {
    id: 'budget',
    text: '予算はどのくらいですか？',
    options: [
      { id: 'cheap', text: 'リーズナブル' },
      { id: 'medium', text: 'ふつう' },
      { id: 'expensive', text: 'ちょっと贅沢' }
    ]
  },
  {
    id: 'temperature',
    text: '温かいものと冷たいもの、どちらが食べたいですか？',
    options: [
      { id: 'hot', text: '温かいもの' },
      { id: 'cold', text: '冷たいもの' },
      { id: 'any', text: 'どちらでも' }
    ]
  },
  {
    id: 'texture',
    text: 'どんな食感が食べたいですか？',
    options: [
      { id: 'soft', text: '柔らかいもの' },
      { id: 'chewy', text: '歯ごたえのあるもの' },
      { id: 'crispy', text: 'さくさく/カリカリしたもの' },
      { id: 'sticky', text: 'とろみのあるもの' }
    ]
  },
  {
    id: 'flavor',
    text: 'どんな味が好みですか？',
    options: [
      { id: 'salty', text: '塩味/しょっぱいもの' },
      { id: 'sweet', text: '甘いもの' },
      { id: 'spicy', text: '辛いもの' },
      { id: 'sour', text: '酸っぱいもの' },
      { id: 'umami', text: 'うま味の強いもの' }
    ]
  },
  {
    id: 'cuisine',
    text: '何系の料理が食べたいですか？',
    options: [
      { id: 'japanese', text: '和食' },
      { id: 'western', text: '洋食' },
      { id: 'chinese', text: '中華' },
      { id: 'ethnic', text: 'エスニック' },
      { id: 'any', text: 'どれでも' }
    ]
  },
  {
    id: 'satisfaction',
    text: 'どのくらいお腹を満たしたいですか？',
    options: [
      { id: 'light', text: '軽く食べたい' },
      { id: 'medium', text: 'しっかり食べたい' },
      { id: 'heavy', text: 'がっつり食べたい' }
    ]
  }
]; 