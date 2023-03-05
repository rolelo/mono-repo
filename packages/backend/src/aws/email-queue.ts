import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { sqsClient } from "./clients";

type Params = {
  messageBody: string,
  messageGroupId: string,
  messageDeduplicationId: string,
};

const createSendMessageCommand = ({ messageBody, messageDeduplicationId, messageGroupId}: Params) => { 
  return new SendMessageCommand({
    QueueUrl: process.env.QUEUE_URL,
    MessageBody: messageBody,
    MessageGroupId: messageGroupId,
    MessageDeduplicationId: messageDeduplicationId,
  })
}

export const sendEmail = async (params: Params) => {
  try {
    await sqsClient.send(createSendMessageCommand(params))
  } catch (e) {
    console.error(e);
  }
}