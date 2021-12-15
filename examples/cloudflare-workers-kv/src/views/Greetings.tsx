import {useState, useEffect} from 'react';
import {ContextView, Text} from '@stripe/tailor-browser-sdk/ui';

const Greetings = (props) => {
  const [greeting, setGreeting] = useState(null);
  const [loading, setLoading] = useState(true);

  // This can be an account id (`props.account.id`) to make this unique to each install -
  // however, we would need to rework the CSP
  const greetingKey = 101;

  useEffect(() => {
    const fetchSavedGreeting = async (key) => {
      try {
        const response = await fetch(
          `https://restless-bread.ng-stripe.workers.dev/greeting/${key}`,
        );
        const savedGreeting = await response.text();
        if (savedGreeting) {
          setGreeting(savedGreeting);
        }
      } catch (error) {
        console.log('Error: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedGreeting(greetingKey);
  }, [greetingKey]);

  return (
    <ContextView title="Greetings" description="Display a saved greeting">
      {!loading && (
        <Text size={48} color="green">
          {greeting ||
            'Please configure a greeting in the application settings.'}
        </Text>
      )}
    </ContextView>
  );
};

export default Greetings;
