interface LoadingProps {
  text?: string;
}

function Loading({ text = "Cargando" }: LoadingProps) {
  return (
    <div className="loading-spinner">
      <div className="spinner" />
      <span className="loading-text">{text}...</span>
    </div>
  );
}

export default Loading;
