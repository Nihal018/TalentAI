"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Clock,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Trophy,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Header } from "../../../components/header";

// Expanded assessment data with 10 questions covering multiple topics
const assessmentData = {
  1: {
    company: "TechCorp Inc.",
    position: "Senior Software Engineer",
    passingScore: 70, // 70% to pass
    questions: [
      {
        id: 1,
        topic: "Data Structures",
        question:
          "What is the time complexity of searching in a balanced binary search tree?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correct: 1,
      },
      {
        id: 2,
        topic: "React",
        question:
          "Which React hook would you use to perform side effects in functional components?",
        options: ["useState", "useEffect", "useContext", "useMemo"],
        correct: 1,
      },
      {
        id: 3,
        topic: "DevOps",
        question: "What is the primary purpose of Docker containers?",
        options: [
          "Version control",
          "Application packaging and deployment",
          "Database management",
          "Code compilation",
        ],
        correct: 1,
      },
      {
        id: 4,
        topic: "Web APIs",
        question:
          "In REST API design, which HTTP method is typically used to update a resource?",
        options: ["GET", "POST", "PUT", "DELETE"],
        correct: 2,
      },
      {
        id: 5,
        topic: "Programming Languages",
        question:
          "What is the main advantage of using TypeScript over JavaScript?",
        options: [
          "Faster execution",
          "Static type checking",
          "Smaller bundle size",
          "Better browser support",
        ],
        correct: 1,
      },
      {
        id: 6,
        topic: "Database",
        question: "Which SQL command is used to retrieve data from a database?",
        options: ["INSERT", "UPDATE", "SELECT", "DELETE"],
        correct: 2,
      },
      {
        id: 7,
        topic: "Algorithms",
        question: "What is the worst-case time complexity of Quick Sort?",
        options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
        correct: 1,
      },
      {
        id: 8,
        topic: "Web Security",
        question: "What does CORS stand for in web development?",
        options: [
          "Cross-Origin Resource Sharing",
          "Cross-Origin Request Security",
          "Common Origin Resource System",
          "Cross-Origin Response Standard",
        ],
        correct: 0,
      },
      {
        id: 9,
        topic: "Software Architecture",
        question: "What is the main principle of microservices architecture?",
        options: [
          "Single large application",
          "Breaking application into small, independent services",
          "Using only one database",
          "Avoiding APIs",
        ],
        correct: 1,
      },
      {
        id: 10,
        topic: "Version Control",
        question: "In Git, which command is used to create a new branch?",
        options: [
          "git new branch",
          "git create branch",
          "git branch",
          "git make branch",
        ],
        correct: 2,
      },
    ],
  },
};

