export const toggleAppsManager = (value1, value2) => ({
    type: 'OPEN_CLOSE',
    value: value1,
    val: value2
  })

  export const changeSelectedUserBranch = (Branches, BrID, BrName, Type) => ({
      type: Type,
      BrID,
      BrName,
      Branches
    })

    export const changeRequestParameter = (Parameter, Type) => ({
      type: Type,
      value: Parameter
    })

    export const setPatientID = (Parameter, Type) => ({
      type: Type,
      value: Parameter
    })

    export const setLoadedParameters = (Parameter, Type) => ({
      type: Type,
      value: Parameter
    })

    export const changeStatus = (Parameter, Type) => ({
      type: Type,
      value: Parameter
    })

    export const changeOrdersSearch = (Parameter, Type) => ({
        type: Type,
        value: Parameter
      })

      export const onTodaysOrdersClicked = (Parameter, Type) => ({
          type: Type,
          value: Parameter
      })

      export const saveUserAuthenticationInfo = (Parameter, Type) => ({
          type: Type,
          value: Parameter
      })
      
      export const saveNotifications = (Parameter, Type) => ({
        type: Type,
        value: Parameter
      })

      export const refreshPage = (Parameter, Type) => ({
        type: Type,
        value: Parameter
      })

      export const changeCalendar = (Parameter, Type) => ({
        type: Type,
        value: Parameter
      })

      export const changeBrPermissions = (Parameter, Type) => ({
        type: Type,
        value: Parameter
      })

      export const showHideLoader = (Parameter, Type) => ({
        type: Type,
        value: Parameter
      })