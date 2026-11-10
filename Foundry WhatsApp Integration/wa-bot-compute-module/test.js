import { SendMessage, SendPrompt, SendUpdate } from './index.js'

const TEST_NUM = process.env.TEST_NUM

async function runTest() {
  try {
    console.log('\nTesting send messages... make sure to have send a message to the bot within the last 24h from recipient number');
    
    // Validate test configuration
    if (!TEST_NUM) {
        console.error('Uh oh!\n');
        process.exit(1);
    }

    const test_msg = "If you're seeing this then it works!"

    const inputsprompt = {
        recipient_number: TEST_NUM, 
        name: "Jay",
    }

    const inputs = {
        recipient_number: TEST_NUM, 
        message: test_msg,
    }

    const inputsUpdate = {
        recipient_number: TEST_NUM, 
        order_num: "001",
        new_status: "on the way"
    }

    console.log(`Sending message to +${inputs.recipient_number} with message \"${inputs.message}\"`);
    console.log("Sending prompt message from template to ", inputs.recipient_number);
    console.log(`Sending update message from template to +${inputs.recipient_number} with \"${inputsUpdate.order_num}: ${inputsUpdate.new_status}\"`);

    let result = await SendPrompt(inputsprompt);
    console.log('Prompt send result(ish):', result);
    if (result.success === false) {
      console.error('Uh oh one!');
      process.exit(1);
    }
    console.log('Woohoo one!');


    result = await SendMessage(inputs);
    console.log('Message send result(ish):', result);
    if (result.success === false) {
      console.error('Uh oh two!');
      process.exit(1);
    }
    console.log('Woohoo two!');


    result = await SendUpdate(inputsUpdate);
    console.log('Update send result(ish):', result);
    if (result.success === false) {
      console.error('Uh oh three!');
      process.exit(1);
    }
    console.log('Woohoo three!');

    process.exit(0);

  } catch (error) {
    console.error('Oh nooo!');
    process.exit(1);
  }
}

// Run the test
await runTest();