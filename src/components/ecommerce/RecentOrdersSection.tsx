import { IModelCommerceUserEventWithReferences } from '@/services/ecommerce/EntityCommerceUserEventService';
import useFetchOnce from '@/utils/client/useFetchOnce';
import { Avatar, Card } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';

const columns: ColumnsType<IModelCommerceUserEventWithReferences> = [
  {
    title: 'Avatar',
    dataIndex: ['user', 'profile_url'],
    key: 'avatar',
    render: (_text, _record, index) => {
      return (
        <Avatar
          src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
        />
      );
    },
  },
  {
    title: 'Customer Id',
    dataIndex: ['user', '_id'],
    key: 'name',
  },
  {
    title: 'Product Id',
    dataIndex: ['product', '_id'],
    key: 'product',
  },
  {
    title: 'Price',
    dataIndex: ['product', 'price'],
    key: 'price',
    render: (text, _record) => {
      return `$${text}`;
    },
  },
];

const ENDPOINT_URL = '/api/ecommerce/recent-orders';

export default function RecentOrdersSection(): React.ReactNode {
  const { isLoading, data } = useFetchOnce<{
    recent_orders: IModelCommerceUserEventWithReferences[];
  }>(ENDPOINT_URL);

  let tableContent = null;
  if (isLoading) {
    tableContent = <Card loading />;
  } else if (data != null) {
    tableContent = (
      <Table
        bordered
        columns={columns}
        dataSource={data.recent_orders}
        loading={isLoading}
        size='small'
      />
    );
  }

  return (
    <section style={{ marginBottom: 48, padding: 16 }}>
      <h2 style={{ fontSize: 24, marginBottom: 16 }}>Recent Orders</h2>
      {tableContent}
    </section>
  );
}
