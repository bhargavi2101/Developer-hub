const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
require('dotenv').config();

async function testQuizFunctionality() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get all quizzes
    const allQuizzes = await Quiz.find({ isActive: true });
    console.log(`\n📚 Available Quizzes (${allQuizzes.length}):`);

    allQuizzes.forEach((quiz, index) => {
      console.log(`${index + 1}. ${quiz.title}`);
      console.log(`   - SubTechnology ID: ${quiz.subTechnologyId}`);
      console.log(`   - Difficulty: ${quiz.difficulty}`);
      console.log(`   - Questions: ${quiz.questions.length}`);
      console.log(`   - Time Limit: ${quiz.timeLimit} minutes`);
      console.log(`   - Passing Score: ${quiz.passingScore}%`);
      console.log(`   - Sample Question: ${quiz.questions[0]?.question || 'N/A'}`);
      console.log('');
    });

    // Get quiz statistics by difficulty
    const difficultyStats = await Quiz.aggregate([
      { $group: { _id: '$difficulty', count: { $sum: 1 }, avgQuestions: { $avg: { $size: '$questions' } } } }
    ]);

    console.log('📊 Quiz Statistics by Difficulty:');
    difficultyStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} quizzes (avg ${Math.round(stat.avgQuestions)} questions)`);
    });

    // Sample quiz structure
    console.log('\n🔍 Sample Quiz Structure (HTML & CSS Fundamentals):');
    const sampleQuiz = allQuizzes.find(q => q.subTechnologyId === 'html-css');
    if (sampleQuiz) {
      console.log(`Title: ${sampleQuiz.title}`);
      console.log(`Description: ${sampleQuiz.description}`);
      console.log(`\nSample Questions:`);
      sampleQuiz.questions.slice(0, 3).forEach((q, i) => {
        console.log(`\n${i + 1}. ${q.question}`);
        console.log(`   Type: ${q.type}`);
        console.log(`   Points: ${q.points}`);
        if (q.options && q.options.length > 0) {
          console.log(`   Options:`);
          q.options.forEach((opt, optIndex) => {
            const correct = optIndex === q.correctAnswer ? '✓' : ' ';
            console.log(`      ${correct} [${optIndex}] ${opt}`);
          });
        }
        console.log(`   Explanation: ${q.explanation}`);
      });
    }

    console.log('\n✅ Quiz functionality test completed!');
    console.log('\n🎯 How to Use Quiz Features:');
    console.log('1. GET /api/quizzes/:subTechnologyId - Get quiz for a topic');
    console.log('2. POST /api/quizzes/:quizId/submit - Submit quiz answers');
    console.log('3. GET /api/quizzes/ - Get user\'s quiz results');
    console.log('4. GET /api/quizzes/statistics - Get user statistics');
    console.log('5. GET /api/quizzes/best - Get user\'s best results');

  } catch (error) {
    console.error('❌ Error testing quiz functionality:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

testQuizFunctionality();
