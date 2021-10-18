import { TailorExtensionContextValue } from "@stripe/tailor-browser-sdk/context";
import AuthWall from "../components/AuthWall";
import TicketList from '../components/TicketList';


const SubscriptionSupportHistory = () => {
  return <TicketList />;
}

export default ({object, account}: TailorExtensionContextValue) => {
  return (
    <AuthWall object={object} account={account}>
      <SubscriptionSupportHistory />
    </AuthWall>
  );
};