export default function AssessmentPage({ params }: { params: { id: string } }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [isCompleted, setIsCompleted] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const jobId = Number.parseInt(params.id);
  const assessment = assessmentData[1];

  // Authentication check
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!isCompleted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isCompleted) {
      // Auto-submit when time runs out
      setIsCompleted(true);
    }
  }, [timeLeft, isCompleted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);
      setSelectedAnswer(null);

      if (currentQuestion < assessment.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Assessment completed
        setIsCompleted(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1] ?? null);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === assessment.questions[index].correct) {
        correct++;
      }
    });
    return Math.round((correct / assessment.questions.length) * 100);
  };

  const handleSubmitAssessment = () => {
    const score = calculateScore();
    const passed = score >= assessment.passingScore;

    if (passed) {
      router.push("/success");
    } else {
      // Redirect to a failure page or back to jobs with a message
      router.push("/browse-jobs?message=assessment-failed");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <Header />
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <Header />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Assessment not found
          </h1>
          <Link href="/browse-jobs">
            <Button>Back to Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    const score = calculateScore();
    const passed = score >= assessment.passingScore;

    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center pt-16">
          <Card className="max-w-2xl mx-auto shadow-xl border-0 ">
            <CardHeader className="text-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  passed ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {passed ? (
                  <Trophy className="h-8 w-8 text-green-600" />
                ) : (
                  <AlertCircle className="h-8 w-8 text-red-600" />
                )}
              </div>
              <CardTitle className="text-3xl text-gray-900">
                Assessment Completed!
              </CardTitle>
              <CardDescription className="text-lg">
                {passed
                  ? "Congratulations! You've passed the assessment."
                  : "Thank you for taking the assessment."}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div
                className={`bg-gradient-to-r rounded-lg p-6 ${
                  passed
                    ? "from-green-50 to-blue-50"
                    : "from-red-50 to-orange-50"
                }`}
              >
                <div
                  className={`text-4xl font-bold mb-2 ${
                    passed ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {score}%
                </div>
                <div className="text-gray-700">Your Score</div>
                <div className="text-sm text-gray-600 mt-2">
                  Passing Score: {assessment.passingScore}%
                </div>
                <div
                  className={`text-sm mt-2 font-medium ${
                    passed ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {passed
                    ? "🎉 Excellent performance!"
                    : "📚 Keep learning and try again!"}
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Score Breakdown by Topic
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Array.from(
                    new Set(assessment.questions.map((q) => q.topic))
                  ).map((topic) => {
                    const topicQuestions = assessment.questions.filter(
                      (q) => q.topic === topic
                    );
                    const topicCorrect = topicQuestions.filter((q, idx) => {
                      const questionIndex = assessment.questions.findIndex(
                        (question) => question.id === q.id
                      );
                      return answers[questionIndex] === q.correct;
                    }).length;
                    const topicScore = Math.round(
                      (topicCorrect / topicQuestions.length) * 100
                    );

                    return (
                      <div key={topic} className="flex justify-between">
                        <span className="text-gray-600">{topic}:</span>
                        <span
                          className={`font-medium ${
                            topicScore >= 70 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {topicScore}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">
                  What happens next?
                </h3>
                {passed ? (
                  <div className="text-left space-y-2 text-sm text-gray-700 bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <strong>You have passed the test!</strong>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Your resume and profile have been sent to{" "}
                      {assessment.company}
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      You will be called for an interview if they show interest
                      in you
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Expect to hear back within 24-48 hours
                    </div>
                  </div>
                ) : (
                  <div className="text-left space-y-2 text-sm text-gray-700 bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                      Score below passing threshold ({assessment.passingScore}%)
                    </div>
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                      Consider improving skills in weaker areas
                    </div>
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                      You can retake the assessment after 24 hours
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={handleSubmitAssessment}
                className={`w-full text-lg py-3 ${
                  passed
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {passed ? "Continue to Success Page" : "Return to Job Search"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // Calculate progress based on answered questions, not current question
  const answeredQuestions = answers.filter(
    (answer) => answer !== undefined
  ).length;
  const progress = (answeredQuestions / assessment.questions.length) * 100;
  const currentQ = assessment.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 ">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40 py-1">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/jobs"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">TalentAI</span>
          </Link>
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center space-x-2 text-sm font-medium px-3 py-1 rounded-full ${
                timeLeft < 300
                  ? "text-red-600 bg-red-50"
                  : "text-gray-600 bg-gray-100"
              }`}
            >
              <Clock className="h-4 w-4" />
              <span className="font-mono">{formatTime(timeLeft)}</span>
            </div>
            <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
              Question {currentQuestion + 1} of {assessment.questions.length}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Assessment Header */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Skill Assessment
            </h1>
            <div className="text-lg text-gray-600">
              {assessment.position} at {assessment.company}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Passing Score: {assessment.passingScore}% • 10 Questions • 30
              Minutes
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>
                Progress ({answeredQuestions} of {assessment.questions.length}{" "}
                answered)
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-3 bg-gray-200">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </Progress>
          </div>
        </div>

        {/* Question Card */}
        <Card className="shadow-xl border-0 mb-8 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-xl font-bold text-gray-900">
                Question {currentQuestion + 1}
              </CardTitle>
              <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                {currentQ.topic}
              </span>
            </div>
            <CardDescription className="text-lg text-gray-700 leading-relaxed">
              {currentQ.question}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <RadioGroup
              value={selectedAnswer?.toString()}
              onValueChange={(value) =>
                handleAnswerSelect(Number.parseInt(value))
              }
              className="space-y-3"
            >
              {currentQ.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:bg-blue-50 hover:border-blue-200 ${
                    selectedAnswer === index
                      ? "bg-blue-50 border-blue-300 shadow-md"
                      : "border-gray-200 hover:shadow-sm"
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                    className="w-5 h-5 border-2"
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-grow cursor-pointer text-base font-medium text-gray-800 leading-relaxed"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center bg-white border-2 border-gray-300 hover:bg-gray-50 disabled:opacity-50 px-6 py-3"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
            {currentQuestion + 1} / {assessment.questions.length}
          </div>

          <Button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 shadow-lg"
          >
            {currentQuestion === assessment.questions.length - 1
              ? "Finish Assessment"
              : "Next"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Assessment Info */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Brain className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <div className="font-semibold mb-2 text-base">
                  Assessment Guidelines:
                </div>
                <ul className="space-y-1.5 text-sm leading-relaxed">
                  <li>
                    • Read each question carefully before selecting your answer
                  </li>
                  <li>
                    • You can navigate back to previous questions to change
                    answers
                  </li>
                  <li>
                    • Minimum {assessment.passingScore}% score required to pass
                  </li>
                  <li>
                    • Your responses help match you with the right opportunities
                  </li>
                  <li>• Take your time - quality over speed</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
