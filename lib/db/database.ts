import {
  User,
  FracCompetency,
  UserCompetencyScore,
  IGotCourse,
  LearningMaterial,
  Quiz,
  QuizAttempt,
  UserCompetencyProfileResponse,
  CompetencyGapItem,
  ZonalCapacityData
} from '../types';

import {
  SEED_USERS,
  SEED_COMPETENCIES,
  SEED_USER_SCORES,
  SEED_IGOT_COURSES,
  SEED_LEARNING_MATERIALS,
  SEED_QUIZZES,
  SEED_ZONAL_ANALYTICS
} from './seed-data';

// Singleton in-memory state store with initial seed
class StatSamarthDatabase {
  private users: Map<string, User> = new Map();
  private credentials: Map<string, string> = new Map(); // email -> password
  private competencies: Map<string, FracCompetency> = new Map();
  private userScores: Map<string, UserCompetencyScore> = new Map();
  private igotCourses: Map<string, IGotCourse> = new Map();
  private learningMaterials: Map<string, LearningMaterial> = new Map();
  private quizzes: Map<string, Quiz> = new Map();
  private quizAttempts: QuizAttempt[] = [];
  private aparSyncRecords: Map<string, { synced: boolean; last_sync: string; tx_hash: string; count: number }> = new Map();

  constructor() {
    this.seed();
  }

  private seed() {
    SEED_USERS.forEach(u => {
      this.users.set(u.id, { ...u });
      // Default seed passwords
      this.credentials.set(u.email.toLowerCase(), 'mospi@2024');
    });

    // Fallback demo credentials from the original UI
    this.credentials.set('iss.officer@mospi.gov.in', 'mospi@2024');
    this.credentials.set('dd.nsso@mospi.gov.in', 'nsso@2024');
    this.credentials.set('dir.field@mospi.gov.in', 'field@2024');

    SEED_COMPETENCIES.forEach(c => this.competencies.set(c.id, { ...c }));
    SEED_USER_SCORES.forEach(s => this.userScores.set(`${s.user_id}_${s.competency_id}`, { ...s }));
    SEED_IGOT_COURSES.forEach(c => this.igotCourses.set(c.id, { ...c }));
    SEED_LEARNING_MATERIALS.forEach(m => this.learningMaterials.set(m.id, { ...m }));
    SEED_QUIZZES.forEach(q => this.quizzes.set(q.id, { ...q }));

    // Default APAR sync state
    this.aparSyncRecords.set('usr_iss_001', {
      synced: false,
      last_sync: '2025-01-20T10:00:00Z',
      tx_hash: '0x8fbc72a19e34c990b7e2129e9841',
      count: 2
    });
    this.aparSyncRecords.set('usr_iss_002', {
      synced: true,
      last_sync: '2025-02-15T18:30:00Z',
      tx_hash: '0x3adc9102b4491efa91845112df88',
      count: 3
    });
  }

  public addUser(userData: Omit<User, 'id' | 'created_at' | 'apar_id'>, password?: string): User {
    const id = `usr_custom_${Date.now()}`;
    const newUser: User = {
      ...userData,
      id,
      created_at: new Date().toISOString(),
      apar_id: `APAR-${new Date().getFullYear()}-CUSTOM-${Math.floor(Math.random() * 9000) + 1000}`
    };

    this.users.set(id, newUser);
    if (password) {
      this.credentials.set(newUser.email.toLowerCase(), password);
    }

    // Initialize baseline competencies with 0 (unassessed) instead of randomized scores
    this.getCompetencies().forEach(comp => {
      this.userScores.set(`${id}_${comp.id}`, {
        id: `sc_${id}_${comp.id}`,
        user_id: id,
        competency_id: comp.id,
        current_level: 0,
        last_assessed_at: new Date().toISOString()
      });
    });

    return newUser;
  }

