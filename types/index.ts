import { Request } from 'express';

export interface JwtPayload {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatarUrl?: string;
  version?: string;
  isPremium?: boolean;
  isGoogleLogin?: boolean;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface SafeUser {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatarUrl?: string;
  isPremium?: boolean;
  isGoogleLogin?: boolean;
}

export interface CreateLevelDto {
  levelName: string;
  level: string;
  image?: string;
}

export interface CreateLessonDto {
  lessonName: string;
  title: string;
  slug: string;
  levelId: number;
  isPremium?: boolean;
}

export interface UpdateLessonDto {
  lessonName?: string;
  title?: string;
  slug?: string;
  levelId?: number;
  isPremium?: boolean;
}

export interface CreateVocabularyDto {
  vocabulary: string;
  meaning: string;
  englishMeaning: string;
  pinyin: string;
  audioUrl?: string;
  lessonId: number;
}

export interface CreateExampleDto {
  example: string;
  meaning: string;
  pinyin: string;
  audioUrl?: string;
  vocabularyId?: number;
  grammarId?: number;
}

export interface CreateGrammarDto {
  grammar: string;
  structure: string;
  usage: string;
  definition: string;
  notes?: string;
  note?: string;
  lessonId: number;
}

export interface CreateCommentDto {
  content: string;
  userId: number;
}

export interface UpdateCommentDto {
  content?: string;
}

export interface AppError extends Error {
  status?: number;
}

export interface CreateRadicalDto {
  radical: string;
  pinyin: string;
  meaning: string;
  englishMeaning: string;
  profoundMeaning?: string;
  example?: string;
  stroke: string;
}

export interface CreateExcersiseDto {
  title: string;
  meaning: string;
  englishMeaning: string;
  grammarId: number;
}

