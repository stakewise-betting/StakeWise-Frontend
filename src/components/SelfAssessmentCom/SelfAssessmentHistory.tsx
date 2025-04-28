// src/components/SelfAssessmentHistory.tsx
import { useState, useEffect } from "react"
import { Clock, ChevronDown, ChevronUp, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import responsibleGamblingService from "@/services/responsibleGamblingApiService"
import { formatDistanceToNow } from "date-fns"

interface AssessmentHistoryItem {
  _id: string;
  completedAt: string;
  totalScore: number;
  riskLevel: "low" | "medium" | "high";
  answers: {
    questionId: number;
    answer: string;
    score: number;
  }[];
}

interface Question {
  id: number;
  question: string;
  options: string[];
}

interface HistoryProps {
  questions: Question[];
  assessments: AssessmentHistoryItem[];
}

const SelfAssessmentHistory = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [history, setHistory] = useState<HistoryProps | null>(null)
  const [expandedAssessment, setExpandedAssessment] = useState<string | null>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true)
        const response = await responsibleGamblingService.getSelfAssessmentHistory()
        if (response.success) {
          setHistory(response.data)
        } else {
          toast.error("Failed to load assessment history")
        }
      } catch (error) {
        console.error("Error fetching assessment history:", error)
        toast.error("An error occurred while loading history")
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const toggleExpand = (id: string) => {
    if (expandedAssessment === id) {
      setExpandedAssessment(null)
    } else {
      setExpandedAssessment(id)
    }
  }

  // Get question text by ID
  const getQuestionText = (questionId: number) => {
    const question = history?.questions.find(q => q.id === questionId)
    return question?.question || "Unknown question"
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#E27625] border-r-transparent mb-4"></div>
          <p className="text-gray-300">Loading assessment history...</p>
        </div>
      </div>
    )
  }

  // Show empty state
  if (!history || history.assessments.length === 0) {
    return (
      <div className="bg-[#333447] rounded-lg p-6 text-center">
        <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">No Assessment History</h3>
        <p className="text-gray-300 text-sm mb-4">
          You haven't completed any self-assessments yet.
        </p>
        <Button 
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() => window.location.href = "/self-assessment"}
        >
          Take Your First Assessment
        </Button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Your Assessment History</h2>
        <Button 
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() => window.location.href = "/self-assessment"}
        >
          Take New Assessment
        </Button>
      </div>

      {history.assessments.map((assessment) => (
        <Card 
          key={assessment._id} 
          className="bg-[#333447] overflow-hidden shadow-lg rounded-xl border-0"
        >
          <CardContent className="p-0">
            <div 
              className="p-4 flex items-center justify-between cursor-pointer"
              onClick={() => toggleExpand(assessment._id)}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-[#1C1C27]">
                  {assessment.riskLevel === "low" && <CheckCircle className="h-6 w-6 text-green-500" />}
                  {assessment.riskLevel === "medium" && <AlertCircle className="h-6 w-6 text-yellow-500" />}
                  {assessment.riskLevel === "high" && <AlertTriangle className="h-6 w-6 text-red-500" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span 
                      className={`text-sm font-medium px-2 py-1 rounded-full uppercase ${
                        assessment.riskLevel === "low" ? "bg-green-500/20 text-green-400" : 
                        assessment.riskLevel === "medium" ? "bg-yellow-500/20 text-yellow-400" : 
                        "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {assessment.riskLevel} Risk
                    </span>
                    <span className="text-sm text-gray-400">
                      {formatDistanceToNow(new Date(assessment.completedAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Score: {assessment.totalScore} / {history.questions.length * 3}
                  </p>
                </div>
              </div>
              {expandedAssessment === assessment._id ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>

            {expandedAssessment === assessment._id && (
              <div className="p-4 border-t border-[#444560]">
                <h4 className="text-sm font-medium mb-3">Your Answers:</h4>
                <div className="space-y-3">
                  {assessment.answers.map((answer, index) => (
                    <div key={index} className="bg-[#1C1C27] p-3 rounded-lg">
                      <p className="text-sm mb-2">{getQuestionText(answer.questionId)}</p>
                      <div className="flex justify-between items-center">
                        <span 
                          className={`text-xs px-2 py-1 rounded-full ${
                            answer.answer === "Never" ? "bg-green-500/20 text-green-400" : 
                            answer.answer === "Sometimes" ? "bg-blue-500/20 text-blue-400" :
                            answer.answer === "Often" ? "bg-yellow-500/20 text-yellow-400" : 
                            "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {answer.answer}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </motion.div>
  )
}

export default SelfAssessmentHistory