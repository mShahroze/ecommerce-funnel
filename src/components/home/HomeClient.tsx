'use client';

import {
  DatabaseOutlined,
  FrownOutlined,
  LoadingOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import Alert from 'antd/es/alert';
import Button from 'antd/es/button';
import Card from 'antd/es/card';
import Col from 'antd/es/col';
import Row from 'antd/es/row';
import React, { useEffect, useRef, useState } from 'react';

type TSeedDataSupportedHTTPMethods = 'POST' | 'DELETE';

function SeedDataCardDescription(props: { hasSeed: boolean }): React.ReactNode {
  const { hasSeed } = props;
  if (hasSeed) {
    return (
      <Alert
        message='Data is ready'
        type='success'
        showIcon
        icon={<RocketOutlined />}
      />
    );
  }

  return (
    <Alert
      message='Data currently missing'
      type='warning'
      showIcon
      icon={<FrownOutlined />}
    />
  );
}

function SeedDataButton(props: {
  isLoading: boolean;
  hasSeed: boolean;
  makeRequest: (method: TSeedDataSupportedHTTPMethods) => void;
}): React.ReactNode {
  const { isLoading, hasSeed, makeRequest } = props;

  if (isLoading) {
    return <LoadingOutlined />;
  }

  if (hasSeed) {
    return (
      <>
        <Button
          danger
          type='primary'
          shape='round'
          icon={<DatabaseOutlined />}
          onClick={() => makeRequest('DELETE')}
        >
          Delete seed
        </Button>
      </>
    );
  }

  return (
    <>
      <Button
        type='primary'
        shape='round'
        icon={<DatabaseOutlined />}
        onClick={() => makeRequest('POST')}
      >
        Create seed
      </Button>
    </>
  );
}

const SEED_ENDPOINT_URL = '/api/ecommerce/seed';

export default function HomeClient(): React.ReactNode {
  const [isSeedRequestLoading, setIsSeedRequestLoading] = useState(false);
  const [isSeedDataCreated, setIsSeedDataCreated] = useState(false);
  const didFetchSeed = useRef(false);

  const makeSeedDataRequest = (httpMethod: 'POST' | 'DELETE' | 'GET') => {
    setIsSeedRequestLoading(true);
    fetch(SEED_ENDPOINT_URL, {
      method: httpMethod,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('request error');
        }
        return response.json();
      })
      .then(({ seed_data_exists }) => {
        setIsSeedDataCreated(seed_data_exists === true);
      })
      .catch((err) => {
        console.log('error: ', err);
      })
      .finally(() => setIsSeedRequestLoading(false));
  };

  useEffect(() => {
    if (didFetchSeed.current) {
      return;
    }
    didFetchSeed.current = true;
    makeSeedDataRequest('GET');
  }, []);

  return (
    <section>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Hello, Muhammad!</h1>
      <Row>
        <Col span={12}>
          <Card title={<h3>Scout technical exercise</h3>} bordered={false}>
            <Card
              loading={isSeedRequestLoading}
              title='Data init'
              extra={
                <SeedDataButton
                  isLoading={isSeedRequestLoading}
                  hasSeed={isSeedDataCreated}
                  makeRequest={makeSeedDataRequest}
                />
              }
            >
              <p>Initialize seed data for the exercise.</p>
              <SeedDataCardDescription hasSeed={isSeedDataCreated} />
            </Card>
          </Card>
        </Col>
      </Row>
    </section>
  );
}
