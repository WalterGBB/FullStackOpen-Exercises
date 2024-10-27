function Filter({ filter, onFilterChange }) {
    return (
        <div>
            <label>Find countries </label>
            <input value={filter} onChange={onFilterChange} />
        </div>
    );
}

export default Filter