import React from "react";
import { observer, inject } from "mobx-react";


export default inject("sessionStore")(
  observer(function ({ sessionStore }) {
    if (sessionStore.authenticated) {
      const currentUser = sessionStore.currentUser;
      return (
       <div>
          <h3>User {currentUser.login}</h3>
        </div>);
    }else{
      return null;
    }
  })
);
