interface EventFiltersProps {
  busqueda: string;
  categoriaSeleccionada: string;
  categorias: string[];
  onBusquedaChange: (value: string) => void;
  onCategoriaChange: (value: string) => void;
}

function EventFilters({
  busqueda,
  categoriaSeleccionada,
  categorias,
  onBusquedaChange,
  onCategoriaChange,
}: EventFiltersProps) {
  return (
    <div className="filters-bar">
      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={busqueda}
        onChange={(e) => onBusquedaChange(e.target.value)}
        className="filter-input"
      />

      <select
        value={categoriaSeleccionada}
        onChange={(e) => onCategoriaChange(e.target.value)}
        className="filter-select"
      >
        <option value="">Todas las categorías</option>
        {categorias.map((categoria) => (
          <option key={categoria} value={categoria}>
            {categoria}
          </option>
        ))}
      </select>
    </div>
  );
}

export default EventFilters;