  public verifyLogin(email: string, password?: string): User | null {
    const targetEmail = email.toLowerCase();

    // For legacy demo accounts mapping to first user
    if (['iss.officer@mospi.gov.in', 'dd.nsso@mospi.gov.in', 'dir.field@mospi.gov.in'].includes(targetEmail)) {
      const userIndex = ['iss.officer@mospi.gov.in', 'dd.nsso@mospi.gov.in', 'dir.field@mospi.gov.in'].indexOf(targetEmail);
      return this.getUsers()[Math.min(userIndex, this.getUsers().length - 1)];
    }

    const storedPass = this.credentials.get(targetEmail);
    if (storedPass && storedPass === password) {
      return this.getUsers().find(u => u.email.toLowerCase() === targetEmail) || null;
    }
    return null;
  }

  public deleteUser(userId: string): boolean {
    if (!this.users.has(userId)) return false;

    const user = this.users.get(userId);
    if (user) {
      this.credentials.delete(user.email.toLowerCase());
    }

    this.users.delete(userId);

    // Cleanup scores
    const scoreKeysToDelete: string[] = [];
    this.userScores.forEach((v, k) => {
      if (v.user_id === userId) scoreKeysToDelete.push(k);
    });
    scoreKeysToDelete.forEach(k => this.userScores.delete(k));

    // Cleanup other records
    this.aparSyncRecords.delete(userId);

    return true;
  }

  public getUsers(): User[] {
    return Array.from(this.users.values());
  }

  public getUser(id: string): User | undefined {
    return this.users.get(id);
  }

  public getCompetencies(): FracCompetency[] {
    return Array.from(this.competencies.values());
  }

  public getUserCompetencyProfile(userId: string): UserCompetencyProfileResponse | null {
    const user = this.users.get(userId);
    if (!user) return null;

    const allCompetencies = Array.from(this.competencies.values());
    const gaps: CompetencyGapItem[] = [];
    const radar_data: any[] = [];

    let totalRequired = 0;
    let totalAchieved = 0;
    let verifiedCount = 0;

    allCompetencies.forEach(comp => {
      const scoreKey = `${userId}_${comp.id}`;
      const userScore = this.userScores.get(scoreKey);
      const currentLevel = userScore ? userScore.current_level : 0;
      const requiredLevel = comp.required_level;

      const gap = currentLevel === 0 ? 0 : Math.max(0, requiredLevel - currentLevel);
      const isVerified = currentLevel >= requiredLevel;

      if (isVerified) {
        verifiedCount++;
      }

      totalRequired += requiredLevel;
      totalAchieved += currentLevel === 0 ? 0 : Math.min(currentLevel, requiredLevel);

      const readinessPct = currentLevel === 0 ? 0 : Math.round((Math.min(currentLevel, requiredLevel) / requiredLevel) * 100);

      let status = 'GAP_IDENTIFIED';
      if (currentLevel === 0) status = 'PENDING_ASSESSMENT';
      else if (isVerified) status = 'VERIFIED';

      // Find recommended iGOT course for this competency
      const recommendedCourse = Array.from(this.igotCourses.values()).find(
        c => c.competency_id === comp.id
      );

      gaps.push({
        competency_id: comp.id,
        competency_name: comp.competency_name,
        category: comp.category,
        required_level: requiredLevel,
        current_level: currentLevel,
        gap,
        status,
        readiness_percentage: readinessPct,
        recommended_course: recommendedCourse
      });

      radar_data.push({
        competency: comp.competency_name.length > 24 ? comp.competency_name.substring(0, 22) + '…' : comp.competency_name,
        current: currentLevel,
        required: requiredLevel,
        category: comp.category,
        fullMark: 5
      });
    });

    // Skill Readiness Index calculation
    const readiness_index = totalRequired > 0 ? Math.round((totalAchieved / totalRequired) * 100) : 0;
    const gap_count = gaps.filter(g => g.status === 'GAP_IDENTIFIED').length;
    const unassessed_count = gaps.filter(g => g.status === 'PENDING_ASSESSMENT').length;

    const userAttempts = this.quizAttempts.filter(a => a.user_id === userId);
    const aparRecord = this.aparSyncRecords.get(userId) || {
      synced: false,
      last_sync: null,
      tx_hash: '',
      count: 0
    };

    return {
      user,
      readiness_index,
      total_competencies: allCompetencies.length,
      verified_competencies: verifiedCount,
      gap_count,
      unassessed_count,
      radar_data,
      gaps,
      recent_attempts: userAttempts.slice(-5).reverse(),
      apar_status: {
        synced: aparRecord.synced,
        last_sync: aparRecord.last_sync,
        apar_id: user.apar_id,
        pending_updates: gap_count,
        unassessed_count: unassessed_count
      }
    };
  }

