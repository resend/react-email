import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Html>
    <Head />
    <Preview>Border + BorderRadius Fix Demo</Preview>
    <Body>
      <Container>
        <Heading as="h1" style={{ textAlign: 'center', marginBottom: '32px' }}>
          Border + BorderRadius Compatibility Fix
        </Heading>
        
        <Text style={{ marginBottom: '24px' }}>
          This demo shows how the Section component now handles border + borderRadius combinations
          with full email client compatibility using a wrapper table approach.
        </Text>

        {/* Example 1: Basic border + borderRadius */}
        <Section
          style={{
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            backgroundColor: '#f9fafb',
          }}
        >
          <Text style={{ margin: '0', fontWeight: '600' }}>
            Example 1: Basic border + borderRadius
          </Text>
          <Text style={{ margin: '8px 0 0 0', color: '#6b7280' }}>
            This section uses both border and borderRadius, which now renders with a wrapper table
            for full email client compatibility.
          </Text>
        </Section>

        {/* Example 2: Individual border properties */}
        <Section
          style={{
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: '#3b82f6',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '16px',
            backgroundColor: '#eff6ff',
          }}
        >
          <Text style={{ margin: '0', fontWeight: '600', color: '#1e40af' }}>
            Example 2: Individual border properties
          </Text>
          <Text style={{ margin: '8px 0 0 0', color: '#1e40af' }}>
            This section uses individual border properties (borderWidth, borderStyle, borderColor)
            combined with borderRadius.
          </Text>
        </Section>

        {/* Example 3: Different border radius values */}
        <Section
          style={{
            border: '3px solid #10b981',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '8px',
            borderBottomLeftRadius: '8px',
            borderBottomRightRadius: '16px',
            padding: '16px',
            marginBottom: '16px',
            backgroundColor: '#ecfdf5',
          }}
        >
          <Text style={{ margin: '0', fontWeight: '600', color: '#065f46' }}>
            Example 3: Different border radius values
          </Text>
          <Text style={{ margin: '8px 0 0 0', color: '#065f46' }}>
            This section uses different border radius values for each corner, demonstrating
            full support for complex border radius combinations.
          </Text>
        </Section>

        {/* Example 4: No border wrapper needed */}
        <Section
          style={{
            border: '1px solid #d1d5db',
            padding: '16px',
            marginBottom: '16px',
            backgroundColor: '#ffffff',
          }}
        >
          <Text style={{ margin: '0', fontWeight: '600' }}>
            Example 4: Border without borderRadius (no wrapper needed)
          </Text>
          <Text style={{ margin: '8px 0 0 0', color: '#6b7280' }}>
            This section uses only border without borderRadius, so it renders normally
            without the wrapper table.
          </Text>
        </Section>

        {/* Example 5: Only borderRadius */}
        <Section
          style={{
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            backgroundColor: '#fef3c7',
          }}
        >
          <Text style={{ margin: '0', fontWeight: '600', color: '#92400e' }}>
            Example 5: Only borderRadius (no wrapper needed)
          </Text>
          <Text style={{ margin: '8px 0 0 0', color: '#92400e' }}>
            This section uses only borderRadius without border, so it renders normally
            without the wrapper table.
          </Text>
        </Section>

        <Text style={{ marginTop: '32px', fontSize: '14px', color: '#6b7280' }}>
          The fix automatically detects when both border and borderRadius are used together
          and applies the wrapper table approach for maximum email client compatibility.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default component; 