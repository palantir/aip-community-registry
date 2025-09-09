import { $Objects, $Actions, $Queries } from "@hadr-aid/sdk";
import css from "./Home.module.css";
import Layout from "./Layout";

function Home() {
  const objectApiNames = Object.keys($Objects);
  const actionApiNames = Object.keys($Actions);
  const queryApiNames = Object.keys($Queries);

  return (
    <Layout>
      <h1>@hadr-aid/sdk</h1>
      <p>
        Welcome to your Ontology SDK! Try using any of the following methods
        now.
      </p>
      <div className={css.methods}>
        <div>
          <h2>Objects ({objectApiNames.length})</h2>
          {objectApiNames.map((objectApiName) => (
            <pre key={objectApiName}>$Objects.{objectApiName}</pre>
          ))}
        </div>
        <div>
          <h2>Actions ({actionApiNames.length})</h2>
          {actionApiNames.map((actionApiName) => (
            <pre key={actionApiName}>$Actions.{actionApiName}</pre>
          ))}
        </div>
        <div>
          <h2>Queries ({queryApiNames.length})</h2>
          {queryApiNames.map((queryApiName) => (
            <pre key={queryApiName}>$Queries.{queryApiName}</pre>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Home;
