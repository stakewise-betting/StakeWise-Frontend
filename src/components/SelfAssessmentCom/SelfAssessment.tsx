import { useState, useEffect } from "react";
import { Shield, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import responsibleGamblingService from "@/services/responsibleGamblingApiService";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

interface Question {
  id: number;
  question: string;
  options: string[];
}

interface Answer {
  questionId: number;
  answer: string;
}

interface AssessmentResult {
  score: number;
  risk: string;
  recommendations?: string;
}

const SelfAssessment = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const response =
          await responsibleGamblingService.getSelfAssessmentQuestions();
        if (response.success) {
          setQuestions(response.data);
        } else {
          toast.error("Failed to load self-assessment questions");
        }
      } catch (error) {
        console.error("Error fetching self-assessment questions:", error);
        toast.error("An error occurred while loading questions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    // Update progress bar
    if (questions.length > 0) {
      setProgress((currentStep / questions.length) * 100);
    }
  }, [currentStep, questions.length]);

  useEffect(() => {
    // Update selected answer when changing questions
    if (questions.length > 0) {
      const existingAnswer = answers.find(
        (a) => a.questionId === questions[currentStep]?.id
      );
      setSelectedAnswer(existingAnswer?.answer || "");
    }
  }, [currentStep, answers, questions]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);

    // Update or add the answer
    if (currentStep < questions.length) {
      const currentQuestion = questions[currentStep];

      const newAnswers = [...answers];
      const existingAnswerIndex = newAnswers.findIndex(
        (a) => a.questionId === currentQuestion.id
      );

      if (existingAnswerIndex >= 0) {
        newAnswers[existingAnswerIndex].answer = answer;
      } else {
        newAnswers.push({
          questionId: currentQuestion.id,
          answer,
        });
      }

      setAnswers(newAnswers);
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit on last question
      handleSubmit(answers);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (finalAnswers: Answer[]) => {
    try {
      setIsSubmitting(true);
      const response = await responsibleGamblingService.submitSelfAssessment(
        finalAnswers
      );

      if (response.success) {
        setResult({
          score: response.data.assessment.score,
          risk: response.data.assessment.riskLevel,
          recommendations: response.data.assessment.recommendations,
        });
        toast.success("Assessment completed successfully");
        console.log("Assessment result:", response.data.assessment);
      } else {
        toast.error(response.message || "Failed to submit assessment");
      }
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast.error("An error occurred while submitting your assessment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartOver = () => {
    setCurrentStep(0);
    setAnswers([]);
    setResult(null);
    setProgress(0);
    setSelectedAnswer("");
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#E27625] border-r-transparent mb-4"></div>
          <p className="text-gray-300">Loading assessment questions...</p>
        </div>
      </div>
    );
  }

  // Show result if assessment is completed
  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="mt-4"
      >
        <Card className="bg-[#333447] overflow-hidden shadow-lg rounded-xl border-0">
          <CardContent className="p-6">
            <div className="text-center mb-8">
              <div className="bg-[#1C1C27] w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4">
                {result.risk === "low" && (
                  <CheckCircle className="h-10 w-10 text-green" />
                )}
                {result.risk === "medium" && (
                  <AlertCircle className="h-10 w-10 text-yellow-500" />
                )}
                {result.risk === "high" && (
                  <AlertTriangle className="h-10 w-10 text-red-500" />
                )}
              </div>
              <h2 className="text-2xl font-bold mb-2">Assessment Complete</h2>
              <p className="text-gray-300">
                Based on your answers, your risk level is:
              </p>
              <div className="mt-4 mb-6">
                <span
                  className={`text-lg font-bold px-4 py-2 rounded-full uppercase ${
                    result.risk === "low"
                      ? "bg-green-500/20 text-green-400"
                      : result.risk === "medium"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {result.risk} Risk
                </span>
              </div>
            </div>

            <div className="bg-[#1C1C27] p-4 rounded-lg mb-6">
              <h3 className="font-medium mb-3">What this means:</h3>
              {result.risk === "low" && (
                <p className="text-gray-300 text-sm">
                  Your responses indicate that you are currently gambling in a
                  healthy way. Continue to enjoy gambling as entertainment, but
                  always stay vigilant about your habits.
                </p>
              )}
              {result.risk === "medium" && (
                <p className="text-gray-300 text-sm">
                  Your responses show some signs of potential gambling problems.
                  Consider using our responsible gambling tools like deposit
                  limits and consider taking breaks from gambling.
                </p>
              )}
              {result.risk === "high" && (
                <p className="text-gray-300 text-sm">
                  Your responses suggest you may be experiencing significant
                  gambling-related problems. We strongly recommend seeking
                  professional help and consider using our self-exclusion
                  option.
                </p>
              )}
            </div>

            <div className="bg-[#1C1C27] p-4 rounded-lg mb-6">
              <h3 className="font-medium mb-3">Recommended Next Steps:</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
                {result.risk === "low" && (
                  <>
                    <li>Set up deposit limits as a precautionary measure</li>
                    <li>Consider taking the assessment again in 3-6 months</li>
                    <li>Keep track of your time and money spent on gambling</li>
                  </>
                )}
                {result.risk === "medium" && (
                  <>
                    <li>Set up strict deposit limits</li>
                    <li>Take regular breaks from gambling</li>
                    <li>
                      Consider speaking with our responsible gambling team
                    </li>
                    <li>
                      Retake this assessment in 1 month to monitor changes
                    </li>
                  </>
                )}
                {result.risk === "high" && (
                  <>
                    <li>Contact our responsible gambling team immediately</li>
                    <li>Consider self-exclusion from our platform</li>
                    <li>
                      Reach out to a gambling helpline (see contacts below)
                    </li>
                    <li>Seek professional counseling or support groups</li>
                  </>
                )}
              </ul>
            </div>

            <div className="mt-6 flex space-x-4">
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                onClick={handleStartOver}
              >
                Take Assessment Again
              </Button>

              <Link
                to="/"
                className="flex items-center cursor-pointer w-full"
                onClick={() => window.scrollTo(0, 0)}
              >
                <Button
                  className="w-full bg-[#E27625] hover:bg-[#D06116] text-white"
                >
                  Return to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Show questions
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="mt-4"
    >
      <Card className="bg-[#333447] overflow-hidden shadow-lg rounded-xl border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-white rounded-full">
              <Shield className="h-5 w-5 text-[#E27625]" />
            </div>
            <h2 className="text-xl font-bold">Gambling Self-Assessment</h2>
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>
                Question {currentStep + 1} of {questions.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-[#1C1C27]" />
          </div>

          {questions.length > 0 && currentStep < questions.length && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-6">
                {questions[currentStep].question}
              </h3>

              <RadioGroup
                value={selectedAnswer}
                onValueChange={handleAnswerSelect}
                className="space-y-3"
              >
                {questions[currentStep].options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-[#1C1C27] rounded-lg hover:bg-[#292938] cursor-pointer"
                    onClick={() => handleAnswerSelect(option)}
                  >
                    <RadioGroupItem
                      value={option}
                      id={`option-${index}`}
                      className="text-[#E27625]"
                    />
                    <Label
                      htmlFor={`option-${index}`}
                      className="cursor-pointer flex-1"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0 || isSubmitting}
              className="border-[#444560] hover:bg-[#333447] hover:text-white"
            >
              Previous
            </Button>
            {currentStep < questions.length - 1 && (
              <Button
                disabled={!selectedAnswer || isSubmitting}
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
            {currentStep === questions.length - 1 && (
              <Button
                disabled={!selectedAnswer || isSubmitting}
                className="bg-[#E27625] hover:bg-[#D06116] text-white"
                onClick={() => handleSubmit(answers)}
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Submitting...
                  </>
                ) : (
                  "Complete Assessment"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 bg-[#1C1C27] p-4 rounded-lg text-sm text-gray-300">
        <p>
          <strong>Note:</strong> This self-assessment is designed to help you
          understand your gambling habits. Your responses are confidential and
          used only to provide you with appropriate guidance. This tool is not a
          substitute for professional advice.
        </p>
      </div>
    </motion.div>
  );
};

export default SelfAssessment;
