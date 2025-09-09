import {
  IConfigDefinition,
  IWorkshopContext,
  useWorkshopContext,
  visitLoadingState,
} from "@osdk/workshop-iframe-custom-widget";
import { Conversation } from "./components/Conversation";
import Layout from "./Layout";
import { useEffect, useState } from "react";

const CONFIG_DEFINITION = [
  {
    fieldId: "stringField",
    field: {
      type: "single",
      fieldValue: {
        type: "inputOutput",
        variableType: {
          type: "string",
          defaultValue: "",
        },
      },
      label: "Message Context",
    },
  },
] as const satisfies IConfigDefinition;

function Home() {
  const workshopContext = useWorkshopContext(CONFIG_DEFINITION);
  const [context, setContext] = useState("You are talking to Bob Johnson, use their name in your replies. They are calling about their order of 50 socks which has status 'stuck in processing'");

  useEffect(() => {
    const res = visitLoadingState<IWorkshopContext<IConfigDefinition>, string | null, unknown>(workshopContext, {
      loading: () => null,
      succeeded: (context: IWorkshopContext<typeof CONFIG_DEFINITION>) => {
        return visitLoadingState<string | undefined, string | null, unknown>(context.stringField.fieldValue, {
          loading: () => null,
          succeeded: (v) => v ?? null,
          reloading: () => null,
          failed: () => null
        })
      },
      reloading: () => null,
      failed: () => {throw Error("Failed to get prompt")},
    });
    if (res) {
      console.log(res)
      setContext(res);
    }
  }, [workshopContext, context]);

  return (
    <Layout>
      <main className="flex min-h-screen min-w-screen flex-col items-center justify-between p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
          <h1 className="text-4xl font-bold mb-8 text-center">
            ElevenLabs Conversational AI
          </h1>
          <Conversation context={context} />
        </div>
      </main>
    </Layout>
  );
}

export default Home;
