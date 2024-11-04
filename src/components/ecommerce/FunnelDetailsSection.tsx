import { Card, Empty } from 'antd';

export default function FunnelDetailsSection(): React.ReactNode {
  return (
    <section style={{ marginBottom: 48, padding: 16 }}>
      <h2 style={{ fontSize: 24, marginBottom: 16 }}>Funnel Details</h2>
      <Card>
        <Empty description='Missing implementation' />
      </Card>
    </section>
  );
}
