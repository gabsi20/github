import { extendObservable, action, when } from "mobx";
import { fromPromise, REJECTED } from "mobx-utils";

export default class IssueStore {
  constructor({ githubAPI, sessionStore }) {
    extendObservable(this, {
      issueDeferred: null,
      fetchIssues: action("fetchIssues", ( repo )=>{
        if (this.repo !== repo) this.issuesDeferred = null;
        when(
          // condition
          () =>
            sessionStore.authenticated &&
            (this.issueDeferred === null ||
              this.issueDeferred.state === REJECTED),
          // ... then
          () => {
            const userDeferred = sessionStore.userDeferred;
            this.issuesDeferred = fromPromise(
              githubAPI.fetchIssues({login: userDeferred.value.login, repo})
            );
          }
        );
      }),
      postIssue: action("postIssue", (repo, title, text) => {
        return githubAPI.postIssue({
          login: sessionStore.userDeferred.value.login,
          repo,
          title,
          text
        });
      })
    });
  }
}
