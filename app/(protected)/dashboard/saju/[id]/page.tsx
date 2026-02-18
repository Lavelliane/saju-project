import { ReadingDetailPage } from "./_components/reading-detail-page";

export default function SajuReadingPage({ params }: { params: Promise<{ id: string }> }) {
  return <ReadingDetailPage paramsPromise={params} />;
}
