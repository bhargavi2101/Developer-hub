const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');

// Get quiz for a sub-technology
const getQuiz = async (req, res) => {
  try {
    const { subTechnologyId } = req.params;
    const userId = req.user.id;

    const quiz = await Quiz.findOne({ subTechnologyId, isActive: true });
    if (!quiz) {
      return res.status(404).json({ msg: 'No quiz available for this topic' });
    }

    // Get user's previous attempts
    const previousAttempts = await QuizResult.find({ userId, quizId: quiz._id });
    const attemptsRemaining = quiz.maxAttempts - previousAttempts.length;

    // Get best score
    const bestResult = previousAttempts.sort((a, b) => b.score - a.score)[0];

    res.status(200).json({
      quiz: {
        id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        timeLimit: quiz.timeLimit,
        difficulty: quiz.difficulty,
        passingScore: quiz.passingScore,
        questionCount: quiz.questions.length
      },
      userProgress: {
        attemptsRemaining: Math.max(0, attemptsRemaining),
        previousAttempts: previousAttempts.length,
        bestScore: bestResult ? bestResult.score : 0,
        bestPercentage: bestResult ? bestResult.percentage : 0,
        passed: bestResult ? bestResult.passed : false
      }
    });
  } catch (error) {
    console.log('Get quiz error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Submit quiz answers
const submitQuiz = async (req, res) => {
  console.log('=== SUBMIT QUIZ START ===');
  try {
    const userId = req.user.id;
    const { quizId } = req.params;
    const { answers, timeSpent } = req.body;

    console.log('Submit quiz request:', { userId, quizId, answersLength: answers?.length, timeSpent });

    if (!answers || !Array.isArray(answers)) {
      console.log('Invalid answers format');
      return res.status(400).json({ msg: 'Invalid answers format' });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      console.log('Quiz not found:', quizId);
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    console.log('Quiz found:', quiz.title);

    // Check if user has exceeded attempts
    const previousAttempts = await QuizResult.countDocuments({ userId, quizId });
    if (previousAttempts >= quiz.maxAttempts) {
      console.log('Max attempts exceeded');
      return res.status(400).json({ msg: 'Maximum quiz attempts exceeded' });
    }

    console.log('Processing answers...');

    // Calculate score
    let score = 0;
    let maxScore = 0;
    const processedAnswers = [];

    answers.forEach((answer, index) => {
      const question = quiz.questions[index];
      if (!question) return;

      maxScore += question.points || 10;
      let isCorrect = false;
      let userAnswer = answer.userAnswer;

      // Check correctness based on question type
      switch (question.type) {
        case 'multiple-choice':
        case 'true-false':
          isCorrect = userAnswer === question.correctAnswer;
          break;
        case 'text':
          // Case-insensitive comparison for text answers
          isCorrect = userAnswer?.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
          break;
        case 'code':
          // For code questions, exact match (could be enhanced later)
          isCorrect = userAnswer === question.correctAnswer;
          break;
      }

      if (isCorrect) {
        score += question.points || 10;
      }

      processedAnswers.push({
        questionIndex: index,
        questionId: question._id,
        userAnswer: userAnswer,
        isCorrect: isCorrect,
        timeSpent: answer.timeSpent || 0
      });
    });

    const percentage = Math.round((score / maxScore) * 100);
    const passed = percentage >= quiz.passingScore;

    console.log('Quiz calculated:', { score, maxScore, percentage, passed });

    // Calculate attempt number
    const attemptNumber = previousAttempts + 1;

    // Create quiz result
    const quizResult = new QuizResult({
      userId,
      quizId,
      subTechnologyId: quiz.subTechnologyId,
      score,
      maxScore,
      percentage,
      passed,
      answers: processedAnswers,
      timeSpent,
      attempts: attemptNumber
    });

    console.log('Saving quiz result...');
    await quizResult.save();
    console.log('Quiz result saved successfully');

    // Check for quiz-related achievements
    try {
      const { checkAchievements } = require('./badgeController');
      await checkAchievements(userId);
    } catch (badgeError) {
      console.log('Error checking achievements:', badgeError);
      // Don't fail the quiz submission if badge checking fails
    }

    console.log('Sending response...');
    res.status(200).json({
      result: {
        score,
        maxScore,
        percentage,
        passed,
        attemptNumber,
        attemptsRemaining: quiz.maxAttempts - attemptNumber,
        timeSpent,
        answers: processedAnswers
      },
      message: passed ? '🎉 Congratulations! You passed the quiz!' : '❌ You did not pass. Keep learning and try again!'
    });
    console.log('=== SUBMIT QUIZ END ===');
  } catch (error) {
    console.log('=== SUBMIT QUIZ ERROR ===');
    console.log('Submit quiz error:', error);
    console.log('Error stack:', error.stack);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get user's quiz results
const getUserQuizResults = async (req, res) => {
  try {
    const userId = req.user.id;
    const { subTechnologyId } = req.query;

    let query = { userId };
    if (subTechnologyId) {
      query.subTechnologyId = subTechnologyId;
    }

    const results = await QuizResult.find(query)
      .sort({ completedAt: -1 })
      .limit(20);

    res.status(200).json(results);
  } catch (error) {
    console.log('Get user quiz results error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get quiz statistics
const getQuizStatistics = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalQuizzes = await QuizResult.countDocuments({ userId });
    const passedQuizzes = await QuizResult.countDocuments({ userId, passed: true });
    const failedQuizzes = totalQuizzes - passedQuizzes;
    const averageScore = await QuizResult.aggregate([
      { $match: { userId } },
      { $group: { _id: null, avgScore: { $avg: '$score' }, avgPercentage: { $avg: '$percentage' } } }
    ]);

    const quizzesByDifficulty = await QuizResult.aggregate([
      {
        $match: { userId }
      },
      {
        $lookup: {
          from: 'quizzes',
          localField: 'quizId',
          foreignField: '_id',
          as: 'quiz'
        }
      },
      {
        $unwind: '$quiz'
      },
      {
        $group: {
          _id: '$quiz.difficulty',
          count: { $sum: 1 },
          avgScore: { $avg: '$score' },
          passRate: {
            $avg: {
              $cond: ['$passed', 1, 0]
            }
          }
        }
      }
    ]);

    res.status(200).json({
      totalQuizzes,
      passedQuizzes,
      failedQuizzes,
      passRate: totalQuizzes > 0 ? Math.round((passedQuizzes / totalQuizzes) * 100) : 0,
      averageScore: averageScore[0]?.avgScore || 0,
      averagePercentage: averageScore[0]?.avgPercentage || 0,
      quizzesByDifficulty
    });
  } catch (error) {
    console.log('Get quiz statistics error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get user's best quiz results
const getBestResults = async (req, res) => {
  try {
    const userId = req.user.id;

    const bestResults = await QuizResult.aggregate([
      { $match: { userId, passed: true } },
      {
        $sort: { percentage: -1, completedAt: 1 }
      },
      {
        $group: {
          _id: '$subTechnologyId',
          bestResult: { $first: '$$ROOT' }
        }
      }
    ]);

    res.status(200).json(bestResults);
  } catch (error) {
    console.log('Get best results error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  getQuiz,
  submitQuiz,
  getUserQuizResults,
  getQuizStatistics,
  getBestResults
};