export default function formatReadingTime(wordCount: number) {
  const mins = Math.ceil(wordCount / 200);

  return `${mins} mins`;
}
