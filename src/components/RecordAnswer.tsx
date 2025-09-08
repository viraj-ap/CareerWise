import { db } from "@/config/firebase";
import { sendMessage } from "@/scripts";
import { useAuth } from "@clerk/clerk-react";
import {
  query,
  collection,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  WebcamIcon,
  VideoOff,
  Video,
  CircleStop,
  Mic,
  RefreshCw,
  Loader,
  Save,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { TooltipButton } from "./TooltipButton";
import WebCam from "react-webcam";
import { SaveModal } from "./SaveModal";
import useSpeechToText from "react-hook-speech-to-text";
import type { ResultType } from "react-hook-speech-to-text";

interface RecordAnswerProps {
  question: { question: string; answer: string };
  isWebCam: boolean;
  setIsWebCam: (value: boolean) => void;
}

interface AIResponse {
  ratings: number;
  feedback: string;
}

export const RecordAnswer = ({
  question,
  isWebCam,
  setIsWebCam,
}: RecordAnswerProps) => {
  const {
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    error,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const [finalTranscript, setFinalTranscript] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { userId } = useAuth();
  const { interviewId } = useParams();

  // Update final transcript whenever results change
  useEffect(() => {
    if (results.length > 0) {
      const combined = results
        .map((res) => (typeof res === "string" ? res : res.transcript))
        .join(" ");
      setFinalTranscript(combined);
    }
  }, [results]);

  // Derived user answer = final transcript + live interim result
  const userAnswer = useMemo(() => {
    return finalTranscript + (interimResult ? " " + interimResult : "");
  }, [finalTranscript, interimResult]);

  const recordUserAnswer = async () => {
    if (isRecording) {
      stopSpeechToText();

      if (userAnswer?.length < 30) {
        toast.error("Error", {
          description: "Your answer should be more than 30 characters",
        });
        return;
      }

      const aiResult = await generateResult(
        question.question,
        question.answer,
        userAnswer
      );
      setAiResult(aiResult);
    } else {
      startSpeechToText();
    }
  };

  const cleanJsonResponse = (responseText: string) => {
    let cleanText = responseText.trim();
    cleanText = cleanText.replace(/(json|```|`)/gi, "");
    return JSON.parse(cleanText);
  };

  const generateResult = async (
    qst: string,
    qstAns: string,
    userAns: string
  ): Promise<AIResponse> => {
    setIsAiGenerating(true);
    const prompt = `
      Question: "${qst}"
      User Answer: "${userAns}"
      Correct Answer: "${qstAns}"
      Please compare the user's answer to the correct answer, and provide a rating (from 1 to 10) based on answer quality, and offer feedback for improvement.
      Return the result in JSON format with the fields "ratings" (number) and "feedback" (string).
    `;

    try {
      const aiResponse = await sendMessage(prompt);
      const parsedResult: AIResponse = cleanJsonResponse(aiResponse);
      return parsedResult;
    } catch (error) {
      console.log(error);
      toast.error("Error", {
        description: "An error occurred while generating feedback.",
      });
      return { ratings: 0, feedback: "Unable to generate feedback" };
    } finally {
      setIsAiGenerating(false);
    }
  };

  const recordNewAnswer = () => {
    setFinalTranscript("");
    stopSpeechToText();
    startSpeechToText();
  };

  const saveUserAnswer = async () => {
    setLoading(true);

    if (!aiResult) return;

    const currentQuestion = question.question;
    try {
      const userAnswerQuery = query(
        collection(db, "userAnswers"),
        where("userId", "==", userId),
        where("question", "==", currentQuestion)
      );

      const querySnap = await getDocs(userAnswerQuery);

      if (!querySnap.empty) {
        toast.info("Already Answered", {
          description: "You have already answered this question",
        });
        return;
      } else {
        await addDoc(collection(db, "userAnswers"), {
          mockIdRef: interviewId,
          question: question.question,
          correct_ans: question.answer,
          user_ans: userAnswer,
          feedback: aiResult.feedback,
          rating: aiResult.ratings,
          userId,
          createdAt: serverTimestamp(),
        });

        toast.success("Saved", { description: "Your answer has been saved." });
      }

      setFinalTranscript("");
      stopSpeechToText();
    } catch (error) {
      toast.error("Error", {
        description: "An error occurred while saving your answer.",
      });
      console.log(error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-8 mt-4">
      {/* save modal */}
      <SaveModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={saveUserAnswer}
        loading={loading}
      />

      <div className="w-full h-[400px] md:w-96 flex flex-col items-center justify-center border p-4 bg-gray-50 rounded-md">
        {isWebCam ? (
          <WebCam
            onUserMedia={() => setIsWebCam(true)}
            onUserMediaError={() => setIsWebCam(false)}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <WebcamIcon className="min-w-24 min-h-24 text-muted-foreground" />
        )}
      </div>

      <div className="flex items-center justify-center gap-3">
        <TooltipButton
          content={isWebCam ? "Turn Off" : "Turn On"}
          icon={isWebCam ? <VideoOff /> : <Video />}
          onClick={() => setIsWebCam(!isWebCam)}
        />

        <TooltipButton
          content={isRecording ? "Stop Recording" : "Start Recording"}
          icon={isRecording ? <CircleStop /> : <Mic />}
          onClick={recordUserAnswer}
        />

        <TooltipButton
          content="Record Again"
          icon={<RefreshCw />}
          onClick={recordNewAnswer}
        />

        <TooltipButton
          content="Save Result"
          icon={isAiGenerating ? <Loader className="animate-spin" /> : <Save />}
          onClick={() => setOpen(true)}
          disabled={!aiResult}
        />
      </div>

      <div className="w-full mt-4 p-4 border rounded-md bg-gray-50">
        <h2 className="text-lg font-semibold">Your Answer:</h2>
        <p className="text-sm mt-2 text-gray-700 whitespace-normal">
          {userAnswer || "Start recording to see your answer here"}
        </p>

        {error && (
          <p className="text-sm text-red-500 mt-2">
            <strong>Speech Error:</strong> {error}
          </p>
        )}
      </div>
    </div>
  );
};
