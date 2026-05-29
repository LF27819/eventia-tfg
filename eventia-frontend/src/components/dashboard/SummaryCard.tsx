interface SummaryCardProps {
  title: string;
  value: number | string;
  description?: string;
}

function SummaryCard({ title, value, description }: SummaryCardProps) {
  return (
    <article className="summary-card">
      <p className="summary-title">{title}</p>
      <h3>{value}</h3>
      {description && <p className="summary-description">{description}</p>}
    </article>
  );
}

export default SummaryCard;