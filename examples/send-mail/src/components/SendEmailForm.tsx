import { FC } from "react";
import {
    Box,
    TextField,
    TextArea,
    Inline,
} from '@stripe/ui-extension-sdk/ui';
import { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";
import { CustomerLoaderProps } from "../hooks/loadCustomer";
import { useSendMail } from "../hooks/sendMail";
import { SendButton } from "./SendButton";

export type SendEmailFormProps = CustomerLoaderProps & ExtensionContextValue;
export const SendEmailForm: FC<SendEmailFormProps> = ({
    customerLoadingStatus,
    customerLoadingErrorMessage,
    customer,
    ...props
}) => {
    const {
      subject,
      setSubject,
      text,
      setText,
      callSendMailAPI,
      sendingStatus,
      sendEmailErrorMessage,
    } = useSendMail(props);
    if (customerLoadingStatus !== "complete") {
        return (
            <Box>
              {customerLoadingStatus === 'loading' ? <Inline>Loading</Inline> : null}
              {customerLoadingStatus === 'error' ? <Inline>{customerLoadingErrorMessage}</Inline> : null}
            </Box>
        );
    };
    return (
        <Box>
          <Box>
            <TextField
              label="Subject"
              value={subject}
              onChange={e=>{
                setSubject(e.target.value);
              }}
            />
            <TextArea
              label="Content (Text only)"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
            />
          </Box>
          <Box>
              <SendButton
                sendingStatus={sendingStatus}
                callSendMailAPI={callSendMailAPI}
                sendEmailErrorMessage={sendEmailErrorMessage}
                customer={customer}
              />
          </Box>
        </Box>
    );
};