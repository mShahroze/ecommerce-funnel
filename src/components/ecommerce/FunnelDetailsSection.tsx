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
    color: '#1A47B8',
    numberColor: '#1D2129',
    percentColor: '#1A47B8',
  },
  product_view: {
    label: 'Product Views',
    color: '#2F6EED',
    numberColor: '#2F6EED',
    percentColor: '#2F6EED',
  },
  checkout: {
    label: 'Checkouts',
    color: '#69A1FF',
    numberColor: '#69A1FF',
    percentColor: '#69A1FF',
  },
  purchase: {
    label: 'Purchases',
    color: '#95BFFF',
    numberColor: '#95BFFF',
    percentColor: '#95BFFF',
  },
} as const;

const stepLabels = {
  session: STEP_CONFIG.session.label,
  product_view: STEP_CONFIG.product_view.label,
  checkout: STEP_CONFIG.checkout.label,
  purchase: STEP_CONFIG.purchase.label,
} as const;

const calculateConversionRate = (current: number, previous: number): string => {
  return ((current / previous) * 100).toFixed(1);
};

export default function FunnelDetailsSection(): React.ReactNode {
  const { isLoading, data } = useFetchOnce<FunnelData>(ENDPOINT_URL);

  if (isLoading) {
    return (
      <section>
        <h2 style={{ fontSize: 24, color: '#ffffff' }}>Funnel Details</h2>
        <Card loading style={{ background: '#141414', border: 'none' }} />
      </section>
    );
  }

  if (!data?.funnel_data?.steps) {
    return (
      <section>
        <h2 style={{ fontSize: 24, color: '#ffffff' }}>Funnel Details</h2>
        <Card style={{ background: '#141414', border: 'none' }}>
          <Empty description='No funnel data available' />
        </Card>
      </section>
    );
  }

  const { steps } = data.funnel_data;

  return (
    <section style={{ margin: 0, padding: 0 }}>
      <h2
        style={{
          fontSize: 24,
          fontWeight: 600,
          color: '#000000E0',
          margin: 0,
          marginBottom: 16,
        }}
      >
        Funnel Details
      </h2>
      <Card
        style={{
          background: '#FFFFFF',
          borderRadius: 8,
          border: '1px solid rgba(0, 0, 0, 0.06)',
          position: 'relative',
          padding: 0,
          margin: 0,
        }}
        bodyStyle={{ padding: 0 }}
      >
        {/* Top Section: Headers and Numbers */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 0,
            padding: '24px 32px 0',
          }}
        >
          {steps.map((step, index) => (
            <div
              key={step.type}
              style={{
                borderRight:
                  index !== steps.length - 1
                    ? '1px solid rgba(0, 0, 0, 0.06)'
                    : 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0 16px',
                height: '100%',
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  color: '#8C8C8C',
                  fontWeight: 400,
                  marginBottom: 8,
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                {stepLabels[step.type]}
              </div>
              <div
                style={{
                  fontSize: 20,
                  lineHeight: '28px',
                  fontWeight: 600,
                  color:
                    STEP_CONFIG[step.type as keyof typeof STEP_CONFIG]
                      .numberColor,
                  marginBottom: 4,
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                {step.count.toLocaleString()}
              </div>
              {index > 0 && (
                <div
                  style={{
                    fontSize: 12,
                    color:
                      STEP_CONFIG[step.type as keyof typeof STEP_CONFIG]
                        .percentColor,
                    opacity: 0.8,
                    width: '100%',
                    textAlign: 'left',
                    marginBottom: 16,
                  }}
                >
                  ({calculateConversionRate(step.count, steps[index - 1].count)}
                  %)
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ position: 'relative', marginTop: 32, marginBottom: 32 }}>
          {/* Funnel Visualization */}
          <div
            style={{
              height: 120,
              position: 'relative',
              display: 'flex',
              margin: '0 32px 24px',
              borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
            }}
          >
            {steps.map((step, index) => {
              const currentRatio = step.count / steps[0].count;
              const nextStep = steps[index + 1];
              const nextRatio = nextStep
                ? nextStep.count / steps[0].count
                : currentRatio;

              return (
                <div
                  key={step.type}
                  style={{
                    flex: 1,
                    height: '100%',
                    position: 'relative',
                    borderRight:
                      index !== steps.length - 1
                        ? '1px solid rgba(0, 0, 0, 0.06)'
                        : 'none',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: -1,
                      right: 0,
                      height: index === 0 ? '100%' : `${currentRatio * 150}%`,
                      transform: 'translateY(-50%)',
                      background:
                        STEP_CONFIG[step.type as keyof typeof STEP_CONFIG]
                          .color,
                      clipPath:
                        index === 0
                          ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                          : `polygon(
        0 ${index === 1 ? '0' : `${(1 - currentRatio) * 10}%`},
        100% ${(1 - nextRatio) * 10}%,
        100% ${100 - (1 - nextRatio) * 10}%,
        0 ${index === 1 ? '100%' : `${100 - (1 - currentRatio) * 10}%`}
      )`,
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Net Conversion Rate */}
          <div
            style={{
              position: 'absolute',
              right: 32,
              bottom: 0,
              fontSize: 13,
              color: '#000000',
            }}
          >
            Net:{' '}
            {calculateConversionRate(
              steps[steps.length - 1].count,
              steps[0].count
            )}
            %
          </div>
        </div>
      </Card>
    </section>
  );
}
