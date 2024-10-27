const Person = ({ person, deletePerson }) => {
    return (
        <div key={person.id}>
            {person.name} {person.phone} <button onClick={() => deletePerson(person.id)}>delete</button>
        </div>)
};

export default Person;
