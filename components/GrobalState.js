import React, { useReducer } from 'react'
import * as FileSystem from 'expo-file-system';
const getLocalData = async () => {

}       

// if(get_local_data ==  ''){
//     get_local_data =  [
//         {
//           "balance": "",
//           "bill_date": "",
//           "box_id": 0,
//           "box_name": "",
//           "branch_id": 0,
//           "contact_code": "",
//           "contact_id": 0,
//           "contact_name": "",
//           "createdAt": "",
//           "current": 0,
//           "due_date": "",
//           "from_date": "",
//           "id": 0,
//           "installment": "",
//           "institute_id": 0,
//           "issue_date": "",
//           "location_id": 1,
//           "location_name": "",
//           "meter_id": 0,
//           "meter_number": "123",
//           "month_of": "",
//           "multiplier": 0,
//           "number_digit": 0,
//           "pole_id": 0,
//           "pole_name": "",
//           "previous": 0,
//           "readed": 0,
//           "reader_id": 0,
//           "round": 0,
//           "tablet_abbr": "",
//           "tablet_id": 0,
//           "to_date": "0",
//           "updatedAt": 0,
//           "usage": 0,
//           "utp_plan_id": 0,
//           "void_meter": 0,
//         }
//     ]
// }
export const initialState = {
    test : "this is initial value",
    local_data: getLocalData()
  };

export const reducer = (state, action) => {
    switch (action.type){
        case "local_data" : {
            return {
                ...state,
                local_data :  action.local_data
            }
        }
        default: 
            return {
                ...state
            }
    }
}

export const StateContext = React.createContext(initialState);
export const StateProvider = ({children,reducer, initialState}) => (
    <StateContext.Provider value = {React.useReducer(reducer,initialState)}>
        {children}
    </StateContext.Provider>
)
export const useGrobals = () => React.useContext(StateContext)