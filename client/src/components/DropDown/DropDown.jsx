import React from 'react'
import styles from './DropDown.module.css'
import FriendRow from './FriendRow'
export default function DropDown({data}) {
  return (
    <div className={styles.DropDown}>
        <ul className={styles.Dropdownlist}>
            {data.map((item) => {
                    return(
                        <li key={item.user_id+'li'}>
                            <FriendRow item={item} />
                        </li>
                    )
                })}
        </ul>
    </div>
  )
}
