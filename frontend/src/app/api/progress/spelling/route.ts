import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { childId, wordIndex, difficulty, isCorrect, hintsUsed } = await req.json();

    // Validate inputs
    if (!childId || wordIndex === undefined || !difficulty) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update or create spelling progress
    const spellingProgress = await prisma.spellingProgress.upsert({
      where: {
        childId_wordIndex_difficulty: {
          childId,
          wordIndex: parseInt(wordIndex),
          difficulty: parseInt(difficulty)
        }
      },
      update: {
        correctCount: isCorrect ? { increment: 1 } : undefined,
        incorrectCount: !isCorrect ? { increment: 1 } : undefined,
        hintsUsed: { increment: hintsUsed || 0 },
        isCompleted: isCorrect,
        lastAttempt: new Date(),
        updatedAt: new Date()
      },
      create: {
        childId,
        wordIndex: parseInt(wordIndex),
        difficulty: parseInt(difficulty),
        correctCount: isCorrect ? 1 : 0,
        incorrectCount: isCorrect ? 0 : 1,
        hintsUsed: hintsUsed || 0,
        isCompleted: isCorrect,
        lastAttempt: new Date()
      }
    });

    // Update overall learning progress for spelling module
    const completedWords = await prisma.spellingProgress.count({
      where: {
        childId,
        isCompleted: true
      }
    });

    const learningProgress = await prisma.learningProgress.upsert({
      where: {
        childId_moduleType: {
          childId,
          moduleType: 'spelling'
        }
      },
      update: {
        totalCompleted: completedWords,
        currentLevel: difficulty,
        lastSession: new Date(),
        updatedAt: new Date()
      },
      create: {
        childId,
        moduleType: 'spelling',
        totalCompleted: completedWords,
        currentLevel: difficulty,
        lastSession: new Date()
      }
    });

    // Calculate and update streak days
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastSession = new Date(learningProgress.lastSession || new Date());
    lastSession.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today.getTime() - lastSession.getTime()) / (1000 * 60 * 60 * 24));
    
    let newStreakDays = learningProgress.streakDays;
    if (daysDiff === 0) {
      // Same day, keep streak
    } else if (daysDiff === 1) {
      // Next day, increment streak
      newStreakDays += 1;
    } else if (daysDiff > 1) {
      // Gap, reset streak
      newStreakDays = 1;
    }

    await prisma.learningProgress.update({
      where: {
        childId_moduleType: {
          childId,
          moduleType: 'spelling'
        }
      },
      data: {
        streakDays: newStreakDays,
        totalSessions: { increment: daysDiff > 0 ? 1 : 0 }
      }
    });

    return NextResponse.json({
      success: true,
      spellingProgress,
      totalCompleted: completedWords
    });

  } catch (error) {
    console.error('Error updating spelling progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}