import { DatasetView } from "@/components/DatasetView";

export const metadata = {
  title: "Dataset Transparency & Provenance - VeritasAI",
  description: "Detailed breakdown of our 1.2M document admissions essay training corpora and limitation disclaimers.",
};

export default function DatasetPage() {
  return <DatasetView />;
}
