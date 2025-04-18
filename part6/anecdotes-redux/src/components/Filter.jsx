import { useDispatch } from "react-redux"
import { setFilter } from "../modules/filterSlice"

const Filter = () => {
    const dispatch = useDispatch()

    const handleChange = (e) => {
        dispatch(setFilter(e.target.value))
    }

    return (
        <div>
            <p>filter <input onChange={handleChange} /></p>
        </div>
    )
}

export default Filter
