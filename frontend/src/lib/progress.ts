// Progress tracking utilities with database integration
export interface LearningProgressSummary {
  letters: {
    completed: string[];
    current: number;
    totalCompleted: number;
  };
  spelling: {
    completed: number[];
    currentLevel: number;
    totalCompleted: number;
  };
  words: {
    completed: number[];
    currentLevel: number;
    totalCompleted: number;
  };
  overall: {
    totalSessions: number;
    lastSession: string;
    streakDays: number;
    achievementsCount: number;
  };
}

export interface ModuleStats {
  correct: number;
  incorrect: number;
  streak: number;
  maxStreak: number;
  hintsUsed?: number;
  shufflesUsed?: number;
}

// Database operations for progress tracking

// Update letter progress in database
export async function updateLetterProgress(
  childId: string,
  letter: string,
  isCorrect: boolean
) {
  try {
    const response = await fetch('/api/progress/letters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        childId,
        letter,
        isCorrect
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update letter progress');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating letter progress:', error);
    throw error;
  }
}

// Update spelling progress in database
export async function updateSpellingProgress(
  childId: string,
  wordIndex: number,
  difficulty: number,
  isCorrect: boolean,
  hintsUsed: number = 0
) {
  try {
    const response = await fetch('/api/progress/spelling', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        childId,
        wordIndex,
        difficulty,
        isCorrect,
        hintsUsed
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update spelling progress');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating spelling progress:', error);
    throw error;
  }
}

// Update word arrangement progress in database
export async function updateWordProgress(
  childId: string,
  wordIndex: number,
  difficulty: number,
  isCorrect: boolean,
  hintsUsed: number = 0,
  shufflesUsed: number = 0
) {
  try {
    const response = await fetch('/api/progress/words', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        childId,
        wordIndex,
        difficulty,
        isCorrect,
        hintsUsed,
        shufflesUsed
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update word progress');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating word progress:', error);
    throw error;
  }
}

// Get complete progress for a child
export async function getChildProgress(childId: string): Promise<LearningProgressSummary> {
  try {
    const response = await fetch(`/api/children/${childId}/progress`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch child progress');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching child progress:', error);
    throw error;
  }
}

// Get progress summary for API compatibility
export async function getProgressSummary(childId: string): Promise<{
  letters_completed: number;
  words_completed: number;
  spelling_completed: number;
  total_sessions: number;
  streak_days: number;
  achievements_count: number;
}> {
  try {
    const progress = await getChildProgress(childId);
    
    return {
      letters_completed: progress.letters.totalCompleted,
      words_completed: progress.words.totalCompleted,
      spelling_completed: progress.spelling.totalCompleted,
      total_sessions: progress.overall.totalSessions,
      streak_days: progress.overall.streakDays,
      achievements_count: progress.overall.achievementsCount
    };
  } catch (error) {
    console.error('Error getting progress summary:', error);
    // Return default values on error
    return {
      letters_completed: 0,
      words_completed: 0,
      spelling_completed: 0,
      total_sessions: 0,
      streak_days: 0,
      achievements_count: 0
    };
  }
}
