import { EvaluationView } from "@/components/EvaluationView";

export const metadata = {
  title: "Evaluation Metrics & Confident Failures - VeritasAI",
  description: "Test set performance metrics and post-mortems of three essays we got confidently wrong.",
};

export default function EvaluationPage() {
  return <EvaluationView />;
}
