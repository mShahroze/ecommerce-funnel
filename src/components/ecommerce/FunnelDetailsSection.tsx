import useFetchOnce from '@/utils/client/useFetchOnce';
import { Card, Empty, theme } from 'antd';
import React from 'react';

interface FunnelStep {
  type: string;
  count: number;
}

interface FunnelData {
  funnel_data: {
    steps: FunnelStep[];
  };
}

const ENDPOINT_URL = '/api/ecommerce/funnel-data';

const stepLabels: Record<string, string> = {
  session: 'Sessions',
  product_view: 'Product Views',
  checkout: 'Checkouts',
  purchase: 'Purchases',
};

export default function FunnelDetailsSection(): React.ReactNode {
  const { useToken } = theme;
  const { token } = useToken();
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
        <h2 style={{ fontSize: 24, marginBottom: 16 }}>Funnel Details</h2>
        <Card loading />
      </section>
    );
  }

  if (!data?.funnel_data?.steps) {
    return (
      <section style={{ marginBottom: 48, padding: 16 }}>
        <h2 style={{ fontSize: 24, marginBottom: 16 }}>Funnel Details</h2>
        <Card>
          <Empty description='No funnel data available' />
        </Card>
      </section>
    );
  }

  const { steps } = data.funnel_data;
  const maxHeight = 200; // maximum height for the funnel visualization

  return (
    <section style={{ marginBottom: 48, padding: 16 }}>
      <h2 style={{ fontSize: 24, marginBottom: 16 }}>Funnel Details</h2>
      <Card>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: maxHeight + 100,
            gap: 20,
            padding: '20px 0',
          }}
        >
          {steps.map((step, index) => {
            const prevStep = index > 0 ? steps[index - 1].count : step.count;
            const conversionRate =
              index > 0
                ? calculateConversionRate(step.count, prevStep)
                : '100.0';
            const startHeight =
              index === 0
                ? maxHeight
                : (maxHeight * steps[index - 1].count) / steps[0].count;
            const endHeight = (maxHeight * step.count) / steps[0].count;

            return (
              <div
                key={step.type}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: 16, marginBottom: 8 }}>
                  {stepLabels[step.type]}
                </div>
                <div style={{ fontSize: 24, fontWeight: 'bold' }}>
                  {step.count.toLocaleString()}
                </div>
                {index > 0 && (
                  <div style={{ color: token.colorTextSecondary }}>
                    ({conversionRate}%)
                  </div>
                )}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: startHeight,
                    marginTop: 16,
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
                      background: `${token.colorPrimary}${9 - index}0`,
                      clipPath: `polygon(
                        0 ${(startHeight - endHeight) / 2}px,
                        100% 0,
                        100% ${endHeight}px,
                        0 ${startHeight - (startHeight - endHeight) / 2}px
                      )`,
                    }}
                  />
                </div>
                {index === steps.length - 1 && (
                  <div
                    style={{
                      marginTop: 16,
                      textAlign: 'right',
                      width: '100%',
                      color: token.colorTextSecondary,
                    }}
                  >
                    E2E: {calculateConversionRate(step.count, steps[0].count)}%
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </section>
  );
}
