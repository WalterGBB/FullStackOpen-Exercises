const Filter = ({ filter, handleFilter }) => {
    return (
        <div>
            filter show with <input value={filter} onChange={handleFilter} />
        </div>
    )
};

export default Filter;