  public updateCompetencyScore(userId: string, competencyId: string, levelDelta: number = 1): UserCompetencyScore {
    const key = `${userId}_${competencyId}`;
    const existing = this.userScores.get(key);
    const current = existing ? existing.current_level : 0;
    const newLevel = Math.min(5, Math.max(1, current + levelDelta));

    const updated: UserCompetencyScore = {
      id: existing ? existing.id : `sc_${Date.now()}`,
      user_id: userId,
      competency_id: competencyId,
      current_level: newLevel,
      last_assessed_at: new Date().toISOString()
    };

    this.userScores.set(key, updated);

    // Mark APAR sync as pending fresh updates
    const currentApar = this.aparSyncRecords.get(userId);
    if (currentApar) {
      currentApar.synced = false;
      currentApar.count += 1;
      this.aparSyncRecords.set(userId, currentApar);
    }

    return updated;
  }

  public getLearningMaterials(): LearningMaterial[] {
    return Array.from(this.learningMaterials.values());
  }

  public addLearningMaterial(material: Omit<LearningMaterial, 'id' | 'created_at'>): LearningMaterial {
    const id = `mat_${Date.now()}`;
    const created_at = new Date().toISOString();
    const newMat: LearningMaterial = {
      ...material,
      id,
      created_at
    };
    this.learningMaterials.set(id, newMat);
    return newMat;
  }

  public getQuizzes(): Quiz[] {
    return Array.from(this.quizzes.values());
  }

  public getQuizById(id: string): Quiz | undefined {
    return this.quizzes.get(id);
  }

  public addQuiz(quiz: Omit<Quiz, 'id'>): Quiz {
    const id = `quiz_${Date.now()}`;
    const newQuiz: Quiz = {
      ...quiz,
      id,
      created_at: new Date().toISOString()
    };
    this.quizzes.set(id, newQuiz);
    return newQuiz;
  }

  public submitQuizAttempt(
    userId: string,
    quizId: string,
    answers: { question_id: string; selected_key: string }[]
  ): {
    attempt: QuizAttempt;
    score_percentage: number;
    passed: boolean;
    competency_advancement: { competency_name: string; old_level: number; new_level: number } | null;
    detailed_results: any[];
  } {
    const quiz = this.quizzes.get(quizId);
    if (!quiz) throw new Error(`Quiz with id ${quizId} not found`);

    let correctCount = 0;
    const detailed_results = quiz.questions_json.map(q => {
      const userAnswer = answers.find(a => a.question_id === q.id);
      const is_correct = userAnswer?.selected_key === q.correct_key;
      if (is_correct) correctCount++;
      return {
        question_id: q.id,
        question: q.question,
        selected_key: userAnswer?.selected_key || null,
        correct_key: q.correct_key,
        is_correct,
        explanation: q.explanation,
        source_citation: q.source_citation,
        blooms_level: q.blooms_level
      };
    });

    const totalQuestions = quiz.questions_json.length;
    const score_percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passThreshold = quiz.pass_percentage || 70;
    const passed = score_percentage >= passThreshold;

    let competencyAdvancement = null;
    let competencyDelta = 0;

    // Determine competency from quiz questions or material
    let targetCompId = quiz.questions_json[0]?.competency_id;
    if (!targetCompId) {
      if (quizId.includes('cpi')) targetCompId = 'comp_02';
      else if (quizId.includes('nsso')) targetCompId = 'comp_01';
      else targetCompId = 'comp_05';
    }

    const comp = this.competencies.get(targetCompId);
    if (comp) {
      const scoreKey = `${userId}_${comp.id}`;
      const existingScore = this.userScores.get(scoreKey);
      const oldLevel = existingScore ? existingScore.current_level : 0;

      // Calculate level based on score if they were unassessed, or apply delta
      let newLevel = oldLevel;

      if (oldLevel === 0) {
        // Initial assessment mapping
        if (score_percentage >= 80) newLevel = Math.max(3, comp.required_level);
        else if (score_percentage >= 60) newLevel = 2;
        else newLevel = 1;
      } else {
        // Incremental improvement if they passed
        if (passed) newLevel = Math.min(5, oldLevel + 1);
      }

      if (newLevel !== oldLevel) {
        competencyDelta = newLevel - oldLevel;
        const updated = this.updateCompetencyScore(userId, comp.id, competencyDelta);
        competencyAdvancement = {
          competency_name: comp.competency_name,
          old_level: oldLevel,
          new_level: updated.current_level
        };
      }
    }

    const attempt: QuizAttempt = {
      id: `att_${Date.now()}`,
      user_id: userId,
      quiz_id: quizId,
      score: score_percentage,
      passed,
      competency_delta: competencyDelta,
      timestamp: new Date().toISOString()
    };

    this.quizAttempts.push(attempt);

    return {
      attempt,
      score_percentage,
      passed,
      competency_advancement: competencyAdvancement,
      detailed_results
    };
  }

