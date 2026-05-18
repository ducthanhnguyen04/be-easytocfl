import { Request } from 'express';

// ─── JWT Payload ────────────────────────────────────────────────────────────
export interface JwtPayload {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatarUrl?: string;
  version?: string;
}

// ─── Authenticated Request ───────────────────────────────────────────────────
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

// ─── User ────────────────────────────────────────────────────────────────────
export interface SafeUser {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatarUrl?: string;
}

// ─── Level ───────────────────────────────────────────────────────────────────
export interface CreateLevelDto {
  levelName: string;
  level: string;
}

// ─── Lesson ──────────────────────────────────────────────────────────────────
export interface CreateLessonDto {
  lessonName: string;
  title: string;
  slug: string;
  levelId: number;
}

export interface UpdateLessonDto {
  lessonName?: string;
  title?: string;
  levelId?: number;
}

// ─── Vocabulary ──────────────────────────────────────────────────────────────
export interface CreateVocabularyDto {
  vocabulary: string;
  meaning: string;
  pinyin: string;
  audioUrl?: string;
  lessonId: number;
}

// ─── Example ─────────────────────────────────────────────────────────────────
export interface CreateExampleDto {
  example: string;
  meaning: string;
  pinyin: string;
  audioUrl?: string;
  vocabularyId?: number;
  grammarId?: number;
}

// ─── Grammar ─────────────────────────────────────────────────────────────────
export interface CreateGrammarDto {
  grammar: string;
  structure: string;
  usage: string;
  notes?: string;
  lessonId: number;
}

// ─── Custom Error with status ─────────────────────────────────────────────────
export interface AppError extends Error {
  status?: number;
}
