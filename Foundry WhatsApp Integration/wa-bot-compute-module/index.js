import pkg from 'whatsapp-business';
const { WABAClient, WABAErrorAPI } = pkg;
import dotenv from "dotenv";
import { Type } from "@sinclair/typebox";
dotenv.config();

const ComputeModule =
process.env.NODE_ENV !== "test"
? (await import("@palantir/compute-module")).ComputeModule
: null;

async function getWaClient() {
  let waAccountId, waPhoneNumerId, accessToken;
  if (process.env.NODE_ENV === 'test') {
      accessToken = process.env.CLOUD_API_ACCESS_TOKEN;
      waPhoneNumerId = process.env.WA_PHONE_NUMBER_ID;
      waAccountId = process.env.WA_BUSINESS_ACCOUNT_ID;
  } else {
    waAccountId = computeModule.getCredential("WaBot", "additionalSecretWaAccountId");
    waPhoneNumerId = computeModule.getCredential("WaBot", "additionalSecretWaPhoneNumId");
    accessToken = computeModule.getCredential("WaBot", "additionalSecretWaApiToken");
  }
  return new WABAClient({
    accountId: waAccountId,
    apiToken: accessToken,
    phoneId: waPhoneNumerId,
  });
}

const send_message_schema = {
  input: Type.Object({
    recipient_number: Type.String(),
    message: Type.String(),
  }),
  output: Type.Boolean(),
};

const send_promt_schema = {
  input: Type.Object({
    recipient_number: Type.String(),
    name: Type.String(),
  }),
  output: Type.Boolean(),
};

const send_update_schema = {
  input: Type.Object({
    order_num: Type.String(),
    new_status: Type.String(),
    recipient_number: Type.String(),
  }),
  output: Type.Boolean(),
};



async function SendMessage(inputs) {
  try {
    const wa = await getWaClient();
    const res = await wa.sendMessage({
      to: inputs.recipient_number.toString(),
      type: "text",
      text: { body: inputs.message },
    });
  // Successfully sent http request for message send
    console.log(res.messages);
    return true; 
  } catch (err) {
    const error = err
		console.error(error.message);
    return false;
  }
}

async function SendPrompt(inputs) {
  const get_perms_body = {
    name: "inform_intent",
    language: {
      policy: 'deterministic',
      code: "en"
    },
    components: [
      {
        type: "header",
        parameters: [
          {
            type: "text",
            parameter_name: "name",
            text: inputs.name,
          }
        ]
      }
    ]
  };
  
  try {
    let wa = await getWaClient();
    const res = await wa.sendMessage({
      to: inputs.recipient_number.toString(),
      type: 'template',
      template: get_perms_body,
    });
    // Successfully sent http request for message send
    console.log(res.messages);
    return true; 
  } catch (err) {
    const error = err;
		console.error(error.message);
    return false;
  }
}

async function SendUpdate(inputs) {
  const get_perms_body = {
    name: "order_update",
    language: {
      policy: 'deterministic',
      code: "en"
    },
    components: [
      {
        type: "body",
        parameters: [
          {
            type: "text",
            parameter_name: "order_num",
            text: inputs.order_num,
          }, {
            type: "text",
            parameter_name: "new_status",
            text: inputs.new_status.toUpperCase(),
          }
        ]
      }
    ]
  };
  try {
    let wa = await getWaClient();
    const res = await wa.sendMessage({
      to: inputs.recipient_number.toString(),
      type: 'template',
      template: get_perms_body,
    });
    // Successfully sent http request for message send
    console.log(res.messages);
    return true; 
  } catch (err) {
    const error = err;
		console.error(error.message);
    return false;
  }
}

const computeModule =
  process.env.NODE_ENV !== "test"
    ? new ComputeModule({
        logger: console,
        sources: {
          WaBot: {
            credentials: ["additionalSecretWaAccountId", "additionalSecretWaApiToken", "additionalSecretWaPhoneNumId"],
          },
        },
        definitions: {
          SendMessage: send_message_schema,
          SendPrompt: send_promt_schema,
          SendUpdate: send_update_schema,
        },
      })
    : null;

// Register CM if not in test mode
if (process.env.NODE_ENV !== 'test' && computeModule) {
  computeModule
    .on("responsive", () => console.log(`Responsive`))
    .on("error", (error) => console.error(`Error: ${error}`))
    .register("SendMessage", async (context) => {
      try {
        return await SendMessage(context);
      } catch (error) {
        console.error(`Error: ${error}`, error);
        throw error;
      }
    })
    .register("SendPrompt", async (context) => {
      try {
        return await SendPrompt(context);
      } catch (error) {
        console.error(`Error: ${error}`, error);
        throw error;
      }
    }).register("SendUpdate", async (context) => {
      try {
        return await SendUpdate(context);
      } catch (error) {
        console.error(`Error: ${error}`, error);
        throw error;
      }
    });
}

// Export declarations at top level
export { SendMessage, SendPrompt, SendUpdate, computeModule };
