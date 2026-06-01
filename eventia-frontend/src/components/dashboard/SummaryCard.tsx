interface SummaryCardProps {
  title: string;
  value: number | string;
  description?: string;
  accentColor?: string;
}

function SummaryCard({
  title,
  value,
  description,
  accentColor = "var(--neon-cyan)",
}: SummaryCardProps) {
  return (
    <div className="summary-card">
      <div className="summary-value" style={{ color: accentColor }}>
        {value}
      </div>

      <div className="summary-title">{title}</div>

      {description && <div className="summary-desc">{description}</div>}
    </div>
  );
}

export default SummaryCard;