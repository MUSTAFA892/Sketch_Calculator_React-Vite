import { Container, Text, Title, Card, Button, Group } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return <div>No result to display</div>;
  }

  return (
    <Container style={{ padding: '30px' }}>
      <Title  order={1} style={{ marginBottom: '20px' }}>
        Result
      </Title>

      <Card shadow="sm" padding="lg" style={{ marginBottom: '20px', backgroundColor: '#f0f0f0' }}>
        <Title order={2} style={{ marginBottom: '10px' }}>
          Expression:
        </Title>
        <Text size="lg" style={{ marginBottom: '20px' }}>
          {result.expression}
        </Text>

        <Title order={2} style={{ marginBottom: '10px' }}>
          Answer:
        </Title>
        <Text size="lg"  color="teal">
          {result.answer}
        </Text>
      </Card>

      {/* Fixing the centering of the button */}
      <Group style={{ display: 'flex', justifyContent: 'center' }}>
        <Button onClick={() => navigate('/')} variant="outline" size="lg">
          Go Back
        </Button>
      </Group>
    </Container>
  );
};

export default ResultPage;
