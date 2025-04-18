import { useNotification } from '../context/NotificationContext'

const Notification = () => {
    const [notification] = useNotification()

    if (!notification) return null

    return (
        <div className='notification'>
            {notification}
        </div>
    )
}

export default Notification
