import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { childId, letter, isCorrect } = await req.json();

    // Validate inputs
    if (!childId || !letter) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update or create letter progress
    const letterProgress = await prisma.letterProgress.upsert({
      where: {
        childId_letter: {
          childId,
          letter: letter.toUpperCase()
        }
      },
      update: {
        correctCount: isCorrect ? { increment: 1 } : undefined,
        incorrectCount: !isCorrect ? { increment: 1 } : undefined,
        isCompleted: isCorrect,
        lastAttempt: new Date(),
        updatedAt: new Date()
      },
      create: {
        childId,
        letter: letter.toUpperCase(),
        correctCount: isCorrect ? 1 : 0,
        incorrectCount: isCorrect ? 0 : 1,
        isCompleted: isCorrect,
        lastAttempt: new Date()
      }
    });

    // Update overall learning progress for letters module
    const completedLetters = await prisma.letterProgress.count({
      where: {
        childId,
        isCompleted: true
      }
    });

    await prisma.learningProgress.upsert({
      where: {
        childId_moduleType: {
          childId,
          moduleType: 'letters'
        }
      },
      update: {
        totalCompleted: completedLetters,
        lastSession: new Date(),
        updatedAt: new Date()
      },
      create: {
        childId,
        moduleType: 'letters',
        totalCompleted: completedLetters,
        lastSession: new Date()
      }
    });

    // Calculate streak days (simplified)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const learningProgress = await prisma.learningProgress.findUnique({
      where: {
        childId_moduleType: {
          childId,
          moduleType: 'letters'
        }
      }
    });

    if (learningProgress) {
      const lastSession = new Date(learningProgress.lastSession || new Date());
      lastSession.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today.getTime() - lastSession.getTime()) / (1000 * 60 * 60 * 24));
      
      let newStreakDays = learningProgress.streakDays;
      if (daysDiff === 0) {
        // Same day, keep streak
      } else if (daysDiff === 1) {
        // Next day, increment streak
        newStreakDays += 1;
      } else {
        // Gap, reset streak
        newStreakDays = 1;
      }

      await prisma.learningProgress.update({
        where: {
          childId_moduleType: {
            childId,
            moduleType: 'letters'
          }
        },
        data: {
          streakDays: newStreakDays,
          totalSessions: { increment: daysDiff > 0 ? 1 : 0 }
        }
      });
    }

    return NextResponse.json({
      success: true,
      letterProgress,
      totalCompleted: completedLetters
    });

  } catch (error) {
    console.error('Error updating letter progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}