  public getIgotRecommendations(userId: string): {
    user: User;
    recommendations: (IGotCourse & { match_score: number; gap_level: number; competency_name: string })[];
  } {
    const profile = this.getUserCompetencyProfile(userId);
    if (!profile) throw new Error('User not found');

    const gapCompetencies = profile.gaps.filter(g => g.gap > 0);
    const gapCompIds = new Set(gapCompetencies.map(g => g.competency_id));

    const recommendations = Array.from(this.igotCourses.values()).map(course => {
      const isDirectGap = gapCompIds.has(course.competency_id);
      const gapInfo = gapCompetencies.find(g => g.competency_id === course.competency_id);
      const comp = this.competencies.get(course.competency_id);

      // Semantic match score calculation
      let match_score = 65; // baseline
      if (isDirectGap) {
        match_score = 88 + Math.min(10, (gapInfo?.gap || 1) * 4);
      } else {
        match_score = 72;
      }

      return {
        ...course,
        match_score: Math.min(99, match_score),
        gap_level: gapInfo ? gapInfo.gap : 0,
        competency_name: comp?.competency_name || 'MoSPI Statistical Domain'
      };
    });

    // Sort by match score descending
    recommendations.sort((a, b) => b.match_score - a.match_score);

    return {
      user: profile.user,
      recommendations
    };
  }

  public syncApar(userId: string): {
    success: boolean;
    apar_id: string;
    synced_at: string;
    transaction_hash: string;
    verified_competencies_count: number;
    message: string;
  } {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');

    const profile = this.getUserCompetencyProfile(userId);
    const timestamp = new Date().toISOString();
    const txHash = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    this.aparSyncRecords.set(userId, {
      synced: true,
      last_sync: timestamp,
      tx_hash: txHash,
      count: 0
    });

    return {
      success: true,
      apar_id: user.apar_id,
      synced_at: timestamp,
      transaction_hash: txHash,
      verified_competencies_count: profile?.verified_competencies || 0,
      message: `Successfully synchronized ${profile?.verified_competencies || 0} verified FRAC competencies to iGOT Karmayogi Passbook & e-APAR Dossier for Officer ${user.name}.`
    };
  }

  public getZonalAnalytics(): ZonalCapacityData[] {
    return SEED_ZONAL_ANALYTICS;
  }

  public forceHmrUpdate() { }
}

// Global instance for Next.js API routes
declare global {
  // eslint-disable-next-line no-var
  var __statsamarth_db: StatSamarthDatabase | undefined;
}

let instance = global.__statsamarth_db;
if (!instance || typeof instance.addUser !== 'function' || typeof (instance as any).forceHmrUpdate !== 'function') {
  instance = new StatSamarthDatabase();
  if (process.env.NODE_ENV !== 'production') {
    global.__statsamarth_db = instance;
  }
}

export const db = instance;
