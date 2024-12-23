import React from "react";
import {
  $Objects,
  $Actions,
  $Queries,
} from "@custom-widget/sdk";
import css from "./Home.module.css";
import Layout from "./Layout.tsx";
import ReactTypingEffect from "react-typing-effect";
import "./TypingEffect.css";
import { ExampleAlert } from "@custom-widget/sdk";
import { Osdk } from "@osdk/client";
import client from "./client.ts";
import platformClient from "./client.ts";
import { getCurrent } from "@osdk/foundry.admin/User";
import { User } from "@osdk/foundry.admin";
import {
  IAsyncValue,
  isAsyncValue_Loaded,
  IWorkshopContext,
  useWorkshopContext,
  visitLoadingState,
} from "@osdk/workshop-iframe-custom-widget";
import { EXAMPLE_CONFIG } from "./config.ts";


// ========= Wrapper widget =========

// Application wrapper for Workshop state loading
export const WidgetWrapper = () => {
  // useWorkshopContext() is imported from an npm library:
  // - it takes in the definition of input values required from Workshop, and the outputs values that are sent to Workshop, and events that should be configured in Workshop
  // - Returns a context object with an API that can be called to get values or set Workshop variables or execute Workshop events
  //
  // Example of getting an input value from Workshop:
  //      workshopContext["title"].getValue() -> returns string
  //
  // Example of setting an output value in Workshop:
  //      workshopContext["selectedTimelineObject"].set(value) -> void
  //
  // Example of executing an event in Workshop:
  //      workshopContext["eventOnTimelineClick"].executeEvent() -> void
  //

  const workshopContext = useWorkshopContext(EXAMPLE_CONFIG);
  console.log(workshopContext.status)

  // Note: we can have a proper management of the state on loading etc.
  return visitLoadingState(workshopContext, {
    loading: () => <>LOADING...</>,
    // If the Workshop context was loaded successfully, we pass it to our custom widget
    succeeded: (value) => {
      console.log("Workshop context loaded successfully:", value);
      return <MyCustomWidget loadedWorkshopContext={value} />
    },
    reloading: (previousValue) => {
      console.log("Workshop context is reloading:", previousValue);
      return <MyCustomWidget loadedWorkshopContext={previousValue} />
    },
    failed: (err) => {
      console.error("Failed to load workshop context:", err);
      return <div>SOMETHING WENT WRONG...</div>;
    },
  });
};

// ========= Utils functions =========

// Loads the value from the Workshop context. It will validate the value is present and has been loaded.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getValueFromAsyncValue = (asyncVal: IAsyncValue<any> | undefined) => {
  if (asyncVal != null && isAsyncValue_Loaded(asyncVal)) {
    return JSON.stringify(asyncVal.value);
  }
  return undefined;
};

// ========= Custom widget =========

// Defines the interface of our "MyCustomWidget" widget
interface MyCustomWidgetProps {
  loadedWorkshopContext: IWorkshopContext<typeof EXAMPLE_CONFIG>;
}

