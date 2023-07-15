import React, {createContext, useState} from 'react'

const Context = createContext();

export default Context;

export function AppContext({children}) {
    const [userName, setUserName] = useState(undefined);
    const [userID, setUserID] = useState(undefined);
  return (
    <Context.Provider
        value ={{
            userName, setUserName,
            userID, setUserID
        }}
    >
      {children}
    </Context.Provider>
  )
}
