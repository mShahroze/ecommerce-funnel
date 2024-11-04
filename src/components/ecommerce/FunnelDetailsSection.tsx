import useFetchOnce from '@/utils/client/useFetchOnce';
import Card from 'antd/es/card';
import Empty from 'antd/es/empty';
import React from 'react';

// Types
interface FunnelStep {
  type: 'session' | 'product_view' | 'checkout' | 'purchase';
  count: number;
}

interface FunnelData {
  funnel_data: {
    steps: FunnelStep[];
  };
}

// Constants
const ENDPOINT_URL = '/api/ecommerce/funnel-data';

const STEP_CONFIG = {
  session: {
    label: 'Sessions',
    color: '#2563eb',
  },
  product_view: {
    label: 'Product Views',
    color: '#3b82f6',
  },
  checkout: {
    label: 'Checkouts',
    color: '#60a5fa',
  },
  purchase: {
    label: 'Purchases',
    color: '#93c5fd',
  },
} as const;

// Helper functions
const calculateConversionRate = (current: number, previous: number): string => {
  return ((current / previous) * 100).toFixed(1);
};

export default function FunnelDetailsSection(): React.ReactNode {
  const { isLoading, data } = useFetchOnce<FunnelData>(ENDPOINT_URL);
  const maxHeight = 120;

  if (isLoading) {
    return (
      <section style={{ marginBottom: 48, padding: 16 }}>
        <h2 style={{ fontSize: 24, marginBottom: 16, color: '#ffffff' }}>
          Funnel Details
        </h2>
        <Card loading style={{ background: '#1b1f23', border: 'none' }} />
      </section>
    );
  }

  if (!data?.funnel_data?.steps) {
    return (
      <section style={{ marginBottom: 48, padding: 16 }}>
        <h2 style={{ fontSize: 24, marginBottom: 16, color: '#ffffff' }}>
          Funnel Details
        </h2>
        <Card style={{ background: '#1b1f23', border: 'none' }}>
          <Empty description='No funnel data available' />
        </Card>
      </section>
    );
  }

  const { steps } = data.funnel_data;

  const renderStepContent = (step: FunnelStep, index: number) => {
    const prevStep = index > 0 ? steps[index - 1].count : step.count;
    const conversionRate =
      index > 0 ? calculateConversionRate(step.count, prevStep) : '100.0';

    return (
      <div
        key={step.type}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <div
          style={{
            fontSize: 13,
            marginBottom: 6,
            color: '#94a3b8',
            fontWeight: 400,
          }}
        >
          {STEP_CONFIG[step.type as keyof typeof STEP_CONFIG].label}
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 500,
            color: index === 0 ? '#ffffff' : '#60a5fa',
            marginBottom: 4,
          }}
        >
          {step.count.toLocaleString()}
        </div>
        {index > 0 && (
          <div
            style={{
              color: '#94a3b8',
              fontSize: 13,
              opacity: 0.8,
            }}
          >
            ({conversionRate}%)
          </div>
        )}
      </div>
    );
  };

  const renderFunnelShape = (step: FunnelStep, index: number) => {
    const startHeight =
      index === 0
        ? maxHeight
        : (maxHeight * steps[index - 1].count) / steps[0].count;
    const endHeight = (maxHeight * step.count) / steps[0].count;

    return (
      <div
        key={`funnel-${step.type}`}
        style={{
          flex: 1,
          height: startHeight,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: endHeight,
            transform: 'translateY(-50%)',
            background:
              STEP_CONFIG[step.type as keyof typeof STEP_CONFIG].color,
            clipPath: `polygon(
              0 ${(startHeight - endHeight) / 2}px,
              100% 0,
              100% ${endHeight}px,
              0 ${startHeight - (startHeight - endHeight) / 2}px
            )`,
          }}
        />
        {index === steps.length - 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: -32,
              right: 0,
              color: '#94a3b8',
              fontSize: 13,
              opacity: 0.8,
            }}
          >
            E2E: {calculateConversionRate(step.count, steps[0].count)}%
          </div>
        )}
      </div>
    );
  };

  return (
    <section style={{ marginBottom: 48, padding: 16 }}>
      <h2 style={{ fontSize: 24, marginBottom: 16, color: '#ffffff' }}>
        Funnel Details
      </h2>
      <Card
        style={{
          background: '#1b1f23',
          border: 'none',
          borderRadius: 8,
          padding: '32px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 48,
          }}
        >
          {/* Labels and Numbers Section */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 40,
            }}
          >
            {steps.map((step, index) => renderStepContent(step, index))}
          </div>

          {/* Funnel Visualization Section */}
          <div
            style={{
              position: 'relative',
              height: maxHeight,
              display: 'flex',
              alignItems: 'center',
              gap: 40,
            }}
          >
            {steps.map((step, index) => renderFunnelShape(step, index))}
          </div>
        </div>
      </Card>
    </section>
  );
}
