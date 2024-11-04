import useFetchOnce from '@/utils/client/useFetchOnce';
import Card from 'antd/es/card';
import Empty from 'antd/es/empty';

import React from 'react';

interface FunnelStep {
  type: 'session' | 'product_view' | 'checkout' | 'purchase';
  count: number;
}

interface FunnelData {
  funnel_data: {
    steps: FunnelStep[];
  };
}

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

const calculateConversionRate = (current: number, previous: number): string => {
  return ((current / previous) * 100).toFixed(1);
};

const calculateE2ERate = (final: number, initial: number): string => {
  return ((final / initial) * 100).toFixed(1);
};

const stepLabels: Record<string, string> = {
  session: 'Sessions',
  product_view: 'Product Views',
  checkout: 'Checkouts',
  purchase: 'Purchases',
};

// Updated color scheme to match the design more closely
const FUNNEL_COLORS = {
  session: '#193366', // Darkest blue
  product_view: '#2952a3', // Dark blue
  checkout: '#3373df', // Medium blue
  purchase: '#4287f5', // Light blue
};

export default function FunnelDetailsSection(): React.ReactNode {
  const { isLoading, data } = useFetchOnce<FunnelData>(ENDPOINT_URL);

  const calculateConversionRate = (
    currentStep: number,
    previousStep: number
  ): string => {
    return ((currentStep / previousStep) * 100).toFixed(1);
  };

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
  const maxHeight = 120; // Adjusted for better proportions

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
            {steps.map((step, index) => {
              const prevStep = index > 0 ? steps[index - 1].count : step.count;
              const conversionRate =
                index > 0
                  ? calculateConversionRate(step.count, prevStep)
                  : '100.0';

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
                      color: '#94a3b8', // Updated to match design
                      fontWeight: 400,
                    }}
                  >
                    {stepLabels[step.type]}
                  </div>
                  <div
                    style={{
                      fontSize: 32, // Updated to match design
                      fontWeight: 500,
                      color: index === 0 ? '#ffffff' : '#60a5fa', // First step white, others blue
                      marginBottom: 4,
                    }}
                  >
                    {step.count.toLocaleString()}
                  </div>
                  {index > 0 && (
                    <div
                      style={{
                        color: '#94a3b8', // Updated to match design
                        fontSize: 13,
                        opacity: 0.8,
                      }}
                    >
                      ({conversionRate}%)
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Funnel Visualization Section */}
          <div
            style={{
              position: 'relative',
              height: 120, // Reduced height to match design
              display: 'flex',
              alignItems: 'center',
              gap: 40,
            }}
          >
            {steps.map((step, index) => {
              const startHeight =
                index === 0
                  ? 120
                  : (120 * steps[index - 1].count) / steps[0].count;
              const endHeight = (120 * step.count) / steps[0].count;

              const FUNNEL_COLORS = {
                session: '#2563eb', // Darkest blue
                product_view: '#3b82f6', // Slightly lighter blue
                checkout: '#60a5fa', // Even lighter blue
                purchase: '#93c5fd', // Lightest blue
              };

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
                        FUNNEL_COLORS[step.type as keyof typeof FUNNEL_COLORS],
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
                        color: '#94a3b8', // Updated to match design
                        fontSize: 13,
                        opacity: 0.8,
                      }}
                    >
                      E2E: {calculateConversionRate(step.count, steps[0].count)}
                      %
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </section>
  );
}
