import React from "react";
import { observer, inject } from "mobx-react";
import { PENDING, REJECTED, FULFILLED } from "mobx-utils";
import { Spinner, Button } from "@blueprintjs/core";
export default inject("issueStore", "sessionStore", "viewStore")(
  observer(
    class IssueList extends React.Component {
      constructor({ issueStore, sessionStore, repo }) {
        super();
        this.state = {
          issues: null
        },
          issueStore.fetchIssues(repo);
      }
      renderIssueList() {
        const { sessionStore, issueStore, repo } = this.props;

        if (sessionStore.authenticated) {
          const state = issueStore.issuesDeferred.state;
          switch (state) {
            case PENDING: {
              return <Spinner />;
            }
            case REJECTED: {
              return (
                <div className="pt-non-ideal-state">
                  <div
                    className="pt-non-ideal-state-visual pt-non-ideal-state-icon"
                  >
                    <span className="pt-icon pt-icon-error" />
                  </div>
                  <h4 className="pt-non-ideal-state-title">Error occured</h4>
                  <div className="pt-non-ideal-state-description">
                    <Button onClick={issueStore.fetchIssues} text="retry" />
                  </div>
                </div>
              );
            }
            case FULFILLED: {
              const issues = this.state.issues = issueStore.issuesDeferred.value;
              return issues.map((issue) => {
                return <div key={issue.id}>
                  #{issue.number} {issue.title} > <a href={issue.html_url} target="_blank">watch on github</a>
                </div>;
              });
              break;
            }
            default: {
              console.error("deferred state not supported", state);
            }
          }
        } else {
          return <h1>NOT AUTHENTICATED </h1>;
        }
      }
      render() {
        return (
          <div>
            <h1>issues</h1>
            {this.renderIssueList()}
          </div>
        );
      }
    }
  )
);
