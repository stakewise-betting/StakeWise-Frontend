import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL + '/api';

const responsibleGamblingApi = axios.create({
  baseURL: `${API_URL}/responsible-gambling`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export const getDepositLimits = async () => {
  try {
    const response = await responsibleGamblingApi.get('/deposit-limits');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || { message: 'Failed to get deposit limits' };
    }
    throw { message: 'Failed to get deposit limits' };
  }
};

export const recordBet = async (amount:any) => {
  try {
    const response = await responsibleGamblingApi.post('/record-bet', { amount });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || { message: 'Failed to record bet' };
    }
    throw { message: 'Failed to record bet' };
  }
};

export const setDepositLimits = async (limits: { daily?: number; weekly?: number; monthly?: number }) => {
  try {
    const response = await responsibleGamblingApi.post('/deposit-limits', limits);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || { message: 'Failed to set deposit limits' };
    }
    throw { message: 'Failed to set deposit limits' };
  }
};

export const getSelfAssessmentQuestions = async () => {
  try {
    const response = await responsibleGamblingApi.get('/self-assessment/questions');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || { message: 'Failed to get self-assessment questions' };
    }
    throw { message: 'Failed to get self-assessment questions' };
  }
};

export const submitSelfAssessment = async (answers: { questionId: number; answer: string }[]) => {
  try {
    // Format answers to match what the backend expects
    const formattedAnswers = answers.map(answer => ({
      questionId: answer.questionId,
      answer: answer.answer,
    }));

    const response = await responsibleGamblingApi.post('/self-assessment', { 
      answers: formattedAnswers
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log("Detailed error:", error.response?.data);
      throw error.response?.data || { message: 'Failed to submit self-assessment' };
    }
    console.log("Unknown error:", error);
    throw { message: 'Failed to submit self-assessment' };
  }
};

export const getSelfAssessmentHistory = async () => {
  try {
    const response = await responsibleGamblingApi.get('/self-assessment/history');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || { message: 'Failed to get self-assessment history' };
    }
    throw { message: 'Failed to get self-assessment history' };
  }
};



const responsibleGamblingService = {
  getDepositLimits,
  setDepositLimits,
  getSelfAssessmentQuestions,
  submitSelfAssessment,
  getSelfAssessmentHistory,
  recordBet,
};

export default responsibleGamblingService;
