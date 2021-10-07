import AuthWall from "../components/AuthWall";
import TicketList from '../components/TicketList';


const SubscriptionSupportHistory = () => {
  return <TicketList />;
}

export default () => {
  return (
    <AuthWall>
      <SubscriptionSupportHistory />
    </AuthWall>
  );
};
