import useFetchOnce from '@/utils/client/useFetchOnce';
import Card from 'antd/es/card';
import Col from 'antd/es/col';
import Row from 'antd/es/row';
import Statistic from 'antd/es/statistic';

const ENDPOINT_URL = '/api/ecommerce/order-summaries';

export default function OrderSummariesSection(): React.ReactNode {
  const { data, isLoading } = useFetchOnce<{
    num_sessions: number;
    num_purchases: number;
    num_dollar_revenue: number;
  }>(ENDPOINT_URL);

  const numSessions = data?.num_sessions ?? 0;
  const numPurchases = data?.num_purchases ?? 0;
  const numDollarRevenue = data?.num_dollar_revenue ?? 0;

  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={{ fontSize: 24, marginBottom: 16 }}>Order Summaries</h2>
      <Row gutter={16}>
        <Col span={6}>
          <Card bordered={false} loading={isLoading}>
            <Statistic precision={0} title='Sessions' value={numSessions} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} loading={isLoading}>
            <Statistic title='Purchases' value={numPurchases} precision={0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} loading={isLoading}>
            <Statistic
              title='Revenue'
              value={numDollarRevenue}
              precision={2}
              prefix='$'
            />
          </Card>
        </Col>
      </Row>
    </section>
  );
}
