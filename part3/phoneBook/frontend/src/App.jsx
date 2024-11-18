import { useState, useEffect } from 'react'
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';
import personService from './services/personService';

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [className, setClassName] = useState('');


  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, []);


  const handleNewName = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const personObjet = {
      name: newName,
      number: newNumber
    }

    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to the Phonebook, replace the old number with the new one?`)) {
        personService
          .update(existingPerson.id, { ...existingPerson, number: newNumber })
          .then(updatedPerson => {
            setPersons(persons.map(person =>
              person.id !== existingPerson.id ? person : updatedPerson
            ));
            setClassName('success')
            setErrorMessage(`'${updatedPerson.name}' has been successfully updated`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            setNewName('');
            setNewNumber('');
          })
          .catch(error => {
            setClassName('error')
            setErrorMessage(error.response.data.error)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            setPersons(persons.filter(person => person.id !== existingPerson.id));
          });
      }
    } else {
      personService
        .create(personObjet)
        .then(createdPerson => {
          setPersons(persons.concat(createdPerson))
          setClassName('success')
          setErrorMessage(`'${createdPerson.name}' has been successfully added`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          setClassName('error')
          setErrorMessage(error.response.data.error)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const personsToShow = filter === ''
    ? persons
    : persons.filter(person =>
      person.name.toLowerCase().includes(filter.toLowerCase())
    );

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)

    if (window.confirm(`Are you sure you want to delete ${person.name}`)) {
      personService
        .eliminate(id)
        .then(deletedPerson => {
          setPersons(persons.filter(person => person.id !== deletedPerson.id))
          setClassName('success')
          setErrorMessage(`'${deletedPerson.name}' has been successfully deleated`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
        .catch(error => {
          setErrorMessage(`ERROR, '${person.name}' was already deleted from the server`)
          setClassName('error')
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilter={handleFilter} />
      <h2>Add a new</h2>
      <Notification message={errorMessage} className={className} />
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNewName={handleNewName}
        newNumber={newNumber}
        handleNewNumber={handleNewNumber}
      />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />

    </div>
  )
}

export default App