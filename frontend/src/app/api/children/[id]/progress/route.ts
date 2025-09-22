import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const childId = params.id;
    
    // Check if child exists
    const child = await prisma.child.findUnique({
      where: { id: childId }
    });
    
    if (!child) {
      return NextResponse.json(
        { error: 'Child not found' },
        { status: 404 }
      );
    }

    // Get learning progress for all modules
    const learningProgress = await prisma.learningProgress.findMany({
      where: { childId }
    });

    // Get completed letters
    const completedLetters = await prisma.letterProgress.findMany({
      where: {
        childId,
        isCompleted: true
      },
      select: { letter: true }
    });

    // Get completed spelling words
    const completedSpellingWords = await prisma.spellingProgress.findMany({
      where: {
        childId,
        isCompleted: true
      },
      select: { wordIndex: true, difficulty: true }
    });

    // Get completed arrangement words
    const completedArrangementWords = await prisma.wordProgress.findMany({
      where: {
        childId,
        isCompleted: true
      },
      select: { wordIndex: true, difficulty: true }
    });

    // Calculate totals and stats
    const lettersProgress = learningProgress.find(p => p.moduleType === 'letters');
    const spellingProgress = learningProgress.find(p => p.moduleType === 'spelling');
    const wordsProgress = learningProgress.find(p => p.moduleType === 'words');

    const totalSessions = learningProgress.reduce((sum, p) => sum + p.totalSessions, 0);
    const maxStreakDays = Math.max(...learningProgress.map(p => p.streakDays), 0);
    const lastSession = learningProgress.reduce((latest, p) => 
      (p.lastSession && (!latest || p.lastSession > latest)) ? p.lastSession : latest, 
      null as Date | null
    );

    // Calculate achievements
    let achievementsCount = 0;
    if (completedLetters.length >= 1) achievementsCount++;
    if (completedLetters.length >= 10) achievementsCount++;
    if (completedLetters.length >= 26) achievementsCount++;
    if (completedSpellingWords.length >= 1) achievementsCount++;
    if (completedSpellingWords.length >= 10) achievementsCount++;
    if (completedSpellingWords.length >= 50) achievementsCount++;
    if (maxStreakDays >= 7) achievementsCount++;
    if (maxStreakDays >= 30) achievementsCount++;

    // Format response
    const progress = {
      letters_completed: completedLetters.length,
      words_completed: completedArrangementWords.length,
      spelling_completed: completedSpellingWords.length,
      total_sessions: totalSessions,
      streak_days: maxStreakDays,
      achievements_count: achievementsCount,
      last_session: lastSession ? lastSession.toISOString() : null,
      letters: {
        completed: completedLetters.map(l => l.letter),
        current: lettersProgress?.currentLevel || 0,
        totalCompleted: completedLetters.length
      },
      spelling: {
        completed: completedSpellingWords.map((w, idx) => idx),
        currentLevel: spellingProgress?.currentLevel || 1,
        totalCompleted: completedSpellingWords.length
      },
      words: {
        completed: completedArrangementWords.map((w, idx) => idx),
        currentLevel: wordsProgress?.currentLevel || 1,
        totalCompleted: completedArrangementWords.length
      },
      overall: {
        totalSessions,
        lastSession: lastSession ? lastSession.toDateString() : '',
        streakDays: maxStreakDays,
        achievementsCount
      }
    };

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching child progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST method not needed - progress updates handled by specific progress endpoints
// Use /api/progress/letters, /api/progress/spelling, /api/progress/words instead
