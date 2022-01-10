import {useState, useEffect} from 'react';
import {ContextView, Box} from '@stripe/ui-extension-sdk/ui';

const Greetings = () => {
  const [greeting, setGreeting] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // This can be an account id (`props.account.id`) to make this unique to each install -
  // however, we would need to rework the CSP
  const greetingKey = 101;

  useEffect(() => {
    const fetchSavedGreeting = async (key: number) => {
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
        <Box css={{
            font: 'title',
            color: "success"
        }}>
          {greeting ||
            'Please configure a greeting in the application settings.'}
        </Box>
      )}
    </ContextView>
  );
};

export default Greetings;
