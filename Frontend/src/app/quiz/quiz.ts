import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RoadmapService } from '../roadmap-service';

interface QuizData {
  id: string;
  title: string;
  description: string;
  timeLimit: number;
  difficulty: string;
  passingScore: number;
  questionCount: number;
}

interface Question {
  question: string;
  type: string;
  options: string[];
  correctAnswer: any;
  explanation: string;
  points: number;
  order: number;
}

interface QuizResult {
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  attemptNumber: number;
  attemptsRemaining: number;
  timeSpent: number;
  answers: any[];
}

interface UserAnswer {
  questionIndex: number;
  questionId: string;
  userAnswer: any;
  isCorrect: boolean;
  timeSpent: number;
}

@Component({
  selector: 'app-quiz',
  standalone: false,
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz implements OnInit, OnDestroy {
  // Quiz state
  quiz: QuizData | null = null;
  questions: Question[] = [];
  currentQuestionIndex: number = 0;
  userAnswers: UserAnswer[] = [];

  // Timer
  timeRemaining: number = 0;
  timeInterval: any;
  timeElapsed: number = 0;
  startTime: number = 0;

  // UI state
  isQuizStarted: boolean = false;
  isQuizCompleted: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  // Result state
  quizResult: QuizResult | null = null;

  // Quiz metadata
  subTechnologyId: string = '';

  constructor(
    private roadmapService: RoadmapService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.subTechnologyId = params['subTechnologyId'] || '';
      if (this.subTechnologyId) {
        this.loadQuiz();
      }
    });
  }

  ngOnDestroy(): void {
    this.cleanupTimer();
  }

  loadQuiz() {
    this.isLoading = true;
    this.errorMessage = '';

    this.roadmapService.getQuiz(this.subTechnologyId).subscribe({
      next: (res: any) => {
        console.log('Quiz loaded:', res);
        this.quiz = res.quiz;
        this.questions = this.generateQuestionData(res.quiz);
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading quiz:', err);
        this.errorMessage = 'Failed to load quiz';
        this.isLoading = false;
      }
    });
  }

  generateQuestionData(quiz: Quiz): Question[] {
    // In a real implementation, you'd fetch the actual questions from the quiz
    // For now, we'll generate sample questions based on the quiz title
    const sampleQuestions: Question[] = [
      {
        question: 'What is the main purpose of this topic?',
        type: 'multiple-choice',
        options: ['To understand the concepts', 'To memorize facts', 'To practice coding', 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: 'The topic covers all these aspects comprehensively.',
        points: 10,
        order: 1
      },
      {
        question: 'Which of the following is true?',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: true,
        explanation: 'This statement is correct based on the topic content.',
        points: 10,
        order: 2
      },
      {
        question: 'What does the acronym stand for?',
        type: 'text',
        options: [],
        correctAnswer: 'Depends on the topic',
        explanation: 'The full form is explained in the content.',
        points: 10,
        order: 3
      },
      {
        question: 'Which concept is most important?',
        type: 'multiple-choice',
        options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'],
        correctAnswer: 'Concept A',
        explanation: 'Concept A is fundamental to understanding this topic.',
        points: 10,
        order: 4
      },
      {
        question: 'Which approach is recommended?',
        type: 'multiple-choice',
        options: ['Approach 1', 'Approach 2', 'Approach 3'],
        correctAnswer: 'Approach 1',
        explanation: 'This approach is most efficient for the given scenario.',
        points: 10,
        order: 5
      }
    ];

    return sampleQuestions;
  }

  startQuiz() {
    this.isQuizStarted = true;
    this.startTime = Date.now();
    this.timeRemaining = this.quiz?.timeLimit || 15 * 60; // Convert to seconds

    // Start timer
    this.timeInterval = setInterval(() => {
      this.timeElapsed = Math.floor((Date.now() - this.startTime) / 1000);
      this.timeRemaining--;

      if (this.timeRemaining <= 0) {
        this.submitQuiz();
      }
    }, 1000);
  }

  selectAnswer(answer: any) {
    const currentQuestion = this.questions[this.currentQuestionIndex];
    const userAnswer: UserAnswer = {
      questionIndex: this.currentQuestionIndex,
      questionId: currentQuestion.order.toString(),
      userAnswer: answer,
      isCorrect: answer === currentQuestion.correctAnswer,
      timeSpent: this.timeElapsed
    };

    // Update or add the user answer
    const existingIndex = this.userAnswers.findIndex(a => a.questionIndex === this.currentQuestionIndex);
    if (existingIndex >= 0) {
      this.userAnswers[existingIndex] = userAnswer;
    } else {
      this.userAnswers.push(userAnswer);
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      // Quiz is complete, submit it
      this.submitQuiz();
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  submitQuiz() {
    this.cleanupTimer();

    // Mark any unanswered questions as skipped
    for (let i = 0; i < this.questions.length; i++) {
      if (!this.userAnswers.find(a => a.questionIndex === i)) {
        this.userAnswers.push({
          questionIndex: i,
          questionId: this.questions[i].order.toString(),
          userAnswer: null,
          isCorrect: false,
          timeSpent: this.timeElapsed
        });
      }
    }

    const timeSpent = Math.floor((Date.now() - this.startTime) / 1000);

    this.roadmapService.submitQuiz(this.quiz?.id || '', this.userAnswers, timeSpent).subscribe({
      next: (res: any) => {
        console.log('Quiz submitted:', res);
        this.quizResult = res.result;
        this.isQuizCompleted = true;
        this.isQuizStarted = false;
      },
      error: (err: any) => {
        console.error('Error submitting quiz:', err);
        this.errorMessage = 'Failed to submit quiz';
        this.isQuizStarted = false;
      }
    });
  }

  cleanupTimer() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
      this.timeInterval = null;
    }
  }

  retryQuiz() {
    this.currentQuestionIndex = 0;
    this.userAnswers = [];
    this.quizResult = null;
    this.isQuizCompleted = false;
    this.isQuizStarted = false;
    this.timeRemaining = this.quiz?.timeLimit || 15 * 60;
    this.timeElapsed = 0;
  }

  backToTechnology() {
    this.router.navigate(['/roadmaps', this.subTechnologyId]);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  getCurrentQuestion(): Question {
    return this.questions[this.currentQuestionIndex];
  }

  get progressPercentage(): number {
    return Math.round(((this.currentQuestionIndex + 1) / this.questions.length) * 100);
  }

  getAnsweredCount(): number {
    return this.userAnswers.filter(a => a.userAnswer !== null).length;
  }

  getSkippedCount(): number {
    return this.userAnswers.filter(a => a.userAnswer === null).length;
  }

  getTimeSpentMinutes(): number {
    return this.quizResult ? Math.floor(this.quizResult.timeSpent / 60) : 0;
  }
}