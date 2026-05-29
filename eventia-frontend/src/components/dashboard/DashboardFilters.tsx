interface DashboardFiltersProps {
  search: string;
  category: string;
  selectedDate?: string;
  categories: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDateChange?: (value: string) => void;
}

function DashboardFilters({
  search,
  category,
  selectedDate = "",
  categories,
  onSearchChange,
  onCategoryChange,
  onDateChange,
}: DashboardFiltersProps) {
  return (
    <div className="filters-bar">
      <input
        type="text"
        placeholder="Buscar evento..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="filter-input"
      />

      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="filter-select"
      >
        <option value="">Todas las categorías</option>
        {categories.map((categoria) => (
          <option key={categoria} value={categoria}>
            {categoria}
          </option>
        ))}
      </select>

      {onDateChange && (
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="filter-select"
        />
      )}
    </div>
  );
}

export default DashboardFilters;