// Defines the custom widget itself
const MyCustomWidget: React.FC<MyCustomWidgetProps> = props => {
  // We populat variables from the properties passed to the widget
  const { loadedWorkshopContext } = props; 

  // Example Ontology query
  // We query all the objects - example inspired from autogenerated docs in Developer console
  const [objects, setObjects] = React.useState<
    Osdk.Instance<ExampleAlert, "$rid">[]
  >([]);

  React.useEffect(() => {
    // Async function as we are performing an async call
    const fetchComponent = async () => {
      const objects: Osdk.Instance<ExampleAlert, "$rid">[] = [];
      // We iterate over all the objects of the set and load them in memory
      for await (const obj of client(
        ExampleAlert
        // We include the RID of the object, as we need them to populate workshop's object variable
      ).asyncIter({$includeRid: true})) { 
        objects.push(obj);
      }
      setObjects(objects);
    };
    fetchComponent();
  }, []);

  // Setters
  const setStringFieldValue = React.useCallback(() => () => {
    loadedWorkshopContext.stringField.setLoadedValue(Math.random().toString());
  }, [loadedWorkshopContext]); 

  const setNumberFieldValue = React.useCallback(() => () => {
    loadedWorkshopContext.numberField.setLoadedValue(Math.random() * 100);
  }, [loadedWorkshopContext]); 

  const setBooleanFieldValue = React.useCallback(() => () => {
    loadedWorkshopContext.booleanField.setLoadedValue(Math.random() < 0.5);
  }, [loadedWorkshopContext]); 

  function getRandomDate(): Date {
    const start = new Date(2020, 0, 1); // January 1, 2020
    const end = new Date(2023, 11, 31); // December 31, 2023

    const startTime = start.getTime();
    const endTime = end.getTime();
    const randomTime = Math.random() * (endTime - startTime) + startTime;

    return new Date(randomTime);
}
  const setDateFieldValue = React.useCallback(() => () => {
    loadedWorkshopContext.dateField.setLoadedValue(getRandomDate());
  }, [loadedWorkshopContext]); 

  const setTimestampFieldValue = React.useCallback(() => () => {
    loadedWorkshopContext.timestampField.setLoadedValue(getRandomDate());
  }, [loadedWorkshopContext]); 


  const setStringListFieldValue = React.useCallback(() => () => {
    loadedWorkshopContext.stringListField.setLoadedValue([Math.random().toString(), Math.random().toString()]);
  }, [loadedWorkshopContext]); 

  const setBooleanListFieldValue = React.useCallback(() => () => {
    loadedWorkshopContext.booleanListField.setLoadedValue([Math.random() < 0.5, Math.random() < 0.5]);
  }, [loadedWorkshopContext]); 

  const setNumberListFieldValue = React.useCallback(() => () => {
    loadedWorkshopContext.numberListField.setLoadedValue([Math.random() * 100, Math.random() * 100]);
  }, [loadedWorkshopContext]); 

  const setDateListFieldValue = React.useCallback(() => () => {
    loadedWorkshopContext.dateListField.setLoadedValue([getRandomDate(), getRandomDate()]);
  }, [loadedWorkshopContext]); 

  const setTimestampListFieldValue = React.useCallback(() => () => {
    loadedWorkshopContext.timestampListField.setLoadedValue([getRandomDate(), getRandomDate()]);
  }, [loadedWorkshopContext]); 

  const triggerEventInWorkshop = React.useCallback(() => () => {
    loadedWorkshopContext.event.executeEvent()
  }, [loadedWorkshopContext]); 


  const objectApiNames = Object.keys($Objects);
  const actionApiNames = Object.keys($Actions);
  const queryApiNames = Object.keys($Queries);

  const [user, setUser] = React.useState<User>();
  const getProfile = React.useCallback(async () => {
    const result = await getCurrent(platformClient);
    setUser(result);
  }, []);

  const handleButtonClick = (
    action: string,
    obj: Osdk.Instance<$Objects.ExampleAlert, "$rid">
  ) => {
    console.log(`Action: ${action}, Object: ${obj}`);

    // We set this object to the Workshop variable
    if(obj.$primaryKey !== undefined){
      loadedWorkshopContext.objectSetField.setLoadedValue([{ $rid: obj.$rid, $primaryKey: obj.$primaryKey }])
      loadedWorkshopContext.event.executeEvent()
    }
    
  };

  getProfile();

  return (
    <Layout>
      <div className={css.topLeftSection}>
        <h1 className="typing">
          <ReactTypingEffect
            text={["Welcome " + user?.username]}
            speed={100}
            typingDelay={500}
            eraseDelay={9999999} // Large delay to prevent erasing
            cursor=" "
          />
        </h1>
      </div>

      <div className={css.container}>

        <div className={css.leftSection}>
        {
        // We display the environement variables one below each other, loaded from the Workshop Context
        }
        <div>
            <h2>Environment Values from Parent Workshop (if any)</h2>
            <p>String Field: {getValueFromAsyncValue(loadedWorkshopContext.stringField.fieldValue)}</p> 
            <button onClick={setStringFieldValue()}>Set a random value</button>
            <p>Number Field: {getValueFromAsyncValue(loadedWorkshopContext.numberField.fieldValue)}</p>
            <button onClick={setNumberFieldValue()}>Set a random value</button>
            <p>Boolean Field: {getValueFromAsyncValue(loadedWorkshopContext.booleanField.fieldValue)}</p>
            <button onClick={setBooleanFieldValue()}>Set a random value</button>
            <p>Date Field: {getValueFromAsyncValue(loadedWorkshopContext.dateField.fieldValue)}</p>
            <button onClick={setDateFieldValue()}>Set a random value</button>
            <p>Timestamp Field: {getValueFromAsyncValue(loadedWorkshopContext.timestampField.fieldValue)}</p>
            <button onClick={setTimestampFieldValue()}>Set a random value</button>
            <p>Object Set Field: {getValueFromAsyncValue(loadedWorkshopContext.objectSetField.fieldValue)}</p>
            <button disabled={true}>Set a random value</button>
            <p>String List Field: {getValueFromAsyncValue(loadedWorkshopContext.stringListField.fieldValue)}</p>
            <button onClick={setStringListFieldValue()}>Set a random value</button>
            <p>Number List Field: {getValueFromAsyncValue(loadedWorkshopContext.numberListField.fieldValue)}</p>
            <button onClick={setNumberListFieldValue()}>Set a random value</button>
            <p>Boolean List Field: {getValueFromAsyncValue(loadedWorkshopContext.booleanListField.fieldValue)}</p>
            <button onClick={setBooleanListFieldValue()}>Set a random value</button>
            <p>Date List Field: {getValueFromAsyncValue(loadedWorkshopContext.dateListField.fieldValue)}</p>
            <button onClick={setDateListFieldValue()}>Set a random value</button>
            <p>Timestamp List Field: {getValueFromAsyncValue(loadedWorkshopContext.timestampListField.fieldValue)}</p>
            <button onClick={setTimestampListFieldValue()}>Set a random value</button>
          </div>
        </div>

        <div className={css.rightSection}>
        <p>
          Welcome to your Ontology SDK! Try using any of the following methods
          now.
        </p>
        <button onClick={triggerEventInWorkshop()}>Trigger an event in Workshop</button>
        <div className={css.methods}>
          <div>
            <h2>Objects Types ({objectApiNames.length})</h2>
            {objectApiNames.map((objectApiName) => (
              <pre key={objectApiName}>$Objects.{objectApiName}</pre>
            ))}
          </div>
          <div>
            <h2>Actions Types ({actionApiNames.length})</h2>
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
          <div>
            <h2>Object Instances ({objects.length})</h2>
            <div className={css.objectInstances}>
              {objects.map((obj) => (
                <div key={obj.$title} className={css.card}>
                  <h3>{obj.$title}</h3>
                  <p>{obj.status}</p>
                  <button onClick={() => handleButtonClick("view", obj)}>
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
      
    </Layout>
  );
};